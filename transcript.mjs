import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function render(data) {
  const mapping = data.mapping;
  if (!mapping || !data.current_node) throw new Error('Missing conversation mapping or current node');
  let id = data.current_node;
  const path = [], seen = new Set();
  while (id != null) {
    if (seen.has(id)) throw new Error('Cycle in conversation path');
    if (!mapping[id]) throw new Error('Missing parent node: ' + id);
    seen.add(id); path.push(mapping[id]); id = mapping[id].parent;
  }
  path.reverse();
  const messages = path.map(n => n.message).filter(m => m && ['user', 'assistant'].includes(m.author?.role) && Array.isArray(m.content?.parts));
  const text = messages.map(m => `## ${m.author.role}\n\n${m.content.parts.map(p => typeof p === 'string' ? p : '[Non-text content: attachment or other media; see original JSON]').join('\n')}\n`).join('\n');
  return { text, count: messages.length, nodes: path.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , input, output] = process.argv;
  if (!input || !output) { console.error('Usage: node transcript.mjs conversation.json transcript.txt'); process.exitCode = 1; }
  else {
    try {
      const result = render(JSON.parse(await readFile(input, 'utf8')));
      await writeFile(output, result.text, { flag: 'wx', mode: 0o600 });
      console.log(`Saved ${result.count} user/assistant entries across ${result.nodes} nodes to ${output}`);
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
