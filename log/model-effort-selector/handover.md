// SPDX-License-Identifier: CC-BY-4.0
<!-- Copyright (c) 2026 MiMo CodeX / dalizi233 -->

# 接力：默认模型与思考强度控制

更新时间：2026-10-11。**本文件是本次更新的接手入口。**

## 当前状态

用户已授权实施，并补充兼容 llm-deepseek / llm-pi-ai 自动推理强度。功能已落地到插件，
在 DSH **0.2.0-rc.2** 实例完成设置、会话选择与真实出站验证。最终 CI 全链通过；文档、打包检查、双副本对账和干净重启
已完成，预览保持运行。插件仍为 **0.4.1**、HEAD `46faddb`，未提交、推送或发布。

README 操作指南（2026-10-11）：用户要求重点说明模型配置页如何自定义强度滑杆，并补充
截图。已重排配置章节，覆盖入口/API 格式选择、显示名与必填值、普通档位共用字段/类型、
固定的关闭/默认点、添加/排序/删除/取消/保存、四种值类型与请求映射示例。
docs/images 下两张真实 DSH 截图分别展示展开模型卡和完整编辑卡；package.json 的 files
包含图片目录，npm pack --dry-run 已确认 README 与两张图片均入包。两个 profile 的
7 个原部署文件及 2 张截图逐字节一致；完整 CI 通过（/tmp/mimo-readme-controls-ci.log）。
本轮仅修改文档与图片打包配置，拍摄未保存模型草稿、未发起模型请求，深色主题与原会话
选模保持不变。下一步按用户反馈修订指南或继续功能验收。

最新下拉修正（2026-10-11）：强度编辑卡「请求字段」里的值类型仍使用原生 select，
夜间系统选项菜单配色不一致。已改为 Promptbook 样式的自定义浮层：当前项对齐触发器、
条目独立悬浮卡、进入/退出过渡及日夜令牌；保留 auto/string/number/json 原有语义。
真实 DSH 验证四项切换、键盘导航、内层 Escape 与点字段关闭菜单，编辑卡继续保持；
测试草稿已取消、恢复深色主题，未保存模型配置或发起请求。双副本同步、完整 CI 通过，
当前 38375 页面保留深色下拉预览。详见 [值类型下拉验证](value-type-dropdown-verification.md)。

最新 UI 修正（2026-10-11）：弹出卡片的背景原误用了宿主未定义的变量，夜间回退成
白底白字。已统一供应商选择 / 名称、模型滑轨、档位预览、强度编辑卡的主题背景、
文字、边框和明暗阴影；手柄、聚焦与错误颜色也使用有效宿主令牌。两种主题分别验证
上述卡片和 API 格式卡，恢复用户原来的深色主题 / Qwen3.8-Max 选择。客户端双副本
同步、完整 CI 23+2 回归及安装门禁通过，当前服务无需重启；详见
[日夜配色验证](popup-themes-verification.md)。

运行恢复（2026-10-11）：用户随后报告后端失联。旧 33005 端口确实停止监听，
对应进程退出码 0；未发现异常堆栈或 OOM/coredump 证据，准确退出原因尚未确认。
已在同一基线实例用 systemd 用户临时服务恢复，避免进程依附工具会话，并保留 journal。
新网页认证成功、llm-mimo 组件运行中、保存的 Responses 模型配置读取正常；完成检查后
服务仍 active/running。本轮未修改插件实现或发起模型请求。当前地址、进程与停止方法
见 [local-env.md](local-env.md)，页面证据见 [恢复截图](evidence/dsh-backend-recovered.jpg)。

最新追加（2026-10-11）：Responses 传输已实现，直接使用 MiMo 根地址下 /responses。
用户随后明确 Responses 的三模型预设应为 none / 不传参 / low / high；插件自带目录
及当前 core-web 实例均已配置四点，默认仍为不传参。原 High ID 保留，新增 Low 使用
独立稳定 UUID；测试用 Max 已从实例移除。Chat / Messages 的关闭/默认/开启配置
经保存前后对账保持一致。已有手动配置不自动覆盖/回填。
完整 CI 现为 23+2 项及安装/补丁门禁全链通过。Flash 的 Responses 关闭/默认/High/
临时 Max 实际 GUI 请求通过；新增 Low 与原生 DSH 文件工具回合的结果见
[Responses 验证](mimo-responses-verification.md)。Pro 的额外默认请求曾在 45 秒超时，
不把三模型预设测试通过表述为三模型全部真实请求已通过。

