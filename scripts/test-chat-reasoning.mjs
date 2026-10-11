import assert from 'node:assert/strict';
import test from 'node:test';
import { apply } from '../lib/index.js';

test('Chat dispatch preserves reasoning and tool history without changing tool contracts', async () => {
  let adapter;
  const config = {
    apiKeyEnv: 'TEST_KEY', baseURL: 'https://mimo-unit-test.invalid/v1', apiFormat: 'chat',
    baseURLsJson: '{}', modelsJson: JSON.stringify([{ id: 'mimo-test', maxTokens: 131072, inputModalities: ['text'] }]),
    customProviders: {}, maxTokens: 131072, temperature: 1,
  };
  const ctx = {
    fiber: { entry: { options: { id: 'llm-mimo' } } },
    provide() {}, on() {}, logger: { info() {}, error() {} },
    get(name) { return name === 'credentials' ? { async resolve() { return { value: 'unit-test-placeholder' }; } } : {}; },
    llm: {
      registerAdapter(_routes, value) { adapter = value; return { replace() {} }; },
      registerConfigurableProviders() { return { replace() {} }; }, registerModelDiscovery() {},
    },
  };
  await apply(ctx, config);
  const tools = [{ name: 'bash', description: 'execute command', parameters: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] } }];
  const messages = [
    { role: 'user', content: [{ type: 'text', text: 'Continue the task.' }] },
    { role: 'assistant', content: [
      { type: 'reasoning', text: 'first 中文🙂\n' },
      { type: 'reasoning', text: 'second exact block' },
      { type: 'text', text: 'Reading the file.' },
      { type: 'tool-call', id: 'call-original', name: 'bash', arguments: '{"command":"cat file"}' },
    ] },
    { role: 'tool', toolCallId: 'call-original', content: [{ type: 'text', text: 'file content' }] },
    { role: 'assistant', content: [{ type: 'reasoning', text: 'Retain a reasoning-only response too.' }] },
    { role: 'assistant', content: [{ type: 'text', text: 'A response without reasoning.' }] },
  ];
  const original = structuredClone({ messages, tools });
  let wire;
  const previousFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://mimo-unit-test.invalid/v1/chat/completions');
      wire = JSON.parse(options.body);
      const events = [
        { choices: [{ index: 0, delta: { content: 'ok' }, finish_reason: null }] },
        { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] },
        { choices: [], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } },
      ];
      return new Response(events.map(e => 'data: ' + JSON.stringify(e) + '\n\n').join('') + 'data: [DONE]\n\n', { headers: { 'content-type': 'text/event-stream' } });
    };
    for await (const _chunk of adapter.stream({ provider: 'mimo', model: 'mimo-test', messages, tools, maxTokens: 131072, signal: new AbortController().signal })) {}
  } finally { globalThis.fetch = previousFetch; }
  assert.equal(wire.max_tokens, 131072);
  assert.equal(wire.messages[1].reasoning_content, 'first 中文🙂\nsecond exact block');
  assert.equal(wire.messages[1].content, 'Reading the file.');
  assert.deepEqual(wire.messages[1].tool_calls, [{ id: 'call-original', type: 'function', function: { name: 'bash', arguments: '{"command":"cat file"}' } }]);
  assert.equal(wire.messages[2].tool_call_id, 'call-original');
  assert.equal(wire.messages[3].reasoning_content, 'Retain a reasoning-only response too.');
  assert.equal(wire.messages[3].content, '');
  assert.equal('reasoning_content' in wire.messages[4], false);
  assert.deepEqual(wire.tools[0].function, tools[0]);
  assert.deepEqual({ messages, tools }, original);
});
