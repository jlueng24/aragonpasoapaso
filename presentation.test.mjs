import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as game from '../dist/game.mjs';
const root=new URL('../dist/',import.meta.url);
const geo=JSON.parse(fs.readFileSync(new URL('map-data.json',root)));
const data=JSON.parse(fs.readFileSync(new URL('pilot-content.json',root)));
function harness(origin='44118'){
 const elements=new Map();
 const element=key=>{
  if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',clientWidth:850,clientHeight:700,open:false,children:[],classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},scrollIntoView(){},showModal(){this.open=true;},querySelector(){return element(key+' title');}});
  return elements.get(key);
 };
 element('#terrain').children=geo.municipalities.map(m=>({dataset:{id:m.id},setAttribute(){},querySelector(){return element('title-'+m.id);}}));
 const source=fs.readFileSync(new URL('app.mjs',root),'utf8').replace(/^import[^\n]+\n/,'').split("document.addEventListener('click'")[0];
 const ctx=vm.createContext({...game,console,Intl,Date,Set,Map,URL,Math,JSON,setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:fn=>fn(),window:{matchMedia:()=>({matches:false})},document:{querySelector:element,querySelectorAll:()=>[],activeElement:null},localStorage:{setItem(){}},fetch:async path=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(new URL(path,root)))})});
 vm.runInContext(source,ctx);
 ctx.GEO=geo;ctx.DATA=data;ctx.ORIGIN=origin;
 vm.runInContext(`geography=GEO;content=DATA;municipalities=new Map(geography.municipalities.map(m=>[m.id,m]));eligible=new Set(Object.keys(content));state=chooseOrigin(freshState(),ORIGIN,eligible).state;viewport=fitIds([...eligible]);`,ctx);
 return {ctx,element,run:code=>vm.runInContext(code,ctx)};
}
test('undiscovered municipalities never reveal names or heraldry on map',()=>{
 const h=harness();h.run('renderMap()');
 const pins=h.element('#pins').innerHTML;
 for(const id of geo.municipalities.find(m=>m.id==='44118').neighbors){
  if(!data[id])continue;
  assert(!pins.includes(data[id].name));
  if(data[id].shield)assert(!pins.includes(data[id].shield));
  assert.equal(h.element('title-'+id).textContent,'Municipio disponible para descubrir');
 }
});
test('all 38 destinations render four lesson screens and offer 2–4 unambiguous answers',()=>{
 for(const id of Object.keys(data)){
  const h=harness(id);
  h.run(`session={id:'${id}',review:true,stage:'lesson',slide:0};`);
  for(let slide=0;slide<4;slide++){
   h.run(`session.slide=${slide};renderLesson()`);
   const html=h.element('#dialog-content').innerHTML;
   assert(html.includes(`Paso ${slide+1} de 4`));assert(!html.includes('undefined'));assert(!html.includes('src="null"'));
   if(slide===0)assert(html.includes('km²'));
   if(slide===2){assert(html.includes('2025'));assert(html.includes('INE'));if(data[id].singularity)assert(html.includes(data[id].singularity));}
  }
  h.run("state.discovered['44004']={kind:'exploration',day:'2026-10-17'};state.discovered['44118']={kind:'exploration',day:'2026-10-17'};startQuiz()");
  const qs=JSON.parse(h.run('JSON.stringify(session.questions)'));
  assert.equal(qs.length,3);
  for(const q of qs){assert(q.options.length>=2);assert(q.options.length<=4);assert.equal(q.options.filter(o=>o.id===q.answer).length,1);assert.equal(new Set(q.options.map(o=>o.label)).size,q.options.length);}
 }
});
test('newly acquired territory opens routes beyond the origin; card collection persists',()=>{
 const h=harness('44061');
 assert(!h.run(`frontier().includes('44223')`));
 h.run(`state=discover(state,'44077',municipalities,eligible,true).state`);
 assert(h.run(`frontier().includes('44223')`));
 h.run('renderAll()');assert(h.element('#pins').innerHTML.includes('La Cerollera'));assert(h.element('#collection').innerHTML.includes('2025'));
});
test('all content matches the official area and INE population records; image files exist and carry credits',()=>{
 const evidence=JSON.parse(fs.readFileSync(new URL('../test/fixtures/official-data.json',root)));
 const population=evidence.population;
 const credits=JSON.parse(fs.readFileSync(new URL('credits.json',root)));
 assert.equal(Object.keys(data).length,38);
 for(const [id,p] of Object.entries(data)){
  assert.equal(p.areaKm2,evidence.areas[id]);
  const row=population.find(r=>r.MetaData.some(m=>m.Codigo===id)&&r.MetaData.some(m=>m.T3_Variable==='Sexo'&&m.Nombre==='Total'));
  assert.equal(p.population,row.Data[0].Valor);assert.equal(p.populationYear,row.Data[0].Anyo);
  for(const key of ['flag','shield'])if(p[key]){assert(fs.existsSync(new URL(p[key],root)));assert(credits.some(c=>c.localFile===p[key]&&c.source&&c.license));}else assert(!p[key]);
 }
});
test('all 38 quizzes remain capped and unambiguous after collecting all 38 municipalities',()=>{
 for(const id of Object.keys(data)){
  const h=harness(id);
  h.ctx.ALL_IDS=Object.keys(data);
  h.run(`for(const key of ALL_IDS)state.discovered[key]={kind:key===state.originId?'origin':'exploration',day:'2026-10-17'};session={id:'${id}',review:true,stage:'lesson',slide:3};startQuiz()`);
  const qs=JSON.parse(h.run('JSON.stringify(session.questions)'));
  for(const q of qs){
   assert(q.options.length<=4,`${id}: too many options`);
   assert(q.options.length>=2,`${id}: insufficient options`);
   assert.equal(q.options.filter(o=>o.id===q.answer).length,1,`${id}: no unique correct answer`);
   assert.equal(new Set(q.options.map(o=>o.label)).size,q.options.length,`${id}: duplicate labels`);
  }
 }
});
test('missing flags and shields fall back to genuine outlines rather than fictional imagery',()=>{
 const id=Object.keys(data).find(id=>!data[id].flag&&!data[id].shield);
 assert(id,'Need a municipality without verified heraldry');
 const h=harness(id);
 h.run(`session={id:'${id}',review:true,stage:'lesson',slide:0};state.discovered['44118']={kind:'exploration',day:'2026-10-17'};startQuiz()`);
 assert.equal(h.run('session.questions[0].type'),'shape');
 assert.equal(h.run('session.questions[0].options.length'),2);
});
test('map pins and collection hide all undiscovered destination names, even with many frontier towns',()=>{
 const h=harness();h.run('renderMap();renderCollection()');
 const pins=h.element('#pins').innerHTML,collection=h.element('#collection').innerHTML;
 for(const [id,p] of Object.entries(data))if(id!=='44118'){
  assert(!pins.includes(p.name),`leaked pin ${p.name}`);
  assert(!collection.includes(`Abrir carta de ${p.name}`),`leaked card ${p.name}`);
 }
});
