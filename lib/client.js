window.__ModuleLoader__.load({
	id: "@mimo-codex/dsh-llm-mimo",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_dom = require("react-dom");
		//#region locales
		const en = {
			baseUrl: "Base URL",
			baseUrlHint: "{name} format",
			apiKey: "API key",
			apiKeyHint: "Leave empty to keep the stored key.",
			apiKeyConfigured: "API key configured",
			apiKeyMissing: "API key not configured",
			modelsTitle: "Models",
			modelsHint: "One card per model. The catalog feeds the model picker.",
			modelName: "Model name",
			modelNameDefault: "defaults to model ID",
			modelId: "Model ID",
			modelIdRequired: "Model ID (required)",
			contextWindow: "Context window",
			maxTokens: "Max output tokens",
			inputTypes: "Input types",
			inputTypesHint: "Checked means the model supports that modality; unchecked modalities are rejected at send time with a clear error, never silently dropped.",
			modalityText: "Text",
			modalityImage: "Image",
			modalityAudio: "Audio",
			modalityVideo: "Video",
			modalityPdf: "PDF",
			addModel: "Add model",
			removeModel: "Remove model",
			expand: "Expand",
			collapse: "Collapse",
			cancel: "Cancel",
			save: "Save",
			saved: "Saved",
			invalid: "Every model needs an ID and at least one input type.",
			keySaved: "API key stored",
			keyFailed: "API key storage failed",
			kFormat: "Auto-formats as K/M",
			providerName: "Provider name",
			providerNameDefault: "defaults to the provider ID",
			providerIdRequired: "Provider ID (required)",
			providerIdHint: "Lowercase identifier that uniquely names the provider in requests and derives the credential name.",
			routeInvalid: "Provider ID: a letter first, then lowercase letters, digits and dashes.",
			routeTaken: "That provider ID is already taken.",
			baseUrlInvalid: "API address must be an http(s) URL.",
			apiFormat: "API format",
			create: "Create provider",
			creating: "Creating…",
			needsBaseUrl: "Custom model API needs an API address.",
			needsModels: "Custom model API needs at least one model."
		};
		const zh = {
			baseUrl: "Base URL",
			baseUrlHint: "{name}格式",
			apiKey: "API 密钥",
			apiKeyHint: "留空则保留已存储的密钥。",
			apiKeyConfigured: "API 密钥已配置",
			apiKeyMissing: "API 密钥未配置",
			modelsTitle: "模型目录",
			modelsHint: "每个模型一张卡片，目录直接供给模型选择器。",
			modelName: "模型名",
			modelNameDefault: "默认为模型ID",
			modelId: "模型ID",
			modelIdRequired: "模型ID（不可为空）",
			contextWindow: "上下文窗口",
			maxTokens: "最大输出token数",
			inputTypes: "输入类型",
			inputTypesHint: "勾选即声明模型支持该模态；未勾选的模态发送时会被明确拦截，不静默丢弃。",
			modalityText: "文本",
			modalityImage: "图片",
			modalityAudio: "音频",
			modalityVideo: "视频",
			modalityPdf: "PDF",
			addModel: "添加模型",
			removeModel: "删除模型",
			expand: "展开",
			collapse: "收起",
			cancel: "取消",
			save: "保存",
			saved: "已保存",
			invalid: "每个模型都需要模型ID和至少一种输入类型。",
			keySaved: "密钥已存储",
			keyFailed: "密钥存储失败",
			kFormat: "自动格式化为 K/M 简写",
			providerName: "供应商名称",
			providerNameDefault: "默认为供应商ID",
			providerIdRequired: "供应商ID（不可为空）",
			providerIdHint: "以小写字母开头的标识，在请求中唯一标识该供应商，并用于派生凭据名。",
			routeInvalid: "供应商ID 需以小写字母开头，仅含小写字母、数字和连字符。",
			routeTaken: "该供应商ID 已被占用。",
			baseUrlInvalid: "API 地址需为 http(s) 链接。",
			apiFormat: "API格式",
			create: "创建提供商",
			creating: "创建中…",
			needsBaseUrl: "自定义模型 API 需要填写 API 地址。",
			needsModels: "自定义模型 API 至少需要一个模型。"
		};
		//#endregion
		//#region helpers
		const NS = "settings.llm-mimo";
		const ENTRY_ID = "llm-mimo";
		const MODALITIES = [
			{ id: "text", label: "modalityText" },
			{ id: "image", label: "modalityImage" },
			{ id: "audio", label: "modalityAudio" },
			{ id: "video", label: "modalityVideo" },
			{ id: "pdf", label: "modalityPdf" }
		];
		const DEFAULT_CONTEXT_WINDOW = 1048576;
		const DEFAULT_MAX_TOKENS = 131072;
		/* 旅行悬浮框/聚焦框视觉样式独立成常量:overlays 自带 <style> 注入,随机器
		   走——设置卡树之外(如对话页模型菜单)不依赖 CARD_STYLES 在场。 */
		const TRAVEL_OVERLAY_CSS = `
.llm-mimo-hoverbox { position: absolute; z-index: 2; pointer-events: none; box-sizing: border-box; background: var(--dsw-alias-interactive-bg-hover); corner-shape: superellipse(1.43); opacity: 0; transition: top 0.26s cubic-bezier(0.2, 0, 0, 1), left 0.26s cubic-bezier(0.2, 0, 0, 1), width 0.26s cubic-bezier(0.2, 0, 0, 1), height 0.26s cubic-bezier(0.2, 0, 0, 1), border-radius 0.26s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease; }
.llm-mimo-hoverbox.on { opacity: 1; }
.llm-mimo-hoverbox.instant { transition: opacity 0.15s ease; }
/* 旅行框配色。调试配色(留档勿删):红 #ef4444 / 绿 rgba(52,168,83,0.55) /
   蓝 #3b82f6,蓝态待命半透明 dim 0.45。正式配色 = 输入框聚焦高亮色
   var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)),全态同色;
   绿框永远全透明不可见,蓝框待命全透明(加号行悬浮触发显形)。 */
.llm-mimo-frame { position: absolute; z-index: 3; pointer-events: none; box-sizing: border-box; border: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); corner-shape: superellipse(1.43); opacity: 0; transition: top 0.26s cubic-bezier(0.2, 0, 0, 1), left 0.26s cubic-bezier(0.2, 0, 0, 1), width 0.26s cubic-bezier(0.2, 0, 0, 1), height 0.26s cubic-bezier(0.2, 0, 0, 1), border-radius 0.26s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease; }
.llm-mimo-frame.on { opacity: 1; }
.llm-mimo-frame.on.dim { opacity: 0; }
.llm-mimo-frame.instant { transition: opacity 0.15s ease; }
@media (prefers-reduced-motion: reduce) { .llm-mimo-hoverbox, .llm-mimo-frame { transition: none; } }
`;
		const CARD_STYLES = `
/* ===== 同类样式集中区(圆钮/危险/成功/浮层配色) =====
   全部从主题语义令牌派生,日间/夜间自动正确;调这类观感只改本块。
   明暗反转的特例(如复选勾线色)用 body[data-ds-dark-theme] 覆盖。 */
body {
	/* 变量必须挂 body:主题令牌 --dsw-alias-* 定义在 body,CSS 变量替换发生在
	   声明元素处——挂 :root 解析不到令牌,整条变量会失效。
	   日间(owner 调教定稿中):图标比填充更透明——实心色底 + 半透明白图标;
	   夜间维持实图标+半透底(悬浮/卡片提亮背景,该关系刚好)。 */
	--llm-mimo-danger-fill: color-mix(in srgb, var(--dsw-alias-state-error-primary) 58%, transparent);
	--llm-mimo-danger-fill-hover: #ef4734;
	--llm-mimo-danger-border: color-mix(in srgb, var(--dsw-alias-state-error-primary) 55%, transparent);
	--llm-mimo-danger-icon: var(--dsw-alias-state-error-primary);
	--llm-mimo-danger-icon-hover: #ffffff;
	--llm-mimo-success-fill: color-mix(in srgb, var(--dsw-alias-state-success-primary) 58%, transparent);
	--llm-mimo-success-fill-hover: color-mix(in srgb, var(--dsw-alias-state-success-primary) 88%, transparent);
	--llm-mimo-success-fill-strong: color-mix(in srgb, var(--dsw-alias-state-success-primary) 75%, transparent);
	--llm-mimo-success-icon: var(--dsw-alias-state-success-primary);
	--llm-mimo-success-icon-hover: #ffffff;
	--llm-mimo-strip-fill: var(--dsw-alias-interactive-bg-hover);
	--llm-mimo-strip-fill-hover: #cbced2;
	/* 小米橙聚焦框(试验过:夜间可以,日间需整体暖色调才不突兀——owner 决定滞后;
	   暖色日间主题就位后取消注释并把 .llm-mimo-frame 的边框色换成该变量即可) */
	/* --llm-mimo-accent-focus: #ff6900; */
	--llm-mimo-popover-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}
body[data-ds-dark-theme] {
	--llm-mimo-danger-fill: color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent);
	--llm-mimo-danger-fill-hover: color-mix(in srgb, var(--dsw-alias-state-error-primary) 80%, transparent);
	--llm-mimo-danger-icon: var(--dsw-alias-state-error-primary);
	--llm-mimo-danger-icon-hover: #ffffff;
	--llm-mimo-success-fill: color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, transparent);
	--llm-mimo-success-fill-hover: color-mix(in srgb, var(--dsw-alias-state-success-primary) 62%, transparent);
	--llm-mimo-success-fill-strong: color-mix(in srgb, var(--dsw-alias-state-success-primary) 55%, transparent);
	--llm-mimo-success-icon: var(--dsw-alias-state-success-primary);
	--llm-mimo-success-icon-hover: #ffffff;
	--llm-mimo-strip-fill: var(--dsw-alias-interactive-bg-hover);
	--llm-mimo-strip-fill-hover: var(--dsw-alias-interactive-bg-hover-solid);
	--llm-mimo-popover-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
}
.llm-mimo-fillcard { background: var(--dsw-alias-bg-module-platform); corner-shape: superellipse(1.43); border-radius: 20px; padding: 10px 12px; display: grid; gap: 8px; align-content: start; }
/* 自定义模型API(llm-mimo) 页:add 面板底色与 fillcard 同为 bg-module-platform,
   卡片分区会被吃掉——页面内 fillcard 用上面(页签条)同款的更亮填充区分;但纯半透明
   会在 -12px 融合重叠处叠色(接缝发亮),故以不透明平台底 + 内阴影半透明合成:
   观感同页签条,整体不透明,重叠同色无缝。 */
.llm-mimo-page .llm-mimo-fillcard, .llm-mimo-edit .llm-mimo-fillcard, .llm-mimo-drawerbody .llm-mimo-fillcard { background: var(--dsw-alias-bg-module-platform); box-shadow: inset 0 0 0 999px var(--dsw-alias-interactive-bg-hover); }
.llm-mimo-page .llm-mimo-formatcard, .llm-mimo-edit .llm-mimo-formatcard, .llm-mimo-drawerbody .llm-mimo-formatcard { background: var(--dsw-alias-bg-module-platform); box-shadow: inset 0 0 0 999px var(--dsw-alias-interactive-bg-hover), var(--llm-mimo-popover-shadow); }
/* 身份行(供应商名称/供应商ID):与 Base URL/API 密钥 行同列
   (标签列 92 + gap 10 + 输入列),悬停收拢同款,垂直恒定。 */
.llm-mimo-idrow { padding: 5px 0; cursor: text; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-fillcard .llm-mimo-idrow input:hover:not([type="checkbox"]) { background: transparent; }
/* 身份行是一个命中区:名字输入框没有独立悬浮判定(悬停它=悬停行,内收照常
   触发;反正点行任意处都聚焦名字输入框,内收位移不怕点偏)。仅供应商ID框
   豁免——它要精确点中编辑,不能在指脚下位移。 */
.llm-mimo-idrow:hover:not(:has(.llm-mimo-idbox:hover)) { padding: 5px 10px; }
.llm-mimo-underline { border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; corner-shape: superellipse(1.43); background: transparent; outline: none; padding: 3px 8px; font: inherit; color: var(--dsw-alias-label-primary); }
.llm-mimo-underline:hover { border-color: var(--dsw-alias-label-secondary); }
/* 选填且建议核查的字段(上下文窗口/最大输出 token 数):仅下划线,仍可被旅行框选中 */
.llm-mimo-flat { border: none; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.llm-mimo-flat:hover { border-bottom-color: var(--dsw-alias-label-secondary); }
.llm-mimo-nameinput { border: 1px solid transparent; background: transparent; outline: none; padding: 2px 4px; font: inherit; color: var(--dsw-alias-label-primary); width: 100%; height: 28px; box-sizing: border-box; border-radius: 6px; }
.llm-mimo-underline::placeholder, .llm-mimo-nameinput::placeholder, .llm-mimo-idbox::placeholder { color: var(--dsw-alias-label-tertiary); }
.llm-mimo-fillcard input:hover:not([type="checkbox"]), .llm-mimo-mcard input:hover:not([type="checkbox"]) { background: var(--dsw-alias-interactive-bg-hover); }
/* 抽屉标题头:对齐宿主 editorHeader(元素4)的「名称 + 路由」双段样式,
   0.2.0 起宿主行卡不再替 llm-mimo 行露出标题,由抽屉自己补齐。 */
.llm-mimo-cardhead { display: flex; align-items: baseline; gap: 8px; padding: 4px 4px 0; }
.llm-mimo-cardtitle { font-weight: 600; font-size: 16px; color: var(--dsw-alias-label-primary); }
.llm-mimo-cardroute { font-size: 13px; color: var(--dsw-alias-label-tertiary); }
.llm-mimo-idbox { border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; corner-shape: superellipse(1.43); background: transparent; outline: none; padding: 3px 8px; font: inherit; color: var(--dsw-alias-label-primary); width: 100%; height: 28px; box-sizing: border-box; }
.llm-mimo-idbox:hover { border-color: var(--dsw-alias-label-secondary); }
.llm-mimo-mgrid { display: grid; align-items: center; column-gap: 8px; }
.llm-mimo-mcard { border-radius: 8px; padding: 5px 8px; position: relative; z-index: 0; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
/* 未悬停略微放宽(内容左/右各外扩 4px),悬停收拢回 5/8 适配填充框 */
.llm-mimo-addbody { border-radius: 8px; padding: 5px 4px; display: flex; align-items: center; gap: 8px; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-addrow:hover .llm-mimo-addbody { padding: 5px 8px; }
.llm-mimo-mcard.collapsed { cursor: pointer; padding: 5px 4px; }
.llm-mimo-mcard.collapsed:hover:not(:has(input:hover)) { padding: 5px 8px; }
.llm-mimo-mcard input, .llm-mimo-mcard label { cursor: auto; }
.llm-mimo-dimmed { opacity: 0.55; }
.llm-mimo-caret { border: none; background: transparent; padding: 0; cursor: pointer; font-family: inherit; color: var(--dsw-alias-label-tertiary); opacity: 0; transition: opacity 0.15s ease, transform 0.26s cubic-bezier(0.2, 0, 0, 1); font-size: 12px; text-align: center; }
.llm-mimo-mcard.collapsed:hover .llm-mimo-caret, .llm-mimo-caret:focus-visible { opacity: 1; }
.llm-mimo-collapsebtn { border: none; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; border-radius: 100%; corner-shape: superellipse(1.43); width: 28px; height: 100%; min-height: 56px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; animation: llm-mimo-spin-in 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-trash { border: none; background: var(--llm-mimo-danger-fill); color: var(--llm-mimo-danger-icon); cursor: pointer; border-radius: 100%; corner-shape: superellipse(1.43); width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex: none; }
.llm-mimo-trash:hover { background: var(--llm-mimo-danger-fill-hover); color: var(--llm-mimo-danger-icon-hover); }
.llm-mimo-trash, .llm-mimo-plusbtn { position: relative; z-index: 3; }
.llm-mimo-trash svg { stroke-width: 1.5; }
.llm-mimo-row { display: flex; align-items: center; gap: 10px; }
/* Base URL 行:悬停(非输入框)时标签上滚成协议名,输入框左缘随标签加宽右移 */
.llm-mimo-rollwrap { display: inline-block; width: 92px; height: 20px; overflow: hidden; transition: width 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-rollstack { display: flex; flex-direction: column; transition: transform 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-rollline { display: block; height: 20px; line-height: 20px; white-space: nowrap; }
.llm-mimo-baserow:hover:not(:has(input:hover)) .llm-mimo-rollstack { transform: translateY(-20px); }
.llm-mimo-baserow:hover:not(:has(input:hover)) .llm-mimo-rollwrap { width: 124px; }
.llm-mimo-baserow { padding: 5px 0; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-baserow:hover:not(:has(input:hover)) { padding: 5px 10px; }
.llm-mimo-baserow { cursor: pointer; }
.llm-mimo-baserow input { cursor: text; }
@keyframes llm-mimo-pop-up { from { opacity: 0; transform: translateY(6px); } }
.llm-mimo-formatcard { position: fixed; z-index: 1000; background: var(--dsw-alias-bg-module-platform); border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; corner-shape: superellipse(1.43); box-shadow: var(--llm-mimo-popover-shadow); padding: 6px; animation: llm-mimo-pop-down 0.2s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-formatcard.closing { pointer-events: none; }
.llm-mimo-formatcard.closing:not(.fly) { animation: llm-mimo-format-close 0.2s cubic-bezier(0.2, 0, 0, 1) forwards; }
.llm-mimo-formatcard.fly { opacity: 0; transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease; }
@keyframes llm-mimo-format-close { to { opacity: 0; transform: translateY(-6px); } }
@keyframes llm-mimo-pop-down { from { opacity: 0; transform: translateY(-6px); } }
.llm-mimo-formathead { font-size: 12px; color: var(--dsw-alias-label-tertiary); padding: 2px 10px 4px; animation: llm-mimo-pop-up 0.2s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-formatline { display: flex; align-items: center; gap: 10px; padding: 5px 8px; cursor: pointer; border-radius: 8px; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-formatline:hover:not(:has(input:hover)) { padding: 5px 14px; background: var(--dsw-alias-interactive-bg-hover); }
.llm-mimo-formatline.active { background: var(--dsw-alias-interactive-bg-hover); }
.llm-mimo-formatname { font-size: 13px; color: var(--dsw-alias-label-primary); width: 190px; flex: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.llm-mimo-formatinput { flex: 1; min-width: 160px; }
.llm-mimo-keyzone { cursor: pointer; border-radius: 8px; }
.llm-mimo-connect { width: 0; opacity: 0; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; color: var(--dsw-alias-label-secondary); flex: none; transition: width 0.26s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease; }
.llm-mimo-keyzone:hover:not(:has(input:hover)) .llm-mimo-connect { width: 24px; opacity: 1; }
.llm-mimo-keyzone .llm-mimo-row { padding: 5px 0; transition: padding 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-keyzone:hover:not(:has(input:hover)) .llm-mimo-row { padding: 5px 10px; }
.llm-mimo-connect.probing { animation: llm-mimo-probe-spin 0.9s linear infinite; color: var(--dsw-alias-label-primary); }
@keyframes llm-mimo-probe-spin { to { transform: rotate(360deg); } }
.llm-mimo-dot.probing { animation: llm-mimo-dot-pulse 0.9s ease-in-out infinite; }
@keyframes llm-mimo-dot-pulse { 50% { opacity: 0.35; } }
.llm-mimo-probeclip { display: grid; grid-template-rows: 1fr; animation: llm-mimo-probe-expand 0.26s cubic-bezier(0.2, 0, 0, 1); }
@keyframes llm-mimo-probe-expand { from { grid-template-rows: 0fr; } }
.llm-mimo-probeerror { min-height: 0; overflow: hidden; border: 1px solid var(--llm-mimo-danger-border); border-radius: 8px; corner-shape: superellipse(1.43); margin: 8px 0 0; padding: 8px 10px; color: var(--dsw-alias-label-error); font-size: 12px; white-space: pre-wrap; word-break: break-all; user-select: text; cursor: text; transition: margin 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-keyzone:hover:not(:has(input:hover)) .llm-mimo-probeerror { margin-left: 10px; margin-right: 10px; }
.llm-mimo-hint { color: var(--dsw-alias-label-tertiary); font-size: 12px; }
.llm-mimo-label { font-size: 13px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.llm-mimo-chip { display: inline-flex; align-items: center; gap: 4px; margin-right: 12px; font-size: 13px; color: var(--dsw-alias-label-secondary); }
.llm-mimo-chip input[type="checkbox"] { appearance: none; width: 16px; height: 16px; margin: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 100%; corner-shape: superellipse(1.43); background: transparent; cursor: pointer; flex: none; }
.llm-mimo-chip input[type="checkbox"]:checked { border-color: transparent; background: var(--dsw-alias-button-primary-fill) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.6 6.3 4.9 8.6 9.4 3.5' fill='none' stroke='%23ffffff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat; }
body[data-ds-dark-theme] .llm-mimo-chip input[type="checkbox"]:checked { background: var(--dsw-alias-button-primary-fill) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.6 6.3 4.9 8.6 9.4 3.5' fill='none' stroke='%2324293d' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat; }
.llm-mimo-chip input:disabled { opacity: 0.55; cursor: default; }
.llm-mimo-addstrip { width: 408px; height: 28px; border: 1px solid transparent; corner-shape: superellipse(1.43); border-radius: 8px; background: transparent; outline: none; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s ease, background 0.2s ease, border-color 0.2s ease; }
.llm-mimo-addrow { cursor: pointer; }
.llm-mimo-addrow:hover .llm-mimo-addstrip { opacity: 1; background: var(--llm-mimo-strip-fill); border-color: var(--dsw-alias-border-l2); }
.llm-mimo-addrow:hover .llm-mimo-plusbtn { background: var(--llm-mimo-success-fill-strong); color: var(--llm-mimo-success-icon-hover); }
.llm-mimo-addrow:hover .llm-mimo-plusbtn:hover, .llm-mimo-addrow:has(.llm-mimo-addstrip:hover) .llm-mimo-plusbtn { background: var(--llm-mimo-success-fill-hover); color: var(--llm-mimo-success-icon-hover); }
${TRAVEL_OVERLAY_CSS}
@keyframes llm-mimo-name-in { from { opacity: 0; transform: translateX(-14px); } }
.llm-mimo-mcard.fresh .llm-mimo-nameinput { animation: llm-mimo-name-in 0.3s cubic-bezier(0.2, 0, 0, 1); }
@keyframes llm-mimo-plus-appear { from { opacity: 0; transform: translateY(8px); } }
.llm-mimo-plusbtn.appear { animation: llm-mimo-plus-appear 0.3s ease; }
.llm-mimo-birthframe { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 408px; height: 28px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; corner-shape: superellipse(1.43); display: flex; align-items: center; justify-content: center; color: var(--dsw-alias-label-tertiary); font-size: 16px; pointer-events: none; animation: llm-mimo-birth-frame 0.35s ease forwards; }
.llm-mimo-birthplus { animation: llm-mimo-birth-plus 0.35s ease forwards; }
@keyframes llm-mimo-birth-frame { to { opacity: 0; } }
@keyframes llm-mimo-birth-plus { to { opacity: 0; transform: translateY(10px); } }
@keyframes llm-mimo-trash-birth { from { background: var(--llm-mimo-success-fill); } }
.llm-mimo-mcard.fresh .llm-mimo-trash { animation: llm-mimo-trash-birth 0.35s ease; }
.llm-mimo-trash-birth { position: relative; display: grid; }
.llm-mimo-trash-glyph { grid-area: 1 / 1; display: flex; align-items: center; justify-content: center; }
.llm-mimo-trash-glyph.plus { color: var(--llm-mimo-success-icon); font-size: 15px; animation: llm-mimo-glyph-out 0.35s ease forwards; }
.llm-mimo-trash-glyph.icon { animation: llm-mimo-glyph-in 0.35s ease; }
@keyframes llm-mimo-glyph-out { to { opacity: 0; transform: translateY(10px); } }
@keyframes llm-mimo-glyph-in { from { opacity: 0; transform: translateY(-10px); } }
.llm-mimo-addplus { color: var(--dsw-alias-label-tertiary); font-size: 16px; opacity: 0; transition: opacity 0.2s ease, color 0.15s ease; }
.llm-mimo-addrow:hover .llm-mimo-addplus { opacity: 1; }
.llm-mimo-addstrip:hover .llm-mimo-addplus { color: #ffffff; }
.llm-mimo-addrow:hover .llm-mimo-addstrip:hover { background: var(--llm-mimo-strip-fill-hover); }
.llm-mimo-plusbtn { border: none; background: var(--llm-mimo-success-fill); color: var(--llm-mimo-success-icon); corner-shape: superellipse(1.43); border-radius: 100%; width: 28px; height: 28px; cursor: pointer; font-size: 19px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
.llm-mimo-plusbtn:hover { background: var(--llm-mimo-success-fill-hover); color: var(--llm-mimo-success-icon-hover); }
.llm-mimo-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 2px; }
.llm-mimo-ghost { background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; corner-shape: superellipse(1.43); padding: 5px 14px; cursor: pointer; font: inherit; color: var(--dsw-alias-label-primary); }
.llm-mimo-ghost:hover { background: var(--dsw-alias-interactive-bg-hover); }
.llm-mimo-primary { background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-inverted); corner-shape: superellipse(1.43); border: none; border-radius: 16px; padding: 5px 16px; cursor: pointer; font: inherit; }
.llm-mimo-primary:hover { background: var(--dsw-alias-button-primary-hover); }
.llm-mimo-primary:disabled { opacity: 0.5; cursor: default; }
.llm-mimo-drawer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-drawer.open { grid-template-rows: 1fr; }
.llm-mimo-drawerclip { min-height: 0; overflow: hidden; }
.llm-mimo-drawerbody { display: grid; gap: 0px; padding: 10px 0 4px; position: relative; opacity: 0; transform: translateY(-6px); transition: opacity 0.18s ease, transform 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-drawer.open .llm-mimo-drawerbody { opacity: 1; transform: translateY(0); }
.llm-mimo-mbody { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-mbody.open { grid-template-rows: 1fr; animation: llm-mimo-mbody-in 0.26s cubic-bezier(0.2, 0, 0, 1); }
.llm-mimo-mbodyclip { min-height: 0; overflow: hidden; }
.llm-mimo-stackitem { transition: margin-top 0.26s cubic-bezier(0.2, 0, 0, 1), border-radius 0.26s cubic-bezier(0.2, 0, 0, 1); }
@keyframes llm-mimo-mbody-in { from { grid-template-rows: 0fr; } }
@keyframes llm-mimo-spin-in { from { opacity: 0; transform: rotate(180deg) scale(0.82); } }
@media (prefers-reduced-motion: reduce) { .llm-mimo-drawer, .llm-mimo-drawerbody, .llm-mimo-mbody, .llm-mimo-collapsebtn, .llm-mimo-mcard, .llm-mimo-stackitem, .llm-mimo-hoverbox, .llm-mimo-frame, .llm-mimo-connect, .llm-mimo-dot, .llm-mimo-probeclip, .llm-mimo-rollstack, .llm-mimo-rollwrap, .llm-mimo-formathead { animation: none; transition: none; } }
`;
		function formatTokens(value) {
			if (!Number.isSafeInteger(value) || value <= 0) return "";
			if (value >= 1048576) {
				const m = value / 1048576;
				return `${Number.isInteger(m) ? m : Math.round(m * 100) / 100}M`;
			}
			if (value >= 1024) {
				const k = value / 1024;
				return `${Number.isInteger(k) ? k : Math.round(k * 100) / 100}K`;
			}
			return String(value);
		}
		function parseTokens(text) {
			const match = /^\s*([\d.]+)\s*([KkMm])?\s*$/.exec(String(text ?? ""));
			if (!match) return void 0;
			const base = Number(match[1]);
			if (!Number.isFinite(base) || base <= 0) return void 0;
			const scale = match[2] === void 0 ? 1 : match[2].toUpperCase() === "M" ? 1048576 : 1024;
			const scaled = Math.round(base * scale);
			return Number.isSafeInteger(scaled) && scaled > 0 ? scaled : void 0;
		}
		function modelsFrom(text) {
			try {
				const parsed = JSON.parse(text ?? "[]");
				if (!Array.isArray(parsed)) return [];
				return parsed.map((entry) => ({
					...entry,
					id: String(entry?.id ?? ""),
					name: String(entry?.name ?? ""),
					contextWindow: Number.isSafeInteger(entry?.contextWindow) ? entry.contextWindow : void 0,
					maxTokens: Number.isSafeInteger(entry?.maxTokens) ? entry.maxTokens : void 0,
					inputModalities: Array.isArray(entry?.inputModalities) && entry.inputModalities.length > 0 ? entry.inputModalities.filter((m) => MODALITIES.some((m2) => m2.id === m)) : ["text"]
				}));
			} catch (_draftMayBeHalfWritten) {
				return [];
			}
		}
		function rowsValid(rows) {
			return rows.length > 0 && rows.every((row) => row.id.trim().length > 0 && row.inputModalities.length > 0) && new Set(rows.map(row => row.id.trim())).size === rows.length;
		}
		// 自定义模型API(llm-mimo) 页:供应商 ID 规则与宿主自定义页一致
		// (小写字母开头,可作凭据名词干);派生凭据名 = <ROUTE 大写>_API_KEY。
		const ROUTE_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
		function isHttpUrl(value) {
			try {
				const protocol = new URL(value).protocol;
				return protocol === "http:" || protocol === "https:";
			} catch {
				return false;
			}
		}
		function deriveKeyRef(provider) {
			return `${provider.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_API_KEY`;
		}
		// 三种 API 格式 = pi-ai 的 wire 协议词表(与旧自定义页的 API 协议同集合)。
				/** Base URL 占位文案跟随所选 API 格式(模板 {name} = 格式名)。 */
		function baseUrlHintFor(template, name) {
			return template.replace("{name}", name);
		}
		/** 格式面板未填时的示例地址:Anthropic 面 /anthropic,OpenAI 两面 /v1。 */
		function formatExampleFor(id) {
			return String(id).startsWith("anthropic") ? "https://api.example.com/anthropic" : "https://api.example.com/v1";
		}
const PAGE_FORMATS = [
			{ id: "anthropic", name: "Anthropic Messages" },
			{ id: "chat", name: "OpenAI Chat Completions" },
			{ id: "responses", name: "OpenAI Responses" }
		];
		/** 目录校验:ID 必填唯一、token 字段为正整数;返回首个问题行号,-1 通过。 */
		function catalogIssue(rows) {
			const seen = /* @__PURE__ */ new Set();
			for (const [index, row] of rows.entries()) {
				const id = row.id.trim();
				if (id.length === 0 || seen.has(id)) return index;
				seen.add(id);
				if (!Number.isSafeInteger(row.contextWindow) || row.contextWindow <= 0) return index;
				if (!Number.isSafeInteger(row.maxTokens) || row.maxTokens <= 0) return index;
			}
			return -1;
		}
		//#endregion
		//#region travel frames
		/**
		 * 旅行悬浮框 + 旅行聚焦框(红/绿/蓝三态双框)。ProviderCard 与自定义页
		 * 共用同一台机器:目标解析、落框几何、续行、目标级 RO 全部在此,行为唯一。
		 * 双框各自独立跑同一套状态机(乒乓:恒有一框锁蓝,另一框自由红/绿)。
		 * 三态(配色见 CARD_STYLES 头注):红态=常驻聚焦描边;绿态=悬浮跟随
		 * (四周外延 20px,永不可见);蓝态=新建行待命(全透明,加号行悬浮显形)。
		 */
		function useTravelFrames(bodyRef) {
			// 双旅行框,各自独立跑同一套红/绿/蓝状态机(逻辑完全复用)。三态
			// (配色见 CARD_STYLES 头注,调试配色留档/正式配色=输入框聚焦高亮色):
			// 红态(常驻聚焦)= 不透明描边、与文本输入框同尺寸同心、跟踪聚焦;
			// 绿态(悬浮跟随)= 四周外延 20px、跟踪悬停的文本输入框,
			//   **永远全透明不可见**(纯逻辑态);
			// 蓝态(新建行待命)= 跟随新建行提示框,
			//   待命全透明、加号行悬浮触发显形。
			// 切换:红→(绿样放大 260ms)→蓝 = 点击新增行;绿→蓝 = 点击新增行;
			// 蓝→红 = 点击新增行(唯一出蓝,新行聚焦模型ID后红态追踪);红↔绿 =
			// 红态点非文本输入框→绿,绿态点文本输入框→红。进出蓝都是点新增行,
			// 两框初始一蓝一绿天然乒乓错开:一个锁在蓝态时,另一个自由红/绿。
			const [hoverBox, setHoverBox] = react.useState(null);
			const [hoverInstant, setHoverInstant] = react.useState(false);
			const [addHover, setAddHover] = react.useState(false);
			const hoverElRef = react.useRef(null);
			const hoverOnRef = react.useRef(false);
			const hoverKeyRef = react.useRef(null);
			const hoverRectRef = react.useRef(null);
			const hoverOffAtRef = react.useRef(0);
			const addHoverRef = react.useRef(false);
			const observedTargetsRef = react.useRef(new Set());
			const targetRORef = react.useRef(null);
			const pointerDragRef = react.useRef(null);
			const isSpotInput = (el) => el?.matches?.("input.llm-mimo-underline, input.llm-mimo-idbox, input.llm-mimo-nameinput, [data-travel-input]");
			const radiusOf = (el) => getComputedStyle(el).borderTopLeftRadius;
			// 悬浮态 = 旅行填充框:跟随悬停目标(输入框/收起钮/折叠行/加号行)
			// 连续滑移,移出卡片就地淡出。
			const resolveHoverSpot = (el) => {
				// Colored action buttons use their own immediate hover highlight.
				// Keep them exempt even when nested inside a collapsible model row.
				if (el.closest?.(".llm-mimo-trash, .llm-mimo-plusbtn")) return null;
				// New model controls participate in the same travelling frame as the
				// original fields. Their larger hit areas can specify a visual inset.
				const control = el.closest?.("[data-travel-spot], [data-travel-input]");
				if (control) return { el: control, radius: radiusOf(control) };
				// 身份行整行是一个命中区(名字/ID 输入框在内):悬浮任何位置都
				// 是整行悬浮框,不出输入框级小框。
				const idrow = el.closest?.(".llm-mimo-idrow");
				if (idrow) return { el: idrow, radius: radiusOf(idrow) };
				if (isSpotInput(el)) return { el, radius: radiusOf(el) };
				const btn = el.closest?.(".llm-mimo-collapsebtn");
				if (btn) return { el: btn, radius: radiusOf(btn) || 28 };
				const keyrow = el.closest?.(".llm-mimo-keyzone");
				if (keyrow) return { el: keyrow, radius: radiusOf(keyrow) };
				const formatline = el.closest?.(".llm-mimo-formatline");
				if (formatline) return { el: formatline, radius: radiusOf(formatline) };
				const baserow = el.closest?.(".llm-mimo-baserow");
				if (baserow) return { el: baserow, radius: radiusOf(baserow) };
				const mcard = el.closest?.(".llm-mimo-mcard.collapsed");
				if (mcard) return { el: mcard, radius: radiusOf(mcard) };
				// 行填充卡的内边距区也归到行的悬浮框主体(模型行=mcard,加号行=
				// addbody,同规格 8px 内层体),行与行之间才落入空隙。
				const stack = el.closest?.(".llm-mimo-stackitem");
				if (stack) {
					const body = stack.querySelector(".llm-mimo-mcard.collapsed, .llm-mimo-addbody");
					if (body) return { el: body, radius: radiusOf(body) };
				}
				return null;
			};
			const measure = (el, pad) => {
				const b = el.getBoundingClientRect();
				// Floating editors and dragged points live in portals. Put the same
				// frame inside their surface, beneath its text, without drawer clipping.
				const surface = bodyRef.current.contains(el) ? null : el.closest("[data-travel-surface]");
				const host = surface ?? bodyRef.current;
				const r = host.getBoundingClientRect();
				const inset = parseFloat(el.dataset?.frameInset ?? "0") || 0;
				// 假目标:带 data-frame-extend-left 的元素,框的矩形左扩 Npx——
				// 输入框本体不动(文字保持与标签列对齐),聚焦框自留呼吸空隙
				// (输入框无可见边界,框是其大小的唯一呈现,可以让框"撒谎")。
				const extendLeft = parseFloat(el.dataset?.frameExtendLeft ?? "0") || 0;
				return {
					// 定位容器自身可滚动时(如菜单 overflow:auto),内容坐标需补
					// scroll 偏移;宿主不可滚动时恒为 0,无副作用。
					top: b.top - r.top - pad + inset + host.scrollTop,
					left: b.left - r.left - pad - extendLeft + inset + host.scrollLeft,
					width: b.width + pad * 2 + extendLeft - inset * 2,
					height: b.height + pad * 2 - inset * 2,
					radius: (parseFloat(radiusOf(el)) || 8) + pad,
					surface,
					on: true
				};
			};
			// 落框:目标/状态变化(旅行/换装)→260ms 几何过渡;同键重测(布局位移)→
			// 无过渡胶着跟随,否则长过渡会拖着追移动中的输入框。同键同矩形的重复
			// 触发(如 mousedown 后紧跟 focusin)直接跳过——两次更新会被批量进同一次
			// 渲染,后一次的胶着标记会把进行中的旅行/换装过渡打成瞬移。熄灭→点亮
			// 时几何瞬时就位,透明度照常淡入。
			const sameRect = (a, b) => !!a && !!b && a.surface === b.surface && Math.abs(a.top - b.top) < 0.1 && Math.abs(a.left - b.left) < 0.1 && Math.abs(a.width - b.width) < 0.1 && Math.abs(a.height - b.height) < 0.1 && Math.abs(a.radius - b.radius) < 0.1;
			const pushBox = (setBox, setInstant, onRef, rectRef, animate, rect) => {
				if (onRef.current && !animate && sameRect(rectRef.current, rect)) return;
				rectRef.current = rect;
				if (!onRef.current) {
					onRef.current = true;
					setInstant(true);
					setBox(rect);
					requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
					return;
				}
				setInstant(!animate);
				setBox(rect);
			};
			const applyHover = () => {
				syncTargets();
				const body = bodyRef.current;
				const target = hoverElRef.current;
				if (!body || !target || !target.el.isConnected) {
					// 离开触发区:淡出(不常驻);淡出时刻留档供续行判定。
					if (hoverOnRef.current) hoverOffAtRef.current = Date.now();
					hoverElRef.current = null;
					hoverOnRef.current = false;
					hoverKeyRef.current = null;
					setHoverBox((prev) => prev && { ...prev, on: false });
					return;
				}
				const keyChanged = hoverKeyRef.current !== target.el;
				hoverKeyRef.current = target.el;
				const rect = measure(target.el, 0);
				// 淡出未完成(<200ms)就遇到下一个触发:续行——从当前位置滑过去并
				// 淡回,不瞬移不重亮;淡出完成后的出现才是全新点亮。
				if (!hoverOnRef.current && hoverRectRef.current && Date.now() - hoverOffAtRef.current < 200) {
					hoverOnRef.current = true;
					hoverRectRef.current = rect;
					setHoverInstant(false);
					setHoverBox(rect);
					return;
				}
				pushBox(setHoverBox, setHoverInstant, hoverOnRef, hoverRectRef, keyChanged, rect);
			};
			// 一个旅行框的状态机实例:三态 + 落框几何(红/蓝 pad 0,绿 pad 20)。
			const useFrameMachine = (initialState) => {
				const [box, setBox] = react.useState(null);
				const [instant, setInstant] = react.useState(false);
				const [state, setState] = react.useState(initialState);
				const elRef = react.useRef(null);
				const onRef = react.useRef(false);
				const keyRef = react.useRef({ el: null, state: null });
				const rectRef = react.useRef(null);
				const stateRef = react.useRef(initialState);
				const setStateTo = (next) => {
					if (stateRef.current === next) return;
					stateRef.current = next;
					setState(next);
				};
				const fadeOut = () => {
					onRef.current = false;
					setBox((prev) => prev && { ...prev, on: false });
				};
				const apply = () => {
					syncTargets();
					const body = bodyRef.current;
					const target = elRef.current;
					if (!body || !target || !target.isConnected) {
						// 目标被删(如所在行被移除)时就地淡出,别飞向零矩形。
						elRef.current = null;
						keyRef.current = { el: null, state: null };
						fadeOut();
						return;
					}
					const st = stateRef.current;
					const keyChanged = keyRef.current.el !== target || keyRef.current.state !== st;
					keyRef.current = { el: target, state: st };
					const pad = st === "green" ? 20 : 0;
					pushBox(setBox, setInstant, onRef, rectRef, keyChanged, measure(target, pad));
				};
				return { box, instant, state, elRef, stateRef, setStateTo, apply, fadeOut };
			};
			const frameA = useFrameMachine("blue");
			const frameB = useFrameMachine("green");
			const frames = [frameA, frameB];
			// 点击推进三态机:每个框独立跑同一份逻辑,故两框对同一点击各自响应。
			const stepClick = (m, target) => {
				const st = m.stateRef.current;
				const addrow = target.closest?.(".llm-mimo-addrow");
				if (st === "blue") {
					// 蓝→红(唯一出蓝方式):点击新增行,新行聚焦模型ID后红态追踪。
					if (addrow) m.setStateTo("red");
					return;
				}
				if (addrow) {
					const strip = addrow.querySelector(".llm-mimo-addstrip");
					if (st === "green") {
						// 绿→蓝:直接驻留新建行提示框。
						m.setStateTo("blue");
						if (strip) m.elRef.current = strip;
						m.apply();
						return;
					}
					// 红→蓝:先放大成绿态的样子(绿框永不可见,只走几何),落定立刻进蓝。
					m.setStateTo("green");
					m.apply();
					window.setTimeout(() => {
						if (m.stateRef.current !== "green") return;
						m.setStateTo("blue");
						if (strip) m.elRef.current = strip;
						m.apply();
					}, 260);
					return;
				}
				if (isSpotInput(target)) {
					// 点击文本输入框:红态就位(绿→红切换,或红态内移动)。
					m.setStateTo("red");
					m.elRef.current = target;
					if (target.closest(".fresh")) {
						// 新增行入场动画中输入框还在位移,落定后再落框。
						window.setTimeout(() => {
							if (m.elRef.current === target) m.apply();
						}, 330);
					} else {
						m.apply();
					}
					return;
				}
				if (st === "red") {
					// 红态点击非文本输入框:切绿,恢复悬浮跟随(原目标上换装)。
					m.setStateTo("green");
					m.apply();
				}
			};
			const stepFocus = (m, target) => {
				// 红态跟踪聚焦(键盘 Tab/自动聚焦也能带框走);绿/蓝态只认点击。
				if (m.stateRef.current !== "red" || !isSpotInput(target)) return;
				m.elRef.current = target;
				if (target.closest(".fresh")) {
					window.setTimeout(() => {
						if (m.elRef.current === target) m.apply();
					}, 330);
				} else {
					m.apply();
				}
			};
			const stepHover = (m, target) => {
				// 绿态悬浮跟随:只跟文本输入框,其余位置原地待命;身份行不跟
				// (整行是悬浮框命中区,不出小框)。
				const input = isSpotInput(target) && !target.closest?.(".llm-mimo-idrow") ? target : null;
				if (m.stateRef.current === "green" && input && m.elRef.current !== input) {
					m.elRef.current = input;
					m.apply();
				}
			};
			const stepLeave = (m) => {
				// 绿态随悬停而在,移出卡片就地淡出;红/蓝态常驻不灭。
				if (m.stateRef.current === "green") m.fadeOut();
			};
			// 显形判定:红态常驻显形;蓝态待命全透明(加号行悬浮触发显形);
			// 绿框永远全透明不可见(owner 裁定,纯逻辑态)。
			const frameDim = (m) => {
				if (m.state === "blue") return !addHover;
				if (m.state === "green") return true;
				return false;
			};
			const retargetHover = (selector, index, tries) => {
				const el = bodyRef.current?.querySelector(`[data-card="${index}"] ${selector}`);
				if (!el) {
					if (tries > 0) window.setTimeout(() => retargetHover(selector, index, tries - 1), 16);
					return;
				}
				hoverElRef.current = { el, radius: radiusOf(el) };
				applyHover();
			};
			// 初始落框:蓝态=新建行提示框;红/绿态=API 密钥输入框(全卡唯一,只落框
			// 不夺焦点)。两框初始一蓝一绿。
			react.useEffect(() => {
				const seed = (m) => {
					const body = bodyRef.current;
					if (!body) return;
					const el = m.stateRef.current === "blue"
						? body.querySelector(".llm-mimo-addstrip")
						: body.querySelector('input[type="password"]');
					if (!el) return;
					m.elRef.current = el;
					m.apply();
				};
				seed(frameA);
				seed(frameB);
			}, []);
			// 悬浮/聚焦目标元素的观察登记:目标自身的盒体变化(如密钥输入框悬停
			// 收窄)不改容器尺寸,容器 RO 收不到——由目标级 RO 逐帧上报,框与填充
			// 随之胶着跟随。syncTargets 在每次落框后把当前目标挂上观察。
			const syncTargets = () => {
				const ro = targetRORef.current;
				if (!ro) return;
				const els = [hoverElRef.current?.el, ...frames.map((m) => m.elRef.current)].filter(Boolean);
				const wanted = new Set(els);
				for (const el of wanted) {
					if (!observedTargetsRef.current.has(el)) {
						observedTargetsRef.current.add(el);
						ro.observe(el);
					}
				}
				for (const el of [...observedTargetsRef.current]) {
					if (!wanted.has(el)) {
						observedTargetsRef.current.delete(el);
						ro.unobserve(el);
					}
				}
			};
			// 布局动画(行抽屉 0fr→1fr、margin 融合)期间输入框逐帧在动:挂
			// ResizeObserver 在容器上,动画全程逐帧重测,框才真正"跟随"输入框
			// (同键重测走无过渡胶着跟随)。回调只碰 ref 与稳定 setter,闭包无旧值。
			react.useEffect(() => {
				const body = bodyRef.current;
				if (!body || typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(() => {
					for (const m of frames) m.apply();
					applyHover();
				});
				observer.observe(body);
				return () => observer.disconnect();
			}, []);
			react.useEffect(() => {
				if (typeof ResizeObserver === "undefined") return;
				targetRORef.current = new ResizeObserver(() => {
					applyHover();
					for (const m of frames) m.apply();
				});
				syncTargets();
				return () => {
					targetRORef.current?.disconnect();
					targetRORef.current = null;
				};
			}, []);
			react.useEffect(() => {
				const body = bodyRef.current;
				if (!body) return;
				const refresh = (event) => {
					if (pointerDragRef.current && pointerDragRef.current !== event.target) return;
					pointerDragRef.current = event.detail?.dragging ? event.target : null;
					if (event.detail?.clear) hoverElRef.current = null;
					if (event.detail?.target) hoverElRef.current = resolveHoverSpot(event.detail.target);
					applyHover();
					for (const m of frames) m.apply();
				};
				body.addEventListener("llm-mimo-travel-layout", refresh);
				return () => body.removeEventListener("llm-mimo-travel-layout", refresh);
			}, []);
			// 布局内收/回弹(悬停驱动的 padding 过渡)只移动内容不改盒体,RO 收不到
			// ——悬停事件后开 340ms 逐帧重测,框才跟得上输入框的水平位移(同键
			// 重测走无过渡胶着跟随,不会重新旅行)。
			let settleRaf = 0;
			let settleUntil = 0;
			const settleTick = () => {
				for (const m of frames) m.apply();
				applyHover();
				if (Date.now() < settleUntil) settleRaf = requestAnimationFrame(settleTick);
				else settleRaf = 0;
			};
			const settle = () => {
				settleUntil = Date.now() + 340;
				if (!settleRaf) settleRaf = requestAnimationFrame(settleTick);
			};
			const onMouseDownCapture = (event) => {
				let target = event.target;
				// 身份行整合:行内按下(除供应商ID框)一律代理到供应商名称输入框
				// ——名字输入框自身的点击判定并入行,点行=点名字输入框(红框落位)。
				const idrow = target.closest?.(".llm-mimo-idrow");
				if (idrow && !target.closest?.(".llm-mimo-idbox")) {
					target = idrow.querySelector("input.llm-mimo-nameinput") ?? target;
				}
				// 点击新增行会消费掉悬浮激活:新蓝框入场一律从全透明开始
				// (重新真实悬停加号行才显形),否则 DOM 移动后悬停状态滞后
				// 会让入场帧闪一下。
				if (target.closest?.(".llm-mimo-addrow") && addHoverRef.current) {
					addHoverRef.current = false;
					setAddHover(false);
				}
				for (const m of frames) stepClick(m, target);
				settle();
			};
			const onFocusCapture = (event) => {
				const target = event.target;
				for (const m of frames) stepFocus(m, target);
			};
			const onMouseOverCapture = (event) => {
				if (pointerDragRef.current) return;
				const found = resolveHoverSpot(event.target);
				// 离开触发区即淡出(不常驻);快速穿过间隙时靠 applyHover 的
				// 续行窗口保证不出现"淡灭再重亮"的断开感。
				if ((hoverElRef.current?.el ?? null) !== (found?.el ?? null)) {
					hoverElRef.current = found;
					applyHover();
				}
				// 新建行悬浮触发:蓝态框显形。
				const onAddrow = !event.target.closest?.(".llm-mimo-trash, .llm-mimo-plusbtn") && !!event.target.closest?.(".llm-mimo-addrow");
				if (onAddrow !== addHoverRef.current) {
					addHoverRef.current = onAddrow;
					setAddHover(onAddrow);
				}
				for (const m of frames) stepHover(m, event.target);
				settle();
			};
			const onMouseLeave = () => {
				if (pointerDragRef.current) return;
				hoverElRef.current = null;
				applyHover();
				if (addHoverRef.current) {
					addHoverRef.current = false;
					setAddHover(false);
				}
				for (const m of frames) stepLeave(m);
				settle();
			};
			const onSurface = (node, box, key) => box?.surface
				? (box.surface.isConnected ? react_dom.createPortal(node, box.surface, key) : null)
				: node;
			const overlays = [
				react_jsx_runtime.jsx("style", { children: TRAVEL_OVERLAY_CSS }, "travel-css"),
				onSurface(react_jsx_runtime.jsx("div", {
					className: "llm-mimo-hoverbox" + (hoverBox?.on ? " on" : "") + (hoverInstant ? " instant" : ""),
					style: hoverBox ? { top: hoverBox.top, left: hoverBox.left, width: hoverBox.width, height: hoverBox.height, borderRadius: hoverBox.radius } : { top: 0, left: 0, width: 0, height: 0 }
				}, "hoverbox"), hoverBox, "hoverbox"),
				onSurface(react_jsx_runtime.jsx("div", {
					className: "llm-mimo-frame " + frameA.state + (frameA.box?.on ? " on" : "") + (frameA.instant ? " instant" : "") + (frameDim(frameA) ? " dim" : ""),
					style: frameA.box ? { top: frameA.box.top, left: frameA.box.left, width: frameA.box.width, height: frameA.box.height, borderRadius: frameA.box.radius } : { top: 0, left: 0, width: 0, height: 0 }
				}, "frame-a"), frameA.box, "frame-a"),
				onSurface(react_jsx_runtime.jsx("div", {
					className: "llm-mimo-frame " + frameB.state + (frameB.box?.on ? " on" : "") + (frameB.instant ? " instant" : "") + (frameDim(frameB) ? " dim" : ""),
					style: frameB.box ? { top: frameB.box.top, left: frameB.box.left, width: frameB.box.width, height: frameB.box.height, borderRadius: frameB.box.radius } : { top: 0, left: 0, width: 0, height: 0 }
				}, "frame-b"), frameB.box, "frame-b")
			];
			return { hoverBox, hoverInstant, addHover, frames, frameA, frameB, frameDim, applyHover, retargetHover, overlays, onMouseDownCapture, onFocusCapture, onMouseOverCapture, onMouseLeave };
		}
		//#endregion

		//#region ProviderCard
		function TokenField(props) {
			const { label, value, onCommit, dimmed, labelPad, kind } = props;
			const [text, setText] = react.useState(value === void 0 ? "" : formatTokens(value));
			react.useEffect(() => {
				setText(value === void 0 ? "" : formatTokens(value));
			}, [value]);
			return react_jsx_runtime.jsxs("span", {
				className: "llm-mimo-row",
				style: { gap: 6 },
				children: [
					react_jsx_runtime.jsx("span", { className: "llm-mimo-label", style: { paddingLeft: labelPad }, children: label }),
					react_jsx_runtime.jsx("input", {
						className: "llm-mimo-underline llm-mimo-flat" + (dimmed ? " llm-mimo-dimmed" : ""),
						style: { width: 62 },
						"aria-label": label,
						title: dimmed ? "默认值，可直接覆写" : label,
						value: text,
						onChange: (event) => setText(event.target.value),
						onBlur: () => {
							const parsed = parseTokens(text);
							onCommit(parsed);
							setText(formatTokens(parsed ?? (kind === "context" ? DEFAULT_CONTEXT_WINDOW : DEFAULT_MAX_TOKENS)));
						}
					})
				]
			});
		}
		// BEGIN GENERATED MODEL CONTROLS
// Shared, pure configuration/selection rules. Also inlined into the browser bundle.
const OFF_EFFORT = 'mimo:off';
const OMIT_EFFORT = 'mimo:default';
// UI-only reset choice. It is translated to the native adapter's advertised default.
const NATIVE_DEFAULT_EFFORT = 'mimo:native-default';
const API_FORMATS = ['chat', 'anthropic', 'responses'];
const API_FORMAT_NAMES = { chat: 'Chat Completions', anthropic: 'Anthropic Messages', responses: 'Responses' };
// Stock MiMo catalog only. Persisted/user-edited catalogs are never refilled.
// These IDs are minted once, rather than from values or during each read.
const mimoPresetIds = {
  'mimo-v2.6-flash': { chat: '4bc9d8e2-c1e5-413c-9237-38ed7be929de', anthropic: '3e344961-a7c2-406f-b2fd-724ad9ca3a06', responses: 'b1399578-1792-4cac-8673-b67ff2460ef6', responsesLow: 'c4dba4d6-668e-4504-b5cf-44ec9db5f46a' },
  'mimo-v2.6-pro': { chat: '9d2c6fef-0961-4420-963f-fcc480d6dfc8', anthropic: '911694cd-515d-49f8-a42f-8d110b4df6ba', responses: '74dc614d-7163-4f74-bbde-92feac56a816', responsesLow: '5c4796ef-adec-4079-b2f9-cd2c788dae28' },
  'mimo-v2.6-pro-ultraspeed': { chat: '00610cdd-c513-4742-a28a-1d6b502e3c2d', anthropic: 'a8187647-06b9-4e72-96c4-8b1649b8835e', responses: '4e0c4978-6af9-444a-9965-7668e9e53bee', responsesLow: '57af5107-119b-485b-b7ec-7b95400cae25' },
};
const forbiddenParts = new Set(['__proto__', 'prototype', 'constructor']);
const reservedRoots = new Set(['model', 'messages', 'input', 'system', 'tools', 'stream', 'max_tokens', 'max_completion_tokens', 'max_output_tokens', 'temperature', 'stop', 'stop_sequences']);

function controlsOf(raw, format = 'chat') {
  const source = raw && typeof raw === 'object' ? raw : {};
  const stops = Array.isArray(source.stops) ? source.stops : [];
  const special = (kind, id, value, name) => {
    const stop = stops.find(item => item?.kind === kind);
    return { id, kind, value: String(stop?.value ?? value), ...(stop?.name?.trim() ? { name: stop.name } : { name }) };
  };
  const ids = new Set([OFF_EFFORT, OMIT_EFFORT]);
  const levels = stops.filter(item => item?.kind === 'level').map(item => {
    // Missing/duplicate IDs are configuration errors; never mint unstable IDs while reading.
    const id = String(item.id ?? '');
    if (!id || ids.has(id)) throw new Error('思考档位 ID 为空或重复');
    ids.add(id);
    return { id, kind: 'level', value: String(item.value ?? ''), ...(item.name?.trim() ? { name: String(item.name) } : {}) };
  });
  return {
    version: 1,
    parameter: String(source.parameter ?? ''),
    valueType: ['auto', 'string', 'number', 'json'].includes(source.valueType) ? source.valueType : 'auto',
    offParameter: String(source.offParameter ?? (format === 'responses' ? 'reasoning.effort' : 'thinking.type')),
    stops: [special('off', OFF_EFFORT, format === 'responses' ? 'none' : 'disabled', '关闭思考'), special('omit', OMIT_EFFORT, '0', '默认'), ...levels],
  };
}

// The requested stock Responses catalog exposes none / omission / low / high.
// Non-none values currently enable thinking with equal documented behavior;
// keep the API values distinct without inventing token budgets.
function mimoReasoningPresets(modelId) {
  const ids = Object.hasOwn(mimoPresetIds, modelId) ? mimoPresetIds[modelId] : undefined;
  if (!ids) return undefined;
  return Object.fromEntries(API_FORMATS.map(format => [format, controlsOf({
    parameter: format === 'responses' ? 'reasoning.effort' : 'thinking.type',
    valueType: 'string',
    stops: format === 'responses' ? [
      { id: `mimo:level:${ids.responsesLow}`, kind: 'level', value: 'low' },
      { id: `mimo:level:${ids.responses}`, kind: 'level', value: 'high' },
    ] : [{ id: `mimo:level:${ids[format]}`, kind: 'level', value: 'enabled', name: '开启思考' }],
  }, format)]));
}

// Anchor legacy single-format controls before a draft changes API format. Copy only once;
// an unconfigured format never borrows a different format's field/value vocabulary.
function withReasoningFormats(model, legacyFormat = 'chat') {
  if (model.reasoningControls === undefined) return model;
  const { reasoningControls, ...rest } = model;
  return { ...rest, reasoningControlsByFormat: { [legacyFormat]: reasoningControls, ...model.reasoningControlsByFormat } };
}

function controlsForFormat(model, format = 'chat') {
  return controlsOf(withReasoningFormats(model ?? {}, format).reasoningControlsByFormat?.[format], format);
}

function controlsPatch(model, format, controls) {
  const migrated = withReasoningFormats(model, format);
  return { reasoningControls: undefined, reasoningControlsByFormat: { ...migrated.reasoningControlsByFormat, [format]: controls } };
}

function modelControlsIssue(model, activeFormat = 'chat') {
  const byFormat = withReasoningFormats(model, activeFormat).reasoningControlsByFormat;
  for (const format of [activeFormat, ...API_FORMATS.filter(id => id !== activeFormat)]) {
    if (byFormat?.[format] === undefined) continue;
    const issue = controlsIssue(byFormat[format], format);
    if (issue) return { ...issue, format };
  }
}

// Display native capabilities without becoming their configuration or request mapper.
// Unsupported off is absent; the reset stop stays separate from the actual effort IDs.
function nativeControls(model) {
  const efforts = model?.reasoning?.efforts;
  if (!efforts?.length) return undefined;
  const off = efforts.find(item => item.id === 'off' || item.id === 'none');
  const defaultName = efforts.find(item => item.id === model.reasoning.defaultEffort)?.name || model.reasoning.defaultEffort;
  return { native: true, stops: [
    ...(off ? [{ id: off.id, kind: 'off', name: '关闭思考', value: off.id }] : []),
    { id: NATIVE_DEFAULT_EFFORT, kind: 'auto', name: '默认', value: '', hint: defaultName ? `适配器默认：${defaultName}` : '使用适配器默认配置' },
    ...efforts.filter(item => item !== off).map(item => ({ id: item.id, kind: 'level', name: item.name || item.id, value: item.id })),
  ] };
}

function parameterParts(path) {
  const parts = String(path).trim().split('.');
  if (parts.some(part => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part) || forbiddenParts.has(part)) || reservedRoots.has(parts[0])) throw new Error('请填写思考参数字段路径（不能覆盖模型、消息、工具或输出上限）');
  return parts;
}

function parameterValue(text, type = 'auto') {
  if (!String(text).trim()) throw new Error('强度值不能为空');
  if (type === 'string') return String(text);
  if (type === 'number') {
    const value = Number(text);
    if (!Number.isFinite(value)) throw new Error('强度值必须是有限数字');
    return value;
  }
  try { return JSON.parse(text); } catch {
    if (type === 'json') throw new Error('强度值必须是有效 JSON');
    return String(text);
  }
}

function controlsIssue(raw, format = 'chat') {
  if (raw === undefined) return undefined;
  try {
    const controls = controlsOf(raw, format);
    for (const stop of controls.stops) {
      if (!stop.value.trim()) return { id: stop.id, message: '强度值不能为空' };
      if (stop.kind === 'omit') continue;
      try {
        parameterValue(stop.value, stop.kind === 'off' ? 'auto' : controls.valueType);
        if (stop.kind === 'level') parameterParts(controls.parameter);
        else parameterParts(controls.offParameter);
      } catch (error) { return { id: stop.id, message: error.message }; }
    }
  } catch (error) { return { message: error.message }; }
  return undefined;
}

function reasoningInfo(raw) {
  const controls = controlsOf(raw);
  return { efforts: controls.stops.map(stop => ({ id: stop.id, name: stop.name || stop.value })), defaultEffort: OMIT_EFFORT };
}

function reasoningParameters(raw, effort) {
  if (effort === undefined || effort === OMIT_EFFORT) return {};
  const controls = controlsOf(raw);
  const stop = controls.stops.find(item => item.id === effort);
  if (!stop) throw new Error('所选思考档位已删除，请重新选择默认或其他档位');
  if (stop.kind === 'omit') return {};
  const parts = parameterParts(stop.kind === 'off' ? controls.offParameter : controls.parameter);
  const payload = {};
  let target = payload;
  for (const key of parts.slice(0, -1)) target = target[key] = {};
  target[parts.at(-1)] = parameterValue(stop.value, stop.kind === 'off' ? 'auto' : controls.valueType);
  return payload;
}

function defaultModelId(models, configured) {
  return models.find(model => model.id.trim() === String(configured ?? "").trim())?.id ?? models[0]?.id;
}

function routeKey(provider, model) { return JSON.stringify([provider, model]); }

// A target model owns its effort vocabulary/default. Never carry an effort across routes.
function selectionFor(model, current, staged) {
  const key = routeKey(model.provider, model.id);
  const requested = staged?.get(key) ?? (current?.provider === model.provider && current.model === model.id ? current.reasoningEffort : undefined);
  const ids = model.reasoning?.efforts?.map(item => item.id) ?? [];
  const effort = requested === NATIVE_DEFAULT_EFFORT ? (ids.includes(model.reasoning?.defaultEffort) ? model.reasoning.defaultEffort : undefined) : ids.includes(requested) ? requested : ids.includes(model.reasoning?.defaultEffort) ? model.reasoning.defaultEffort : undefined;
  return { provider: model.provider, model: model.id, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
}

// Inlined by scripts/build-controls-client.mjs. No relative browser imports.
const mc = react.createElement;
const CONTROL_CSS = `
/* Portal cards resolve the host's body theme. */
.mm-effort-card,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu{--mm-card-shadow-color:rgba(0,0,0,.18);background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);box-shadow:0 8px 28px var(--mm-card-shadow-color),0 0 0 1px var(--dsw-alias-border-l2)}
body[data-ds-dark-theme] :is(.mm-effort-card,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu){--mm-card-shadow-color:rgba(0,0,0,.4)}
.llm-mimo-mcard.collapsed:hover:has(.mm-star-zone:hover){padding:5px 4px}
.mm-name-slot{position:relative;min-width:0;height:28px;display:flex;align-items:center}
.mm-name-slot .llm-mimo-nameinput{width:100%;min-width:0;transition:margin-left 160ms ease,width 160ms ease;box-sizing:border-box}
.mm-name-slot.is-default .llm-mimo-nameinput,.mm-name-slot:has(.mm-star-zone:hover) .llm-mimo-nameinput,.mm-name-slot:has(.mm-star:focus-visible) .llm-mimo-nameinput{margin-left:24px;width:calc(100% - 24px)}
.mm-star-zone{position:absolute;left:0;top:0;width:24px;height:28px;z-index:3;display:grid;place-items:center}
.mm-star{opacity:0;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#9299a2);width:24px;height:28px;cursor:pointer;font-size:20px;padding:0}
.mm-star-zone:hover .mm-star,.mm-star:focus-visible,.is-default .mm-star{opacity:1}.is-default .mm-star{color:#c5942d}
.mm-controls{position:relative;grid-column:1/4;display:flex;align-items:center;gap:12px;height:30px;padding-left:5px;margin-top:2px}
.mm-edit-track{height:16px;border-radius:12px;background:var(--dsw-alias-interactive-bg-hover,#dfe2e5);position:relative;flex:1;margin:0 11px}
.mm-travel{position:absolute;top:-3px;width:22px;height:22px;border-radius:50%;background:var(--dsw-alias-interactive-bg-active,#c6ccd3);transform:translateX(-50%);transition:left 130ms ease;pointer-events:none}
.mm-dot{position:absolute;z-index:3;top:-7px;transform:translateX(-50%);width:30px;height:30px;border:0;border-radius:50%;background:transparent;cursor:grab;touch-action:none;padding:0;display:grid;place-items:center}
.mm-dot::after{content:'';width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#a2a8b1)}
.mm-dot.special{cursor:default}.mm-dot.dragging::after{background:var(--dsw-alias-button-primary-fill,#477de6)}
.mm-add-stop{padding:0;transition:transform 100ms ease}
.mm-add-stop.deleting{background:var(--llm-mimo-danger-fill);color:var(--llm-mimo-danger-icon)}
.mm-add-stop.deleting:hover,.mm-add-stop.over{background:var(--llm-mimo-danger-fill-hover);color:var(--llm-mimo-danger-icon-hover)}.mm-add-stop.over{transform:scale(1.12)}
.mm-glyph-out{animation:llm-mimo-glyph-out 140ms ease forwards}.mm-glyph-in{animation:llm-mimo-glyph-in 140ms ease}
.mm-drag-surface{position:fixed;width:30px;height:30px;z-index:10022;pointer-events:none;border-radius:50%}
.mm-drag-handle{position:absolute;inset:4px;border-radius:50%;background:var(--dsw-alias-interactive-bg-active,#c6ccd3);display:grid;place-items:center}
.mm-drag-handle::after{content:'';position:relative;z-index:3;width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-button-primary-fill,#477de6)}
.mm-effort-card,.mm-menu,.mm-hover-card{box-sizing:border-box;position:fixed;z-index:10020;border-radius:14px;font-family:inherit;font-size:14px;line-height:1.4}
.mm-effort-card{width:238px;padding:12px;touch-action:none}.mm-effort-card input,.mm-type-trigger,.mm-effort-card summary,.mm-effort-grip{position:relative;z-index:3}.mm-effort-card input{font:inherit;min-width:0;color:inherit;box-sizing:border-box}
.mm-effort-name{border:0;outline:none;background:transparent;width:100%;padding:5px 6px;font-size:14px;border-radius:6px}
.mm-effort-value{border:1px solid var(--dsw-alias-border-l2,#cbd0d7);outline:none;background:transparent;border-radius:7px;width:100%;padding:5px 6px;margin:5px 0 2px;font-size:14px}
.mm-effort-value:focus{border-color:var(--dsw-alias-state-business-primary)}.mm-effort-value.invalid{border-color:var(--dsw-alias-state-error-primary)}.mm-effort-card small{font-size:11px;color:var(--dsw-alias-label-secondary,#9299a2)}
.mm-mapping{margin-top:7px;font-size:12px;interpolate-size:allow-keywords}.mm-mapping summary{cursor:pointer;color:var(--dsw-alias-label-secondary,#7f8792)}.mm-mapping input{width:100%;border:1px solid var(--dsw-alias-border-l2,#cbd0d7);background:transparent;border-radius:6px;padding:4px;margin-top:6px}.mm-mapping::details-content{overflow:hidden;transition:height .26s cubic-bezier(.2,0,0,1),content-visibility .26s allow-discrete}.mm-mapping:not([open])::details-content{height:0;content-visibility:hidden}
.mm-type-trigger{display:flex;align-items:center;gap:6px;box-sizing:border-box;width:100%;margin:6px 0;font:inherit;font-size:13px;color:inherit;background:transparent;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:3px 10px;cursor:pointer;text-align:left}.mm-type-trigger>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm-type-caret{font-size:10px;color:var(--dsw-alias-label-tertiary)}.mm-type-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}.mm-type-trigger:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}
.mm-type-menu{box-sizing:border-box;position:fixed;z-index:10024;border-radius:12px;padding:6px;font:inherit;font-size:13px;line-height:1.4;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-type-head{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:2px 10px 4px}.mm-type-option{display:block;box-sizing:border-box;width:100%;border:1px solid transparent;border-radius:8px;background:transparent;font:inherit;color:inherit;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:4px 7px;cursor:pointer;transition:padding .26s cubic-bezier(.2,0,0,1),background .15s ease}.mm-type-option[aria-selected=true]{background:var(--dsw-alias-interactive-bg-hover)}.mm-type-option:hover,.mm-type-option:focus-visible{position:relative;z-index:1;width:max-content;min-width:100%;max-width:var(--mm-type-row-limit);padding:4px 13px;outline:none;background:var(--dsw-alias-bg-module-platform);border-color:var(--dsw-alias-border-l2);box-shadow:0 10px 28px var(--mm-card-shadow-color)}
.mm-effort-grip{height:9px;cursor:grab;user-select:none;margin-bottom:3px;text-align:center;color:var(--dsw-alias-label-tertiary,#9ca4af);font-size:10px;line-height:9px}
.mm-selector{font:inherit;position:relative}.mm-trigger{border:0;background:transparent;border-radius:8px;padding:4px 8px;color:var(--dsw-alias-label-secondary,#89929e);font:inherit;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:6px;max-width:240px;min-height:28px}.mm-trigger>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm-trigger:hover{background:var(--dsw-alias-interactive-bg-hover,#edf0f4)}
.mm-menu{padding:6px;max-height:min(460px,70vh);overflow:auto;min-width:120px;border-radius:12px;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-provider{padding:0;border-radius:0;margin:0;position:relative;transition:border-radius .26s cubic-bezier(.2,0,0,1),margin .26s cubic-bezier(.2,0,0,1),padding .26s cubic-bezier(.2,0,0,1),background-color .26s cubic-bezier(.2,0,0,1)}.mm-provider.expanded{padding:4px;margin:8px 0;border-radius:9px;background:var(--dsw-alias-interactive-bg-hover,#f0f1f3)}
.mm-provider-row{display:flex;align-items:center;position:relative;border-radius:7px}.mm-provider-name,.mm-model-row{flex:1;min-width:0;display:block;background:transparent;border:0;cursor:pointer;color:inherit;font:inherit;font-size:12px;text-align:left;height:32px;padding:0 9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:7px}.mm-provider-name{flex:0 0 62%;width:62%;border-radius:0}.mm-provider-arrow{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#85909d);width:26px;height:30px;cursor:pointer}.mm-provider-expand{flex:1;min-width:32px;height:32px;width:auto;display:flex;align-items:center;justify-content:flex-end;padding:0 9px}.mm-provider-expand>span{opacity:0;transition:opacity .15s ease}.mm-provider-row:hover .mm-provider-expand>span,.mm-provider-expand:focus-visible>span,.expanded .mm-provider-expand>span{opacity:1}
.mm-provider-models{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s cubic-bezier(.2,0,0,1);pointer-events:none}.mm-provider.expanded .mm-provider-models{grid-template-rows:1fr;pointer-events:auto}.mm-provider-models-clip{min-height:0;overflow:hidden}.mm-provider-models .mm-model-row{width:100%}
.mm-model-row:hover{background:var(--dsw-alias-interactive-bg-active,#e4e7eb)}.mm-model-row.selected{color:var(--dsw-alias-state-business-primary)}
.mm-menu-message{font-size:12px;padding:8px;color:var(--dsw-alias-label-secondary,#808894)}.mm-menu-error{font-size:12px;padding:8px;color:var(--dsw-alias-state-error-primary)}
.mm-hover-card{padding:5px 10px;display:flex;gap:12px;align-items:center;min-height:34px;max-width:calc(100vw - 16px);white-space:nowrap;border-radius:12px;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}
.mm-hover-card.closing,.mm-slider-tip-card.closing,.mm-type-menu.closing{pointer-events:none;opacity:0;transform:scaleY(.96);transform-origin:top;transition:opacity .2s ease,transform .2s cubic-bezier(.2,0,0,1)}
@keyframes mm-pop-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.mm-hover-name{border:0;padding:2px 0;background:transparent;font:inherit;font-size:12px;cursor:pointer;color:inherit;white-space:normal;overflow-wrap:anywhere;min-width:var(--mm-hover-name-width,80px);text-align:left}.mm-hover-card.supplier .mm-hover-name{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mm-slider-wrap{position:relative;width:204px;min-width:80px;height:30px;flex:0 1 204px;display:flex;align-items:center}.mm-slider-rail{position:absolute;left:0;right:0;height:16px;border-radius:12px;background:var(--dsw-alias-interactive-bg-hover,#e3e6eb)}.mm-slider-dots{position:absolute;left:11px;right:11px;height:30px;pointer-events:none}.mm-slider-dots>i{position:absolute;top:13px;width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#a3abb6);transform:translateX(-50%)}
.mm-slider-wrap input{appearance:none;position:absolute;left:0;width:100%;height:30px;background:transparent;cursor:pointer;margin:0;z-index:1;touch-action:none}.mm-slider-wrap input::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:50%;background:transparent;box-shadow:none}.mm-slider-wrap input::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:transparent;box-shadow:none}.mm-slider-wrap input::-moz-range-track{background:transparent;border:0}
.mm-slider-thumb{position:absolute;z-index:2;width:22px;height:22px;top:4px;transform:translateX(-50%);border-radius:50%;background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1),0 0 0 1px var(--dsw-alias-border-l2);pointer-events:none;transition:left .26s cubic-bezier(.2,0,0,1)}.mm-slider-wrap:has(input:focus-visible) .mm-slider-thumb{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
.mm-slider-tip{position:absolute;bottom:38px;transform:translateX(-50%);pointer-events:none;transition:left .26s cubic-bezier(.2,0,0,1)}.mm-slider-tip-card{box-shadow:0 4px 18px var(--mm-card-shadow-color);border:1px solid var(--dsw-alias-border-l2);border-radius:9px;padding:6px 10px;text-align:center;font-size:12px;white-space:nowrap;animation:mm-pop-in .2s cubic-bezier(.2,0,0,1)}.mm-slider-tip small{display:block;color:var(--dsw-alias-label-secondary,#84909e);font-size:11px}
@media(prefers-reduced-motion:reduce){.mm-travel,.mm-name-slot .llm-mimo-nameinput,.mm-add-stop,.mm-slider-thumb,.mm-slider-tip,.mm-provider,.mm-provider-models,.mm-provider-expand>span,.mm-hover-card.closing,.mm-slider-tip-card.closing,.mm-type-menu.closing,.mm-type-option,.mm-mapping::details-content{transition:none}.mm-glyph-in,.mm-glyph-out,.mm-menu,.mm-hover-card,.mm-slider-tip-card,.mm-type-menu{animation:none}.mm-glyph-out{display:none}}
`;
function controlsPortal(node, anchor) {
  const root = anchor?.getRootNode();
  return react_dom.createPortal(mc(react.Fragment, null, mc('style', null, CONTROL_CSS), node), root && root !== document ? root : document.body);
}
function freshStopId() { return `mimo:level:${crypto.randomUUID()}`; }
function controlsError(rows, format) {
  for (let index = 0; index < rows.length; index++) { const issue = modelControlsIssue(rows[index], format); if (issue) return { ...issue, index, seq: Date.now() }; }
}
// The default belongs to a draft card, even while its API ID is temporarily empty.
function useDefaultDraft(rows, configured, keys) {
  const ref=react.useRef({configured:Symbol('initial'),key:null,manual:false});
  if(ref.current.configured!==configured){const id=defaultModelId(rows,configured);ref.current={configured,key:keys[rows.findIndex(r=>r.id===id)],manual:!!configured&&rows.some(r=>r.id===id)};}
  return {key:ref.current.manual?ref.current.key:keys[0],
    select(index,value){ref.current={configured:value,key:keys[index],manual:true};},
    rename(index,value){if(ref.current.manual&&ref.current.key===keys[index]){ref.current.configured=value;return true;}return false;},
    remove(index){const removed=ref.current.manual&&ref.current.key===keys[index];if(removed)ref.current={configured:'',key:null,manual:false};return removed;},
    reset(){ref.current.configured=Symbol('reset');}
  };
}
function DefaultName({row,isDefault,onDefault,t,onPatch,index,placeholder}) {
  return mc('div',{className:'mm-name-slot'+(isDefault?' is-default':'')},
    mc('div',{className:'mm-star-zone'},mc('button',{type:'button',className:'mm-star','data-travel-spot':true,'aria-label':`${row.name||row.id}：${isDefault?'供应商默认模型':'设为供应商默认模型'}`,'aria-pressed':isDefault,onClick:e=>{e.stopPropagation();onDefault();}},isDefault?'★':'☆')),
    mc('input',{className:'llm-mimo-nameinput','aria-label':t('modelName'),title:t('modelName'),placeholder,value:row.name,onChange:e=>onPatch(index,{name:e.target.value})}));
}
function StopActionGlyph({deleting}) {
  const previous=react.useRef(deleting), sequence=react.useRef(0);
  const [departing,setDeparting]=react.useState(null);
  react.useLayoutEffect(()=>{
    if(previous.current===deleting)return;
    setDeparting({deleting:previous.current,sequence:++sequence.current});previous.current=deleting;
    const timer=setTimeout(()=>setDeparting(null),140);
    return()=>clearTimeout(timer);
  },[deleting]);
  const glyph=trash=>trash?mc(_primitives.IconTrashOutlineRegular,{width:14,height:14}):'+';
  return mc('span',{className:'llm-mimo-trash-birth','aria-hidden':true},
    departing&&mc('span',{key:`out:${departing.sequence}`,className:'llm-mimo-trash-glyph mm-glyph-out'},glyph(departing.deleting)),
    mc('span',{key:deleting?'trash':'plus',className:'llm-mimo-trash-glyph'+(departing?' mm-glyph-in':'')},glyph(deleting)));
}
const VALUE_TYPES=[['auto','自动解析数字 / JSON，否则文本'],['string','文本'],['number','数字'],['json','JSON']];
// Match Promptbook's selected-row alignment and independent hover cards, while
// keeping the portaled menu inside the effort editor's dismissal boundary.
function ValueTypePicker({value,onChange,disabled,menuRef,keep,leave}) {
  const [open,setOpen]=react.useState(false),[closing,setClosing]=react.useState(false),[pos,setPos]=react.useState(null);
  const trigger=react.useRef(null),closeTimer=react.useRef(0),focusOnOpen=react.useRef(false);
  const id=react.useId();
  const close=(restoreFocus=false)=>{
    clearTimeout(closeTimer.current);setClosing(true);
    closeTimer.current=setTimeout(()=>{setOpen(false);setClosing(false);},200);
    if(restoreFocus)trigger.current?.focus();
  };
  const show=(focus=false)=>{keep();clearTimeout(closeTimer.current);focusOnOpen.current=focus;setClosing(false);setOpen(true);};
  react.useLayoutEffect(()=>{
    if(!open)return;
    const place=()=>{
      const anchor=trigger.current?.getBoundingClientRect(),menu=menuRef.current;if(!anchor||!menu)return;
      const selected=menu.querySelector('[aria-selected="true"]');
      const width=Math.min(innerWidth-16,anchor.width+12),left=Math.max(8,Math.min(innerWidth-width-8,anchor.left-6));
      setPos({left,width,top:Math.max(8,Math.min(innerHeight-menu.offsetHeight-8,anchor.top-(selected?.offsetTop||22))),'--mm-type-row-limit':`${innerWidth-left-8}px`});
    };
    place();
    if(focusOnOpen.current){menuRef.current?.querySelector('[aria-selected="true"]')?.focus();focusOnOpen.current=false;}
    window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
    const observer=new ResizeObserver(place);if(trigger.current)observer.observe(trigger.current);if(menuRef.current)observer.observe(menuRef.current);
    return()=>{window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);observer.disconnect();};
  },[open,value]);
  react.useEffect(()=>{
    if(!open||closing)return;
    const outside=e=>{if(!trigger.current?.contains(e.target)&&!menuRef.current?.contains(e.target))close();};
    const escape=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',escape,true);
    return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',escape,true);};
  },[open,closing]);
  react.useEffect(()=>{if(disabled){clearTimeout(closeTimer.current);setOpen(false);setClosing(false);}},[disabled]);
  react.useEffect(()=>()=>clearTimeout(closeTimer.current),[]);
  const navigate=e=>{
    if(e.key==='Tab'){close();return;}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
    e.preventDefault();
    const options=Array.from(menuRef.current?.querySelectorAll('[role="option"]')||[]),current=options.indexOf(document.activeElement);
    const next=e.key==='Home'?0:e.key==='End'?options.length-1:(current+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
    options[next]?.focus();
  };
  return mc(react.Fragment,null,
    mc('button',{ref:trigger,type:'button',className:'mm-type-trigger','data-travel-spot':true,'aria-label':'强度值类型','aria-haspopup':'listbox','aria-expanded':open&&!closing,'aria-controls':open?id:undefined,disabled,
      onClick:()=>open&&!closing?close():show(),onKeyDown:e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();show(true);}}},
      mc('span',null,VALUE_TYPES.find(([type])=>type===value)?.[1]||value),mc('span',{className:'mm-type-caret','aria-hidden':true},'▾')),
    open&&controlsPortal(mc('div',{id,ref:menuRef,className:'mm-type-menu'+(closing?' closing':''),role:'listbox','aria-label':'强度值类型',style:{...pos,visibility:pos?undefined:'hidden'},onPointerEnter:keep,onPointerLeave:leave,onPointerDown:e=>e.stopPropagation(),onClick:e=>e.stopPropagation(),onKeyDown:navigate},
      mc('div',{className:'mm-type-head'},'值类型'),
      ...VALUE_TYPES.map(([type,label])=>mc('button',{key:type,type:'button',className:'mm-type-option',role:'option','aria-selected':type===value,tabIndex:closing?-1:0,onClick:()=>{onChange(type);close(true);}},label))),trigger.current));
}
function EffortEditor({row,index,onPatch,issue,disabled,apiFormat='chat'}) {
  const controls = controlsForFormat(row,apiFormat);
  const validation = controlsIssue(controls);
  const [active,setActive] = react.useState(null);
  const [pos,setPos] = react.useState(null);
  const [drag,setDrag] = react.useState(null);
  const [overTrash,setOverTrash] = react.useState(false);
  const track = react.useRef(null), plus = react.useRef(null), popup = react.useRef(null), valueInput = react.useRef(null), dragPoint = react.useRef(null), typeMenu = react.useRef(null);
  const leaveTimer=react.useRef(0), holdTimer=react.useRef(0), dragging=react.useRef(null), focusNew=react.useRef(false);
  const wasDragging=react.useRef(false);
  const live=react.useRef(null); live.current={controls,row,onPatch,index,apiFormat};
  const patch = next => onPatch(index,controlsPatch(row,apiFormat,next));
  const keep = () => clearTimeout(leaveTimer.current);
  const cancelHold = () => {clearTimeout(holdTimer.current);holdTimer.current=0;};
  const leave = () => {keep();leaveTimer.current=setTimeout(()=>{if(!dragging.current && !popup.current?.contains(document.activeElement)&&!typeMenu.current?.contains(document.activeElement))setActive(null);},240);};
  const open = id => {keep();if(!dragging.current||dragging.current.id===id)setActive(id);};
  const activeStop=controls.stops.find(s=>s.id===active);
  const orderingKey=controls.stops.map(s=>s.id).join('|');
  const place = () => {
    if(dragging.current?.active)return;
    const rect=track.current?.getBoundingClientRect(); if(!rect||!activeStop)return;
    const fraction=controls.stops.findIndex(s=>s.id===active)/(controls.stops.length-1);
    const x=rect.left+rect.width*fraction;
    // 底边锚定:卡体随折叠区展开长高自然向上生长,无需逐帧重锚(top 定位会逐帧
    // 滞后抖动)。拖拽态仍用 top 跟手,React 切换样式对象时会清掉另一侧,无拉伸。
    setPos({left:Math.max(8,Math.min(innerWidth-246,x-119)),bottom:Math.max(8,innerHeight-(rect.top-12))});
  };
  react.useLayoutEffect(()=>{place();},[active,orderingKey,controls.parameter,drag]);
  // Notify the existing shared travel frame after React has moved a point/card.
  // ResizeObserver alone cannot see a change of position at constant size.
  react.useLayoutEffect(()=>{
    const ended=wasDragging.current&&!drag;wasDragging.current=!!drag;
    const target=drag?(overTrash?null:dragPoint.current):ended?Array.from(track.current?.children||[]).find(el=>el.dataset.effortId===active):undefined;
    track.current?.dispatchEvent(new CustomEvent('llm-mimo-travel-layout',{bubbles:true,detail:{target,dragging:!!drag,clear:!!drag&&overTrash||ended&&!target}}));
  },[drag,pos,overTrash,active,controls.stops.length]);
  react.useEffect(()=>{
    if(!active)return;
    const reposition=()=>place(); window.addEventListener('resize',reposition);window.addEventListener('scroll',reposition,true);
    const observer=new ResizeObserver(reposition);if(popup.current)observer.observe(popup.current);
    const outside=e=>{if(!dragging.current&&!popup.current?.contains(e.target)&&!typeMenu.current?.contains(e.target)&&!track.current?.contains(e.target)&&!plus.current?.contains(e.target))setActive(null);};
    const key=e=>{if(e.key==='Escape'&&!typeMenu.current){if(dragging.current){e.preventDefault();cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);}else setActive(null);}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key,true);
    return()=>{window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true);document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key,true);observer.disconnect();};
  },[active,orderingKey,!!pos]);
  react.useLayoutEffect(()=>{
    const anchor=track.current;
    return()=>anchor?.dispatchEvent(new CustomEvent('llm-mimo-travel-layout',{bubbles:true,detail:{dragging:false,clear:true}}));
  },[]);
  react.useEffect(()=>{if(focusNew.current&&activeStop&&valueInput.current){valueInput.current.focus();focusNew.current=false;}},[active,!!pos,issue?.seq]);
  react.useEffect(()=>{if(issue?.id){focusNew.current=true;open(issue.id);}},[issue?.seq]);
  react.useEffect(()=>()=>{clearTimeout(leaveTimer.current);cancelHold();},[]);
  const activate = d => {
    if(dragging.current!==d||d.active)return;
    cancelHold();keep();d.active=true;
    // A held point may have just opened its card. Start from its actual position
    // so entering drag mode does not jump to the pre-popup fallback rectangle.
    if(popup.current?.dataset.effortId===d.id){const card=popup.current.getBoundingClientRect();d.card={left:card.left,top:card.top};}
    setDrag({id:d.id,stops:d.preview,point:d.point,card:d.card});
  };
  react.useEffect(()=>{
    const move=e=>{
      const d=dragging.current;if(!d||e.pointerId!==d.pointerId)return;
      if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>4)d.moved=true;
      if(!d.active&&!d.moved)return;
      activate(d);
      e.preventDefault();
      const rect=track.current?.getBoundingClientRect(), bin=plus.current?.getBoundingClientRect();if(!rect)return;
      const trash=!!bin&&e.clientX>=bin.left-5&&e.clientX<=bin.right+5&&e.clientY>=bin.top-8&&e.clientY<=bin.bottom+8;
      const dx=e.clientX-d.x,dy=e.clientY-d.y;
      const target=Math.max(2,Math.min(d.stops.length-1,Math.round((d.point.x+dx-rect.left)/rect.width*(d.stops.length-1))));
      const preview=d.stops.filter(s=>s.id!==d.id);preview.splice(target,0,d.stops.find(s=>s.id===d.id));
      d.preview=preview;d.trash=trash;setOverTrash(trash);
      // Only the other points snap to equally spaced slots. The grabbed point
      // and card keep their original grab offset and follow both pointer axes.
      setDrag({id:d.id,stops:preview,point:{x:d.point.x+dx,y:d.point.y+dy},card:{left:d.card.left+dx,top:d.card.top+dy}});
    };
    const end=e=>{const d=dragging.current;if(!d||e.pointerId!==d.pointerId)return;cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);if(e.type==='pointercancel'||!d.moved)return;
      const {controls,row,onPatch,index,apiFormat}=live.current;const stops=d.trash?d.stops.filter(s=>s.id!==d.id):d.preview;
      onPatch(index,controlsPatch(row,apiFormat,{...controls,stops}));if(d.trash)setActive(null);
    };
    const cancel=()=>{cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);};
    window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);window.addEventListener('blur',cancel);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);window.removeEventListener('blur',cancel);cancelHold();dragging.current=null;};
  },[]);
  react.useEffect(()=>{cancelHold();dragging.current=null;setDrag(null);setOverTrash(false);},[apiFormat,disabled]);
  const start=(e,stop)=>{
    if(disabled||stop.kind!=='level'||e.button!==0||e.target.closest('input,select,summary,details,button:not(.mm-dot)'))return;
    const rect=track.current?.getBoundingClientRect();if(!rect)return;
    const x=rect.left+rect.width*controls.stops.findIndex(s=>s.id===stop.id)/(controls.stops.length-1);
    const card=popup.current?.getBoundingClientRect();
    cancelHold();
    const d=dragging.current={id:stop.id,pointerId:e.pointerId,x:e.clientX,y:e.clientY,point:{x,y:rect.top+rect.height/2},
      card:{left:card?.left??Math.max(8,Math.min(innerWidth-246,x-119)),top:card?.top??Math.max(8,rect.top-140)},
      stops:controls.stops,preview:controls.stops,moved:false,active:false,trash:false};open(stop.id);
    holdTimer.current=setTimeout(()=>activate(d),200);
  };
  const shown=drag?.stops||controls.stops, slot=Math.max(0,shown.findIndex(s=>s.id===active));
  const edit=(fields)=>patch({...controls,stops:controls.stops.map(s=>s.id===active?{...s,...fields}:s)});
  const editor=activeStop&&pos&&mc('div',{ref:popup,className:'mm-effort-card','data-travel-surface':true,'data-effort-id':activeStop.id,style:drag?.card||pos,onPointerEnter:keep,onPointerLeave:leave,onPointerDown:e=>start(e,activeStop),onClick:e=>e.stopPropagation()},
    activeStop.kind==='level'&&mc('div',{className:'mm-effort-grip','data-travel-spot':true,title:'拖动排序；拖到右侧垃圾桶删除'},'⋮⋮'),
    mc('input',{className:'mm-effort-name','data-travel-input':true,'aria-label':'强度显示名',value:activeStop.name||'',placeholder:activeStop.value,onChange:e=>edit({name:e.target.value||undefined}),disabled}),
    mc('input',{ref:valueInput,className:'mm-effort-value'+(validation?.id===active?' invalid':''),'data-travel-input':true,'aria-label':'强度值',required:true,value:activeStop.value,onChange:e=>edit({value:e.target.value}),disabled}),
    activeStop.kind==='omit'?mc('small',null,'不传递思考参数，包括思考开关'):mc('details',{className:'mm-mapping',onToggle:place},
      mc('summary',{'data-travel-spot':true},'请求字段'),
      mc('input',{'data-travel-input':true,'aria-label':'思考参数字段',placeholder:activeStop.kind==='off'?(apiFormat==='responses'?'reasoning.effort':'thinking.type'):apiFormat==='chat'?'如 reasoning_effort 或 thinking_budget':apiFormat==='anthropic'?'如 output_config.effort 或 thinking.budget_tokens':'如 reasoning.effort',value:activeStop.kind==='off'?controls.offParameter:controls.parameter,onChange:e=>patch({...controls,[activeStop.kind==='off'?'offParameter':'parameter']:e.target.value}),disabled}),
      activeStop.kind==='level'&&mc(ValueTypePicker,{key:`${apiFormat}:${activeStop.id}`,value:controls.valueType,onChange:valueType=>patch({...controls,valueType}),disabled:disabled||!!drag,menuRef:typeMenu,keep,leave}),
      mc('small',null,`${API_FORMAT_NAMES[apiFormat]} · 仅按此格式的配置发送。`)),
    validation?.id===active&&mc('small',{style:{color:'#e65a6c'}},validation.message));
  return mc(react.Fragment,null,mc('style',null,CONTROL_CSS),mc('div',{className:'mm-controls','aria-label':'思考强度配置','data-api-format':apiFormat,title:`${API_FORMAT_NAMES[apiFormat]} 思考配置`},
    mc('div',{ref:track,className:'mm-edit-track',onPointerEnter:keep,onPointerLeave:leave},
      active&&!drag&&mc('div',{className:'mm-travel',style:{left:`${100*slot/(shown.length-1)}%`}}),
      ...shown.map((stop,i)=>mc('button',{key:stop.id,type:'button',className:'mm-dot'+(stop.kind!=='level'?' special':'')+(drag?.id===stop.id?' dragging':''),style:{left:`${100*i/(shown.length-1)}%`,visibility:drag?.id===stop.id?'hidden':undefined},'data-travel-spot':true,'data-frame-inset':4,'aria-label':stop.name||stop.value,'data-effort-id':stop.id,disabled,onPointerEnter:()=>open(stop.id),onFocus:()=>open(stop.id),onClick:()=>open(stop.id),onPointerDown:e=>start(e,stop),onKeyDown:e=>{
        if(stop.kind==='level'&&e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const j=Math.max(2,Math.min(controls.stops.length-1,i+(e.key==='ArrowLeft'?-1:1)));const stops=[...controls.stops];stops.splice(i,1);stops.splice(j,0,stop);patch({...controls,stops});}
        if(stop.kind==='level'&&e.key==='Delete'){e.preventDefault();patch({...controls,stops:controls.stops.filter(s=>s.id!==stop.id)});setActive(null);}
      }}))),
    mc('button',{ref:plus,type:'button',className:'llm-mimo-plusbtn mm-add-stop'+(drag?' deleting':'')+(overTrash?' over':''),'aria-label':drag?'删除思考档位':'添加思考档位',disabled,onClick:()=>{if(drag||dragging.current)return;const stop={id:freshStopId(),kind:'level',value:''};patch({...controls,stops:[...controls.stops,stop]});focusNew.current=true;open(stop.id);}},mc(StopActionGlyph,{deleting:!!drag}))),
    (editor||drag)&&controlsPortal(mc(react.Fragment,null,editor,drag&&mc('div',{ref:dragPoint,className:'mm-drag-surface','data-travel-surface':true,'data-travel-spot':true,'data-frame-inset':4,style:{left:drag.point.x-15,top:drag.point.y-15}},mc('div',{className:'mm-drag-handle'}))),track.current));
}
// Retain a leaving card for the same 200 ms fade used by Promptbook.
function useClosingCard(content) {
  const [retained,setRetained]=react.useState(content);
  react.useLayoutEffect(()=>{
    if(content){setRetained(content);return;}
    const timer=setTimeout(()=>setRetained(null),200);
    return()=>clearTimeout(timer);
  },[content]);
  return {content:content||retained,closing:!content};
}
function effortDescription(stop,controls) {
  return stop.hint||(stop.kind==='off'?'关闭思考':stop.kind==='omit'?'不传递思考参数':!controls.native&&/^\d+$/.test(stop.value)?`${stop.value} token`:stop.value);
}
function ModelEffortSlider({controls,selected,onPreview,onCommit,disabled}) {
  const defaultIndex=Math.max(0,controls.stops.findIndex(s=>s.kind==='omit'||s.kind==='auto'));
  const [value,setValue]=react.useState(()=>{const i=controls.stops.findIndex(s=>s.id===selected);return i<0?defaultIndex:i;});
  const [hovered,setHovered]=react.useState(null), [keyboardTip,setKeyboardTip]=react.useState(false);
  const rail=react.useRef(null), thumb=react.useRef(null), liveValue=react.useRef(value), pointerOrigin=react.useRef(null);
  react.useEffect(()=>{const i=controls.stops.findIndex(s=>s.id===selected);setValue(i<0?defaultIndex:i);liveValue.current=i<0?defaultIndex:i;},[selected,JSON.stringify(controls.stops)]);
  const stop=controls.stops[value]||controls.stops[defaultIndex];
  const count=Math.max(1,controls.stops.length-1);
  const tipIndex=hovered??(keyboardTip?value:null), tipStop=controls.stops[tipIndex];
  const tip=useClosingCard(tipStop?tipStop.id:null), shownTip=controls.stops.find(s=>s.id===tip.content), shownIndex=controls.stops.indexOf(shownTip);
  const position=i=>`calc(11px + (100% - 22px) * ${i/count})`;
  const inspect=e=>{
    const rect=rail.current?.getBoundingClientRect();if(!rect)return;
    const handle=thumb.current?.getBoundingClientRect();
    if(handle&&Math.abs(e.clientX-(handle.left+11))<=12&&Math.abs(e.clientY-(handle.top+11))<=12){setHovered(liveValue.current);return;}
    const spacing=(rect.width-22)/count, i=Math.max(0,Math.min(count,Math.round((e.clientX-rect.left-11)/spacing)));
    const x=rect.left+11+spacing*i;
    // Inspecting another point never stages or commits a selection.
    setHovered(Math.abs(e.clientX-x)<=Math.min(12,spacing/2)&&Math.abs(e.clientY-(rect.top+15))<=12?i:null);
  };
  const commit=()=>{pointerOrigin.current=null;onCommit(controls.stops[liveValue.current].id);};
  return mc('div',{ref:rail,className:'mm-slider-wrap',onPointerEnter:inspect,onPointerMove:inspect,onPointerLeave:()=>setHovered(null)},
    mc('div',{className:'mm-slider-rail'}),mc('div',{className:'mm-slider-dots'},...controls.stops.map((s,i)=>mc('i',{key:s.id,style:{left:`${100*i/Math.max(1,controls.stops.length-1)}%`}}))),
    mc('input',{type:'range',disabled,min:0,max:controls.stops.length-1,step:1,value,'aria-label':'思考强度','aria-valuetext':`${stop.name||stop.value}，${effortDescription(stop,controls)}`,onChange:e=>{const i=+e.target.value;liveValue.current=i;setValue(i);if(pointerOrigin.current)setHovered(i);else{setHovered(null);setKeyboardTip(true);}onPreview(controls.stops[i].id);},onPointerDown:()=>{pointerOrigin.current={selected};setKeyboardTip(false);},onPointerUp:commit,onPointerCancel:()=>{const i=controls.stops.findIndex(s=>s.id===(pointerOrigin.current?.selected??selected));liveValue.current=i<0?defaultIndex:i;pointerOrigin.current=null;setValue(liveValue.current);onPreview(controls.stops[liveValue.current].id);},onKeyUp:e=>{if(['ArrowLeft','ArrowRight','Home','End','ArrowUp','ArrowDown'].includes(e.key))commit();},onFocus:e=>{if(e.currentTarget.matches(':focus-visible'))setKeyboardTip(true);},onBlur:()=>setKeyboardTip(false)}),
    mc('div',{ref:thumb,className:'mm-slider-thumb',style:{left:position(value)},'aria-hidden':true}),
    shownTip&&mc('div',{className:'mm-slider-tip',style:{left:position(shownIndex)}},mc('div',{key:shownTip.id,className:'mm-slider-tip-card'+(tip.closing?' closing':''),role:'tooltip','aria-hidden':tip.closing,'data-effort-id':shownTip.id},shownTip.name||shownTip.value,mc('small',null,effortDescription(shownTip,controls)))));
}
function selectPress(action) { return { onPointerDown: e => { if(e.button===0){e.preventDefault();action();} }, onClick: e => { if(e.detail===0)action(); } }; }
function HostedModelSelect({ctx,sessionId,locked,available,directory,select,refreshControls,controlsStore}) {
  const state=react.useSyncExternalStore(fn=>directory.subscribe(fn),()=>directory.getSnapshot());
  const metadata=react.useSyncExternalStore(fn=>controlsStore.subscribe(fn),()=>controlsStore.getSnapshot());
  const [open,setOpen]=react.useState(false), [expanded,setExpanded]=react.useState(()=>new Set()), [hover,setHover]=react.useState(null), [geometry,setGeometry]=react.useState(null), [hoverGeometry,setHoverGeometry]=react.useState(null), [stagingRevision,setStagingRevision]=react.useState(0), [error,setError]=react.useState(null);
  const {content:shownHover,closing:hoverClosing}=useClosingCard(hover);
  const root=react.useRef(null), menu=react.useRef(null), floating=react.useRef(null), leaveTimer=react.useRef(0), staged=react.useMemo(()=>new Map(),[sessionId]), hoverSource=react.useRef(null), activeSession=react.useRef(sessionId), suppressFocus=react.useRef(false);
  activeSession.current=sessionId;
  // 供应商行的悬浮高亮走设置卡同一台旅行悬浮框机器（行为唯一）。
  const travel=useTravelFrames(menu);
  react.useEffect(()=>{setOpen(false);setHover(null);setExpanded(new Set());setError(null);},[sessionId]);
  // A committed selection, including /model, takes precedence over an older preview.
  react.useEffect(()=>{
    if(!state.current)return;
    const key=routeKey(state.current.provider,state.current.model);
    const model=state.groups.find(g=>g.id===state.current.provider)?.models.find(m=>m.id===state.current.model);
    // A native reset is a UI choice; its committed wire selection is the advertised default.
    if(staged.get(key)===NATIVE_DEFAULT_EFFORT&&state.current.reasoningEffort===model?.reasoning?.defaultEffort)return;
    if(staged.delete(key))setStagingRevision(x=>x+1);
  },[staged,state.current?.provider,state.current?.model,state.current?.reasoningEffort]);
  const controlsRevision=JSON.stringify(metadata.map(m=>[m.provider,m.id,m.apiFormat,m.reasoningControls]));
  react.useEffect(()=>{staged.clear();setHover(null);setStagingRevision(x=>x+1);},[staged,controlsRevision]);
  const hosted=metadata.find(m=>m.provider===state.current?.provider&&m.id===state.current?.model);
  const currentModel=state.groups.flatMap(g=>g.models.map(m=>({...m,provider:g.id}))).find(m=>m.provider===state.current?.provider&&m.id===state.current?.model);
  const busy=state.status==='selecting', disabled=locked||!available||busy;
  const keep=()=>clearTimeout(leaveTimer.current), leave=()=>{keep();leaveTimer.current=setTimeout(()=>setHover(null),180);};
  const place=()=>{
    const trigger=root.current?.getBoundingClientRect(), composer=root.current?.closest('[data-composer-card]')?.getBoundingClientRect();if(!trigger)return;
    const right=Math.min(innerWidth-8,composer?.right??trigger.right), left=Math.max(8,Math.min(trigger.left,right-120));
    setGeometry({left,right:innerWidth-right,bottom:innerHeight-trigger.top+8,maxHeight:Math.max(80,trigger.top-16)});
    const source=hover&&hoverSource.current?.getBoundingClientRect();if(source){const supplier=hover.kind==='provider', text=supplier?(hover.group.name||hover.group.id):(hover.model.name||hover.model.id||'');const textWidth=Math.max(Array.from(text).reduce((n,c)=>n+(c.charCodeAt(0)>255?12:6),16),supplier?hoverSource.current.scrollWidth-18:0);const nameWidth=Math.max(right-left-20,textWidth);
      // The supplier's full-name card grows leftward, leaving the entire
      // right-hand expansion target unobstructed.
      const edge=supplier?source.right:right, width=supplier?Math.max(source.width,textWidth+20):Math.min(innerWidth-16,nameWidth+236);const h=floating.current?.offsetHeight||(supplier?34:40);
      setHoverGeometry({left:Math.max(8,edge-width),width:Math.min(width,edge-8),'--mm-hover-name-width':`${Math.min(nameWidth,Math.max(80,right-244))}px`,top:Math.max(8,Math.min(innerHeight-h-8,hover.current?trigger.top-h-8:source.top-(h-source.height)/2))});}
  };
  const show=(data,el)=>{keep();hoverSource.current=el;setHover(data);};
  react.useLayoutEffect(()=>{place();},[open,hover,expanded,state.groups,stagingRevision]);
  react.useEffect(()=>{
    const reposition=()=>place();window.addEventListener('resize',reposition);window.addEventListener('scroll',reposition,true);
    const observer=new ResizeObserver(reposition);if(root.current?.closest('[data-composer-card]'))observer.observe(root.current.closest('[data-composer-card]'));if(menu.current)observer.observe(menu.current);if(floating.current)observer.observe(floating.current);
    const outside=e=>{if(!root.current?.contains(e.target)&&!menu.current?.contains(e.target)&&!floating.current?.contains(e.target)){setOpen(false);setHover(null);}};
    const key=e=>{if(e.key==='Escape'&&(open||hover)){setOpen(false);setHover(null);suppressFocus.current=true;root.current?.querySelector('button')?.focus();suppressFocus.current=false;}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',key);
    return()=>{window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true);observer.disconnect();document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',key);};
  },[open,hover,!!hoverGeometry]);
  react.useEffect(()=>()=>{clearTimeout(leaveTimer.current);},[]);
  react.useEffect(()=>{void refreshControls();},[]);
  const choose=async(model,effort)=>{
    if(disabled)return;
    if(effort!==undefined)staged.set(routeKey(model.provider,model.id),effort);
    const result=await select(selectionFor(model,state.current,staged));
    if(activeSession.current!==sessionId)return;
    if(result?.ok===false)setError(result.error?.message||'选择失败');else{setOpen(false);setHover(null);setError(null);}
  };
  const expand=(id)=>{setHover(null);setExpanded(prev=>{const next=new Set(prev);next.has(id)?next.delete(id):next.add(id);return next;});};
  const selectedEffort=model=>staged.get(routeKey(model.provider,model.id))===NATIVE_DEFAULT_EFFORT?NATIVE_DEFAULT_EFFORT:selectionFor(model,state.current,staged).reasoningEffort;
  const controlsFor=model=>metadata.find(m=>m.provider===model?.provider&&m.id===model?.id)?.reasoningControls||nativeControls(model);
  const remember=(model,effort)=>{staged.set(routeKey(model.provider,model.id),effort);setStagingRevision(x=>x+1);};
  const foreignEntry=react.useSyncExternalStore(fn=>ctx.slots.subscribe('conversation.input.model',fn),()=>ctx.slots.entries('conversation.input.model'));
  const fallback=foreignEntry.find(e=>e.options.key!=='llm-mimo-model-controls');
  if(!hosted&&!currentModel&&!state.groups.length&&fallback){const injected=fallback.inject?.(sessionId)||{};return mc(fallback.component,{...injected,locked,t:ctx.locale.bind(fallback.locale||NS)});}
  const hoverMeta=shownHover?.model&&metadata.find(m=>m.provider===shownHover.model.provider&&m.id===shownHover.model.id);
  const hoverControls=shownHover?.kind==='model'&&controlsFor(shownHover.model);
  const popupKey=shownHover&&`${shownHover.kind}:${routeKey(shownHover.model.provider,shownHover.model.id)}:${shownHover.current?'current':'menu'}`;
  const modelPopup=hoverControls&&hoverGeometry&&mc('div',{key:popupKey,ref:floating,className:'mm-hover-card'+(hoverClosing?' closing':''),style:hoverGeometry,'aria-hidden':hoverClosing,inert:hoverClosing?'':undefined,onPointerEnter:keep,onPointerLeave:leave},
    mc(ModelEffortSlider,{key:routeKey(shownHover.model.provider,shownHover.model.id)+':'+(hoverMeta?.apiFormat||'native'),controls:hoverControls,disabled,selected:selectedEffort(shownHover.model),onPreview:effort=>remember(shownHover.model,effort),onCommit:effort=>{
      if(disabled)return;
      remember(shownHover.model,effort);if(state.current?.provider===shownHover.model.provider&&state.current.model===shownHover.model.id){void select(selectionFor(shownHover.model,state.current,staged)).then(result=>{if(result?.ok===false){staged.delete(routeKey(shownHover.model.provider,shownHover.model.id));setStagingRevision(x=>x+1);setError(result.error?.message||'选择失败');}});}
    }}),mc('button',{type:'button',className:'mm-hover-name',disabled,...selectPress(()=>choose(shownHover.model))},shownHover.model.name||shownHover.model.id));
  const supplierPopup=shownHover?.kind==='provider'&&hoverGeometry&&mc('div',{key:popupKey,ref:floating,className:'mm-hover-card supplier'+(hoverClosing?' closing':''),style:hoverGeometry,'aria-hidden':hoverClosing,inert:hoverClosing?'':undefined,onPointerEnter:keep,onPointerLeave:()=>{leave();travel.onMouseLeave();}},
    mc('button',{type:'button',className:'mm-hover-name',disabled,...selectPress(()=>choose(shownHover.model))},(shownHover.group.name||shownHover.group.id)));
  const groups=state.groups.filter(group=>group.models.length);
  const menuNode=open&&geometry&&mc('div',{ref:menu,className:'mm-menu',style:geometry,'aria-label':'选择模型',onMouseOverCapture:travel.onMouseOverCapture,onMouseDownCapture:travel.onMouseDownCapture,onMouseLeave:()=>{if(shownHover?.kind==='provider')return;travel.onMouseLeave();}},
    ...travel.overlays,
    state.status==='loading'&&mc('div',{className:'mm-menu-message'},'正在加载模型…'),
    ...groups.map(group=>{
      const models=group.models.map(m=>({...m,provider:group.id}));
      const preferred=metadata.find(m=>m.provider===group.id&&m.isDefault)?.id;
      const defaultModel=models.find(m=>m.id===preferred)||models[0]; if(!defaultModel)return null;
      const isExpanded=expanded.has(group.id);
      return mc('div',{className:'mm-provider'+(isExpanded?' expanded':''),key:group.id},
        mc('div',{className:'mm-provider-row','data-travel-spot':true},
          mc('button',{type:'button',className:'mm-provider-name',disabled,onPointerEnter:e=>show({kind:'provider',group,model:defaultModel},e.currentTarget),onPointerLeave:leave,onFocus:e=>{if(e.currentTarget.matches(':focus-visible'))show({kind:'provider',group,model:defaultModel},e.currentTarget);},...selectPress(()=>choose(defaultModel))},(group.name||group.id)||group.id),
          mc('button',{type:'button',className:'mm-provider-arrow mm-provider-expand','aria-label':`${isExpanded?'收起':'展开'} ${(group.name||group.id)||group.id}`,'aria-expanded':isExpanded,onPointerEnter:()=>{keep();setHover(null);},onFocus:()=>{keep();setHover(null);},onClick:()=>expand(group.id)},mc('span',null,isExpanded?'⌃':'⌄'))),
        mc('div',{className:'mm-provider-models','aria-hidden':!isExpanded,inert:!isExpanded?'':undefined},mc('div',{className:'mm-provider-models-clip'},
          models.map(model=>mc('button',{key:model.id,type:'button',className:'mm-model-row'+(state.current?.provider===group.id&&state.current.model===model.id?' selected':''),disabled:disabled||!isExpanded,tabIndex:isExpanded?undefined:-1,onPointerEnter:e=>{if(controlsFor(model))show({kind:'model',model},e.currentTarget);else setHover(null);},onPointerLeave:leave,onFocus:e=>{if(controlsFor(model))show({kind:'model',model},e.currentTarget);},...selectPress(()=>choose(model))},model.name||model.id)))));
    }),
    state.failures?.length>0&&mc('div',{className:'mm-menu-message'},'部分供应商加载失败',mc('button',{type:'button',onClick:()=>{void ctx.modelDirectories.directoryFor(sessionId).load();void refreshControls();}},'重试')),
    (error||state.error)&&mc('div',{className:'mm-menu-error'},error||state.error),
    !state.groups.length&&state.status!=='loading'&&mc('div',{className:'mm-menu-message'},'暂无可用模型'));
  return mc(react.Fragment,null,mc('style',null,CONTROL_CSS),mc('div',{ref:root,className:'mm-selector'},
    mc('button',{type:'button',className:'mm-trigger','aria-label':'选择模型','aria-expanded':open,disabled,onPointerEnter:e=>{if(currentModel&&controlsFor(currentModel)&&!open)show({kind:'model',model:currentModel,current:true},e.currentTarget);},onPointerLeave:leave,onFocus:e=>{if(!suppressFocus.current&&currentModel&&controlsFor(currentModel)&&!open)show({kind:'model',model:currentModel,current:true},e.currentTarget);},onClick:()=>{setHover(null);setOpen(x=>!x);void ctx.modelDirectories.directoryFor(sessionId).load();void refreshControls();}},mc('span',null,currentModel?.name||state.current?.model||'选择模型'),mc('span',null,open?'⌃':'⌄'))),
    menuNode&&controlsPortal(menuNode,root.current),(supplierPopup||modelPopup)&&controlsPortal(supplierPopup||modelPopup,root.current),
    (error||hosted&&state.current?.reasoningEffort&&!currentModel?.reasoning?.efforts?.some(e=>e.id===state.current.reasoningEffort))&&!open&&mc('span',{className:'mm-menu-error',role:'alert'},error||'所选思考档位已删除，请重新选择'));
}
function installModelControls(ctx) {
  ctx.inject(['modelDirectories','sessions','remote.session'],scope=>{
    let models=[],listeners=new Set(),pending=null,disposed=false;
    const controlsStore={getSnapshot:()=>models,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
    const refreshControls=()=>{
      if(pending)return pending;
      pending=(async()=>{try{const result=await scope.remote.settings.describe();const ns=(result?.value?.namespaces||[]).find(n=>n.ns===ENTRY_ID);const next=JSON.parse(ns?.value?.modelControlsViewJson||'[]');if(!disposed&&Array.isArray(next)){models=next;for(const fn of listeners)fn();}}catch{if(!disposed){models=[];for(const fn of listeners)fn();}}finally{pending=null;}})();return pending;
    };
    scope.effect(()=>{void refreshControls();return()=>{disposed=true;listeners.clear();};},'llm-mimo: model controls metadata');
    scope.effect(()=>scope.remote.$on('settings/document-updated',()=>{void refreshControls();}),'llm-mimo: controls settings refresh');
    scope.effect(()=>scope.remote.$on('llm/adapters-updated',()=>{void refreshControls();}),'llm-mimo: controls adapter refresh');
    scope.slots.inject('conversation.input.model',()=>scope.slots.register({name:'conversation.input.model',key:'llm-mimo-model-controls',priority:-10,locale:NS,inject:sessionId=>{
      const directory=scope.modelDirectories.directoryFor(sessionId);
      const available=scope.sessions.subagentAddress(sessionId)===undefined;
      return {ctx:scope,sessionId,available,directory:directory.store,select:selection=>available?directory.select(selection):Promise.resolve(undefined),refreshControls,controlsStore};
    }},HostedModelSelect),'llm-mimo: model selector and native effort controls');
  });
}

		// END GENERATED MODEL CONTROLS
		function ModelCard(props) {
			const { t, row, index, expanded, fresh, onToggle, onPatch, onRemove, isDefault, onDefault, issue, disabled, apiFormat } = props;
			const namePlaceholder = row.id.trim().length > 0 ? `${t("modelName")}（${row.id.trim()}）` : `${t("modelName")}（${t("modelNameDefault")}）`;
			// 展开体延迟 300ms 卸载:收起时 class 先摘,0fr→1fr 过渡跑完再卸载。
			const [bodyMounted, setBodyMounted] = react.useState(expanded);
			react.useEffect(() => {
				if (expanded) {
					setBodyMounted(true);
					return;
				}
				const timer = window.setTimeout(() => setBodyMounted(false), 300);
				return () => window.clearTimeout(timer);
			}, [expanded]);
			const contextValue = row.contextWindow ?? DEFAULT_CONTEXT_WINDOW;
			const tokensValue = row.maxTokens ?? DEFAULT_MAX_TOKENS;
			const onBlankArea = (event) => !(event.target.closest && event.target.closest("input, label, button"));
			const clickProps = expanded ? {} : {
				onClick: (event) => { if (onBlankArea(event)) onToggle(); }
			};
			const markStyle = { cursor: expanded ? "default" : "pointer" };
			const header = react_jsx_runtime.jsxs("div", {
				className: "llm-mimo-mgrid",
				style: { gridTemplateColumns: "185px 215px 1fr 20px 28px" },
				children: [
					react_jsx_runtime.jsx(DefaultName, { t, row, index, onPatch, isDefault, onDefault, placeholder: namePlaceholder }),
					react_jsx_runtime.jsx("input", {
						className: "llm-mimo-idbox",
						"aria-label": t("modelIdRequired"),
						title: t("modelIdRequired"),
						placeholder: t("modelIdRequired"),
						value: row.id,
						autoFocus: fresh || undefined,
						onChange: (event) => onPatch(index, { id: event.target.value })
					}),
					react_jsx_runtime.jsx("span", {}),
					react_jsx_runtime.jsx("button", {
						type: "button",
						className: "llm-mimo-caret",
						style: { transform: expanded ? "rotate(180deg)" : "none" },
						title: expanded ? t("collapse") : t("expand"),
						"aria-label": expanded ? t("collapse") : t("expand"),
						"aria-expanded": expanded,
						onClick: (event) => { event.stopPropagation(); onToggle(); },
						children: "▾"
					}),
					react_jsx_runtime.jsx("button", {
						type: "button",
						className: "llm-mimo-trash",
						style: { justifySelf: "end" },
						title: t("removeModel"),
						onClick: (event) => { event.stopPropagation(); onRemove(index); },
						children: fresh ? react_jsx_runtime.jsxs("span", {
							className: "llm-mimo-trash-birth",
							children: [
								react_jsx_runtime.jsx("span", { className: "llm-mimo-trash-glyph plus", children: "+" }),
								react_jsx_runtime.jsx("span", { className: "llm-mimo-trash-glyph icon", children: react_jsx_runtime.jsx(_primitives.IconTrashOutlineRegular, { width: 14, height: 14 }) })
							]
						}) : react_jsx_runtime.jsx(_primitives.IconTrashOutlineRegular, { width: 14, height: 14 })
					})
				]
			});
			const body = bodyMounted && react_jsx_runtime.jsx("div", {
				className: "llm-mimo-mbody" + (expanded ? " open" : ""),
				children: react_jsx_runtime.jsx("div", {
					className: "llm-mimo-mbodyclip",
					children: react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-mgrid",
						style: { gridTemplateColumns: "185px 215px 1fr 56px", marginTop: 8, rowGap: 8 },
						children: [
					react_jsx_runtime.jsx(TokenField, {
						label: `${t("contextWindow")}:`,
						kind: "context",
						labelPad: 5,
						value: contextValue,
						dimmed: contextValue === DEFAULT_CONTEXT_WINDOW,
						onCommit: (parsed) => onPatch(index, { contextWindow: parsed ?? DEFAULT_CONTEXT_WINDOW })
					}),
					react_jsx_runtime.jsx(TokenField, {
						label: `${t("maxTokens")}:`,
						kind: "tokens",
						labelPad: 9,
						value: tokensValue,
						dimmed: tokensValue === DEFAULT_MAX_TOKENS,
						onCommit: (parsed) => onPatch(index, { maxTokens: parsed ?? DEFAULT_MAX_TOKENS })
					}),
					react_jsx_runtime.jsx("span", {}),
					react_jsx_runtime.jsx("button", {
						type: "button",
						className: "llm-mimo-collapsebtn",
						title: t("collapse"),
						style: { gridColumn: "4", gridRow: "1 / 4", width: "56px", height: "100%", justifySelf: "end" },
						onClick: () => onToggle(),
						children: "▴"
					}),
					react_jsx_runtime.jsxs("div", {
						style: { gridColumn: "1 / 4", display: "flex", alignItems: "center", gap: 12 },
						children: [
							react_jsx_runtime.jsx("span", { className: "llm-mimo-label", style: { paddingLeft: 5 }, title: t("inputTypesHint"), children: `${t("inputTypes")}:` }),
							MODALITIES.map((modality) => react_jsx_runtime.jsxs("label", {
								className: "llm-mimo-chip",
								title: t(modality.label),
								children: [
									react_jsx_runtime.jsx("input", {
										type: "checkbox",
										disabled: modality.id === "text",
										checked: modality.id === "text" ? true : row.inputModalities.includes(modality.id),
										onChange: (event) => {
											const next = event.target.checked
												? [...row.inputModalities.filter((m) => m !== modality.id), modality.id]
												: row.inputModalities.filter((m) => m !== modality.id);
											onPatch(index, { inputModalities: next });
										}
									}),
									t(modality.label)
								]
								}, modality.id))
							]
						}),
						react_jsx_runtime.jsx(EffortEditor, { row, index, onPatch, issue, disabled, apiFormat }, apiFormat)
						]
					})
				})
			});
			return react_jsx_runtime.jsxs("div", {
				className: "llm-mimo-mcard" + (!expanded ? " collapsed" : "") + (fresh ? " fresh" : ""),
				...clickProps,
				style: markStyle,
				children: [
					header,
					body,
					fresh && react_jsx_runtime.jsx("div", {
						className: "llm-mimo-birthframe",
						children: react_jsx_runtime.jsx("span", { className: "llm-mimo-birthplus", children: "+" })
					}, "birth")
				]
			});
		}
			function AddStrip(props) {
				const { t, onAdd, fused, justAdded } = props;
				// 与未展开模型行同解剖:填充卡(10/12) > 内层体(5/8, radius 8) >
				// 内容行(高 28 按钮族);左侧提示框 408px = 名+ID 列宽,右侧加号列
				// 与垃圾桶列右缘对齐。规格与模型行逐像素统一。
				return react_jsx_runtime.jsxs("div", {
					className: "llm-mimo-fillcard llm-mimo-addrow llm-mimo-stackitem",
					style: { marginTop: fused ? -12 : 8, borderRadius: fused ? "0 0 20px 20px" : 20 },
					onClick: onAdd,
					children: [
						react_jsx_runtime.jsxs("div", {
							className: "llm-mimo-addbody",
							children: [
								react_jsx_runtime.jsx("div", {
									className: "llm-mimo-addstrip",
									title: t("addModel"),
									onClick: (event) => { event.stopPropagation(); onAdd(); },
									children: react_jsx_runtime.jsx("span", { className: "llm-mimo-addplus", children: "+" })
								}),
								react_jsx_runtime.jsx("span", { style: { flex: 1 } }),
								react_jsx_runtime.jsx("button", {
									type: "button",
									className: "llm-mimo-plusbtn" + (justAdded ? " appear" : ""),
									title: t("addModel"),
									onClick: (event) => { event.stopPropagation(); onAdd(); },
									children: "+"
								})
							]
						})
					]
				});
			}
			/** 三种 API 格式:名称 + 各自持久化链接的说明。 */
		const FORMAT_META = [
			{ id: "anthropic", name: "Anthropic Messages", desc: "可持久化存储该协议的 Anthropic Messages API 链接，相互作为备用" },
			{ id: "chat", name: "OpenAI Chat Completions", desc: "可持久化存储该协议的 OpenAI Chat Completions API 链接，相互作为备用" },
			{ id: "responses", name: "OpenAI Responses", desc: "可持久化存储该协议的 OpenAI Responses API 链接，相互作为备用" }
		];
		/** 解析每协议链接存储;坏草稿静默回空。 */
		function formatsFrom(text) {
			try {
				const parsed = JSON.parse(text ?? "{}");
				const out = {};
				for (const key of ["anthropic", "chat", "responses"]) {
					if (typeof parsed?.[key] === "string" && parsed[key].trim().length > 0) out[key] = parsed[key].trim();
				}
				return out;
			} catch (_halfWrittenDraft) {
				return {};
			}
		}
		function ProviderCard(props) {
				const { t, provider, keyConfigured, probe } = props;
			const state = props.useCard((snapshot) => snapshot);
			const disabled = state?.writable === false;
			const [expanded, setExpanded] = react.useState(() => new Set());
			const bodyRef = react.useRef(null);
			// 旅行悬浮框 + 双旅行框三态机:与自定义页共用 useTravelFrames。
			const travel = useTravelFrames(bodyRef);
			const { frames, frameA, frameB, frameDim, applyHover, retargetHover } = travel;
			const [freshIndex, setFreshIndex] = react.useState(null);
			const [keyDraft, setKeyDraft] = react.useState("");
			const [probeState, setProbeState] = react.useState(null);
			// 连通性测试:草稿密钥非空则测草稿,否则服务端解析已存密钥。
			// 成功更新小圆灯为绿;失败向下展开红框展示服务端带回的报错。
			const probeConnectivity = async () => {
				if (disabled || (probeState && probeState.phase === "probing") || typeof probe !== "function") return;
				setProbeState({ phase: "probing" });
				try {
					const draft = keyDraft.trim();
					const response = await probe({
						baseURL: baseURL.length > 0 ? baseURL : void 0,
						apiKey: draft.length > 0 ? draft : void 0
					});
					setProbeState(response?.ok === true
						? { phase: "ok", count: Array.isArray(response.value) ? response.value.length : 0 }
						: { phase: "fail", message: response?.error?.message ?? "连通性测试被拒绝" });
				} catch (error) {
					setProbeState({ phase: "fail", message: String(error?.message ?? error) });
				}
			};
			const [notice, setNotice] = react.useState(null);
			const drawerRef = react.useRef(null);
			const clipRef = react.useRef(null);
			const { open } = useEditorDrawer(drawerRef, clipRef, t, provider);
			const baseURL = state?.baseURL?.text ?? "";
			const baseURLsText = state?.baseURLsJson?.text ?? "{}";
			const formats = formatsFrom(baseURLsText);
			const activeFormatId = FORMAT_META.some((entry) => entry.id === (state?.apiFormat?.text ?? "chat")) ? state.apiFormat.text : "chat";
			const activeFormat = FORMAT_META.find((entry) => entry.id === activeFormatId) ?? FORMAT_META[0];
			const [formatOpen, setFormatOpen] = react.useState(false);
			const [formatClosing, setFormatClosing] = react.useState(false);
			const [formatFly, setFormatFly] = react.useState(null);
			const formatCardRef = react.useRef(null);
			const baseRowRef = react.useRef(null);
			const baseInputRef = react.useRef(null);
			const formatPortalRef = react.useRef(null);
			react.useEffect(() => () => formatPortalRef.current?.remove(), []);
			// 面板宿主挂进 Base URL 行所在的渲染根:宿主页面是 Shadow DOM,挂
			// document.body 会逃出样式作用域(CARD_STYLES 失效、退化为文档流块,
			// position:fixed 也随之失效);挂同根则样式照常生效,且在抽屉裁剪层
			// 之外,可自由外扩遮挡。行引用未就绪前兜底挂 body。
			const ensureFormatPortal = () => {
				if (formatPortalRef.current) return formatPortalRef.current;
				const host = document.createElement("div");
				try {
					// Shadow DOM:挂进所在渲染根(样式同树);光 DOM:getRootNode 返回
					// Document 本身,往 Document appendChild 会抛 HierarchyRequestError,
					// 回退挂 body(全局 <style> 照常作用)。
					const rootNode = baseRowRef.current?.getRootNode();
					if (rootNode && rootNode !== document && typeof rootNode.appendChild === "function") rootNode.appendChild(host);
					else document.body.appendChild(host);
				} catch (_hierarchyRequest) {
					document.body.appendChild(host);
				}
				formatPortalRef.current = host;
				return host;
			};
			const placeFormatCard = () => {
				const card = formatCardRef.current;
				const row = baseRowRef.current;
				if (!card || !row) return;
				const rowRect = row.getBoundingClientRect();
				const header = card.querySelector(".llm-mimo-formathead");
				const headerH = header?.offsetHeight ?? 22;
				const activeLine = card.querySelector(".llm-mimo-formatline.active");
				// 激活行在卡内的布局偏移用 offsetTop(相对卡片自身,含头部高度),
				// 与卡片当前在哪无关——不依赖卡片现位的测量就不会被自身动画/旧
				// 位置污染。目标:激活行的视口Y == Base URL 行的视口Y。
				const activeOffset = activeLine ? activeLine.offsetTop : headerH;
				card.style.top = `${Math.round(rowRect.top - activeOffset)}px`;
				card.style.left = `${Math.round(rowRect.left - 6)}px`;
				card.style.width = `${Math.round(rowRect.width + 12)}px`;
				if (localStorage.getItem("llm-mimo-format-debug") === "1") {
					card.style.background = "#ff00ff";
					card.style.outline = "2px solid cyan";
				}
			};
			// 面板为独立浮层:点击面板外任意处即收起(面板内点击不受影响);
			// 收起走 200ms 缩回过渡,期间不重复触发。
			const closeFormatPanel = () => {
				if (!formatOpen || formatClosing) return;
				setFormatClosing(true);
				window.setTimeout(() => {
					setFormatOpen(false);
					setFormatClosing(false);
					setFormatFly(null);
				}, 200);
			};
			react.useEffect(() => {
				if (!formatOpen) return;
				const onDocMousedown = (event) => {
					if (formatCardRef.current?.contains(event.target)) return;
					closeFormatPanel();
				};
				const reposition = () => placeFormatCard();
				document.addEventListener("mousedown", onDocMousedown, true);
				window.addEventListener("resize", reposition);
				document.addEventListener("scroll", reposition, true);
				return () => {
					document.removeEventListener("mousedown", onDocMousedown, true);
					window.removeEventListener("resize", reposition);
					document.removeEventListener("scroll", reposition, true);
				};
			}, [formatOpen, formatClosing]);
			// 对位:激活格式行钉在点击前 Base URL 行的屏幕高度上(头向上弹,其余向下弹)。
			react.useLayoutEffect(() => {
				if (!formatOpen) return;
				placeFormatCard();
			}, [formatOpen]);
			// 弹出动画(transform)会干扰当帧测量:动画落定后再校准一次。
			react.useEffect(() => {
				if (!formatOpen) return;
				const timer = window.setTimeout(() => placeFormatCard(), 260);
				return () => window.clearTimeout(timer);
			}, [formatOpen]);
			// 切换格式:当前编辑的 URL 归还给旧格式存储,新格式无存储则继承现值;
			// 全部走表单暂存,随保存落盘。
			// 未存储链接的格式:按已存链接猜一个灰色默认(同源 + /v1)。
			const guessBaseURL = () => {
				const source = formats.anthropic ?? baseURL.trim();
				try {
					return new URL(source).origin + "/v1";
				} catch (_invalidURL) {
					return "https://api.xiaomimimo.com/v1";
				}
			};
			const selectFormat = (id) => {
				// Persist the legacy bucket before apiFormat changes its interpretation.
				props.edit("modelsJson", JSON.stringify(rows));
				setControlIssue(null);
				const card = formatCardRef.current;
				const row = baseRowRef.current;
				const line = card?.querySelector(`.llm-mimo-formatline[data-format="${id}"]`);
				if (card && row && line) {
					// 整卡平移使选中行落到 Base URL 行,随后整卡淡出。
					const rowRect = row.getBoundingClientRect();
					const lineRect = line.getBoundingClientRect();
					setFormatFly({
						dx: Math.round(rowRect.left - lineRect.left),
						dy: Math.round(rowRect.top - lineRect.top)
					});
				}
				const next = { ...formats };
				const current = baseURL.trim();
				if (current.length > 0) next[activeFormatId] = current;
				props.edit("baseURLsJson", JSON.stringify(next));
				props.edit("apiFormat", id);
				// 新格式无存储时采纳猜测值到 Base URL 输入框,但不写回存储——
				// 存储只记真实使用/编辑过的链接,没存过的保持灰色猜测。
				props.edit("baseURL", next[id] ?? guessBaseURL());
				baseInputRef.current?.focus();
				closeFormatPanel();
			};
			const modelsText = state?.modelsJson?.text ?? "[]";
			const apiKeyEnv = state?.apiKeyEnv?.text ?? "MIMO_NORMAL_API_KEY";
			const rows = modelsFrom(modelsText).map(row => withReasoningFormats(row, activeFormatId));
			const rowKeys = react.useRef([]);
			while (rowKeys.current.length < rows.length) rowKeys.current.push(crypto.randomUUID());
			const [controlIssue, setControlIssue] = react.useState(null);
			const defaultDraft = useDefaultDraft(rows, state?.defaultModelId?.text ?? "", rowKeys.current);

			const valid = rowsValid(rows);
			// 行展开/收起、增删行都会移动输入框布局——重测两个旅行框的位置。
			react.useEffect(() => {
				for (const m of frames) m.apply();
			}, [expanded, rows.length, open]);
			const patchRow = (index, patch) => {
				if (patch.id !== undefined && defaultDraft.rename(index, patch.id)) props.edit("defaultModelId", patch.id);
				const next = rows.map((row, i) => i === index ? { ...row, ...patch } : row);
				props.edit("modelsJson", JSON.stringify(next));
			};
			const addRow = () => {
				const next = [...rows, { id: "", name: "", contextWindow: DEFAULT_CONTEXT_WINDOW, maxTokens: DEFAULT_MAX_TOKENS, inputModalities: ["text", "image"] }];
				props.edit("modelsJson", JSON.stringify(next));
				setFreshIndex(rows.length);
				window.setTimeout(() => setFreshIndex(null), 500);
			};
			const removeRow = (index) => {
				if (defaultDraft.remove(index)) props.edit("defaultModelId", "");
				rowKeys.current.splice(index, 1);
				const next = rows.filter((_, i) => i !== index);
				props.edit("modelsJson", JSON.stringify(next));
				setExpanded((prev) => {
					const nextSet = new Set();
					for (const i of prev) if (i < index) nextSet.add(i); else if (i > index) nextSet.add(i - 1);
					return nextSet;
				});
			};
			// 悬浮框目标改指(带重试:收起按钮要等展开体挂载)。展开行的行级悬浮
			// 代表=收起按钮;收起后回到整行。
			const toggle = (index) => {
				const willOpen = !expanded.has(index);
				setExpanded((prev) => {
					const next = new Set(prev);
					if (next.has(index)) next.delete(index);
					else next.add(index);
					return next;
				});
				retargetHover(willOpen ? ".llm-mimo-collapsebtn" : ".llm-mimo-mcard", index, 12);
			};
			const save = async () => {
				const issue = controlsError(rows, activeFormatId);
				if (issue) { if(issue.format !== activeFormatId) selectFormat(issue.format); setExpanded(prev => new Set([...prev, issue.index])); setControlIssue(issue); return; }
				setControlIssue(null);
				if (!valid || disabled) return;
				props.edit("modelsJson", JSON.stringify(rows));
				if (keyDraft.trim().length > 0) props.edit("apiKey", keyDraft.trim());
				try {
					if (typeof props.save === "function") await props.save();
					setKeyDraft("");
					const landed = typeof props.readLanded === "function" ? props.readLanded() : null;
					setNotice(landed === false ? { ok: false, text: `${t("keyFailed")}: save did not land` } : { ok: true, text: t("saved") });
				} catch (error) {
					setNotice({ ok: false, text: `${t("keyFailed")}: ${error?.message ?? String(error)}` });
				}
			};
			const cancel = () => {
				defaultDraft.reset();
				if (typeof props.discard === "function") props.discard();
				setControlIssue(null);
				setKeyDraft("");
				setNotice(null);
			};
			// 扁平卡片栈:每行恒为独立填充卡;相邻折叠行以 -12px 重叠融合(不透明同色
			// 无边框),任一侧展开则分离为 8px——分合只是 margin 过渡,与展开体开合同步并发。
			// 融合接缝的两侧角归零:接缝处没有圆角就永远不会有侧边凹凸,外露角保持 20px。
			const rowOpen = (index) => expanded.has(index);
			const rowMargin = (index) => rowOpen(index) || (index > 0 && rowOpen(index - 1)) ? 8 : -12;
			const lastRowIndex = rows.length - 1;
			const stackRadius = (fusedAbove, fusedBelow) => fusedAbove && fusedBelow ? 0 : fusedAbove ? "0 0 20px 20px" : fusedBelow ? "20px 20px 0 0" : 20;
			const rowNodes = rows.map((row, index) => react_jsx_runtime.jsx("div", {
				className: "llm-mimo-fillcard llm-mimo-stackitem" + (index === freshIndex ? " fresh" : ""),
				"data-card": index,
				style: { marginTop: rowMargin(index), borderRadius: stackRadius(rowMargin(index) === -12, index < lastRowIndex && rowMargin(index + 1) === -12) },
				children: react_jsx_runtime.jsx(ModelCard, {
					t,
					row,
					index,
					expanded: expanded.has(index),
					fresh: index === freshIndex,
					onToggle: () => toggle(index),
					onPatch: patchRow,
					onRemove: removeRow,
					isDefault: rowKeys.current[index] === defaultDraft.key,
					onDefault: () => { defaultDraft.select(index, row.id); props.edit("defaultModelId", row.id); },
					apiFormat: activeFormatId,
					issue: controlIssue?.index === index ? controlIssue : null,
					disabled
				})
			}, rowKeys.current[index]));
			const stripFused = rows.length === 0 || !rowOpen(lastRowIndex);
			const titleBlock = react_jsx_runtime.jsxs("div", { children: [
				react_jsx_runtime.jsx("div", { style: { fontWeight: 600, fontSize: 13, color: "var(--dsw-alias-label-primary)" }, children: t("modelsTitle") }),
				react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", children: t("modelsHint") })
			] });
			const titleCard = react_jsx_runtime.jsx("div", {
				className: "llm-mimo-fillcard llm-mimo-stackitem",
				style: { marginTop: 8, borderRadius: rows.length === 0 || !rowOpen(0) ? "20px 20px 0 0" : 20 },
				children: titleBlock
			});
			const stripNode = react_jsx_runtime.jsx(AddStrip, {
				t,
				onAdd: addRow,
				fused: stripFused,
				justAdded: freshIndex !== null
			}, "strip");
			const connectionCard = react_jsx_runtime.jsxs("div", {
				className: "llm-mimo-fillcard",
				style: { position: "relative" },
				children: [
					react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-row llm-mimo-baserow",
						ref: baseRowRef,
						title: "点击切换 API 格式",
						onClick: (event) => {
							if (event.target.closest("input, label, button")) return;
							ensureFormatPortal();
							setFormatFly(null);
							setFormatOpen((open) => !open);
						},
						children: [
							react_jsx_runtime.jsx("span", {
								className: "llm-mimo-label llm-mimo-rollwrap",
								children: react_jsx_runtime.jsxs("span", {
									className: "llm-mimo-rollstack",
									children: [
										react_jsx_runtime.jsx("span", { className: "llm-mimo-rollline", children: t("baseUrl") }),
										react_jsx_runtime.jsx("span", { className: "llm-mimo-rollline", children: activeFormat.name })
									]
								})
							}),
							react_jsx_runtime.jsx("input", {
								className: "llm-mimo-underline",
								ref: baseInputRef,
								style: { flex: 1 },
								placeholder: baseUrlHintFor(t("baseUrlHint"), activeFormat.name),
								value: baseURL,
								disabled,
								onChange: (event) => props.edit("baseURL", event.target.value)
							})
						]
					}),
					(formatOpen || formatClosing) && react_dom.createPortal(react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-formatcard" + (formatFly ? " fly" : "") + (formatClosing ? " closing" : ""),
						style: formatFly ? { transform: `translate(${formatFly.dx}px, ${formatFly.dy}px)` } : void 0,
						ref: formatCardRef,
						children: [
							react_jsx_runtime.jsx("div", { className: "llm-mimo-formathead", children: "API格式" }),
							FORMAT_META.map((entry) => react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-formatline" + (entry.id === activeFormatId ? " active" : ""),
								"data-format": entry.id,
								title: entry.desc,
								onClick: () => selectFormat(entry.id),
								children: [
									react_jsx_runtime.jsx("span", { className: "llm-mimo-formatname", children: entry.name }),
									react_jsx_runtime.jsx("input", {
										className: "llm-mimo-underline llm-mimo-formatinput",
										placeholder: formatExampleFor(entry.id),
										title: entry.desc,
										value: entry.id === activeFormatId ? baseURL : formats[entry.id] ?? "",
										readOnly: true
									})
								]
							}, entry.id))
						]
					}), formatPortalRef.current),
					react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-keyzone",
						title: "点击测试连通性",
						onClick: (event) => {
							// 报错文本本身可选中复制,不属于点击热区。
							if (event.target.closest("input, label, button, .llm-mimo-probeerror")) return;
							probeConnectivity();
						},
						children: [
							react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-row",
								children: [
									react_jsx_runtime.jsx("span", { className: "llm-mimo-label", style: { minWidth: 92 }, children: t("apiKey") }),
									react_jsx_runtime.jsx("input", {
										className: "llm-mimo-underline",
										style: { flex: 1 },
										type: "password",
										placeholder: t("apiKeyHint"),
										value: keyDraft,
										disabled,
										onChange: (event) => setKeyDraft(event.target.value)
									}),
									react_jsx_runtime.jsx("span", {
										className: "llm-mimo-connect" + (probeState?.phase === "probing" ? " probing" : ""),
										title: "测试连通性",
										onClick: (event) => {
											event.stopPropagation();
											probeConnectivity();
										},
										children: react_jsx_runtime.jsx(_primitives.IconLinkOutlineRegular, { width: 16, height: 16 })
									}),
									react_jsx_runtime.jsx("span", {
										className: "llm-mimo-dot" + (probeState?.phase === "probing" ? " probing" : ""),
										role: "img",
										"aria-label": probeState?.phase === "ok" ? "联通正常" : probeState?.phase === "fail" ? "联通异常" : keyConfigured ? t("apiKeyConfigured") : t("apiKeyMissing"),
										title: probeState?.phase === "probing" ? "正在测试连通性…" : probeState?.phase === "ok" ? `联通正常（${probeState.count} 个模型）` : probeState?.phase === "fail" ? "联通异常" : keyConfigured ? t("apiKeyConfigured") : t("apiKeyMissing"),
										style: {
											width: 9,
											height: 9,
											borderRadius: "50%",
											background: probeState?.phase === "probing" ? "#f59e0b" : probeState?.phase === "ok" ? "#22c55e" : probeState?.phase === "fail" ? "#ef4444" : keyConfigured ? "#22c55e" : "#e5e7eb",
											display: "inline-block",
											flexShrink: 0
										}
									})
								]
							}),
							probeState?.phase === "fail" && react_jsx_runtime.jsx("div", {
								className: "llm-mimo-probeclip",
								children: react_jsx_runtime.jsx("div", {
									className: "llm-mimo-probeerror",
									children: probeState.message
								})
							})
						]
					})
				]
			});
			return react_jsx_runtime.jsxs("div", {
				ref: drawerRef,
				children: [
					react_jsx_runtime.jsx("style", { children: CARD_STYLES }),
					react_jsx_runtime.jsx("div", {
						className: "llm-mimo-drawer" + (open ? " open" : ""),
						children: react_jsx_runtime.jsx("div", {
							className: "llm-mimo-drawerclip",
							ref: clipRef,
						children: react_jsx_runtime.jsxs("div", {
							className: "llm-mimo-drawerbody",
							ref: bodyRef,
								onMouseDownCapture: travel.onMouseDownCapture,
								onFocusCapture: travel.onFocusCapture,
								onMouseOverCapture: travel.onMouseOverCapture,
								onMouseLeave: travel.onMouseLeave,
							children: [
									react_jsx_runtime.jsx("div", {
										className: "llm-mimo-cardhead",
										children: [
											react_jsx_runtime.jsx("span", { className: "llm-mimo-cardtitle", children: props.provider?.displayName ?? props.provider?.name ?? "MiMo" }),
											react_jsx_runtime.jsx("span", { className: "llm-mimo-cardroute", children: props.provider?.provider ?? "mimo" })
										]
									}),
									connectionCard,
									titleCard,
									...rowNodes,
									stripNode,
									!valid && react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", style: { marginTop: 8, color: "#ef4444" }, children: t("invalid") }),
									notice !== null && react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", style: { marginTop: 8, color: notice.ok ? "#8fdca6" : "#ef4444" }, children: notice.text }),
									react_jsx_runtime.jsxs("div", {
										className: "llm-mimo-foot",
										style: { marginTop: 8 },
										children: [
											react_jsx_runtime.jsx("button", { type: "button", className: "llm-mimo-ghost", disabled, onClick: cancel, children: t("cancel") }),
											react_jsx_runtime.jsx("button", { type: "button", className: "llm-mimo-primary", disabled: disabled || !valid, onClick: save, children: t("save") })
										]
									}),
										...travel.overlays
								]
							})
						})
					})
				]
			});
		}
		//#endregion
		//#region apply		//#endregion
		function ProviderCardDiag(props) {
			try {
				// 同一 settingsNs 下:基础路由 "mimo" 用 MiMo 卡,自定义路由用行内编辑器。
				const route = props.provider?.provider;
				if (typeof route === "string" && route !== "mimo") return CustomProviderCardDiag(props);
				return ProviderCard(props);
			} catch (error) {
				return react_jsx_runtime.jsx("div", { style: { color: "#ef4444", padding: 8, fontSize: 12, whiteSpace: "pre-wrap" }, children: "PC-ERR: " + String(error?.stack ?? error).slice(0, 500) });
			}
		}
		//#region CustomApiPage
		/**
		 * 自定义模型API(llm-mimo) 页:旧「自定义模型 API」创建表单的 llm-mimo 卡片版。
		 * 布局 = 图2 卡片(连接卡 Base URL / API 密钥 + 模型目录栈)+ Base URL 上方
		 * 一行「供应商名称(无框) + 供应商ID(有框)」(同模型行解剖:185/215 列)。
		 * 创建语义与旧页一致:写 llm-pi-ai 的 providers.<route> 配置 + 派生凭据
		 * (<ROUTE>_API_KEY);llm-mimo 引擎自托管是后续替换,页面行为不变。
		 */
		function CustomApiPage(props) {
			const { t, taken, readOnly, onClose, onBusyChange, createProvider, commitCustom, loadCustom, probeEndpoint } = props;
			const [route, setRoute] = react.useState("");
			const [displayName, setDisplayName] = react.useState("");
			const [baseURL, setBaseURL] = react.useState("");
			const [formatId, setFormatId] = react.useState("chat");
			const [keyDraft, setKeyDraft] = react.useState("");
			const [models, setModels] = react.useState([]);
			const [configuredDefault, setConfiguredDefault] = react.useState("");
						const [controlIssue, setControlIssue] = react.useState(null);
			const rowKeys = react.useRef([]);
			while(rowKeys.current.length < models.length) rowKeys.current.push(crypto.randomUUID());
			const defaultDraft = useDefaultDraft(models, configuredDefault, rowKeys.current);
			const [expanded, setExpanded] = react.useState(() => /* @__PURE__ */ new Set());
			const [freshIndex, setFreshIndex] = react.useState(null);
			const [formatOpen, setFormatOpen] = react.useState(false);
			const [probeState, setProbeState] = react.useState(null);
			const [failure, setFailure] = react.useState(void 0);
			const [notice, setNotice] = react.useState(null);
			// 行内编辑态:editingRoute = 被编辑的自定义供应商路由(创建态为 null)。
			const editingRoute = props.editingRoute ?? null;
			const [busy, setBusy] = react.useState(false);
			// 旅行悬浮框 + 双旅行框三态机:与 ProviderCard 共用 useTravelFrames。
			const bodyRef = react.useRef(null);
			const nameInputRef = react.useRef(null);
			const formatCardRef = react.useRef(null);
			const baseInputRef = react.useRef(null);
			const travel = useTravelFrames(bodyRef);
			// 行展开/收起、增删行都会移动输入框布局——重测两个旅行框的位置。
			react.useEffect(() => {
				for (const m of travel.frames) m.apply();
			}, [expanded, models.length]);
			// 行内编辑:从 customProviders 预填该路由的条目;取消=还原。
			const loadFromEntry = () => {
				if (!editingRoute || typeof loadCustom !== "function") return;
				const entry = loadCustom(editingRoute);
				if (!entry) return;
				setRoute(editingRoute);
				setDisplayName(!entry.displayName || entry.displayName === editingRoute ? "" : entry.displayName);
				setBaseURL(entry.baseURL ?? "");
				defaultDraft.reset();
				setConfiguredDefault(entry.defaultModelId ?? "");
				setControlIssue(null);
				setFormatId(["anthropic", "chat", "responses"].includes(entry.apiFormat) ? entry.apiFormat : "chat");
				setModels(modelsFrom(entry.modelsJson).map(row => withReasoningFormats(row, entry.apiFormat ?? "chat")));
			};
			react.useEffect(() => { loadFromEntry(); }, []);
			// 面板定位同 MiMo 卡:激活行视口 Y == Base URL 行视口 Y(激活行原位
			// 取代 Base URL 行,"API格式"头向上、其余行向下弹出),卡宽 = 行宽 ±6px。
			react.useLayoutEffect(() => {
				if (!formatOpen) return;
				const card = formatCardRef.current;
				if (!card) return;
				const activeLine = card.querySelector(".llm-mimo-formatline.active");
				card.style.top = `${-(activeLine ? activeLine.offsetTop : 0)}px`;
			}, [formatOpen, formatId]);
			react.useEffect(() => {
				onBusyChange?.(busy || probeState?.phase === "probing");
			}, [busy, probeState]);
			const routeTrimmed = route.trim();
			const routeInvalid = routeTrimmed.length > 0 && !ROUTE_PATTERN.test(routeTrimmed);
			const routeTaken = routeTrimmed.length > 0 && (taken ?? []).includes(routeTrimmed);
			const normalizedBaseURL = baseURL.trim();
			const baseUrlInvalid = baseURL.length > 0 && !isHttpUrl(normalizedBaseURL);
			const badModelIndex = catalogIssue(models);
			const ready = routeTrimmed.length > 0 && !routeInvalid && !routeTaken && normalizedBaseURL.length > 0 && !baseUrlInvalid && models.length > 0 && badModelIndex === -1;
			const hint = failure !== void 0 || ready || routeTrimmed.length === 0 || routeInvalid || routeTaken || baseUrlInvalid ? void 0 : normalizedBaseURL.length === 0 ? t("needsBaseUrl") : models.length === 0 ? t("needsModels") : badModelIndex !== -1 ? t("invalid") : void 0;
			const activeFormat = PAGE_FORMATS.find((entry) => entry.id === formatId) ?? PAGE_FORMATS[0];
			const probeConnectivity = async () => {
				if (probeState?.phase === "probing") return;
				setProbeState({ phase: "probing" });
				try {
					const answer = await probeEndpoint({
						...editingRoute ? { provider: editingRoute } : {},
						baseURL: normalizedBaseURL,
						api: formatId,
						...keyDraft.trim().length === 0 ? {} : { apiKey: keyDraft.trim() }
					});
					if (!answer.ok) {
						setProbeState({ phase: "fail", message: answer.error });
						return;
					}
					const found = answer.value ?? [];
					setProbeState({ phase: "ok", count: found.length });
					// 目录为空时用发现结果填充(旧页「获取可用模型」的等价物)。
					if (models.length === 0 && found.length > 0) {
						setModels(found.map((model) => ({
							...model,
							id: String(model.id ?? ""),
							name: String(model.name ?? ""),
							contextWindow: Number.isSafeInteger(model.contextWindow) ? model.contextWindow : void 0,
							maxTokens: Number.isSafeInteger(model.maxTokens) ? model.maxTokens : void 0,
							inputModalities: Array.isArray(model.inputModalities) && model.inputModalities.length > 0 ? model.inputModalities.filter((m) => MODALITIES.some((m2) => m2.id === m)) : ["text"]
						})));
					}
				} catch (error) {
					setProbeState({ phase: "fail", message: error?.message ?? String(error) });
				}
			};
			const patchRow = (index, patch) => {
				if (patch.id !== undefined && defaultDraft.rename(index, patch.id)) setConfiguredDefault(patch.id);
				setModels((prev) => prev.map((row, i) => i === index ? { ...row, ...patch } : row));
			};
			const addRow = () => {
				setModels((prev) => [...prev, { id: "", name: "", contextWindow: DEFAULT_CONTEXT_WINDOW, maxTokens: DEFAULT_MAX_TOKENS, inputModalities: ["text", "image"] }]);
				setFreshIndex(models.length);
				window.setTimeout(() => setFreshIndex(null), 500);
			};
			const removeRow = (index) => {
				if (defaultDraft.remove(index)) setConfiguredDefault("");
				rowKeys.current.splice(index,1);
				setModels((prev) => prev.filter((_, i) => i !== index));
				setExpanded((prev) => {
					const nextSet = /* @__PURE__ */ new Set();
					for (const i of prev) if (i < index) nextSet.add(i); else if (i > index) nextSet.add(i - 1);
					return nextSet;
				});
			};
			const toggle = (index) => {
				const willOpen = !expanded.has(index);
				setExpanded((prev) => {
					const next = new Set(prev);
					if (next.has(index)) next.delete(index);
					else next.add(index);
					return next;
				});
				travel.retargetHover(willOpen ? ".llm-mimo-collapsebtn" : ".llm-mimo-mcard", index, 12);
			};
			const create = async () => {
				const issue = controlsError(models, formatId);
				if (issue) { setFormatId(issue.format); setExpanded(prev => new Set([...prev, issue.index])); setControlIssue(issue); return; }
				setControlIssue(null);
				if (!ready || busy || readOnly) return;
				setBusy(true);
				setFailure(void 0);
				try {
					const keyRef = editingRoute && typeof loadCustom === "function" ? loadCustom(editingRoute)?.apiKeyEnv ?? deriveKeyRef(editingRoute) : deriveKeyRef(routeTrimmed);
					const storesKey = keyDraft.trim().length > 0;
					const entry = {
						...(editingRoute ? loadCustom(editingRoute) : {}),
						defaultModelId: configuredDefault.trim() || undefined,
						...displayName.trim().length === 0 ? {} : { displayName: displayName.trim() },
						...storesKey ? { apiKeyEnv: keyRef } : editingRoute && typeof loadCustom === "function" && loadCustom(editingRoute)?.apiKeyEnv ? { apiKeyEnv: loadCustom(editingRoute).apiKeyEnv } : {},
						apiFormat: formatId,
						baseURL: normalizedBaseURL,
						modelsJson: JSON.stringify(models.map((row) => ({
							...row,
							id: row.id.trim(),
							...row.name.trim().length === 0 ? {} : { name: row.name.trim() },
							contextWindow: row.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
							maxTokens: row.maxTokens ?? DEFAULT_MAX_TOKENS,
							inputModalities: [...row.inputModalities]
						})))
					};
					const message = editingRoute
						? await commitCustom(editingRoute, entry, storesKey ? { ref: keyRef, value: keyDraft.trim() } : void 0)
						: await createProvider(routeTrimmed, entry, storesKey ? { ref: keyRef, value: keyDraft.trim() } : void 0);
					if (message !== void 0) {
						setFailure(message);
						return;
					}
					if (editingRoute) {
						setKeyDraft("");
						setNotice({ ok: true, text: t("saved") });
					} else {
						onClose?.(true);
					}
				} catch (error) {
					setFailure(error?.message ?? String(error));
				} finally {
					setBusy(false);
				}
			};
			// 扁平卡片栈:与 ProviderCard 同规则——相邻折叠行 -12px 重叠融合,
			// 任一侧展开则 8px 分离;接缝两侧角归零,外露角 20px。
			const rowOpen = (index) => expanded.has(index);
			const rowMargin = (index) => rowOpen(index) || (index > 0 && rowOpen(index - 1)) ? 8 : -12;
			const lastRowIndex = models.length - 1;
			const stackRadius = (fusedAbove, fusedBelow) => fusedAbove && fusedBelow ? 0 : fusedAbove ? "0 0 20px 20px" : fusedBelow ? "20px 20px 0 0" : 20;
			const rowNodes = models.map((row, index) => react_jsx_runtime.jsx("div", {
				className: "llm-mimo-fillcard llm-mimo-stackitem" + (index === freshIndex ? " fresh" : ""),
				"data-card": index,
				style: { marginTop: rowMargin(index), borderRadius: stackRadius(rowMargin(index) === -12, index < lastRowIndex && rowMargin(index + 1) === -12) },
				children: react_jsx_runtime.jsx(ModelCard, {
					t,
					row,
					index,
					expanded: expanded.has(index),
					fresh: index === freshIndex,
					onToggle: () => toggle(index),
					onPatch: patchRow,
					onRemove: removeRow,
					isDefault: rowKeys.current[index] === defaultDraft.key,
					onDefault: () => { defaultDraft.select(index, row.id); setConfiguredDefault(row.id); },
					apiFormat: formatId,
					issue: controlIssue?.index === index ? controlIssue : null,
					disabled: readOnly || busy
				})
			}, rowKeys.current[index]));
			const stripFused = models.length === 0 || !rowOpen(lastRowIndex);
			const titleCard = react_jsx_runtime.jsxs("div", {
				className: "llm-mimo-fillcard llm-mimo-stackitem",
				style: { marginTop: 8, borderRadius: models.length === 0 || !rowOpen(0) ? "20px 20px 0 0" : 20 },
				children: [
					react_jsx_runtime.jsx("div", { style: { fontWeight: 600, fontSize: 13, color: "var(--dsw-alias-label-primary)" }, children: t("modelsTitle") }),
					react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", children: t("modelsHint") })
				]
			});
			const stripNode = react_jsx_runtime.jsx(AddStrip, {
				t,
				onAdd: addRow,
				fused: stripFused,
				justAdded: freshIndex !== null
			}, "strip");
			const connectionCard = react_jsx_runtime.jsxs("div", {
				className: "llm-mimo-fillcard",
				children: [
					react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-row llm-mimo-idrow",
						onClick: (event) => {
							// 行即名字输入框:点行(含名字输入框本体)聚焦名字输入框;
							// 供应商ID框保留原生编辑。
							if (event.target.closest?.(".llm-mimo-idbox")) return;
							nameInputRef.current?.focus();
						},
						children: [
							react_jsx_runtime.jsx("input", {
								ref: nameInputRef,
								className: "llm-mimo-nameinput",
								"data-frame-extend-left": "4",
								style: { width: 92, flex: "none", padding: "2px 0", cursor: "text" },
								title: `${t("providerName")}（${t("providerNameDefault")}）`,
								placeholder: route.trim().length > 0 ? route.trim() : t("providerName"),
								value: displayName,
								disabled: readOnly,
								onChange: (event) => setDisplayName(event.target.value)
							}),
							react_jsx_runtime.jsx("input", {
								className: "llm-mimo-idbox",
								style: { flex: 1 },
								title: t("providerIdHint"),
								placeholder: t("providerIdRequired"),
								value: route,
								disabled: readOnly || !!editingRoute,
								onChange: (event) => setRoute(event.target.value)
							})
						]
					}),
					react_jsx_runtime.jsxs("div", {
						style: { position: "relative" },
						children: [
							react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-row llm-mimo-baserow",
								title: "点击切换 API 格式",
								onClick: (event) => {
									if (event.target.closest("input, label, button")) return;
									setFormatOpen((open) => !open);
								},
								children: [
									react_jsx_runtime.jsx("span", {
										className: "llm-mimo-label llm-mimo-rollwrap",
										children: react_jsx_runtime.jsxs("span", {
											className: "llm-mimo-rollstack",
											children: [
												react_jsx_runtime.jsx("span", { className: "llm-mimo-rollline", children: t("baseUrl") }),
												react_jsx_runtime.jsx("span", { className: "llm-mimo-rollline", children: activeFormat.name })
											]
										})
									}),
									react_jsx_runtime.jsx("input", {
										ref: baseInputRef,
										className: "llm-mimo-underline",
										style: { flex: 1 },
										placeholder: baseUrlHintFor(t("baseUrlHint"), activeFormat.name),
										value: baseURL,
										disabled: readOnly,
										onChange: (event) => setBaseURL(event.target.value)
									})
								]
							}),
							formatOpen && react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-formatcard",
								ref: formatCardRef,
								style: { position: "absolute", left: -6, right: -6, top: 0, zIndex: 10 },
								children: [
									react_jsx_runtime.jsx("div", { className: "llm-mimo-formathead", children: t("apiFormat") }),
									PAGE_FORMATS.map((entry) => react_jsx_runtime.jsxs("div", {
										className: "llm-mimo-formatline" + (entry.id === formatId ? " active" : ""),
										title: entry.name,
										onClick: () => {
											// 点行任意处(含行内输入框)=选中该格式→收起→聚焦 Base URL 输入框。
											setModels(current => current.map(row => withReasoningFormats(row, formatId)));
											setControlIssue(null);
											setFormatId(entry.id);
											setFormatOpen(false);
											baseInputRef.current?.focus();
										},
										children: [
											react_jsx_runtime.jsx("span", { className: "llm-mimo-formatname", children: entry.name }),
											react_jsx_runtime.jsx("input", {
												className: "llm-mimo-underline llm-mimo-formatinput",
												title: entry.name,
												value: entry.id === formatId ? baseURL : "",
												placeholder: formatExampleFor(entry.id),
												readOnly: true
											})
										]
									}, entry.id))
								]
							})
						]
					}),
					react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-keyzone",
						title: "点击测试连通性",
						onClick: (event) => {
							if (event.target.closest("input, label, button, .llm-mimo-probeerror")) return;
							probeConnectivity();
						},
						children: [
							react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-row",
								children: [
									react_jsx_runtime.jsx("span", { className: "llm-mimo-label", style: { minWidth: 92 }, children: t("apiKey") }),
									react_jsx_runtime.jsx("input", {
										className: "llm-mimo-underline",
										style: { flex: 1 },
										type: "password",
										placeholder: t("apiKeyHint"),
										value: keyDraft,
										disabled: readOnly,
										onChange: (event) => setKeyDraft(event.target.value)
									}),
									react_jsx_runtime.jsx("span", {
										className: "llm-mimo-connect" + (probeState?.phase === "probing" ? " probing" : ""),
										title: "测试连通性",
										onClick: (event) => {
											event.stopPropagation();
											probeConnectivity();
										},
										children: react_jsx_runtime.jsx(_primitives.IconLinkOutlineRegular, { width: 16, height: 16 })
									}),
									react_jsx_runtime.jsx("span", {
										className: "llm-mimo-dot" + (probeState?.phase === "probing" ? " probing" : ""),
										role: "img",
										title: probeState?.phase === "probing" ? "正在测试连通性…" : probeState?.phase === "ok" ? `联通正常（${probeState.count} 个模型）` : probeState?.phase === "fail" ? "联通异常" : "点击测试连通性",
										style: {
											width: 9,
											height: 9,
											borderRadius: "50%",
											background: probeState?.phase === "probing" ? "#f59e0b" : probeState?.phase === "ok" ? "#22c55e" : probeState?.phase === "fail" ? "#ef4444" : "#e5e7eb",
											display: "inline-block",
											flexShrink: 0
										}
									})
								]
							}),
							probeState?.phase === "fail" && react_jsx_runtime.jsx("div", {
								className: "llm-mimo-probeclip",
								children: react_jsx_runtime.jsx("div", {
									className: "llm-mimo-probeerror",
									children: probeState.message
								})
							})
						]
					})
				]
			});
			return react_jsx_runtime.jsxs("div", {
				ref: bodyRef,
				className: editingRoute ? "llm-mimo-edit" : "llm-mimo-page",
				style: { display: "grid", gap: 0, padding: "4px 0", position: "relative" },
				onMouseDownCapture: (event) => {
					travel.onMouseDownCapture(event);
					if (formatOpen && !event.target.closest?.(".llm-mimo-formatcard, .llm-mimo-baserow")) setFormatOpen(false);
				},
				onFocusCapture: travel.onFocusCapture,
				onMouseOverCapture: travel.onMouseOverCapture,
				onMouseLeave: travel.onMouseLeave,
				children: [
					react_jsx_runtime.jsx("style", { children: CARD_STYLES }),
					connectionCard,
					titleCard,
					...rowNodes,
					stripNode,
					routeInvalid || routeTaken || baseUrlInvalid ? react_jsx_runtime.jsx("div", {
						className: "llm-mimo-hint",
						style: { marginTop: 8, color: "#ef4444" },
						children: routeInvalid ? t("routeInvalid") : routeTaken ? t("routeTaken") : t("baseUrlInvalid")
					}) : null,
					failure !== void 0 && react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", style: { marginTop: 8, color: "#ef4444" }, children: failure }),
					notice !== null && react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", style: { marginTop: 8, color: notice.ok ? "#8fdca6" : "#ef4444" }, children: notice.text }),
					hint !== void 0 && react_jsx_runtime.jsx("div", { className: "llm-mimo-hint", style: { marginTop: 8 }, children: hint }),
					react_jsx_runtime.jsxs("div", {
						className: "llm-mimo-foot",
						style: { marginTop: 8 },
						children: [
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: "llm-mimo-ghost",
								disabled: busy,
								onClick: () => {
									if (editingRoute) {
										loadFromEntry();
										setFailure(void 0);
										setNotice(null);
									} else {
										onClose?.(false);
									}
								},
								children: t("cancel")
							}),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: "llm-mimo-primary",
								disabled: busy || readOnly || !ready,
								onClick: create,
								children: busy ? t("creating") : editingRoute ? t("save") : t("create")
							})
						]
					}),
					...travel.overlays
				]
			});
		}
		/** 行上下文的抽屉接管:挂载=展开并藏掉宿主通用编辑器(空表单),卸载=收起;
		 *  行按钮文案在 编辑/收起 间切换(改首文本节点,不动 React 文本)。 */
		function useEditorDrawer(drawerRef, clipRef, t, provider) {
			const [open, setOpen] = react.useState(false);
			react.useEffect(() => {
				const drawer = drawerRef.current;
				const seat = drawer?.closest("[data-slot]");
				const host = seat?.parentElement ?? drawer?.parentElement;
				if (!drawer || !host) {
					setOpen(true);
					return;
				}
				const findEditor = () => Array.from(host.children).find((child) => child !== seat && typeof child.className === "string" && child.className.includes("editor"));
				if (host.querySelector(':scope > div[class*="rowHead"]')) host.style.rowGap = "0px";
				const setToggleLabel = (expanded) => {
					const button = host.querySelector(':scope > div[class*="rowHead"] button');
					if (!button) return;
					const label = expanded ? t("collapse") : t("edit");
					if (button.firstChild?.nodeType === 3) button.firstChild.nodeValue = label;
					else button.textContent = label;
					button.setAttribute("aria-label", `${label} ${provider?.displayName ?? ""} (${provider?.provider ?? ""})`);
				};
				const sync = () => {
					const editor = findEditor();
					if (editor) editor.style.display = "none";
					setOpen(editor !== void 0);
					setToggleLabel(editor !== void 0);
				};
				sync();
				const observer = new MutationObserver(sync);
				observer.observe(host, { childList: true });
				return () => {
					observer.disconnect();
					const editor = findEditor();
					if (editor) editor.style.display = "";
					if (host) host.style.rowGap = "";
					setToggleLabel(false);
				};
			}, []);
			react.useEffect(() => {
				if (clipRef.current) clipRef.current.inert = !open;
			}, [open]);
			return { open, setOpen };
		}
		/**
		 * 自定义供应商的行内编辑器:与创建页同一副表单,0.2.0 起配色与创建页
		 * 同步(llm-mimo-edit 同套提亮覆盖——宿主行卡底色已变,深 fillcard
		 * 不再成立);外壳接管宿主「编辑」抽屉(同 ProviderCard)。
		 */
		function CustomProviderCard(props) {
			const drawerRef = react.useRef(null);
			const clipRef = react.useRef(null);
			const { open } = useEditorDrawer(drawerRef, clipRef, props.t, props.provider);
			return react_jsx_runtime.jsxs("div", {
				ref: drawerRef,
				children: [
					react_jsx_runtime.jsx("style", { children: CARD_STYLES }),
					react_jsx_runtime.jsx("div", {
						className: "llm-mimo-drawer" + (open ? " open" : ""),
						children: react_jsx_runtime.jsx("div", {
							className: "llm-mimo-drawerclip",
							ref: clipRef,
							children: react_jsx_runtime.jsxs("div", {
								className: "llm-mimo-drawerbody",
								children: [
									react_jsx_runtime.jsx("div", {
										className: "llm-mimo-cardhead",
										children: [
											react_jsx_runtime.jsx("span", { className: "llm-mimo-cardtitle", children: props.provider?.displayName ?? props.provider?.provider ?? "" }),
											react_jsx_runtime.jsx("span", { className: "llm-mimo-cardroute", children: props.provider?.provider ?? "" })
										]
									}),
									react_jsx_runtime.jsx(CustomApiPage, { ...props, editingRoute: props.provider?.provider })
								]
							})
						})
					})
				]
			});
		}
		function CustomProviderCardDiag(props) {
			try {
				return CustomProviderCard(props);
			} catch (error) {
				return react_jsx_runtime.jsx("div", { style: { color: "#ef4444", padding: 8, fontSize: 12, whiteSpace: "pre-wrap" }, children: "CPC-ERR: " + String(error?.stack ?? error).slice(0, 500) });
			}
		}
		function CustomApiPageDiag(props) {
			try {
				return CustomApiPage(props);
			} catch (error) {
				return react_jsx_runtime.jsx("div", { style: { color: "#ef4444", padding: 8, fontSize: 12, whiteSpace: "pre-wrap" }, children: "CAP-ERR: " + String(error?.stack ?? error).slice(0, 500) });
			}
		}
		//#endregion
		//#region 轨迹面板注入（dispatch 视图记录的展示缝）
		// 轨迹「初始系统提示词」= 装配瀑布最终产物：预设 persona（会话作用域=瀑布下游）
		// 会覆盖 promptbook 的替换结果，而本包 promptView 的改写又发生在轨迹记录之后
		// ——轨迹没有任何一栏显示"模型实际收到的 system"。本注入把 host 侧
		// dispatchViewJson 环形缓冲（原始与被替换的都有记录）渲染进系统提示词面板。
		// 宿主无扩展槽：面板是 React 硬渲染，MutationObserver + 内容指纹防抖重注入
		// （指纹相同不写 DOM，防止 observer 自反馈循环）。
		const DISPATCH_VIEW_BLOCK_ID = "llm-mimo-dispatch-view-block";
		function llmMimoTrajectoryEffect(ctx) {
			const scope = ctx.configForms.get(ENTRY_ID);
			const settingsFace = ctx.remote.settings;
			// dispatch 记录的实时性：host 直接赋值 volatile 字段不广播（设置控制器只在
			// settings.mutate 路径上推快照）——快照里的记录可能陈旧。面板可见期间的
			// sync 附带一次节流 describe() 拉新（单飞行 + 最小间隔），流式渲染的 DOM
			// 变更天然驱动它逐轮刷新。
			let liveRecords = null;
			let describeInflight = false;
			let lastDescribeAt = 0;
			const parseRecords = (raw) => {
				try {
					const parsed = JSON.parse(typeof raw === "string" ? raw : "[]");
					return Array.isArray(parsed) ? parsed : [];
				} catch {
					return [];
				}
			};
			const readRecords = () => {
				if (liveRecords) return liveRecords;
				const value = scope.getSnapshot()?.value;
				return parseRecords(value?.dispatchViewJson);
			};
			const pullFresh = async () => {
				if (describeInflight || Date.now() - lastDescribeAt < 1000) return;
				describeInflight = true;
				lastDescribeAt = Date.now();
				try {
					// typert 客户端把返回包成 {ok, value}——真正的 DescribeValue 在 .value 里
					const described = await settingsFace.describe();
					const namespaces = described?.value?.namespaces ?? described?.namespaces ?? [];
					const view = namespaces.find((n) => n.ns === ENTRY_ID);
					if (view) {
						liveRecords = parseRecords(view.value?.dispatchViewJson);
						queueMicrotask(() => sync());
					}
				} catch {
					// describe 失败退回快照数据
				} finally {
					describeInflight = false;
				}
			};
			const formatTime = (iso) => typeof iso === "string" && iso.length >= 19 ? iso.slice(11, 19) : String(iso ?? "");
			const buildBlock = (fingerprint) => {
				const records = readRecords();
				const root = document.createElement("div");
				root.id = DISPATCH_VIEW_BLOCK_ID;
				root.dataset.fingerprint = fingerprint;
				root.style.cssText = "margin:0 0 12px;display:grid;gap:8px";
				const head = document.createElement("div");
				head.style.cssText = "font-size:12px;color:var(--dsw-alias-label-tertiary)";
				head.textContent = records.length === 0
					? "llm-mimo：暂无 dispatch 记录（非 llm-mimo 托管的模型不经过本适配器）"
					: `实际请求提示词（llm-mimo dispatch 记录 · 新者在前 · 共 ${records.length} 条 · 跨会话混记）`;
				root.append(head);
				for (const record of records) {
					const card = document.createElement("div");
					card.style.cssText = "border:1px solid var(--dsw-alias-border-l2);border-radius:10px;corner-shape:superellipse(1.43);background:var(--dsw-alias-bg-layer-1);padding:8px 10px;display:grid;gap:6px";
					const meta = document.createElement("div");
					meta.style.cssText = "font-size:12px;color:var(--dsw-alias-label-secondary);display:flex;gap:10px;flex-wrap:wrap;align-items:baseline";
					const model = document.createElement("span");
					model.style.cssText = "font-family:var(--dsw-font-mono,ui-monospace,monospace);color:var(--dsw-alias-label-primary)";
					model.textContent = String(record.model ?? "?");
					const badge = document.createElement("span");
					badge.textContent = record.tampered ? "已替换（promptbook）" : "原始（无替换源）";
					const time = document.createElement("span");
					time.style.cssText = "color:var(--dsw-alias-label-tertiary)";
					time.textContent = formatTime(record.time);
					meta.append(model, badge, time);
					const body = document.createElement("pre");
					body.style.cssText = "margin:0;white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);font-family:inherit";
					body.textContent = String(record.system ?? "");
					card.append(meta, body);
					root.append(card);
				}
				return root;
			};
			let observing = false;
			let observer = null;
			// 指纹只取头部廉价字段（长度/首末时间）——流式期间 body 变更频繁，
			// 全量 JSON 序列化会跟着每帧跑
			const fingerprintOf = (records) => `${records.length}:${records[0]?.time ?? ""}:${records[0]?.system?.length ?? 0}:${records[records.length - 1]?.time ?? ""}`;
			const sync = () => {
				const panel = document.getElementById("trajectory-detail-panel");
				if (!panel) return;
				const existing = document.getElementById(DISPATCH_VIEW_BLOCK_ID);
				if (panel.getAttribute("aria-labelledby") !== "trajectory-detail-system-prompt") {
					if (existing) existing.remove();
					return;
				}
				// 面板可见：顺手拉一次新记录（节流）；流式变更会反复触发本函数
				void pullFresh();
				const records = readRecords();
				const fingerprint = fingerprintOf(records);
				if (existing && existing.dataset.fingerprint === fingerprint) return;
				const fresh = buildBlock(fingerprint);
				if (existing) existing.replaceWith(fresh);
				else panel.prepend(fresh);
			};
			ctx.effect(() => {
				// 盯 body 而非面板本身：轨迹开合/切 tab 时 React 会把面板重挂载成新元素，
				// 面板级 observer 随旧节点失效（本 bug 的第一版实证）；body 级观察天然覆盖
				observer = new MutationObserver(() => {
					// React 重渲染一轮会多次变动——微任务去抖
					queueMicrotask(() => sync());
				});
				observer.observe(document.body, { childList: true, subtree: true });
				observing = true;
				sync();
				const offRecords = scope.subscribe?.(() => queueMicrotask(() => sync()));
				return () => {
					observer?.disconnect();
					observing = false;
					offRecords?.();
					document.getElementById(DISPATCH_VIEW_BLOCK_ID)?.remove();
				};
			}, "llm-mimo: trajectory panel");
		}
		//#endregion
		//#region apply
		const inject = ["slots", "locale", "configForms", "remote", "remote.llm", "remote.settings", "remote.credentials"];
		function apply(ctx) {
			installModelControls(ctx);
			try {
				const t = ctx.locale.bind(NS);
				ctx.effect(() => ctx.locale.register(NS, { zh, en }), "llm-mimo: dictionaries");
				llmMimoTrajectoryEffect(ctx);
				const scope = ctx.configForms.get(ENTRY_ID);
				const settingsFace = ctx.remote.settings;
				let lastLanded = null;
				const rawMutate = scope.mutate.bind(scope);
				scope.mutate = async (ops, expectedRevision) => {
					try {
						const landed = await rawMutate(ops, expectedRevision);
						lastLanded = landed === true;
						if (landed) return true;
						console.warn("llm-mimo: settings.mutate not-landed (expectedRevision=" + String(expectedRevision) + "); retrying directly without any revision fence", ops);
						const response = await settingsFace.mutate(ENTRY_ID, structuredClone(ops), void 0);
						const ok = response?.ok === true;
						lastLanded = ok;
						console.error("llm-mimo: direct retry (no fence) →", ok ? "LANDED" : "STILL refused: " + (response?.error?.message ?? JSON.stringify(response?.error ?? response)), "| code:", response?.error?.code ?? "?");
						return ok;
					} catch (error) {
						console.error("llm-mimo: settings.mutate REJECTED:", error?.message ?? String(error), { ops, expectedRevision, code: error?.code });
						throw error;
					}
				};
				const form = new _primitives.SettingsFormModel(scope, [
					{ field: "baseURL", format: (value) => typeof value === "string" ? value : "", parse: (text) => text.trim().length === 0 ? { kind: "clear" } : { value: text } },
					{ field: "apiFormat", format: (value) => typeof value === "string" ? value : "chat", parse: (text) => ["anthropic", "chat", "responses"].includes(text) ? { value: text } : void 0 },
					{ field: "baseURLsJson", format: (value) => typeof value === "string" ? value : "{}", parse: (text) => text.trim().length === 0 ? { kind: "clear" } : { value: text } },
					{ field: "defaultModelId", format: value => typeof value === "string" ? value : "", parse: text => text.trim() ? { value: text.trim() } : { kind: "clear" } },
					{ field: "modelsJson", format: (value) => typeof value === "string" ? value : JSON.stringify(Array.isArray(value) ? value : []), parse: (text) => {
						const trimmed = text.trim();
						if (trimmed === "") return { kind: "clear" };
						try {
							const parsed = JSON.parse(trimmed);
							if (!Array.isArray(parsed)) return void 0;
							return { value: trimmed };
						} catch (_notJson) {
							return void 0;
						}
					} },
					{ field: "apiKeyEnv", format: (value) => typeof value === "string" ? value : "MIMO_NORMAL_API_KEY", parse: (text) => text.trim().length === 0 ? { kind: "clear" } : { value: text.trim() } },
					{ field: "customProviders", format: (value) => JSON.stringify(value ?? {}), parse: (text) => { try { return { value: JSON.parse(text) }; } catch (_notJson) { return void 0; } } },
				], [
					{ field: "apiKey", write: async (value) => {
						const refName = form.field("apiKeyEnv")?.text ?? "MIMO_NORMAL_API_KEY";
						const response = await ctx.remote.credentials.set(credentialRefText(refName), value);
						if (response?.ok === false) throw new Error(response?.error?.message ?? "credential write refused");
					} }
				]);
				const store = form.bind(() => ({
					baseURL: form.field("baseURL"),
					apiFormat: form.field("apiFormat"),
					baseURLsJson: form.field("baseURLsJson"),
					modelsJson: form.field("modelsJson"),
					defaultModelId: form.field("defaultModelId"),
					apiKeyEnv: form.field("apiKeyEnv"),
					writable: true
				}));
				// 自定义供应商条目读写:落点是 llm-mimo 自己的 customProviders(dict 字段=单条 set/unset,宿主删除按钮语义正确)
				// (彻底退出 pi-ai:创建与行内编辑都走这里,路由由 loader/volatile-update
				// 即时挂载)。密钥仍走凭据服务,名 = 条目 apiKeyEnv(缺省派生 <ROUTE>_API_KEY)。
				const loadCustomEntry = (route) => {
					try {
						const parsed = JSON.parse(form.field("customProviders")?.text ?? "{}");
						const entry = parsed?.[route];
						return typeof entry === "object" && entry !== null ? entry : null;
					} catch (_halfWritten) { return null; }
				};
				const writeCustomEntry = async (route, entry, key) => {
					const ok = await scope.mutate([{ op: "set", path: ["customProviders", route], value: entry }]);
					if (ok !== true) return "settings write refused";
					if (key) {
						const stored = await ctx.remote.credentials.set(key.ref, key.value);
						if (stored?.ok !== true) return stored?.error?.message ?? "credential write refused";
					}
					return void 0;
				};
				const controller = {
					dispose: () => form.dispose(),
					inject: () => ({
						hooks: { card: store },
						...form.actions(),
						read: (field) => form.field(field),
						readLanded: () => lastLanded,
						// 连通性探针:服务端 registerModelDiscovery 的处理器既测草稿
						// 密钥(apiKey 直传)也能解析已存密钥(服务端 credentials)。
						probe: (request) => ctx.remote.llm.discoverModels(ENTRY_ID, request),
						// 自定义供应商条目读写:行内编辑器走 provider-card 面(即本面),
						// 必须在此提供;创建页的 custom-api-card 面另有同名函数。
						loadCustom: loadCustomEntry,
						commitCustom: (route, entry, key) => writeCustomEntry(route, entry, key),
						createProvider: (route, entry, key) => writeCustomEntry(route, entry, key),
						probeEndpoint: async (request) => {
							const response = await ctx.remote.llm.discoverModels(ENTRY_ID, request);
							return response?.ok ? { ok: true, value: response.value } : { ok: false, error: response?.error?.message ?? "discovery refused" };
						}
					})
				};
				function credentialRefText(name) {
					return name;
				}
				ctx.effect(() => () => controller.dispose(), "llm-mimo: form subscription");
				// 直接在 apply 期注册,不走 whileServed:cf(configForms 子系统)在 ns 变为
				// served 时会抢注同 key 的通用卡,双方赛跑谁先谁赢、输家报错被宿主吞掉
				// ("registered by cf")——apply 期注册保证必赢。本插件 ns 随适配器常驻
				// served,whileServed 的自动 Dispose 语义在此没有价值。
				// 宿主 SegmentedControl 的选中指示条按等分轨道算术定位,标签不等宽时
			// 文字会撑出指示框(实测 157/157/200 轨道 vs 172px 指示条);而强制等宽
			// (width:max-content)又会让整条溢出容器。运行的 UI 是打包产物,磁盘 lib
			// 补丁不生效——改为从这里量测真实页签几何落到指示条行内样式上
			// (left/width=选中页签,滑移过渡保留)。全 app SegmentedControl 受益。
			const syncSegmentPills = () => {
				for (const list of document.querySelectorAll('div[role="tablist"]')) {
					const pill = list.firstElementChild;
					if (!pill || pill.getAttribute("aria-hidden") !== "true") continue;
					const sel = list.querySelector('[role="tab"][aria-selected="true"]');
					if (!sel) continue;
					const left = `${sel.offsetLeft}px`;
					const width = `${sel.offsetWidth}px`;
					if (pill.style.left === left && pill.style.width === width && pill.style.transform === "none") continue;
					if (!pill.dataset.pillMeasured) {
						pill.dataset.pillMeasured = "1";
						pill.style.transition = "none";
						pill.style.left = left;
						pill.style.width = width;
						pill.style.transform = "none";
						void pill.offsetWidth;
						pill.style.transition = "left 160ms ease, width 160ms ease";
					} else {
						pill.style.left = left;
						pill.style.width = width;
						pill.style.transform = "none";
					}
				}
			};
			syncSegmentPills();
			let pillRaf = 0;
			const schedulePillSync = () => {
				if (pillRaf) return;
				pillRaf = requestAnimationFrame(() => {
					pillRaf = 0;
					syncSegmentPills();
				});
			};
			ctx.effect(() => {
				const observer = new MutationObserver(schedulePillSync);
				observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected", "style", "class"] });
				window.addEventListener("resize", schedulePillSync);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", schedulePillSync);
				};
			}, "llm-mimo: segment pill sync");
			window.__mmStage = "before-inject";

				window.__slotsProbe = ctx.slots;
				try {
					ctx.slots.inject("settings.models.provider-card", () => ctx.slots.register({
						name: "settings.models.provider-card",
						key: ENTRY_ID,
						priority: -10,
						locale: NS,
						inject: () => controller.inject()
					}, ProviderCardDiag), "llm-mimo: provider card");
					// 自定义模型API(llm-mimo) 页:创建语义与旧自定义页一致——
					// 写 llm-pi-ai 的 providers.<route> + 派生凭据 <ROUTE>_API_KEY。
					ctx.slots.inject("settings.models.custom-api-card", () => ctx.slots.register({
						name: "settings.models.custom-api-card",
						key: "llm-mimo-custom",
						priority: -10,
						locale: NS,
						inject: () => ({
							createProvider: (route, entry, key) => writeCustomEntry(route, entry, key),
							commitCustom: (route, entry, key) => writeCustomEntry(route, entry, key),
							loadCustom: loadCustomEntry,
							probeEndpoint: async (request) => {
								const response = await ctx.remote.llm.discoverModels("llm-mimo", request);
								return response?.ok ? { ok: true, value: response.value } : { ok: false, error: response?.error?.message ?? "discovery refused" };
							}
						})
					}, CustomApiPageDiag), "llm-mimo: custom api page");
					window.__mmStage = "injected@apply";
				} catch (error) {
					window.__mmStage = "inject-error@apply: " + String(error?.message ?? error).slice(0, 120);
				}
			} catch (error) {
				console.error("llm-mimo client apply failed:", error);
				const diag = document.getElementById("llm-mimo-apply-fail") ?? document.body.appendChild(Object.assign(document.createElement("div"), { id: "llm-mimo-apply-fail" }));
				diag.textContent = `LLM-MIMO-APPLY-FAIL: ${error?.stack ?? error?.message ?? String(error)}`;
				throw error;
			}
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
