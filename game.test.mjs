import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,chooseOrigin,discover,availableNeighbors,dailyUsage,practicePool,dayKey,normalizeState} from '../dist/game.mjs';

const geography=JSON.parse(fs.readFileSync(new URL('../dist/map-data.json',import.meta.url),'utf8'));
const content=JSON.parse(fs.readFileSync(new URL('../dist/pilot-content.json',import.meta.url),'utf8'));
const municipalities=new Map(geography.municipalities.map(m=>[m.id,m]));
const eligible=new Set(Object.keys(content));
const today=new Date('2026-10-16T12:00:00Z');
const tomorrow=new Date('2026-10-17T12:00:00Z');
const origin=()=>chooseOrigin(freshState(),'44118',eligible,today).state;

test('free origin is the sole unlocked card and cannot be changed for another free card',()=>{
  const state=origin();assert.deepEqual(practicePool(state),['44118']);assert.equal(dailyUsage(state,today),0);
  assert.equal(chooseOrigin(state,'44004',eligible,today).reason,'origin-already-chosen');
  assert.equal(chooseOrigin(freshState(),'not-real',eligible,today).reason,'unavailable');
});
test('real municipal borders determine available exploration; distant places cannot be skipped to',()=>{
  const state=chooseOrigin(freshState(),'44004',eligible,today).state;
  assert(availableNeighbors(state,municipalities,eligible).includes('44118'));
  assert(!availableNeighbors(state,municipalities,eligible).includes('44107'));
  assert.equal(discover(state,'44107',municipalities,eligible,true,today).reason,'not-neighbor');
});
test('failed and repeated attempts do not consume allowance',()=>{
  const state=origin();const failed=discover(state,'44004',municipalities,eligible,false,today);
  assert.equal(failed.reason,'quiz-incomplete');assert.equal(dailyUsage(state,today),0);
  const first=discover(state,'44004',municipalities,eligible,true,today);assert(first.ok);
  assert.equal(dailyUsage(first.state,today),1);
  assert.equal(discover(first.state,'44004',municipalities,eligible,true,today).reason,'already-discovered');
  assert.equal(dailyUsage(first.state,today),1);
});
test('unlimited discovery remains enabled for testing, including across day boundaries',()=>{
  const state={...origin(),limit:1};const first=discover(state,'44004',municipalities,eligible,true,today).state;
  assert.equal(discover(first,'44107',municipalities,eligible,true,today).ok,true);
  const second=discover(first,'44107',municipalities,eligible,true,tomorrow);assert(second.ok);
  assert.equal(dailyUsage(second.state,tomorrow),1);assert.equal(practicePool(second.state).length,3);
});
test('midnight is based on Spain peninsular time, including summer and winter',()=>{
  assert.equal(dayKey(new Date('2026-10-16T21:59:59Z')),'2026-10-16');
  assert.equal(dayKey(new Date('2026-10-16T22:00:00Z')),'2026-10-17');
  assert.equal(dayKey(new Date('2026-12-16T22:59:59Z')),'2026-12-16');
  assert.equal(dayKey(new Date('2026-12-16T23:00:00Z')),'2026-12-17');
});
test('restored progress preserves cards and quota, and removes unknown IDs',()=>{
  const first=discover(origin(),'44004',municipalities,eligible,true,today).state;
  const raw=JSON.parse(JSON.stringify(first));raw.discovered.fake={day:'2026-10-16',kind:'exploration'};
  const restored=normalizeState(raw,municipalities,eligible);
  assert.deepEqual(practicePool(restored).sort(),['44004','44118']);assert.equal(dailyUsage(restored,today),1);
  assert.deepEqual(normalizeState(null,municipalities,eligible),freshState());
});
test('all pilot municipalities are reachable from each possible origin',()=>{
  for(const start of eligible){
    let state=chooseOrigin({...freshState(),limit:10},start,eligible,today).state;
    for(let i=0;i<eligible.size;i++){
      const [next]=availableNeighbors(state,municipalities,eligible);if(!next)break;
      state=discover(state,next,municipalities,eligible,true,today).state;
    }
    assert.equal(practicePool(state).length,eligible.size);
  }
});
test('cartography has 731 unique municipalities and symmetric real shared-edge adjacency',()=>{
  assert.equal(municipalities.size,731);
  for(const m of municipalities.values()){
    assert(!m.neighbors.includes(m.id));
    for(const n of m.neighbors)assert(municipalities.get(n)?.neighbors.includes(m.id));
  }
});
