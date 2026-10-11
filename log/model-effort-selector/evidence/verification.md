// SPDX-License-Identifier: CC-BY-4.0
<!-- Copyright (c) 2026 MiMo CodeX / dalizi233 -->

# 验证摘要

2026-10-10；DSH 0.2.0-rc.2，llm-mimo 0.4.1 工作区功能改动。浏览器渲染 viewport
保持 1280×720。源码、两个复制包与干净实例对账结果见 progress/local-env。

## CI

命令：DSH_RUNTIME_BIN=<baseline node_modules/.bin/dsh> npm run ci，退出 0。

- verify-install 的静态、模块、apply、打包和补丁清单检查通过。
- 历史回传/模型控制：12 项通过，0 失败；实际基线 DeepSeek/pi-ai：2 项通过，0 失败。
- 客户端生成检查通过。
- npm pristine 0.2.0-rc.2 两补丁重放成功，二跑 already patched, skip × 2；标记和语法检查通过。
- 临时官方 CLI 安装成功，组合树包含 llm-mimo；最终 PASS：本地 CI 全链通过。

## 实际请求

同一 MiMo V2.6 Flash，同一无附件/无工具任务“只回答数字：1+1等于几？”，全部返回 2。
仅捕获字段摘要与 HTTP 状态，不保存凭据、URL、系统提示词或完整会话。

| 选择 | 实际出站 | HTTP |
| --- | --- | --- |
| 默认 | thinking / reasoning_effort 无值；序列化回归断言字段不存在 | 200 |
| 关闭思考 | thinking.type = disabled | 200 |
| 手动普通档 enabled | thinking.type = enabled | 200 |
| 再选默认 | 明确捕获 hasThinking=false，hasReasoningEffort=false | 200 |

[requests.jsonl](requests.jsonl) 前两行分别为首轮和标题请求；初版捕获使用 null 表示
缺值，不能单凭 null 区分缺键/显式 null。最后一行使用存在性布尔，直接证明切回默认
没有字段残留。两个普通文本档、数字预算、自定义隔离、Anthropic 省略与 prepareCall
快照由实际适配器序列化单测捕获；模拟的预算字段不构成真实端点能力证明。

## UI

真实设置页面检验三条配置路径、两种星标状态及 ID 清空边界、必填定位、点均分、名字
跟随、普通点/卡拖排与拖桶删除、保存/取消/刷新重启。会话页面检验供应商分合、浮卡
右外沿与细轨、待选值/会话隔离、共享 /model 状态、过期 ID 恢复、原生 DeepSeek 菜单。
新建测试供应商与普通测试档位已清理；真实测试会话保留。截图位置记录于本机交接。

## API 格式与原生滑轨扩展

用户追加授权的范围：逐模型、逐 API 格式独立配置；原生可推理模型也使用悬浮滑轨。

- 主路由：Chat 手动 enabled/名称、Messages 独立 enabled/名称、Responses 独立 high/
  字段；各首次未配置格式只有关闭/默认两点。Responses 关闭值 none、字段 reasoning.effort。
- 保存三桶后切回恢复；临时改 Chat 名称再切 Messages 后取消，恢复保存的 Chat 名称。
- Responses 空值藏在另一格式时，保存切回 Responses，空值红框获得焦点。
- 自定义百炼：Chat 草稿 4096/number/thinking_budget；Messages 仅两点，切回保留草稿，
  取消恢复原两点。未发送此预算到真实供应商。
- 原生 DeepSeek：统一供应商栈、两模型独立展开、悬浮滑轨；选择 Low、关闭、默认，
  默认提示为适配器默认 High。目录的实际四种努力值加一个 UI 重置点，未将 UI ID 发送。
- pi-ai：导入实际基线适配器，广告词汇投影逐项相等、配置默认 medium、不推理模型
  无轨道、重置选择保持原生默认。当前实例无 pi-ai UI/真实出站验证，不扩大结论。

API 格式回归捕获真正的 llm-mimo 序列化请求：Chat reasoning_effort 与 Messages
output_config.effort 分属各桶，旧档位在新格式拒绝，自定义 route 格式独立于主 route。
prepareCall 捕获的旧 Chat 在配置变更后继续使用旧字段；Responses 元数据与关闭映射
正确，但真实传输仍返回 UNSUPPORTED_FORMAT。此扩展没有新增真实付费 API 请求。

最终干净重启再次确认组件 v0.4.1 / 1 运行中，1280×720；已保存的 Responses
关闭 none / reasoning.effort 读回，取消恢复 Chat；原生默认浮卡提示 High。当前
截图由本机 local-env 指路；两 profile 的 6 文件与源码一致，pack dry-run 共 22 文件。

## 旅行框、拖动与加号修正

2026-10-10 用户视觉反馈后，1280×720，同一基线实例：

- 原收起钮与新增加号/星标/虚手柄使用同一旅行机器；新加号填充框 32×32（按钮 28），
  虚手柄框 22×22。浮卡名称、值和请求字段在 portal 内接住悬浮/聚焦框，不遮文字。
- 抓点位移 +38/−27px，浮卡左上角与虚手柄同向等距移动；抓浮卡 +36/−22px 亦然，
  抓取偏移保持，布局量化误差 <0.02px。松手后按最终排序落回均分位置。
- 拖动中的原旅行框位于浮动点表面；经过底层其他控件不夺走，拖到桶时落到桶。
- 加号沿用原绿色圆钮；实际拖动后出现原 glyph-out / glyph-in 动画名，350ms 下翻；
  松手/取消回到加号时也有同一过渡。拖桶删除临时项后无浮动节点残留。
- Escape 取消不改顺序；关闭/默认不能启动拖动/删除。5 点约 89.78px，删除后 4 点
  约 119.70px，所有点重新均分；展开模型的星标及百炼自定义编辑的加号/浮卡通过。
- 完整 CI 退出 0，12+2 项回归和全部原有安装/补丁门禁通过；此次无新真实 API 请求。

用户的 1/2 草稿已恢复保留；验证临时档删除，未保存草稿或改服务端配置。

## 会话预览与供应商区域修正

2026-10-11，真实 DSH 0.2.0-rc.2、1280×720，同进程客户端热载。

- 折叠五供应商内部缝均为 0 圆角，外缘 9px；展开独立卡后收起恢复。
- 名称 / 展开按钮实测约 102.57 / 62.88px；长名裁剪，完整供应商名浮卡宽 176px，
  右边与名称区右边同为 1064.03px。右区左边缘悬浮收起名称卡，点击可展开。
- DeepSeek 五个点逐项悬浮，各预览正确且选中 High（索引 3）、手柄位置未变；
  当前模型一直 MiMo Pro。点击 Low（索引 2）时手柄实测从 885.96 经 868.38 向
  840.46px 移动，CSS 过渡 .26s cubic-bezier(.2,0,0,1)。
- MiMo Pro 悬浮关闭点不改默认，点击关闭、键盘 End 恢复默认；原生 Home/End/
  箭头及 Tab 离焦预览收起、Escape 收起通过。关闭动画期间浮卡不再接受交互。
- 浮卡/档位卡动画名 mm-pop-in，.2s 同 Promptbook 曲线；退出同 .2s 淡出收缩。
- 最终 CI 12+2 及安装/补丁全链通过；六包文件双副本对账，无新真实 API 请求。

模型恢复本轮起始 MiMo V2.6 Pro / 默认，未打开或保存设置；上一轮 1/2 草稿是历史
状态，本轮起始页面已为 Promptbook，不擅自重建可能已被用户取消的草稿。
