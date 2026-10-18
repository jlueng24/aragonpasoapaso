export const DEFAULT_LIMIT = 3;
// Temporarily suspended while testing the complete three-comarca expedition.
export const DAILY_LIMIT_ENABLED = false;
export const STORAGE_KEY = 'aragon-explora-v1';
export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function freshState() { return { version: 3, originId: null, discovered: {}, collection: {}, favorites: {}, limit: DEFAULT_LIMIT }; }
function validEvent(event){ return event && typeof event.day === 'string'; }
export function normalizeState(value, municipalities, eligible) {
  const state = freshState();
  if (!value || ![1,2,3].includes(value.version)) return state;
  state.limit = [3,5,10].includes(value.limit) ? value.limit : DEFAULT_LIMIT;
  // Version 1 stored a single discovery map. Migrate it into both the current expedition and the permanent collection.
  const legacy = value.version === 1;
  const rawCollection = legacy ? (value.discovered || {}) : (value.collection || {});
  for (const [id,event] of Object.entries(rawCollection)) {
    if (municipalities.has(id) && eligible.has(id) && validEvent(event)) state.collection[id] = {...event};
  }
  if (value.version >= 3 && value.favorites && typeof value.favorites === 'object') {
    for (const [id,on] of Object.entries(value.favorites)) if (on && municipalities.has(id) && eligible.has(id) && state.collection[id]) state.favorites[id] = true;
  }
  if (eligible.has(value.originId)) {
    state.originId = value.originId;
    for (const [id,event] of Object.entries(value.discovered || {})) {
      if (municipalities.has(id) && eligible.has(id) && validEvent(event)) state.discovered[id] = { kind: id === state.originId ? 'origin' : 'exploration', day:event.day };
    }
    if (!state.discovered[state.originId]) state.discovered[state.originId] = { kind:'origin', day:dayKey() };
    for (const [id,event] of Object.entries(state.discovered)) if (!state.collection[id]) state.collection[id] = {...event};
  }
  // Favorites may reference discoveries in the active route that were just merged into the collection.
  if (value.version >= 3 && value.favorites && typeof value.favorites === 'object') {
    for (const [id,on] of Object.entries(value.favorites)) if (on && state.collection[id]) state.favorites[id] = true;
  }
  return state;
}
export function dailyUsage(state, date = new Date()) {
  return Object.values(state.discovered).filter(x=>x.kind==='exploration' && x.day===dayKey(date)).length;
}
export function availableNeighbors(state, municipalities, eligible) {
  const out=new Set();
  for (const id of Object.keys(state.discovered)) {
    for (const n of municipalities.get(id)?.neighbors || []) {
      if (eligible.has(n) && !state.discovered[n]) out.add(n);
    }
  }
  return [...out];
}
export function chooseOrigin(state,id,eligible,date = new Date()) {
  if (state.originId) return {ok:false,reason:'origin-already-chosen'};
  if (!eligible.has(id)) return {ok:false,reason:'unavailable'};
  const event={kind:'origin',day:dayKey(date)};
  return {ok:true,state:{...state,originId:id,discovered:{[id]:event},collection:{...state.collection,[id]:state.collection[id]||event}}};
}
export function discover(state,id,municipalities,eligible,quizPassed,date = new Date()) {
  if (!state.originId) return {ok:false,reason:'choose-origin'};
  if (state.discovered[id]) return {ok:false,reason:'already-discovered'};
  if (!availableNeighbors(state,municipalities,eligible).includes(id)) return {ok:false,reason:'not-neighbor'};
  if (!quizPassed) return {ok:false,reason:'quiz-incomplete'};
  if (DAILY_LIMIT_ENABLED && dailyUsage(state,date)>=state.limit) return {ok:false,reason:'daily-limit'};
  const event={kind:'exploration',day:dayKey(date)};
  return {ok:true,state:{...state,discovered:{...state.discovered,[id]:event},collection:{...state.collection,[id]:state.collection[id]||event}}};
}
export function startNewExpedition(state){
  return {...state,version:3,originId:null,discovered:{}};
}
export function clearAllProgress(){ return freshState(); }
// Future flag games use the permanent collection, not only the current expedition.
export function practicePool(state) { return [...new Set([...Object.keys(state.collection || {}),...Object.keys(state.discovered || {})])]; }
export function expeditionPool(state) { return Object.keys(state.discovered || {}); }
