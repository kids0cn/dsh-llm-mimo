// SPDX-License-Identifier: CC-BY-4.0
<!-- Copyright (c) 2026 MiMo CodeX / dalizi233 -->

# 默认模型与思考强度控制更新计划

日期：2026-10-11。状态：功能已实现并完成本地验收；继续按视觉反馈调整预览，插件版本保持 0.4.1。

接手入口为 [handover.md](handover.md)，阶段进度见 [progress.md](progress.md)。本目录管理本次更新；原有适配器开发和思考历史回传修复分别保留在自己的计划中。

## 1. 目标与范围

把已确认的模型选择器和模型配置交互接入 llm-mimo：供应商默认模型星标、逐模型思考强度档位编辑、会话内悬浮强度选择。默认只呈现精简条目，感兴趣时展开成独立卡片，其他未展开条目常驻。

- 插件起点：工作区 package 0.4.1，Git HEAD `46faddb`，另有未提交的思考历史回传修复。
- 宿主基线保持 DSH **0.2.0-rc.2**。用户已知 v0.2.1-alpha.2，暂不推进基线。
- 托管范围的权威源为 `llmMimo.listHostedModels()`，按 **provider + model ID** 判断，包括 mimo 主路由及 customProviders。相同模型名、ID 后缀或品牌不能作为判断依据。
- 用户后续授权原生 DeepSeek/pi-ai 的会话控件也使用滑轨；读取标准能力目录，参数仍由原适配器转换。托管配置和提示词治理范围保持精确路由。
- 本次不改 Promptbook 的提示词解析、源注册、工具 name/parameters，也不改模态门禁和 Responses 存根的边界。
- 新插件版本号在实现及验收完成后确定；本次不 bump、不发布、不推送。

原型是交互依据，模型、token 值均为演示数据，不代表供应商能力。完整设计在下面自包含记录；本机原型位置、截图和实例路径放在被忽略的 `local-env.md`。

## 2. 已确认的交互

### 2.1 会话模型选择器

1. 点击当前模型只打开模型选择。初次弹出时所有供应商合并堆叠成简洁行。
2. 点击供应商名称选择该供应商的默认模型。名称占左侧约 62%，长名裁剪；右侧约 38% 全部作为展开/收起判定区，悬浮行时才露出小箭头。点击右区才把该供应商展开成独立卡片，显示全部模型。其他供应商继续常驻，展开状态彼此独立。折叠行内部连接处为直角，栈的外缘才有圆角。
3. 悬浮当前可推理模型、展开列表中的可推理模型或已弹出的滑杆时，显示独立浮卡，**完整模型名与滑杆包在同一张卡片内**。供应商仅在左侧名称区悬浮时浮起独立卡片，包含完整名称与展开箭头；浮卡向左延伸，右边止于名称区边缘，不能遮住右侧展开判定区。悬浮右区立即让名称浮卡退场。
4. 悬浮手柄或任一可选档位时显示预览卡片，内容为强度显示名及 token / 关闭思考 / 不传递思考参数。候选点悬浮只预览，不移动手柄、不暂存强度、不切换模型；点击、拖动或键盘调整才选择强度。离开档位隐藏预览，停留在轨道仍保留模型浮卡。模型到滑杆之间要有短暂衔接时间。键盘聚焦也能预览，离开焦点后退场。
5. 托管模型思考选项顺序为关闭思考（语义 -1）、默认（语义 0，**不传递思考强度参数**）、其他配置的档位。位置按数量均分；不得把 -1/0 直接当作供应商请求值。原生模型以自身能力为准，默认恢复适配器默认，不承诺省略参数。
6. 滑杆沿用原型的薄形态：底槽约 16 px，手柄约 22 px，悬浮区域约 30 px。原型轨道宽 204 px，可因可用空间收缩，不随屏幕无条件放大。
7. 供应商/模型选择列表左边对齐已选模型按钮的左边，右边对齐整个输入框右外沿，包含发送按钮一侧。模型浮卡可向左延伸以容纳完整名字与轨道，右边仍对齐输入框。列表浮卡纵向跟随对应行。
8. 调整尚未选中的模型强度只修改该模型的待选值，不能切换当前模型；点击模型名称时带上刚才选择的强度。
9. 手柄位置使用 Promptbook 同款 .26s cubic-bezier(.2,0,0,1) 过渡；浮卡和档位预览 .2s 淡入并下移 4px，退场 .2s 淡出/轻收缩。退场卡停止交互和键盘聚焦，减少动态效果偏好关闭动画。

