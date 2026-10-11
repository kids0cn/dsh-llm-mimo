# AGENTS.md — llm-mimo 暴露接口与工程纪律

给 AI 代理/消费方看的接口契约。修改本插件前先读本文 + `log/llm-mimo/`（`handover.md` 为入口，含实验结论与踩坑）。

## 一、llmMimo 服务（提示词源接口）

`ctx.provide("llmMimo", api)`，消费方 `inject: ["llmMimo"]` 后经 `ctx.llmMimo` 访问。

### `listHostedModels(): Array<{ provider, id, name, ... }>`
枚举本插件托管面（`mimo` 主路由 + 全部 `customProviders` 条目的模型目录）。
**提示词源及托管配置消费方 GUI 的模型下拉必须只用这个源**——非托管模型不给托管配置入口，即治理性退化。
条目额外提供 `isDefault`、`apiFormat`、标准 `reasoning` 与当前格式归一化的 `reasoningControls`。托管判断必须
精确匹配 `(provider, id)`；浏览器的 `modelControlsViewJson` 由同一接口派生，只有模型
元数据，不包含凭据或连接地址。

### `registerPromptSource(source): () => void`
注册提示词源，返回 disposer。`source` 形状：

```js
{
  // 整体替换系统提示词；返回 undefined = 该项不改
  resolveSystem({ provider, model, system }): string | undefined
  // 替换单个工具的描述；返回 undefined = 该项不改
  resolveToolDescription({ provider, model, toolName, description }): string | undefined
}
```

**语义约束（契约，勿违反）**：
1. llm-mimo 默认零行为变化——无注册源时直接透传。
2. 只改文本，**绝不碰 tool 的 `name`/`parameters`**（历史 tool_use 块以名为关联键）。
3. `resolve*` 必须是 `(provider, model)` 的**确定性纯函数**（逐字节稳定）——
   system/tools 位于请求前缀头部，抖动即缓存全量 miss；动态片段放尾部追加通道。
4. **作用域保证**：问询只发生在本插件 dispatch 内（适配器只挂 `mimo`+customProviders
   路由），域外模型结构性不可达。
5. 系统提示词双通道：loop 请求的提示词在 `messages` 头部 system 消息
   （`GenerateOptions.system` 未定义），一次性调用走 `options.system`；
   问询输入取合并文本，替换结果写回单一通道。

## 二、与装配层的关系（架构定位）

"按模型换提示词"的**主通道在装配层**（GUI 轨迹渲染装配产物，可见性免费）：

- `ctx.systemPrompt.section({ name, order, complete: true, text: (context) => ... })`——
  整体替换系统提示词；
- `ctx.on("system-prompt/assemble", async (assembly, context, next) => {
    assembly.tools = …改描述…; return next(); }, { global: true })`——改工具描述
  （装配瀑布返回值权威）。

llmMimo dispatch 接口是**兜底/强制层**（防绕过路径、装配层失灵时的最后一道）。
装配层按模型解析的模型源必须用 pending route——**正解 = `assembly.variables.model`**
（框架 installModelSelection 注入装配输入，零滞后）；`session.requestHeader()` 在
**首装配时恒 null**（dispatch 期才落盘，真机插桩证伪），仅可作 dispatch 期后备；
勿用 `agent.options` 创建快照（R5 教训：会一回合延迟）。

## 三、配置面（`cordis.patch.yml` 的 llm-mimo 行 config）