后续用户进一步要求 API 格式与思考配置联动，并授权原生供应商选择器也显示滑轨。
此扩展已实现并完成主路由/自定义编辑的 UI 验证；最终对账与重启信息见 local-env。
不推进 DSH 基线。前轮仅有 Responses 配置支持；本轮已补齐实际传输。

用户随后指出新增控件没有接入原旅行框，拖动浮卡/虚手柄只跳格点，新增加号样式不一致。
这轮已补齐：新星标、点、加号及浮卡字段共享 useTravelFrames；浮卡和拖动点的框在
各自 portal 表面内绘制，避开抽屉裁切。拖动保留抓取偏移连续跟随两轴，其他点均分
预排、松手提交；加号复用绿色按钮与原图标下翻动画，拖桶删除后恢复加号。
真实 DSH 主路由/自定义编辑、点和浮卡拖动、固定点、删除、Escape 取消通过，最新
完整 CI 仍 12+2 项及安装/补丁门禁全链通过。用户原有“1 / 2”草稿已恢复并保留，
没有把它们或临时验证项保存为请求配置。预览仍为同一进程和地址，见 local-env。

2026-10-11 继续修正会话选择器：手柄 .26s 连续过渡，悬浮任一档位只预览名称和值；
名称区约 62%、展开区约 38%，长供应商名裁剪且只有名称区触发浮卡，完整名称卡向左
延展不遮展开区。折叠供应商内缝直角、栈外缘圆角；展开独立卡及折回均过渡。模型/
供应商浮卡和档位卡沿用 Promptbook .2s 进入/退场节奏，退场停止交互及键盘聚焦。
真实 DSH 验证候选悬浮不改手柄/模型、点击过渡、键盘聚焦/离焦及展开区隔离。当前
模型保持用户本轮的 MiMo V2.6 Pro / 默认；本轮未打开设置草稿，不复建上一轮的 1/2
草稿。完整 CI 12+2 及全部安装门禁通过，继续同进程热载；详情见 progress/local-env。

- [README.md](README.md)：完整交互、已落地数据协议与验收条件。
- [progress.md](progress.md)：验证记录与边界。
- [verification.md](evidence/verification.md)：脱敏 CI/UI/出站证据摘要。
- [AGENTS.md](../../AGENTS.md)：强制接口与部署纪律。
- [reasoning-history-passback](../reasoning-history-passback/handover.md)：同时存在的历史回传修复，保持保留。
- 被忽略的 local-env.md：本机实例、截图和当前预览地址，不含认证信息。

## 用户定稿与实现

默认完全省略思考参数，**包括思考开关**。自定义目录主要由使用者有需要时手动配置，
不推断自定义端点预算能力。用户随后授权插件自带 MiMo 三模型目录预设：Chat /
Messages 开启为 thinking.type: enabled，Responses 为 reasoning.effort: low / high；关闭
对应 disabled / none。三模型当前能力相同，非 none 的 Responses 档位行为相同，
按用户要求保留 Low / High 两个 API 值，不虚构 token 预算。已有目录及手动修改/删除不自动回填，当前
实例的空配置是本轮经 GUI 明确填写的。旧 thinking 配置只保留加载兼容；标题请求
也不再自动注入关闭开关。

关闭与默认用稳定 ID mimo:off / mimo:default，始终第一、第二，不能拖删；所有点
按数量均分。关闭初始映射 thinking.type: disabled 可改，默认无论编辑值是什么都
不发参数。普通档位用稳定 UUID，名称留空跟随值；字段路径/类型只放编辑浮卡内。

模型配置默认星标在收起和展开时都有效；手动选择绑定草稿卡片，名字/ID 改动、暂时
清空 ID 都保留同一卡片。没有手动选择时取第一项；删除默认项回退第一项。主路由、
自定义编辑、新供应商创建均使用相同编辑器，保存/取消保留目录其他字段。