### 2.2 供应商默认模型星标

- 未手动指定时，该供应商目录的第一项（既有创建顺序）为默认模型；第一项显示实心星。
- 非默认模型，**展开和收起状态均适用**：仅悬浮模型名输入框左侧约 24 px 区域，名字输入框左边向右缩，腾出空心星。悬浮名字其他区域不触发。
- 点击空心星设为供应商默认模型；实心星和缩进常驻。名称输入框右边缘、模型 ID 列及删除列保持位置。
- 改名字或模型 ID 后仍是同一张默认模型卡；删除手动指定的默认模型时回退到剩余第一项。保存/取消包括默认选择。
- 星标只配置供应商默认模型，不等同于 DSH 的全局/最后选中模型默认值；不增加新的常驻“默认模型”表单行。

### 2.3 设置中的强度档位编辑

- 在展开模型卡的输入类型行**下面**增加一行细滑轨，整体宽度与输入类型行接近；右侧加号新增可用控制点。
- 空闲时只显示点，不使用实心手柄。悬浮某点时虚手柄稍微变暗，向上弹出独立编辑卡。正式实现接入已有旅行悬浮框逻辑；demo 仅变暗的豁免不等于旅行效果已经实现。
- 编辑卡的强度名称默认无框、无下划线，字号与强度值相同。名称未定制时等于强度值字符串，并随值变化；手动改名后独立，清空名字恢复跟随。
- 强度值使用完整输入框，是必填项。原型允许文本值；其 API 类型、字段和单位由协议映射决定，不在 UI 擅自限制为 token 数。
- 关闭思考永远第一/最左，不传参永远第二/紧邻右侧；这两个点**不能拖动或拖删**。它们没有固定像素坐标：所有点等距，新增档位也缩短前两个点的间距。
- 普通点及其弹出卡的空白处/拖动标记可拖动排序，输入框维持正常编辑。静止按住 200ms 即进入拖动；移动超过 4px 也可立即开始，不等待长按。拖动中的虚手柄与浮卡保留抓取偏移，同时跟随鼠标的横纵位移；其他点按预览顺序均分，松手后才提交顺序并落回轴上。加号沿用既有绿色按钮，进入/退出拖动时使用 140ms 图标下翻过渡切换垃圾桶，拖入后释放即删除该档位。彩色加号/垃圾桶豁免旅行框，悬浮背景及图标颜色与既有删除按钮一样即时变化。拖动取消恢复原顺序。
- 特殊点也能打开编辑卡；用户没有要求其字段只读。其操作语义由类型标记识别，不因修改显示字段或值而变成普通档位。
- 新增打开空白必填值并聚焦；保存遇到空值要阻止落盘、展开对应模型并定位红框字段。保存/取消包含档位、名称、值和顺序。

用户于 2026-10-11 追加要求 MiMo 预设。插件自带默认目录的 V2.6 Flash、Pro、
Pro Ultraspeed 均提供三格式独立的关闭/默认/开启配置；Chat 与 Messages 开启为
thinking.type: enabled，Responses 开启为 reasoning.effort: high，关闭为 disabled / none。
官方当前说明三模型都仅区分开关，Responses 所有非 none 值等效，故不填伪预算或
重复的低/中/高档。默认仍完全省略参数。只预设默认目录，不覆盖既有目录/删除结果或
自动套用到自定义端点。普通预设档位 UUID 在源码中预先固定，格式/模型之间独立。

## 3. 实施前接入勘察（历史背景）

| 层 | 当前代码/契约 | 本次需要处理 |
| --- | --- | --- |
| 模型配置 | [lib/index.js](../../lib/index.js) 的 Config、parseModels、parseCustomProviders、connectionFor | 保留默认模型及档位元数据，旧配置兼容 |
| 服务端托管源 | 同文件 `llmMimo.listHostedModels()` | 继续作为权威；提供浏览器可用的、无凭据的元数据桥接 |
| 目录与能力 | `catalogModelInfo`、`modelInfo`、MimoAdapter 的 listModels/resolveModel/prepareCall | 按精确路由广告稳定的 reasoning effort ID；请求与能力使用同一连接快照 |
| 真实请求 | `serializeChat`、Anthropic `serialize`、MimoAdapter.request | 将选中档位映射到协议字段；明确关闭和字段省略 |
| 设置客户端 | [lib/client.js](../../lib/client.js) 的 modelsFrom、ModelCard、ProviderCard、CustomApiPage、SettingsFormModel | 三条创建/编辑路径都能无损读写新字段，不能只改 MiMo 卡片 |
| 会话客户端 | DSH `conversation.input.model` | 整体 single 槽，优先级覆盖；没有单独强度子槽，也没有 single 槽的逐模型 selector |
| 宿主选模状态 | `ctx.modelDirectories.directoryFor(sessionId)` 的 store/load/select | 复用状态与会话 selectModel；/model 命令和选择器同步，不另建持久会话状态 |
| 宿主强度通道 | LlmResolvedModelInfo.reasoning、GenerateOptions.reasoningEffort | ID 为不透明字符串；未传时可能被 reasoning.defaultEffort 补值，必须防止“默认”被补成有参档位 |

