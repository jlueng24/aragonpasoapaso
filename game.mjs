export const DEFAULT_LIMIT = 3;
// Temporarily suspended while testing the complete two-comarca expedition.
export const DAILY_LIMIT_ENABLED = false;
export const STORAGE_KEY = 'aragon-explora-v1';
export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
export function freshState() { return { version: 1, originId: null, discovered: {}, limit: DEFAULT_LIMIT }; }
export function normalizeState(value, municipalities, eligible) {
  const state = freshState();
  if (!value || value.version !== 1 || !eligible.has(value.originId)) return state;
  state.originId = value.originId;
  state.limit = [3,5,10].includes(value.limit) ? value.limit : DEFAULT_LIMIT;
  for (const [id,event] of Object.entries(value.discovered || {})) {
    if (municipalities.has(id) && eligible.has(id) && event && typeof event.day === 'string') state.discovered[id] = { kind: id === state.originId ? 'origin' : 'exploration', day:event.day };
  }
  if (!state.discovered[state.originId]) state.discovered[state.originId] = { kind:'origin', day:dayKey() };
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
  return {ok:true,state:{...state,originId:id,discovered:{[id]:{kind:'origin',day:dayKey(date)}}}};
}
export function discover(state,id,municipalities,eligible,quizPassed,date = new Date()) {
  if (!state.originId) return {ok:false,reason:'choose-origin'};
  if (state.discovered[id]) return {ok:false,reason:'already-discovered'};
  if (!availableNeighbors(state,municipalities,eligible).includes(id)) return {ok:false,reason:'not-neighbor'};
  if (!quizPassed) return {ok:false,reason:'quiz-incomplete'};
  if (DAILY_LIMIT_ENABLED && dailyUsage(state,date)>=state.limit) return {ok:false,reason:'daily-limit'};
  return {ok:true,state:{...state,discovered:{...state.discovered,[id]:{kind:'exploration',day:dayKey(date)}}}};
}
// Future flag games must use this pool for both questions and answer options.
export function practicePool(state) { return Object.keys(state.discovered); }