每模型按 reasoningControlsByFormat 的 chat/anthropic/responses 三桶保存档位、名称、
值与字段/类型。切换 API 同时切换编辑轨道、标准能力和请求映射，切回恢复。旧单份
配置归入切换前的原格式，新格式不借用其他桶。保存校验所有已配置桶，错误时切回并
聚焦。Responses 关闭初始 reasoning.effort: none；默认省略整个 reasoning 字段。
Responses 使用 input/max_output_tokens、平铺 function 工具、call_id 关联及原生 reasoning
历史回传；流必须收到 completed/incomplete 终态，显式 stop 序列拒绝发送。

会话入口复用公共 single 槽与共享 ModelDirectory。用户追加授权后，原生可推理模型
也使用悬浮滑轨；托管配置/提示词范围仍精确限定于 llmMimo 成员。DeepSeek/pi-ai 只取
目标模型广告的 effort/default；不跨路由携带 MiMo 档位。悬浮细轨在模型名左侧，同处
一张浮卡，右边对齐整个输入框外沿。未选模型的强度仅按会话/精确路由暂存，点名称
才提交；配置或格式更新清除旧预览。原生默认点恢复适配器广告默认，不保证原生请求
省略参数；原生未广告 off/none 就不补关闭点，内部 native-default ID 不发送。无可用
标准目录时才委托原组件。/model 与选择器共享提交状态，当前提交优先于旧预览。当前档位删除后显示
提示并拒绝发送过期 ID，重新选择恢复。

## 实现入口

- lib/model-controls.js：数据归一化、默认引用、字段/值解析、标准强度投影、目标模型选值规则。
- src/controls-client.js：星标、旅行虚手柄/编辑浮卡、增删拖排、模型入口及原槽委托。
- lib/client.js：既有三条设置路径的接线及生成标记区域；源修改后 npm run build:client。
- lib/index.js：目录投影、同源无凭据桥、请求映射及 prepareCall 快照。
- lib/responses.js：Responses 序列化、流协议校验及原生工具/推理历史回传。
- scripts/test-responses.mjs：Responses 工具回合、媒体映射、异常/断流与发现回退回归。
- scripts/test-model-controls.mjs：配置、序列化/类型、隔离、过期 ID 和快照回归。
- scripts/test-native-efforts.mjs：导入实际基线 DeepSeek/pi-ai 适配器，核验默认/词汇及无推理模型。

不需要新增宿主补丁；仍保留原多模态投影及设置页第三页签补丁。新服务采用可选注入，
不扩大 peer 范围。新交互仅在 0.2.0-rc.2 进行了行为验收，不宣称旧宿主的新 UI 已验证。

旅行框目标在 useTravelFrames 注册：data-travel-spot / data-travel-input，视觉盒体可
用 data-frame-inset 调整；portal 标注 data-travel-surface。EffortEditor 在布局提交后
发 llm-mimo-travel-layout 通知同一机器重测，拖动按所属轨道锁定目标，结束/卸载清锁。
不能只改生成 client 区域，也不要用静态独立高亮代替原旅行逻辑。
彩色动作按钮（llm-mimo-plusbtn / llm-mimo-trash）是旅行框豁免项；普通点和浮卡字段
仍走原旅行机器。拖入垃圾桶清悬浮框但保留拖动所属轨道锁，离桶恢复虚手柄跟随。

## 已验证

npm run ci 通过：23 项历史/模型控制/Responses 测试、2 项实际基线原生适配器兼容测试、客户端
生成一致性、安装门禁、npm pristine 宿主补丁重放/二跑幂等、临时官方安装及组合树。

1280×720 的真实 DSH UI 已验证：星标两状态、空 ID 边界/删除回退/取消，轨道添加
均分、名字跟随、空值定位、普通点拖排/拖到垃圾桶，主路由保存刷新重启、自定义编辑
取消、新供应商创建后重新打开；供应商独立展开/其他常驻、浮卡滑轨与模型选择、未选
模型预览、会话隔离、/model 同步、原生 DeepSeek 默认/Low/Off/High/Max 菜单、过期
档位提示与重新选默认恢复、Escape 收起。原生菜单是扩展前验证；扩展后已验证原生
DeepSeek 两模型独立展开、悬浮滑轨及 Low/关闭/默认（High），保留其他供应商常驻。
pi-ai 是实际基线适配器广告/默认及 UI 投影回归，未在当前实例增加 pi-ai 凭据或发请求。