已读基线的 ui-model-selection、ui-slots、api-session-controller、dsh-agent 与 dsh-llm 类型及实现。原生 ModelSelect 没有作为 client 公共导出；不能写一个假定可导入它的回退方案。single 槽可优先级覆盖，如何按会话委托原生 occupant 是 T1 的首个验证项。

现有 Chat 序列化不发 thinking/强度控制；Anthropic 路径显式发送 thinking.type，且 session-title 特判关闭。原有 Config.thinking 为全路由继承配置，新“默认/不传参”不能仅清空界面值后继续被旧配置或宿主 defaultEffort 填回。

现有模型元数据经过多次白名单投影。服务端 parseModels、自定义供应商 parseCustomProviders、客户端 modelsFrom、自定义供应商保存和 GET /models 发现回填都要逐一检查，否则新字段会在保存时丢失。既有 description、视频参数和其他能力字段也要保留。

`listHostedModels()` 是宿主 Cordis 服务，不是现成的浏览器 Remote。标准会话 catalog 只投影 provider/model/name/reasoning 的有限字段，不能假定附加任意 JSON 就会到客户端。T1 要确定最小桥接及配置更新后缓存刷新机制。

## 4. 已落地的数据与请求协议

用户本轮澄清覆盖原计划的旧 thinking 注入策略：**默认完全省略所有思考参数，包括开关**。
旧字段可加载，但不再自动注入；未显式选择的标题请求也不强制关闭。

### 4.1 供应商默认模型

主配置及每个 customProviders 条目可选 `defaultModelId`。缺省或引用失效时取目录
第一项，不主动把这个隐式默认写成手动引用。星标改选绑定稳定草稿卡片，改 ID 时
同步引用，即使暂时清空也保持同一卡片；删除默认卡片清除引用并回退第一项。
同供应商重复 ID 被设置保存校验阻止。

### 4.2 逐模型档位

modelsJson 条目可选 `reasoningControlsByFormat`，键为 chat/anthropic/responses，每份
配置协议版本 1，如 `reasoningControlsByFormat.chat`：

```js
{
  version: 1,
  parameter: 'reasoning_effort', // 普通档位共用字段路径，由使用者填写
  valueType: 'string',          // auto / string / number / json
  offParameter: 'thinking.type',
  stops: [
    { id: 'mimo:off', kind: 'off', name: '关闭思考', value: 'disabled' },
    { id: 'mimo:default', kind: 'omit', name: '默认', value: '0' },
    { id: 'mimo:level:<uuid>', kind: 'level', value: 'low' }
  ]
}
```

普通项 id 不由名称、值或位置生成；重排和编辑保持 ID。普通名称缺省/清空跟随 value；
特殊项缺省名称保留关闭/默认语义。特殊 kind 永远前两项且不能拖删，所有点等距。
上述普通项是协议写法示例，不会自动灌入旧配置。

API 格式切换时模型轨道、请求映射与标准能力目录一起切换，切回恢复对应桶。旧单份
reasoningControls 在编辑或切换前归入原格式；其他格式从两特殊点开始，不能复制另一
格式的参数。主路由、自定义编辑、新建都使用同一规则。Responses 关闭初始为
reasoning.effort: none；保存校验全部已配置桶，有错误时切换并聚焦。

