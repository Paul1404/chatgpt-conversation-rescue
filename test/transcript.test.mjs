import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { render } from '../transcript.mjs';
test('renders the active path in order and identifies media', () => {
  const message = (role, parts) => ({ author: { role }, content: { parts } });
  const result = render({ current_node: 'b', mapping: { root: { parent: null }, a: { parent: 'root', message: message('user', ['hello', { content_type: 'image' }]) }, b: { parent: 'a', message: message('assistant', ['hi']) }, other: { parent: 'root', message: message('user', ['alternate']) } } });
  assert.equal(result.count, 2); assert.match(result.text, /hello[\s\S]*Non-text content[\s\S]*hi/); assert.doesNotMatch(result.text, /alternate/);
});
test('rejects missing parents and cycles', () => {
  assert.throws(() => render({current_node:'a',mapping:{a:{parent:'missing'}}}), /Missing parent/);
  assert.throws(() => render({current_node:'a',mapping:{a:{parent:'a'}}}), /Cycle/);
});