| 字段 | 说明 |
|---|---|
| `apiKeyEnv` | 凭据引用名（credential-ref；缺省 `MIMO_NORMAL_API_KEY`） |
| `baseURL` / `apiFormat` | 主路由连接；`apiFormat`: `anthropic` \| `chat` \| `responses`，三者均有传输 |
| `modelsJson` | 模型目录 JSON 字符串，条目：`id/name/description/contextWindow/maxTokens/inputModalities/videoFps/videoMediaResolution/reasoningControlsByFormat`；兼容旧单份 `reasoningControls` |
| `defaultModelId` | 供应商默认模型 ID（volatile）；缺省或失效取目录第一项 |
| `customProviders` | dict（volatile）：`displayName/apiKeyEnv/baseURL/apiFormat/baseURLsJson/modelsJson/defaultModelId`，route 即路由键 |
| `modelControlsViewJson` | volatile 派生托管目录（勿手写），设置及适配器更新后客户端重新读取 |
| `dispatchViewJson` | volatile 遥测（勿手写）：每次 dispatch 的实际 system 视图记录环形缓冲（`[{time, provider, model, tampered, system}]`，新者在前，cap 8，按 model+tampered+system 去重）。无注册源也记录（tampered=false）。轨迹面板注入（client）读取；实例重启即清 |

`inputModalities` 词汇：`text | image | audio | video | pdf`。**勾选=能力声明**：
未勾的模态发送即拒（错误文案指明缺哪个、给两条出路）；anthropic 面勾 audio/video/pdf
是假声明（MiMo 服务端静默丢，见能力矩阵），勾选前先确认 `apiFormat`。

`reasoningControlsByFormat` 按 `chat/anthropic/responses` 分开保存，每个桶的协议版本为
1：`parameter`（当前模型、当前格式普通档位共用点分字段路径）、`valueType`
（`auto/string/number/json`）、`offParameter`（Chat/Anthropic 初始 `thinking.type`，Responses 初始 `reasoning.effort`）及有序 `stops`。
每项包含稳定 `id`、`kind: off/omit/level`、必填文本 `value`、可选 `name`。特殊 ID 为
`mimo:off` / `mimo:default`，固定在前两项；普通项使用 `mimo:level:<uuid>`，不得用
值或顺序充当 ID。普通名称留空跟随值；特殊名称缺省保留语义名称。

**默认必须省略全部思考参数，包括开关**：标准目录 `defaultEffort` 为 `mimo:default`，
未传 effort 和该 ID 都构造空映射；旧 `thinking` 配置只保留加载兼容，不再注入请求，
标题也不强制关闭。关闭初始值 `disabled` 可修改，自定义目录的普通档位与字段需要手动
配置，不自动猜测端点能力或填预算。用户授权的默认 MiMo V2.6 Flash/Pro/Pro Ultraspeed
目录例外：Chat 与 Messages 预设关闭/默认/开启，为 `thinking.type: disabled/enabled`；
Responses 预设 none/不传参/low/high，字段为 `reasoning.effort`，默认仍选不传参。
当前 MiMo 非 none 档位行为相同，
不虚构 token 预算。预设仅写入插件自带默认目录，已有目录/格式桶及手动删除不自动回填。
普通预设项使用预先生成的稳定 UUID，三模型/三格式分别独立。禁止参数路径覆盖模型、
消息、工具、输出上限等契约字段及原型
属性。过期 ID 拒绝发送并显示错误；能力与映射都读取 `prepareCall` 捕获的连接快照。

旧单份字段在编辑/切换前归入原格式，未配置格式不能借用其他格式的字段与档位。
Responses 关闭初始为 reasoning.effort: none，实际请求为 Base URL 下 /responses；
MiMo 根地址为 https://api.xiaomimimo.com/v1。默认省略整个 reasoning，选择其他点
按当前桶映射发送。Responses 输出 item 对应持久 block；原生 reasoning 内容、ID
及可选 encrypted_content 保存在 replayState，只有同模型/路由且内容未改才复用。
工具关联使用 call_id，不能用输出 item 的 id 代替；function_call_output 回传每个
工具结果。流必须以 response.completed/incomplete 结尾，断流不能视为成功。
保存校验全部已配置的格式；隐藏格式有错误时切到该格式并定位输入框。

会话入口使用公共 `conversation.input.model` single 槽与标准 ModelDirectory；按精确
托管成员读取本插件映射，原生 llm-deepseek/pi-ai 模型只展示其标准 reasoning 词汇。
这是用户授权的会话控件适配，不扩大提示词配置或 llmMimo 托管范围。原生默认点使用
适配器公布的默认值，原生参数转换留给原适配器，不承诺省略原生请求参数；不广告
关闭则不补关闭点。UI 内部 native-default ID 不得发送给适配器。无可用目录时委托
原有槽组件。待选值按会话及精确路由暂存，配置/格式更新后清除，持久选择走共享目录。
新选模服务采用可选注入，仅在 0.2.0-rc.2 验证新交互，缺失时保留旧功能。

