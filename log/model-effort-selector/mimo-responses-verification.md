// SPDX-License-Identifier: CC-BY-4.0
<!-- Copyright (c) 2026 MiMo CodeX / dalizi233 -->

# MiMo Responses 传输与四档预设验证

日期：2026-10-11。DSH 0.2.0-rc.2，llm-mimo 0.4.1；网页渲染固定 1280×720。
未提交、推送、发布或升级 DSH 基线。

## 配置与实现

Flash / Pro / Pro Ultraspeed 的 Responses 预设为：

| 顺序 | 显示 | 显式出站 |
| --- | --- | --- |
| 0 | 关闭思考 | reasoning.effort = none |
| 1 | 默认 | 完全不传思考参数，包括开关 |
| 2 | low | reasoning.effort = low |
| 3 | high | reasoning.effort = high |

默认选第二点。普通名称留空跟随值；Low 使用独立稳定 UUID，已有 High ID 保持。
当前 core-web 三个 Responses 桶已通过设置页手动更新；临时测试 Max 已移除。
[配置快照](mimo-responses-presets-config.json)保留脱敏目录。Chat / Messages 两桶逐模型
与上一轮快照一致。插件默认目录有相同预设；已有用户目录与手动删除的档位不自动回填。

POST https://api.xiaomimimo.com/v1/responses 已验证。实际传输映射 input、max_output_tokens，
保持原工具 name/parameters 与提示词解析。流中的 reasoning、message、function_call
转成宿主 block；原生 reasoning item / 可选 encrypted_content 同模型路由回传，工具
使用 call_id 对应 function_call_output。编辑历史或切换路由/格式后丢弃过期原生 replay。
断流、无终态、重复/变更工具 ID、异常参数、空响应不视为成功；显式 stop 序列拒绝发送。
普通与关闭档位的字段映射均禁止覆盖 Responses 的 input 与 max_output_tokens。

官方文档当前说明非 none effort 都启用思考，投入档位尚无差异；预设保留用户要求的
low/high 参数值，不预设 token 预算：[MiMo Responses 文档](https://mimo.mi.com/docs/zh-CN/api/chat/responses)。

## 已完成的实际请求

[真实适配器证据](mimo-responses-adapter.json)：Flash 默认、none、high、临时 max 均
HTTP 200 并回答 2。默认无 reasoning/thinking，none 的 reasoning token 为 0；原生
read_file → write_file 回合实际读取/写入测试文件，后续请求携带 reasoning、工具调用
与结果，最终回答 OK。额外 Pro 默认探测 45 秒超时，未算通过。

[托管 DeepSeek Responses 证据](deepseek-responses-adapter.json)：deepseek-flash 的 none、
不传参、High、Max 四档均 HTTP 200，回答 2，none 无推理 token。使用隔离适配器配置，
没有修改实例 deepseek-lab 的 Chat 配置；这四项是实际适配器集成验证，未声称 GUI 四项验证。
此前 Chat / Messages 全链路记录保留在本计划原验证文档。

GUI：Flash 默认、none、high、临时 max 在主根地址均实际完成并回答 2，出站值与选择一致。
标题请求全部省略思考字段；部分标题的 64 token 上限触发 incomplete，主任务仍完成。
新增 Low 的[真实适配器请求](mimo-responses-low-adapter.json)使用已保存的档位 ID，
HTTP 200、reasoning.effort=low、256 输出上限，回答 2。网页 Low 请求出站也是 low
且收到 HTTP 200，但 128000 输出上限的该次任务 3 分多钟未完成，手动停止；不计 GUI
生成成功。该任务没有修改模型配置或输出上限。

[GUI 脱敏出站](mimo-responses-ui-wire.jsonl)的原生 DSH High 工具任务已完成，实际
read → write → bash 校验 → OK。测试输入/输出文件逐字节相等：
[输入](evidence/responses-tool-input.txt)、[输出](evidence/responses-tool-output.txt)。
后续三次终态请求均带上之前的原生 reasoning item、function_call 与 function_call_output，
HTTP 200，reasoning.effort 仍为 high。记录只含完成读回响应的尝试，未返回响应的
尝试不在该审计中，不能据序号当作无重试证明。

最终恢复 Flash / 默认（不传参），Responses 主根地址保持。预览在移除审计插桩后
干净重启；当前地址与进程句柄见不入库的 local-env.md。
[最终设置截图](evidence/mimo-responses-four-presets.jpg)展示四个均分点与 Low 编辑卡。

## CI

完整 npm run ci 通过：23 项历史/配置/Responses 回归、2 项实际基线 DeepSeek/pi-ai
能力兼容、生成客户端一致性、安装门禁、pristine 宿主补丁重放与二跑幂等、临时官方安装
及组合树检查。三模型/三格式字段、四点顺序、默认省略和 Low/High 实际序列化均有覆盖。
不将配置回归或模拟媒体映射测试表述为三模型全量远程能力测试。
