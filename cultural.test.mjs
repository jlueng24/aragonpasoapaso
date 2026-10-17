import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const content=JSON.parse(readFileSync(new URL('../dist/pilot-content.json', import.meta.url),'utf8'));
test('38 fichas con singularidad y fuente HTTPS',()=>{
 assert.equal(Object.keys(content).length,38);
 for (const [code, p] of Object.entries(content)) {
  assert.ok(typeof p.singularity==='string' && p.singularity.length>45,`sin singularidad ${code}`);
  assert.match(p.singularitySource,/^https:\/\//,`sin fuente cultural ${code}`);
  assert.ok(p.sources.includes(p.singularitySource),`fuente no registrada ${code}`);
 }
});
test('no inventar patronazgo ni fechas para fichas pendientes',()=>{
 for (const p of Object.values(content)) {
  if (!p.patron) assert.ok(!p.festival,`${p.name} tiene fiesta sin patronazgo`);
 }
});