扩展后 UI 验证三格式初次仅两点、主路由三份配置保存、切回恢复、跨格式取消、隐藏
格式空值定位；百炼自定义草稿 numeric 4096、Messages 隔离、Chat 恢复及取消。测试
普通档位已清理。序列化回归覆盖三格式能力切换、Chat/Anthropic 不串字段、自定义
路由独立格式、prepareCall 保持旧格式、Responses 配置及仍拒绝发送的明确边界。

同一 MiMo V2.6 Flash、同一“只回答数字：1+1等于几？”任务：默认、关闭、手动启用、
切回默认均 HTTP 200 且返回 2；出站分别为无字段、thinking.type: disabled、
thinking.type: enabled、无字段。最后一条明确捕获 hasThinking=false 和
hasReasoningEffort=false。本地序列化还覆盖两个普通文本档、数值预算、自定义路由和
Anthropic 面，不把这些模拟端点当作真实 API 能力结论。

测试普通档位与临时供应商已清理，测试会话保留作为可复查结果，恢复主模型默认档位。
两 profile 的复制包已同步；交付前对账与干净重启结果记录在 progress/local-env。

## 2026-10-11 追加验收

2026-10-11 追加验收：名称浮卡中的重复展开按钮已删除，名称区域和右侧展开区域
完全分离；供应商模型行现在常驻裁剪容器，用 0fr/1fr 做 260ms 下展/上收，折叠
立即 inert/禁用/退出 Tab 顺序。实测两个方向均有连续高度变化，展开区不触发名称浮卡。
src 源和生成客户端均更新，两 profile 复制包同步，npm run ci 全链通过。

托管 DeepSeek 的 GUI 配置→滑轨选择→实际请求验收：Chat、Messages 各四档
（关闭、默认、High、Max）共八个主请求 HTTP 200，均返回 2，实际出站字段正确、
默认完全省略思考字段、格式之间无残留。Messages 使用 DeepSeek 官方 /anthropic 根路径。
该轮 Responses 四档完成保存与选择，但当时明确 UNSUPPORTED_FORMAT，零上游请求。
当时的记录和安全审计见 [deepseek-e2e.md](deepseek-e2e.md)；本轮已补齐 Responses
传输与 DeepSeek 四档实际适配器请求，见上方最新状态与 Responses 验证。
临时测试配置已清理，DeepSeek 恢复原 Chat URL/模型条目，MiMo Pro 恢复默认档，
测试会话保留，原 DSH 实例/预览页保持运行。

2026-10-11 按钮与长按修正：彩色动作按钮使用既有按钮的即时悬浮高亮，移除新增
加号的旅行注册；加号/垃圾桶图标下翻从 350ms 缩为 140ms。普通点或浮卡空白处
静止按住 200ms 即进入拖动，超过 4px 移动仍立即开始；长按时从实际浮卡位置启动，
卡片不跳动。松手、Escape、pointercancel、失焦、格式切换及卸载清除计时/拖动状态。
真实 DSH 1280×720 已验短点击无延迟误拖、静止长按、点/卡两轴跟随与排序、特殊点
不可拖、Escape 前后取消、桶悬浮配色/豁免、离桶续行、拖删。临时 High/Max 已删除，
可见草稿字段/星标/展开状态与起始逐项一致；没有保存配置或新增 API 调用。完整 CI
再次通过，两 profile 副本同步。证据见 [button-hold-verification.json](button-hold-verification.json)
和 [button-longpress.png](button-longpress.png)。

## 后续工作边界

本次实现与本地验收已授权，不需要再询问是否开始开发。后续按用户视觉反馈调整；推送、
版本号与发布沿用既有视觉验收门，尚未进入该流程。不要为了新功能升级 DSH 基线或
中断私有实验队列。不要回退工作区原有 reasoning_content 修复及其 CI 回归。
