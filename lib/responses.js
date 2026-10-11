// OpenAI Responses wire protocol. No conversation selection or provider guessing here.
import { LlmError, ToolCallId } from '@deepseek-ai/dsh-llm';
import { createHash } from 'node:crypto';

const fail = (message, code = 'MALFORMED_RESPONSE') => { throw new LlmError(`llm-mimo Responses: ${message}`, code); };
const text = value => typeof value === 'string' ? value : fail('expected a string');
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : fail('expected an object');

function itemText(item) {
  if (item.type === 'function_call') return text(item.arguments);
  if (item.content !== undefined && !Array.isArray(item.content) || item.type === 'reasoning' && item.summary !== undefined && !Array.isArray(item.summary)) return fail('invalid output content');
  const parts = item.type === 'reasoning' ? [...item.content ?? [], ...item.summary ?? []] : item.content ?? [];
  return parts.map(part => {
    if (['output_text', 'reasoning_text', 'summary_text'].includes(part.type)) return text(part.text);
    if (part.type === 'refusal') return text(part.refusal);
    return fail(`unsupported output part ${String(part.type)}`, 'UNSUPPORTED_CONTENT');
  }).join('');
}

// Only reuse native item identity on the same model/route and format. The native
// item belongs to one emitted block, so dropping a block also drops its replay.
function replayItem(message, index, options) {
  const source = message.source;
  const replay = source?.kind === 'model' ? source.replayState : undefined;
  const response = replay?.response;
  if (response?.kind !== 'mimo-responses' || response.version !== 1 || response.model !== options.model || response.provider !== options.provider) return;
  const block = message.content[index];
  const saved = replay.blocks?.length === message.content.length ? replay.blocks[index] : undefined;
  if (saved?.type !== block.type || !saved.item || typeof saved.item.id !== 'string') return;
  const item = saved.item;
  if (block.type === 'text' && item.type === 'message' || block.type === 'reasoning' && item.type === 'reasoning') return item;
  if (block.type === 'tool-call' && item.type === 'function_call' && item.call_id === block.id && item.name === block.name) return item;
}

export function serializeResponses(options, connection, media, reasoning) {
  const input = [];
  const parts = blocks => blocks.flatMap(block => {
    if (block.type === 'text') return block.text ? [{ type: 'input_text', text: block.text }] : [];
    if (block.type === 'reasoning' || block.type === 'tool-call') return [];
    if (block.type !== 'image' && block.type !== 'file') return fail(`unsupported input ${block.type}`, 'UNSUPPORTED_CONTENT');
    const stored = media?.get(block.attachment.attachmentId);
    if (!stored) return fail('request attachment is missing', 'INVALID_REQUEST');
    const data = `data:${stored.mediaType};base64,${Buffer.from(stored.data).toString('base64')}`;
    if (block.type === 'image') return [{ type: 'input_image', image_url: data }];
    if (stored.mediaType === 'application/pdf') return [{ type: 'input_file', filename: block.attachment.name, file_data: data }];
    if (stored.mediaType.startsWith('audio/')) {
      return [{ type: 'input_audio', audio_url: data }];
    }
    if (stored.mediaType.startsWith('video/')) {
      const model = connection.models.find(item => item.id === options.model);
      return [{ type: 'input_video', video_url: data,
        ...(model?.videoFps === undefined ? {} : { fps: model.videoFps }),
        ...(model?.videoMediaResolution === undefined ? {} : { media_resolution: model.videoMediaResolution }),
      }];
    }
    return fail(`unsupported file ${stored.mediaType}`, 'UNSUPPORTED_CONTENT');
  });
  if (options.system) input.push({ role: 'system', content: [{ type: 'input_text', text: options.system }] });
  const pending = new Set();
  const seenCalls = new Set();
  for (const [messageIndex, message] of options.messages.entries()) {
    if (message.role === 'assistant') {
      for (const [index, block] of message.content.entries()) {
        const native = replayItem(message, index, options);
        if (block.type === 'text') {
          if (block.text) input.push({ type: 'message', role: 'assistant',
            ...(native?.id ? { id: native.id } : {}), content: [{ type: 'output_text', text: block.text, annotations: [] }] });
        } else if (block.type === 'reasoning') {
          // Preserve MiMo's complete reasoning content (and any native encrypted
          // state). If assembly edited text, discard stale native state instead.
          if (native && itemText(native) === block.text) input.push(structuredClone(native));
          else if (block.text) input.push({ type: 'reasoning',
            id: `rs_${createHash('sha256').update(JSON.stringify([options.provider, options.model, messageIndex, index, block.text])).digest('hex').slice(0, 32)}`,
            summary: [], content: [{ type: 'reasoning_text', text: block.text }] });
        } else if (block.type === 'tool-call') {
          if (!block.id || seenCalls.has(block.id)) return fail('empty or duplicate tool call id', 'INVALID_REQUEST');
          seenCalls.add(block.id); pending.add(block.id);
          input.push({ type: 'function_call', ...(native?.id ? { id: native.id } : {}), call_id: block.id, name: block.name, arguments: block.arguments });
        } else return fail(`unsupported assistant content ${block.type}`, 'UNSUPPORTED_CONTENT');
      }
    } else if (message.role === 'tool') {
      if (!pending.delete(message.toolCallId)) return fail('tool result has no matching call', 'INVALID_REQUEST');
      const content = parts(message.content);
      input.push({ type: 'function_call_output', call_id: message.toolCallId,
        output: content.every(part => part.type === 'input_text') ? content.map(part => part.text).join('') : content });
    } else {
      if (pending.size) return fail('tool calls need results before the next input', 'INVALID_REQUEST');
      if (!['user', 'system', 'developer'].includes(message.role)) return fail(`unsupported role ${message.role}`, 'UNSUPPORTED_CONTENT');
      const content = parts(message.content);
      if (content.length) input.push({ role: message.role, content });
    }
  }
  if (pending.size) return fail('history ends with unresolved tool calls', 'INVALID_REQUEST');
  // Responses has no stop parameter. Refuse rather than silently ignore a
  // caller's requested stop sequences.
  if (options.stop?.length) return fail('stop sequences are not supported', 'INVALID_REQUEST');
  return { model: options.model, stream: true, input, max_output_tokens: options.maxTokens ?? connection.maxTokens,
    ...reasoning,
    ...(options.temperature === undefined && connection.temperature === undefined ? {} : { temperature: options.temperature ?? connection.temperature }),
    ...(options.tools === undefined ? {} : { tools: options.tools.map(tool => ({ type: 'function', name: tool.name, description: tool.description, parameters: tool.parameters })) }),
  };
}