模型控制客户端源在 `src/controls-client.js`，共享纯规则在 `lib/model-controls.js`；运行
`npm run build:client` 更新 `lib/client.js` 标记区域，勿只改生成区域。CI 校验生成一致性。

## 四、宿主要求

- **`patches/dsh-llm-file-video-projection.patch`（必需）**：dsh-llm 投影层按模态勾选
  保留 video/audio/pdf file 块（否则一律投影成文本句柄，真发死代码）。
- `patches/settings-models-add-custom-mimo-tab.patch`：设置弹窗第三页签（自定义模型
  API 创建页）宿主补丁。
- 干净回退点：两补丁均为独立 diff，重装 runtime 后重放即可。

## 五、工程纪律

- **仓库形式（2026-09-28 起）**：插件即独立 git 仓库（创建插件时 `git init` 空仓起步，
  README/AGENTS.md 随包）。**插件写炸 = 回退插件仓库 + 重新部署，不动实例仓库**；
  实例仓库只管实例态（cordis.patch.yml、profile package.json、runtime 补丁应用态）。
- **部署**：插件仓库（源）→ cp 到 `profiles/{core-web,core-headless}/packages/llm-mimo`
  双副本 → 重启实例生效（服务端 bundle 按 boot 加载；client.js 逐请求取盘可热载）。
  开发迭代可直接改 live 后回灌仓库，发布前保证 live == 仓库。
- **验证纪律**：dispatch 时改写**不能**看轨迹系统提示词面板（显示装配时持久提示词，
  不是线上改写）——用行为判别（判别式系统提示词：让模型自查工具前缀并按结果作答）。
  轨迹面板只验装配层产物。

## 六、发布与安装（2026-09-28 实测定稿）

**安装器规格**（GUI 插件→添加插件）：包名（registry）/ GitHub 或 git URL / 本地**绝对**
路径（`file:` 前缀=复制式，裸路径=link: 式）。安装器自动把带 `dsh.bundle` 清单的包装进
`dsh.profile.bundles`（无需手动登记）；兼容门禁只校验 `@deepseek-ai/dsh*` 的
peerDependencies 与运行时版本（`workspace:*` 或精确版本）。

**package.json 范式（对照 dsh-llm-deepseek-api-key）**：
- `peerDependencies`：`@deepseek-ai/dsh*` + cordis——**运行时提供**（勿放 dependencies；
  registry 上的 dsh-llm 可得版本 ≠ 运行时版本，放 deps 会装错或装不上）。
- `dependencies`：仅第三方（schemastery/cosmokit/eventsource-parser——均已在
  npmmirror 验证可得）。
- `files` 含 `cordis.patch.yml` 与 `patches/`；`license`/`publishConfig`/`exports` 齐备。

**两种安装形态的实测结论（3096/3097 隔离实例）**：
1. **发布形态**（`file:`/registry/git——pnpm 复制 + 自动解析 dependencies）：安装→启用→
   挂载全绿。发布到 git/registry 后丢安装器即可装。
2. **link: 形态**（裸本地路径）：pnpm 不装被链包的依赖——**仓库目录必须先
   `pnpm install`**（本仓名义 `.npmrc` 已关 auto-install-peers）出 node_modules，
   否则启用报 "failed to import"（缺 schemastery 等）。开发机克隆后先装依赖再本地装。

**命名（已定稿 2026-09-28）**：包名 `@mimo-codex/dsh-llm-mimo`——scope `@mimo-codex`
为 owner npm 账号下的免费组织；`@local/` 此后只用于实例内不发布的草稿包。
**待定项**：`repository` 字段待推送 GitHub 后补；registry 发布走
`npm login`（两步验证）+ `npm publish --access public`。