对应官方资料（2026-10-10 核验）：MiMo 的 [Chat](https://mimo.mi.com/docs/zh-CN/api/chat/openai-api)
与 [Messages](https://mimo.mi.com/docs/zh-CN/api/chat/anthropic-api) 用 thinking.type；
[Responses](https://mimo.mi.com/docs/zh-CN/api/chat/responses) 用 reasoning.effort，
目前只有开启/关闭的实际区别，不把枚举推断为不同 token 预算。
[DeepSeek](https://api-docs.deepseek.com/zh-cn/guides/thinking_mode/) 的三种格式强度路径
分别为 reasoning_effort、output_config.effort、reasoning.effort。
百炼 [Chat](https://help.aliyun.com/zh/model-studio/qwen-api-via-openai-chat-completions/)、
[Responses](https://help.aliyun.com/zh/model-studio/qwen-api-via-openai-responses)、
[Messages](https://help.aliyun.com/zh/model-studio/anthropic-api-messages) 还因型号存在不同
的取值、默认与映射。此核验只用于说明独立配置的依据，不自动导入供应商预设。

| 操作 | 字段路径 / 类型 | 实际请求规则与证据 |
| --- | --- | --- |
| 未传 effort 或 mimo:default | 无 | Chat/Anthropic 不发 thinking、effort、budget，包括开关；单测及真实默认请求证明 |
| mimo:off 初始映射 | thinking.type / 文本 disabled | 仅显式选择才发送；MiMo Chat HTTP 200；字段和值可手动改 |
| 普通文本档 | 使用者填写，如 reasoning_effort / string | 选择稳定 ID 后查回原始值；两个文本档序列化回归证明构造，不自动声明真实端点支持 |
| 普通数字档 | 使用者填写，如 thinking.budget_tokens / number | 有限数字；自定义路由序列化回归验证 4096 数字，不视为真实能力结论 |
| 普通 JSON 档 | 使用者填写，如 thinking / json | 可发送对象组合字段；JSON 必须有效，auto 解析有效 JSON，否则保留文本 |
| 过期 / 未知 effort | 不构造 | 可见错误，拒绝请求；重新选默认或有效档位恢复 |

路径采用点分字段，只允许标识符；不能覆盖 model/messages/system/tools/stream/
max_tokens/temperature/stop 等契约字段，也不能写原型属性。字段与类型隐藏在强度
浮卡的“请求字段”展开内，不增加常驻表单。配置 value 是文本，输出类型由映射决定；
滑杆索引与用户的 -1/0 语义不会直接发给 API。

### 4.3 宿主与客户端

服务端标准 `reasoning.efforts` 使用稳定 ID，`defaultEffort` 为 `mimo:default`，避免
宿主补值造成有参请求。prepareCall 能力与真实映射使用同一捕获连接快照。

浏览器读取 `modelControlsViewJson`，该无凭据目录由 `llmMimo.listHostedModels()`
派生，精确 (provider, model) 为托管权威。设置/适配器更新后重新读取，菜单打开也
刷新；不返回连接地址或凭据。现有目录字段在编辑、发现回填及保存中保留。

会话组件复用公共 single 槽，无新宿主补丁；标准目录中可推理原生模型也展示细轨。
关闭只取原生 off/none 广告，没有就不补点。原生默认点恢复广告的默认值，内部
mimo:native-default 不传给适配器，不承诺原生请求省略参数。普通点精确保留原生 ID、
名称与顺序，转换由原适配器负责。没有可用目录时通过 entries/subscribe 委托原组件。

选中强度沿用 directory.select 的会话投影；滑动预览不逐帧远程提交，结束才提交。
待选值按 sessionId 与精确路由暂存，点击名字才连模型一起提交；已提交选择（含 /model）
优先于旧预览；格式或配置更新清除旧预览。两会话 UI 已验证不串预览。选择失败/当前档位删除显示错误，不悄悄
构造旧请求。新服务可选注入，旧 host 新 UI 不作未验证的兼容承诺。

## 5. 实施阶梯（当前结果见 progress）

| 阶段 | 工作与交付 | 完成条件 |
| --- | --- | --- |
| T0 计划准备 | 固化用户设计、源码勘察、记录原型与实例差异 | 本目录与交接入口建立，原型记录指向本计划。已完成 |
| T1 接入与参数定稿 | 验证 single 槽委托回退、托管元数据桥/刷新、reasoning 通道；确认手动映射和默认省略；补充数据方案定稿 | 有最小可验证接入证据、完整请求映射表；非托管选模可回退、无新增宿主补丁依赖；若公共接口不足，先记录精确限制与可审阅替代方案 |
| T2 配置与适配器 | 扩展主/自定义供应商及模型解析，稳定 ID、默认引用和能力投影；接通真实请求序列化 | 默认按用户新定稿省略；off/omit/普通值出站正确；跨路由不串值；prepareCall 快照一致 |
| T3 设置编辑器 | 星标与档位编辑接入既有合并/独立卡片及旅行悬浮机制；主路由、创建页、自定义编辑均支持 | 保存/取消及重启后值完整；特殊点不能拖删；普通点重排/删除后所有点等距；不丢既有字段 |
| T4 会话选择器 | 悬浮浮卡、细滑杆、手柄提示、供应商合并展开及默认选择；接共享会话 directory | 调强度不误切模型，/model 同步；非托管保留原生功能；按输入框锚定、完整长名、离开收起 |
| T5 联合验收与部署 | 扩展必要回归后 npm run ci；同步两个实例副本；重启基线实例；浏览器与最小真实请求验收 | CI 全绿，源/实例版本与文件对账，UI 与实际请求均有证据；历史回传回归保留 |
| T6 收口 | 更新接口/用户说明/进度和 handover；打包检查；按验收结果确定插件版本 | 用户视觉验收后才进入推送/发布流程；不将 prototype 或计划完成等同于功能完成 |

T1 的技术核实由实施承担，当前不需要用户先猜参数名。只有会改变已确认交互或要求新增宿主补丁时，才带具体方案回来讨论。

## 6. 验收矩阵

| 领域 | 最少验证 |
| --- | --- |
| 配置兼容 | 老模型无新字段的读写/请求；主路由与自定义供应商保存、取消、刷新、重启；默认模型改名、改 ID、删除与失效回退；已有描述/视频参数保留 |
| 档位数据 | 名字跟随与自定义、必填空值定位、稳定 ID、拖动重排及取消、拖到垃圾桶、特殊点不拖删、新增后全轴均分；删除当前选择后的过期 ID 处理明确且可见 |
| 控件作用域 | 精确 provider/model 托管判断；同名非托管模型、无元数据模型、插件禁用/卸载和其他 slot occupant；非托管原生推理选择不受影响 |
| 会话状态 | 两会话互不串值；当前模型改强度；未选中模型先调强度再点名称；/model 同步；选择失败与过期返回；模型不可用和目录局部失败提示 |
| 请求证据 | 同一模型任务分别 off/omit/至少两普通档位；检查 JSON 字段和类型，而非只看回复长短；默认省略/切档不残留；非托管请求不改；工具回合保留 reasoning_content 与关联 ID |
| UI | DSH 渲染视口固定 1280×720；折叠/展开均可设默认；其他供应商/模型常驻；模型与滑轨衔接、仅手柄提示、滚动/窗口变化重定位、长名称与右外沿对齐；键盘可访问同一操作 |
| 工程 | npm run ci（安装门禁 + 原有宿主 patch 重放/幂等 + 有意义的配置/出站请求回归）；client 依赖/打包产物有效；源与 core-web/core-headless 双副本对账；实例重启后组件状态正常 |

请求测试先用本地捕获端点证明构造和隔离，再在基线实例做最小真实请求，控制同一模型/任务/配置条件。截图、启动成功、模型回复或 fake ctx 冒烟都不能单独证明参数正确。证据不含凭据、认证 token 或完整私人会话。

## 7. 工作区与部署约束

已有未提交内容来自 [reasoning-history-passback](../reasoning-history-passback/handover.md)：lib/index.js 保留 assistant reasoning_content，scripts/ci.mjs 加入对应回归。实施要在此基础上叠加，不回退、不用旧实例副本覆盖源代码。实验队列和私有适配器快照不属于本计划，也不能为 UI 验收中断它们。

两个实例 profile 都解析到各自 packages/llm-mimo **副本**。实施前为 0.4.0，现均已同步工作区 0.4.1 功能代码。每次服务端变动仍须按 [AGENTS.md](../../AGENTS.md) 对账并重启；仅改工作区不能证明实例已生效。

新浏览器会话先 set 渲染 viewport 1280×720，再确认 window.innerWidth/innerHeight；保持到验收结束。用 DSH 本次实际打印地址和首次认证信息，不在文档保存认证信息。服务和标签在交付预览时保持打开。

新 UI 使用宿主 theme token 与 ctx.effect 生命周期；清理 portal、订阅、计时器、pointer capture。优先使用公共 slot/service 接口，不依赖散列 CSS 选择器或改官方模型组件私有文件。不得用全局注册/移除槽的方式跟随某一会话而影响另一会话。

目前仅确认 0.2.0-rc.2 的新接触面；不扩大 peer 范围。对已声明旧版本需要检查可选注入/原功能退化，不能未验证就宣称新 UI 全部支持。若真正需要新的共享 DSH 服务依赖，再按工程参考更新 manifest/peer/dev 及安装门禁。