function responseUsage(raw) {
  const usage = raw ?? {};
  const count = value => value === undefined ? 0 : Number.isSafeInteger(value) && value >= 0 ? value : fail('invalid token usage');
  const input = count(usage.input_tokens);
  const cached = count(usage.input_tokens_details?.cached_tokens);
  if (cached > input) return fail('cached tokens exceed input tokens');
  const output = count(usage.output_tokens);
  return { inputTokens: input - cached, outputTokens: output, totalTokens: input + output,
    ...(cached ? { cacheReadTokens: cached } : {}),
    ...(usage.output_tokens_details?.reasoning_tokens === undefined ? {} : { reasoningTokens: count(usage.output_tokens_details.reasoning_tokens) }),
  };
}

// One provider output item maps to one harness block. Text parts in that item
// share the block, keeping native item replay aligned with durable block drops.
export async function* translateResponses(events, model, provider, providerError) {
  const entries = new Map();
  const ids = new Map();
  const callIds = new Set();
  const start = function* (index, raw) {
    if (!Number.isSafeInteger(index) || index < 0 || entries.has(index)) return fail('invalid or duplicate output index');
    const item = object(raw);
    if (typeof item.id !== 'string' || !item.id || ids.has(item.id)) return fail('empty or duplicate output item id');
    const type = item.type === 'message' ? 'text' : item.type === 'reasoning' ? 'reasoning' : item.type === 'function_call' ? 'tool-call' : fail(`unsupported output item ${String(item.type)}`, 'UNSUPPORTED_CONTENT');
    if (type === 'text' && item.role !== 'assistant') return fail('output message must be assistant');
    const content = type === 'tool-call'
      ? { type, id: ToolCallId(text(item.call_id)), name: text(item.name), arguments: '' }
      : { type, text: '' };
    if (type === 'tool-call') {
      if (!content.id || !content.name || callIds.has(content.id)) return fail('empty or duplicate tool identity');
      callIds.add(content.id);
    }
    const entry = { index: entries.size, outputIndex: index, item, content, closed: false };
    entries.set(index, entry); ids.set(item.id, entry);
    yield { type: 'block-start', index: entry.index, blockType: type };
    if (type === 'tool-call') yield { type: 'tool-call-delta', index: entry.index, id: content.id, name: content.name, argumentsDelta: '' };
    yield* delta(entry, itemText(item));
  };
  const delta = function* (entry, value) {
    if (entry.closed) return fail('delta after output item settled');
    if (!value) return;
    if (entry.content.type === 'tool-call') {
      entry.content.arguments += value;
      yield { type: 'tool-call-delta', index: entry.index, id: entry.content.id, argumentsDelta: value };
    } else {
      entry.content.text += value;
      yield { type: entry.content.type === 'text' ? 'text-delta' : 'reasoning-delta', index: entry.index, text: value };
    }
  };
  const reconcile = function* (entry, value) {
    const previous = entry.content.type === 'tool-call' ? entry.content.arguments : entry.content.text;
    if (!value.startsWith(previous)) return fail('settled content differs from streamed content');
    yield* delta(entry, value.slice(previous.length));
  };
  const identity = (entry, raw) => {
    const item = object(raw);
    if (item.id !== entry.item.id || item.type !== entry.item.type) return fail('output identity changed');
    if (entry.content.type === 'text' && item.role !== 'assistant') return fail('output role changed');
    if (entry.content.type === 'tool-call' && (item.call_id !== entry.content.id || item.name !== entry.content.name)) return fail('tool identity changed');
    return item;
  };
  const settle = function* (entry, raw) {
    const item = identity(entry, raw);
    yield* reconcile(entry, itemText(item));
    entry.item = structuredClone(item);
    entry.closed = true;
    yield { type: 'block-end', index: entry.index, block: { ...entry.content } };
  };
  for await (const event of events) {
    const type = event.type;
    if (type === 'response.failed') throw providerError({ error: object(event.response).error });
    if (type === 'error') throw providerError(event);
    if (type === 'response.output_item.added') { yield* start(event.output_index, event.item); continue; }
    if (type === 'response.output_item.done') {
      if (!entries.has(event.output_index)) yield* start(event.output_index, event.item);
      const entry = entries.get(event.output_index);
      if (entry.closed) return fail('duplicate output_item.done');
      yield* settle(entry, event.item); continue;
    }
    const changes = {
      'response.output_text.delta': 'text', 'response.refusal.delta': 'text',
      'response.reasoning_text.delta': 'reasoning', 'response.reasoning_summary_text.delta': 'reasoning',
      'response.function_call_arguments.delta': 'tool-call',
    };
    if (changes[type]) {
      const entry = entries.get(event.output_index) ?? ids.get(event.item_id);
      if (!entry || entry.content.type !== changes[type] || entry.item.id !== event.item_id || event.output_index !== undefined && entry.outputIndex !== event.output_index) return fail('delta without matching output item');
      yield* delta(entry, text(event.delta)); continue;
    }
    if (type !== 'response.completed' && type !== 'response.incomplete') continue;
    const response = object(event.response);
    if (response.error) throw providerError({ error: response.error });
    if (response.status !== (type === 'response.completed' ? 'completed' : 'incomplete')) return fail('terminal status mismatch');
    if (!Array.isArray(response.output)) return fail('terminal output is missing');
    const completedIds = new Set();
    for (const [index, item] of response.output.entries()) {
      object(item);
      if (completedIds.has(item.id)) return fail('duplicate terminal output item');
      completedIds.add(item.id);
      let entry = ids.get(item.id);
      if (!entry) { yield* start(index, item); entry = entries.get(index); }
      if (entry.outputIndex !== index) return fail('terminal output order changed');
      if (!entry.closed) yield* settle(entry, item);
      else {
        identity(entry, item);
        if (itemText(item) !== (entry.content.type === 'tool-call' ? entry.content.arguments : entry.content.text)) return fail('terminal content differs from settled output');
        entry.item = structuredClone(item);
      }
    }
    if ([...entries.values()].some(entry => !completedIds.has(entry.item.id))) return fail('terminal output omitted a streamed item');
    const truncated = response.incomplete_details?.reason === 'max_output_tokens';
    if (type === 'response.incomplete' && !truncated && response.incomplete_details?.reason !== 'content_filter') return fail('unknown incomplete reason');
    const blocks = [...entries.values()];
    for (const { content } of blocks) if (content.type === 'tool-call' && !truncated) {
      let parsed;
      try { parsed = JSON.parse(content.arguments); } catch { return fail('invalid function arguments'); }
      object(parsed);
    }
    if (!truncated && response.incomplete_details?.reason !== 'content_filter' && !blocks.some(entry => entry.content.type === 'tool-call' || entry.content.text || entry.item.encrypted_content)) return fail('no response content', 'EMPTY_RESPONSE');
    yield { type: 'usage', usage: responseUsage(response.usage) };
    yield { type: 'finish', reason: { kind: truncated ? 'max-tokens' : blocks.some(entry => entry.content.type === 'tool-call') ? 'tool-calls' : 'stop' },
      replayState: { response: { kind: 'mimo-responses', version: 1, model, provider }, blocks: blocks.map(entry => ({ type: entry.content.type, item: entry.item })) },
    };
    return;
  }
  return fail('stream ended before response completed', 'STREAM_CLOSED');
}
