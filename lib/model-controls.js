// Shared, pure configuration/selection rules. Also inlined into the browser bundle.
export const OFF_EFFORT = 'mimo:off';
export const OMIT_EFFORT = 'mimo:default';
// UI-only reset choice. It is translated to the native adapter's advertised default.
export const NATIVE_DEFAULT_EFFORT = 'mimo:native-default';
export const API_FORMATS = ['chat', 'anthropic', 'responses'];
export const API_FORMAT_NAMES = { chat: 'Chat Completions', anthropic: 'Anthropic Messages', responses: 'Responses' };
// Stock MiMo catalog only. Persisted/user-edited catalogs are never refilled.
// These IDs are minted once, rather than from values or during each read.
const mimoPresetIds = {
  'mimo-v2.6-flash': { chat: '4bc9d8e2-c1e5-413c-9237-38ed7be929de', anthropic: '3e344961-a7c2-406f-b2fd-724ad9ca3a06', responses: 'b1399578-1792-4cac-8673-b67ff2460ef6', responsesLow: 'c4dba4d6-668e-4504-b5cf-44ec9db5f46a' },
  'mimo-v2.6-pro': { chat: '9d2c6fef-0961-4420-963f-fcc480d6dfc8', anthropic: '911694cd-515d-49f8-a42f-8d110b4df6ba', responses: '74dc614d-7163-4f74-bbde-92feac56a816', responsesLow: '5c4796ef-adec-4079-b2f9-cd2c788dae28' },
  'mimo-v2.6-pro-ultraspeed': { chat: '00610cdd-c513-4742-a28a-1d6b502e3c2d', anthropic: 'a8187647-06b9-4e72-96c4-8b1649b8835e', responses: '4e0c4978-6af9-444a-9965-7668e9e53bee', responsesLow: '57af5107-119b-485b-b7ec-7b95400cae25' },
};
const forbiddenParts = new Set(['__proto__', 'prototype', 'constructor']);
const reservedRoots = new Set(['model', 'messages', 'input', 'system', 'tools', 'stream', 'max_tokens', 'max_completion_tokens', 'max_output_tokens', 'temperature', 'stop', 'stop_sequences']);

export function controlsOf(raw, format = 'chat') {
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
export function mimoReasoningPresets(modelId) {
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
export function withReasoningFormats(model, legacyFormat = 'chat') {
  if (model.reasoningControls === undefined) return model;
  const { reasoningControls, ...rest } = model;
  return { ...rest, reasoningControlsByFormat: { [legacyFormat]: reasoningControls, ...model.reasoningControlsByFormat } };
}

export function controlsForFormat(model, format = 'chat') {
  return controlsOf(withReasoningFormats(model ?? {}, format).reasoningControlsByFormat?.[format], format);
}

export function controlsPatch(model, format, controls) {
  const migrated = withReasoningFormats(model, format);
  return { reasoningControls: undefined, reasoningControlsByFormat: { ...migrated.reasoningControlsByFormat, [format]: controls } };
}

export function modelControlsIssue(model, activeFormat = 'chat') {
  const byFormat = withReasoningFormats(model, activeFormat).reasoningControlsByFormat;
  for (const format of [activeFormat, ...API_FORMATS.filter(id => id !== activeFormat)]) {
    if (byFormat?.[format] === undefined) continue;
    const issue = controlsIssue(byFormat[format], format);
    if (issue) return { ...issue, format };
  }
}

// Display native capabilities without becoming their configuration or request mapper.
// Unsupported off is absent; the reset stop stays separate from the actual effort IDs.
export function nativeControls(model) {
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

export function parameterParts(path) {
  const parts = String(path).trim().split('.');
  if (parts.some(part => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part) || forbiddenParts.has(part)) || reservedRoots.has(parts[0])) throw new Error('请填写思考参数字段路径（不能覆盖模型、消息、工具或输出上限）');
  return parts;
}

export function parameterValue(text, type = 'auto') {
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

export function controlsIssue(raw, format = 'chat') {
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

export function reasoningInfo(raw) {
  const controls = controlsOf(raw);
  return { efforts: controls.stops.map(stop => ({ id: stop.id, name: stop.name || stop.value })), defaultEffort: OMIT_EFFORT };
}

export function reasoningParameters(raw, effort) {
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

export function defaultModelId(models, configured) {
  return models.find(model => model.id.trim() === String(configured ?? "").trim())?.id ?? models[0]?.id;
}

export function routeKey(provider, model) { return JSON.stringify([provider, model]); }

// A target model owns its effort vocabulary/default. Never carry an effort across routes.
export function selectionFor(model, current, staged) {
  const key = routeKey(model.provider, model.id);
  const requested = staged?.get(key) ?? (current?.provider === model.provider && current.model === model.id ? current.reasoningEffort : undefined);
  const ids = model.reasoning?.efforts?.map(item => item.id) ?? [];
  const effort = requested === NATIVE_DEFAULT_EFFORT ? (ids.includes(model.reasoning?.defaultEffort) ? model.reasoning.defaultEffort : undefined) : ids.includes(requested) ? requested : ids.includes(model.reasoning?.defaultEffort) ? model.reasoning.defaultEffort : undefined;
  return { provider: model.provider, model: model.id, ...(effort === undefined ? {} : { reasoningEffort: effort }) };
}
