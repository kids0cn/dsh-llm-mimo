# Chat reasoning history passback

2026-10-10：用户要求补齐 Thinking 历史回传后重测工具/教学与执行者对照。
第六轮实际请求证明旧 Chat 序列化只保留正文与 tool_calls，遗漏已经接收的
reasoning 块。原始实验与候选保留。

本修复将 assistant 内容中的 reasoning 块按顺序原样合并到独立的
reasoning_content 字段，包括有工具调用与纯思考响应。正文、tool-call ID、
参数、结果关联和工具 schema 均保留；没有压缩、摘要或新增行动教学。

当前源代码已修改，真实 dispatch 的离线回归已加入 npm run ci，完整 CI 已通过（包含 DSH 安装门禁、宿主 patch 重放与幂等性）。根工作区第七轮的私有适配器快照加载此修复；现有运行中的实例未被自动重启。

原生 AgentLoop 本地 SSE 验证两个型号、6 套工具配置通过；真实 Token Plan 预检两型号共 6 请求，全部接受 131072，工具回合之后 reasoning_content 与上一响应逐字相等。证据见根工作区 log/mimo-preset-00/round-7/suite-inputs/audit/preparation/native-replay-proof/state.json 与 live-replay-preflight/state.json。全量重测由根工作区 round-7/handover.md 管理；原后台响应断流后已另立接力，继承完成结果与账本并继续队列。当前入口为根工作区 `python3 log/mimo-preset-00/round-7/monitor.py --watch`。

输出上限 131072 和超过24576思考token按1/10计的指标属于新实验配置与分析，
不改旧账本，不改供应商真实费用，不作为 adapter 的文本改写功能。
