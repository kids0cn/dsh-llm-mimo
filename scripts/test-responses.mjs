import assert from 'node:assert/strict';
import test from 'node:test';
import { apply } from '../lib/index.js';

const model = 'mimo-v2.6-flash';
const tools = [{ name: 'read_file', description: 'Read a test file.', parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } }];
const user = { role: 'user', content: [{ type: 'text', text: 'Run the test.' }] };
const message = (value = 'ok', id = 'msg-test') => ({ id, type: 'message', role: 'assistant', content: [{ type: 'output_text', text: value, annotations: [] }], status: 'completed' });
const reasoning = { id: 'rs-native', type: 'reasoning', content: [{ type: 'reasoning_text', text: '思考🙂' }], summary: [], status: 'completed', encrypted_content: 'opaque-test-state' };
const call = (id, name, args) => ({ id: `fc-${id}`, type: 'function_call', call_id: id, name, arguments: args, status: 'completed' });
const complete = (output = [message()], usage = { input_tokens: 10, output_tokens: 3 }) => ({ type: 'response.completed', response: { id: 'resp-test', status: 'completed', output, usage } });
const added = (item, index) => ({ type: 'response.output_item.added', output_index: index, item });
const done = (item, index) => ({ type: 'response.output_item.done', output_index: index, item });
function sse(events) {
  // Cut inside UTF-8 and SSE fields to exercise the real transport decoder.
  const data = new TextEncoder().encode(': heartbeat\n\n' + events.map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`).join(''));
  return new Response(new ReadableStream({ start(controller) {
    for (let i = 0; i < data.length; i += 7) controller.enqueue(data.slice(i, i + 7));
    controller.close();
  } }), { headers: { 'content-type': 'text/event-stream' } });
}
async function fixture(overrides = {}, attachments) {
  let adapter, api, discovery;
  const config = { apiKeyEnv: 'UNIT_TEST', baseURL: 'https://responses-unit.invalid/v1/', apiFormat: 'responses', maxTokens: 128, customProviders: {}, ...overrides };
  await apply({
    fiber: { entry: { options: { id: 'llm-mimo' } } },
    provide(_name, value) { api = value; }, on() {}, logger: { info() {}, error() {} },
    get(name) { return name === 'credentials' ? { async resolve() { return { value: 'unit-test-placeholder' }; } } : attachments; },
    llm: { registerAdapter(_routes, value) { adapter = value; return { replace() {} }; }, registerConfigurableProviders() { return { replace() {} }; }, registerModelDiscovery(_ns, value) { discovery = value; } },
  }, config);
  return { adapter, api, discovery };
}
async function stream(adapter, overrides = {}) {
  return Array.fromAsync(adapter.stream({ provider: 'mimo', model, messages: [user], signal: new AbortController().signal, ...overrides }));
}
async function withFetch(fetch, fn) {
  const original = globalThis.fetch;
  try { globalThis.fetch = async (...args) => fetch(...args); return await fn(); } finally { globalThis.fetch = original; }
}
const code = expected => error => error.code === expected;

test('Responses streams reasoning, text and parallel tools; round-trip retains native history and call_id', async () => {
  const { adapter, api } = await fixture();
  api.registerPromptSource({ resolveSystem: () => 'model-specific system', resolveToolDescription: () => 'model-specific description' });
  const a = call('call-a', 'read_file', '{"path":"a.txt"}');
  const b = call('call-b', 'read_file', '{"path":"b.txt"}');
  const output = [reasoning, message('Reading.'), a, b];
  const events = [
    { type: 'response.created', response: { status: 'in_progress' } },
    added({ ...reasoning, content: [], status: 'in_progress' }, 0),
    { type: 'response.reasoning_text.delta', output_index: 0, item_id: reasoning.id, delta: '思考🙂' },
    added({ ...output[1], content: [] }, 1),
    { type: 'response.output_text.delta', output_index: 1, item_id: output[1].id, delta: 'Read' },
    added({ ...a, arguments: '' }, 2), added({ ...b, arguments: '' }, 3),
    { type: 'response.function_call_arguments.delta', output_index: 2, item_id: a.id, delta: '{"path":' },
    { type: 'response.function_call_arguments.delta', output_index: 3, item_id: b.id, delta: '{"path":"b.txt"}' },
    { type: 'response.output_text.delta', output_index: 1, item_id: output[1].id, delta: 'ing.' },
    { type: 'response.function_call_arguments.delta', output_index: 2, item_id: a.id, delta: '"a.txt"}' },
    ...output.map(done), complete(output, { input_tokens: 20, input_tokens_details: { cached_tokens: 12 }, output_tokens: 7, output_tokens_details: { reasoning_tokens: 3 } }),
  ];
  const chunks = await withFetch(() => sse(events), () => stream(adapter, { tools, messages: [{ role: 'system', content: [{ type: 'text', text: 'original' }] }, user] }));
  assert.deepEqual(chunks.filter(c => c.type === 'block-end').map(c => c.block), [
    { type: 'reasoning', text: '思考🙂' }, { type: 'text', text: 'Reading.' },
    { type: 'tool-call', id: 'call-a', name: 'read_file', arguments: a.arguments }, { type: 'tool-call', id: 'call-b', name: 'read_file', arguments: b.arguments },
  ]);
  assert.deepEqual(chunks.find(c => c.type === 'usage').usage, { inputTokens: 8, cacheReadTokens: 12, outputTokens: 7, totalTokens: 27, reasoningTokens: 3 });
  const finish = chunks.at(-1);
  assert.equal(finish.reason.kind, 'tool-calls');
  const assistant = { role: 'assistant', content: chunks.filter(c => c.type === 'block-end').map(c => c.block), source: { kind: 'model', provider: 'mimo', model, replayState: finish.replayState } };
  const results = ['call-a', 'call-b'].map(toolCallId => ({ role: 'tool', toolCallId, content: [{ type: 'text', text: toolCallId + ' result' }] }));
  const original = structuredClone(assistant);
  let payload;
  await withFetch((url, init) => {
    assert.equal(url, 'https://responses-unit.invalid/v1/responses');
    assert.equal(init.signal.aborted, false); assert.equal(init.redirect, 'error');
    payload = JSON.parse(init.body); return sse([complete()]);
  }, () => stream(adapter, { system: 'original system', tools, messages: [user, assistant, ...results] }));
  assert.deepEqual(payload.input[0], { role: 'system', content: [{ type: 'input_text', text: 'model-specific system' }] });
  assert.deepEqual(payload.input[2], reasoning);
  assert.deepEqual(payload.input.slice(4, 6), [a, b].map(({ status, ...item }) => item));
  assert.deepEqual(payload.input.slice(6), [
    { type: 'function_call_output', call_id: 'call-a', output: 'call-a result' },
    { type: 'function_call_output', call_id: 'call-b', output: 'call-b result' },
  ]);
  assert.deepEqual(payload.tools, [{ type: 'function', ...tools[0], description: 'model-specific description' }]);
  assert.equal(payload.max_output_tokens, 128); assert.equal('reasoning' in payload, false);
  assert.deepEqual(assistant, original);
});

test('Responses native state is dropped after text edits or format/route changes', async () => {
  const { adapter } = await fixture();
  const initial = await withFetch(() => sse([complete([reasoning, message()])]), () => stream(adapter));
  const assistant = { role: 'assistant', content: initial.filter(c => c.type === 'block-end').map(c => c.block), source: { kind: 'model', provider: 'mimo', model, replayState: initial.at(-1).replayState } };
  const bodies = [];
  await withFetch((_url, init) => { bodies.push(JSON.parse(init.body)); return sse([complete()]); }, async () => {
    const edited = structuredClone(assistant); edited.content[0].text = 'edited';
    await stream(adapter, { messages: [user, edited] });
    const foreign = structuredClone(assistant); foreign.source.replayState.response.provider = 'other';
    await stream(adapter, { messages: [user, foreign] });
    await stream(adapter, { messages: [user, foreign] });
    const chat = structuredClone(assistant); chat.source.replayState.response.kind = 'mimo-chat';
    await stream(adapter, { messages: [user, chat] });
  });
  for (const body of bodies) { assert.equal('encrypted_content' in body.input[1], false); assert.match(body.input[1].id, /^rs_[a-f\d]{32}$/); }
  assert.deepEqual(bodies[1], bodies[2]);
});

test('Responses accepts terminal-only output, refusal and token-limited partial function arguments', async () => {
  const { adapter } = await fixture();
  const refusal = { ...message(), content: [{ type: 'refusal', refusal: 'cannot do this' }] };
  const chunks = await withFetch(() => sse([complete([refusal])]), () => stream(adapter));
  assert.equal(chunks.find(c => c.type === 'block-end').block.text, 'cannot do this');
  const partial = call('partial', 'read_file', '{"path":');
  const incomplete = { type: 'response.incomplete', response: { status: 'incomplete', output: [partial], incomplete_details: { reason: 'max_output_tokens' }, usage: { input_tokens: 1, output_tokens: 1 } } };
  const truncated = await withFetch(() => sse([incomplete]), () => stream(adapter));
  assert.equal(truncated.at(-1).reason.kind, 'max-tokens');
  assert.equal(truncated.find(c => c.type === 'block-end').block.arguments, '{"path":');
});

test('Responses never treats a disconnected, malformed or empty stream as successful', async () => {
  const { adapter } = await fixture();
  const cases = [
    [sse([done(message(), 0)]), 'STREAM_CLOSED'],
    [new Response('data: {\n\n'), 'MALFORMED_RESPONSE'],
    [new Response('event: response.completed\ndata: {"type":"response.created"}\n\n'), 'MALFORMED_RESPONSE'],
    [sse([complete([])]), 'EMPTY_RESPONSE'], [sse([complete([message('')])]), 'EMPTY_RESPONSE'],
    [sse([complete([call('a', 'read_file', '[]')])]), 'MALFORMED_RESPONSE'],
    [sse([complete([call('a', 'read_file', '{')])]), 'MALFORMED_RESPONSE'],
    [sse([complete([{ id: 'unsupported', type: 'web_search_call' }])]), 'UNSUPPORTED_CONTENT'],
  ];
  for (const [response, expected] of cases) await withFetch(() => response, () => assert.rejects(stream(adapter), code(expected)));
});

test('Responses rejects changed tool identities, duplicate calls and inconsistent terminal/delta data', async () => {
  const { adapter } = await fixture();
  const a = call('a', 'read_file', '{}');
  const cases = [
    [done(a, 0), complete([{ ...a, call_id: 'different' }])],
    [complete([a, { ...a, id: 'fc-other' }])],
    [complete([message(), message()])],
    [added({ ...message(), content: [] }, 0), { type: 'response.output_text.delta', output_index: 1, item_id: 'msg-test', delta: 'ok' }, complete()],
    [done(message(), 0), complete([])],
    [done(message('first'), 0), complete([message('changed')])],
  ];
  for (const events of cases) await withFetch(() => sse(events), () => assert.rejects(stream(adapter), code('MALFORMED_RESPONSE')));
});

test('Responses normalizes HTTP/in-band errors, retry metadata and aborts', async () => {
  const { adapter } = await fixture();
  await withFetch(() => new Response(JSON.stringify({ error: { type: 'rate_limit_error', message: 'slow down' } }), { status: 429, headers: { 'retry-after': '2', 'x-request-id': 'req-unit' } }), () => assert.rejects(stream(adapter), error => {
    assert.equal(error.code, 'RATE_LIMIT'); assert.equal(error.failure.status, 429); assert.equal(error.failure.requestId, 'req-unit'); assert.equal(error.failure.providerRetryAfterMs, 2000); return true;
  }));
  await withFetch(() => sse([{ type: 'response.failed', response: { status: 'failed', error: { code: 'invalid_request_error', message: 'bad input' } } }]), () => assert.rejects(stream(adapter), code('INVALID_REQUEST')));
  await withFetch(() => sse([{ type: 'error', code: 'rate_limit_error', message: 'slow down' }]), () => assert.rejects(stream(adapter), code('RATE_LIMIT')));
  const controller = new AbortController(); controller.abort();
  await withFetch(() => { throw new Error('must not fetch after abort'); }, () => assert.rejects(stream(adapter, { signal: controller.signal }), code('ABORTED')));
});

test('Responses media uses native image/audio/video fields and retains the modality gate', async () => {
  const { adapter } = await fixture({ modelsJson: JSON.stringify([{ id: model, inputModalities: ['text', 'image', 'audio', 'video', 'pdf'], videoFps: 2, videoMediaResolution: 'max' }]) }, {
    async readImage() { return { data: new Uint8Array([1, 2]), mediaType: 'image/png' }; },
    async *readFileStream() { yield new Uint8Array([3, 4]); },
  });
  const image = { type: 'image', attachment: { attachmentId: 'image', name: 'image.png' } };
  const file = name => ({ type: 'file', attachment: { attachmentId: name, name } });
  let payload;
  await withFetch((_url, init) => { payload = JSON.parse(init.body); return sse([complete()]); }, () => stream(adapter, { messages: [{ role: 'user', content: [image, file('test.wav'), file('test.mp4'), file('test.pdf')] }] }));
  assert.deepEqual(payload.input[0].content, [
    { type: 'input_image', image_url: 'data:image/png;base64,AQI=' },
    { type: 'input_audio', audio_url: 'data:audio/wav;base64,AwQ=' },
    { type: 'input_video', video_url: 'data:video/mp4;base64,AwQ=', fps: 2, media_resolution: 'max' },
    { type: 'input_file', filename: 'test.pdf', file_data: 'data:application/pdf;base64,AwQ=' },
  ]);
  const restricted = await fixture({ modelsJson: JSON.stringify([{ id: model, inputModalities: ['text'] }]) });
  await withFetch(() => { throw new Error('media must be refused before transport'); }, () => assert.rejects(stream(restricted.adapter, { messages: [{ role: 'user', content: [file('test.wav')] }] }), code('INVALID_REQUEST')));
});

test('Responses rejects dangling/unmatched tools and unsupported stop sequences before transport', async () => {
  const { adapter } = await fixture();
  const history = [user, { role: 'assistant', content: [{ type: 'tool-call', id: 'a', name: 'read_file', arguments: '{}' }] }];
  const cases = [
    { messages: history }, { messages: [...history, user] },
    { messages: [user, { role: 'tool', toolCallId: 'unknown', content: [{ type: 'text', text: 'result' }] }] },
    { stop: ['END'] },
  ];
  for (const options of cases) await withFetch(() => { throw new Error('invalid history must not be sent'); }, () => assert.rejects(stream(adapter, options), code('INVALID_REQUEST')));
});

test('Responses discovery tries the model list, then a format-specific minimal request without thinking fields', async () => {
  const { discovery } = await fixture();
  const requests = [];
  await withFetch((url, init) => { requests.push({ url, init }); return new Response(JSON.stringify({ data: [{ id: model }] })); }, async () => {
    assert.deepEqual(await discovery({ provider: 'mimo', api: 'openai-responses' }), [{ id: model }]);
  });
  assert.equal(requests.length, 1); assert.equal(requests[0].url, 'https://responses-unit.invalid/v1/models');
  requests.length = 0;
  await withFetch((url, init) => { requests.push({ url, init }); return url.endsWith('/models') ? new Response('', { status: 404 }) : new Response('{}'); }, () => discovery({ provider: 'mimo', api: 'responses' }));
  assert.equal(requests[1].url, 'https://responses-unit.invalid/v1/responses');
  assert.deepEqual(JSON.parse(requests[1].init.body), { model, max_output_tokens: 1, input: 'ping' });
});
