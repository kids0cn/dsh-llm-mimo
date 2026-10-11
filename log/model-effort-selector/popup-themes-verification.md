// SPDX-License-Identifier: CC-BY-4.0
<!-- Copyright (c) 2026 MiMo CodeX / dalizi233 -->

# 弹出卡片日间 / 夜间配色验证

2026-10-11，在 DSH 0.2.0-rc.2 / core-web、1280 × 720 CSS px 验证。

## 原因与修正

新增控件使用了宿主未定义的 `--dsw-alias-background-primary`，夜间因此回退成
白底，却继承了夜间白色文字。修正前实测选择卡背景 `rgb(255, 255, 255)`、文字
`rgb(249, 250, 251)`。

供应商选择卡、供应商名称悬浮卡、模型名称 / 滑轨悬浮卡、候选档位提示卡、设置里的
强度编辑卡共用宿主 `bg-module-platform`、`label-primary`、`border-l2`；阴影在
日间 / 夜间分别采用黑色 0.18 / 0.4。手柄使用 `bg-layer-1`、宿主阴影与边框；
选中、聚焦、错误提示使用宿主 `state-business-primary` / `state-error-primary`。
API 格式卡原已使用有效主题变量，本轮一并验收。

## 真实 UI 结果

以下每类卡片均在两种主题实际打开，记录 DOM 计算样式并检查可读性。

| 卡片 | 日间背景 / 文字 | 夜间背景 / 文字 |
| --- | --- | --- |
| 供应商选择卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |
| 供应商名称悬浮卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |
| 模型名称 / 滑轨悬浮卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |
| 候选 High 档位提示卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |
| 强度编辑卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |
| API 格式卡 | 245,246,247 / 15,17,21 | 53,54,56 / 249,250,251 |

编辑卡的必填值、请求字段与值类型下拉均可辨认；原生下拉的 `color-scheme` 分别为
light / dark。候选档位只悬浮预览，滑杆仍处于默认点。结束时恢复用户原有深色主题，
当前模型按钮仍为 Qwen3.8-Max。浏览器无 warning / error。

客户端已构建并同步 core-web / core-headless 双副本，7 个包文件逐字节一致；同一
systemd 用户服务继续运行，只刷新页面加载 client.js。完整 `npm run ci`（显式指定
基线 `DSH_RUNTIME_BIN`）退出 0，23+2 项回归和安装 / 补丁门禁全部通过；完整输出
保存在本机 `/tmp/mimo-popup-themes-ci.log`。本轮没有修改请求映射或模型配置值。

- [夜间选择卡 / 滑轨 / 档位提示](evidence/popup-theme-dark-selector.jpg)
- [日间选择卡 / 滑轨 / 档位提示](evidence/popup-theme-light-selector.jpg)
- [夜间强度编辑卡](evidence/popup-theme-dark-editor.jpg)
- [日间强度编辑卡](evidence/popup-theme-light-editor.jpg)
