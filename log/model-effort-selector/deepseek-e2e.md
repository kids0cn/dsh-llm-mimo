# DeepSeek 托管线路端到端验收

2026-10-11，DSH 0.2.0-rc.2，`mimo-codex-020rc2 / core-web`，浏览器 1280 × 720 CSS 像素。
测试对象为 llm-mimo 的 `deepseek-lab / deepseek-flash`，不是原生 llm-deepseek 路由。

## 结果

| API 格式 | 关闭思考 | 默认／不传参数 | High | Max |
| --- | --- | --- | --- | --- |
| Chat Completions | HTTP 200，返回 2 | HTTP 200，返回 2 | HTTP 200，返回 2 | HTTP 200，返回 2 |
| Anthropic Messages | HTTP 200，返回 2 | HTTP 200，返回 2 | HTTP 200，返回 2 | HTTP 200，返回 2 |
| Responses | UNSUPPORTED_FORMAT | UNSUPPORTED_FORMAT | UNSUPPORTED_FORMAT | UNSUPPORTED_FORMAT |

Responses 的四份选择都完成了配置保存、模型选择与滑轨提交，但适配器在发请求前拒绝。
四次测试前后审计记录均为 16 条，没有 Responses 上游请求。当前缺少 Responses
传输实现，不能将配置或选择成功记作完整链路通过。

## 配置与实际请求

三个格式均通过设置界面手动添加 High、Max；格式初次切换只显示关闭、默认两点，
各格式独立保存。关闭点与默认点使用其初始值；High/Max 使用文本类型及下表字段。

| 选择 | Chat 请求体字段 | Messages 请求体字段 | Responses 已保存的映射 |
| --- | --- | --- | --- |
| 关闭 | `thinking.type: disabled` | `thinking.type: disabled` | `reasoning.effort: none` |
| 默认 | 无任何思考字段 | 无任何思考字段 | 无任何思考字段 |
| High | `reasoning_effort: high` | `output_config.effort: high` | `reasoning.effort: high` |
| Max | `reasoning_effort: max` | `output_config.effort: max` | `reasoning.effort: max` |

Chat 和 Messages 八个主请求均断言：HTTP 200、流结束、最终文本为 `2`，关闭/默认/
High/Max 字段与配置一致，无另一格式的残留字段。默认还逐一核验了 `thinking`、
`reasoning_effort`、`reasoning`、`output_config` 均不存在。Responses 一列是配置映射，
没有实际发送，不能据此证明其序列化或服务端行为。

Messages 使用官方的 `/anthropic` 根路径，实际请求为
`https://api.deepseek.com/anthropic/v1/messages`；Chat 实际请求为
`https://api.deepseek.com/v1/chat/completions`。参照
[DeepSeek Anthropic 文档](https://api-docs.deepseek.com/guides/anthropic_api/)和
[思考模式文档](https://api-docs.deepseek.com/guides/thinking_mode/)。

每档新建独立 DSH 测试会话，使用相同工作区、标准模式、模型和任务
“只回答数字：1+1等于几？”，保持配置上下文 1M、输出上限 128K。
DSH 自带的会话标题请求另产生八条记录，其上限为 64，不计入八个主请求。
主请求按模型、配置输出上限与 GUI 执行顺序区分。审计只保存字段存在性、字段值、
HTTP 状态、用量、流完成与结果判定，不记录凭据、请求头、系统提示词或消息全文。

## 可复查证据

- [测试时保存的三个格式配置](deepseek-e2e-config.json)
- [八个真实主请求的出站记录](deepseek-e2e-wire.jsonl)
- [Responses 四档的拒绝记录](deepseek-e2e-responses.json)
- [Responses 报错截图](deepseek-responses.png)

## 交互修正与收尾

供应商名称浮卡仅含名称按钮，已删除重复的展开按钮；其右沿与名称触发区右沿一致，
不遮挡右侧展开区域。实测名称浮卡右沿 1064.0263，展开区左沿 1064.0264 CSS 像素；
鼠标进入展开区时，活动的名称浮卡数量为零。展开/收起不会改变已选模型。

模型行保留在独立裁剪容器中，以 `grid-template-rows: 0fr / 1fr` 做 260ms 过渡。
实际展开测得 0、8.62、17.41、36.93、44.71、56.47…96px，收起测得
95.95、90.97、87.21、68.04、48.45、35.61、25.97…0px。
折叠即标记 inert/aria-hidden、禁用按钮并退出 Tab 顺序；其他供应商保持常驻。
遵循 prefers-reduced-motion。[最终界面截图](provider-name-only.png)。

`npm run ci` 全链通过，客户端生成、安装门禁、宿主补丁重放/幂等及 14 项测试通过。
客户端代码已同步到 core-web 与 core-headless 的实例复制包。

临时审计 URL、High/Max 档位和三格式测试映射已撤回，DeepSeek 条目恢复测试前配置：
Chat、`https://api.deepseek.com`、原模型目录，无 reasoningControlsByFormat。
刷新后重新打开真实设置页确认只显示关闭、默认两点。测试会话保留；用户原选
MiMo V2.6 Pro 恢复默认档。DSH 实例与预览页保留，审计转发进程已停止。
