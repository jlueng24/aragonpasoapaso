import {STORAGE_KEY, DAILY_LIMIT_ENABLED, freshState, normalizeState, dailyUsage, dayKey, availableNeighbors, chooseOrigin, discover, practicePool} from './game.mjs';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stripAccents = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const shuffle = list => { const out=[...list]; for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];} return out; };
let geography, content, municipalities, eligible, state, selected = null, viewport, session = null, lastFocus = null;
let toastTimer, tipTimer, storageWarning = false, dragging = false, pointer = null;
const map = $('#map'), dialog = $('#dialog');

async function loadJson(path){const response=await fetch(path);if(!response.ok)throw new Error(`No se pudo cargar ${path}`);return response.json();}
function place(id){ return {...municipalities.get(id),...content[id]}; }
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{if(!storageWarning){storageWarning=true;toast('El navegador no permite guardar. Esta partida durará mientras mantengas la página abierta.');}}}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4800);}
function tip(message){clearTimeout(tipTimer);$('#map-tip').textContent=message;$('#map-tip').classList.add('show');tipTimer=setTimeout(()=>$('#map-tip').classList.remove('show'),4200);}
function remaining(){return DAILY_LIMIT_ENABLED?Math.max(0,state.limit-dailyUsage(state)):Infinity;}
function owned(id){return !!state.discovered[id];}
function frontier(){return availableNeighbors(state,municipalities,eligible);}
function status(id){return owned(id)?'discovered':(!state.originId||frontier().includes(id))?'available':'locked';}

function setView(box){viewport=[...box];map.setAttribute('viewBox',viewport.join(' '));renderPins();}
function fitIds(ids,padding=.28){
  const boxes=ids.map(id=>municipalities.get(id)?.bbox).filter(Boolean);
  if(!boxes.length)return geography.bounds;
  const x0=Math.min(...boxes.map(b=>b[0])),y0=Math.min(...boxes.map(b=>b[1])),x1=Math.max(...boxes.map(b=>b[2])),y1=Math.max(...boxes.map(b=>b[3]));
  let width=Math.max(24,x1-x0)*(1+padding*2),height=Math.max(24,y1-y0)*(1+padding*2);
  const ratio=(map.clientWidth||800)/(map.clientHeight||700);
  if(width/height<ratio)width=height*ratio;else height=width/ratio;
  return [(x0+x1-width)/2,(y0+y1-height)/2,width,height];
}
function showZone(){setView(fitIds(state.originId?[...practicePool(state),...frontier()]:[...eligible],.24));}
function zoom(factor){const [x,y,w,h]=viewport;const nw=Math.max(35,Math.min(1900,w*factor)),nh=h*(nw/w);setView([x+(w-nw)/2,y+(h-nh)/2,nw,nh]);}
function buildMap(){
  $('#terrain').innerHTML=geography.municipalities.map(m=>`<path class="municipality" data-id="${m.id}" d="${m.path}"><title>Municipio por descubrir</title></path>`).join('');
  $('#province-lines').innerHTML=geography.provinces.map(p=>`<path class="province-line" d="${p.path}"></path><text class="province-name" x="${p.point[0]}" y="${p.point[1]}">${esc(p.name)}</text>`).join('');
}
function renderMap(){
  const open=new Set(frontier());
  for(const path of $('#terrain').children){
    const id=path.dataset.id,known=owned(id),ready=eligible.has(id)&&(!state.originId||open.has(id));
    path.setAttribute('class',['municipality',eligible.has(id)?'pilot':'',known?'discovered':ready?'available':'locked',selected===id?'selected':''].filter(Boolean).join(' '));
    path.querySelector('title').textContent=known?place(id).name:ready?'Municipio disponible para descubrir':'Territorio todavía sin explorar';
  }
  renderPins();
  $('#daily-badge').textContent=`${practicePool(state).length} / ${eligible.size} descubiertos · Sin límite diario`;
  $('#collection-count').textContent=practicePool(state).length;
}
function destinationLabel(id){return `Destino ${String(frontier().indexOf(id)+1).padStart(2,'0')}`;}
function silhouette(id,cls='silhouette'){
 const p=place(id),b=p.bbox,pad=3;
 return `<svg class="${cls}" viewBox="${b[0]-pad} ${b[1]-pad} ${b[2]-b[0]+pad*2} ${b[3]-b[1]+pad*2}" aria-hidden="true"><path d="${p.path}"></path></svg>`;
}
function symbol(p,type,cls=''){
 return p[type]?`<img class="${cls}" src="${esc(p[type])}" alt="${type==='flag'?'Bandera':'Escudo'} de ${esc(p.name)}">`:`<span class="symbol-pending">${type==='flag'?'Bandera':'Escudo'}<small>Imagen pendiente de verificar</small></span>`;
}
function number(value,digits=0){return Number.isFinite(value)?new Intl.NumberFormat('es-ES',{maximumFractionDigits:digits}).format(value):'—';}
function factLink(url,label='Ver fuente'){return url?`<a class="fact-source" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`:'';}

function renderPins(){
  if(!viewport||!municipalities)return;
  if(!state.originId){$('#pins').innerHTML='';return;}
  const unit=Math.max(viewport[2]/Math.max(map.clientWidth||850,350),viewport[3]/Math.max(map.clientHeight||700,330));
  const full=viewport[2]>650, labels=[];
  const ids=full?[state.originId]:[...practicePool(state),...frontier()].sort((a,b)=>(b===selected)-(a===selected)||(b===state.originId)-(a===state.originId));
  $('#pins').innerHTML=ids.map(id=>{
    const p=place(id),[x,y]=p.point,known=owned(id),origin=state.originId===id;
    const size=unit*(full?14:15),labelSize=unit*12,labelY=y+size*2.1;
    const label=known?p.name:destinationLabel(id);
    const rect=[x-label.length*labelSize*.27,labelY-labelSize,x+label.length*labelSize*.27,labelY+labelSize*.3];
    const showLabel=(known||selected===id)&&!labels.some(r=>r[0]<rect[2]&&r[2]>rect[0]&&r[1]<rect[3]&&r[3]>rect[1]);
    if(showLabel)labels.push(rect);
    return `<g class="pin ${known?'':'mystery-pin'}" data-id="${id}" tabindex="0" role="button" aria-label="${esc(label)}${known?', descubierto':', disponible para explorar'}">${origin?`<circle class="origin-halo" cx="${x}" cy="${y}" r="${size*1.28}"></circle>`:''}<circle cx="${x}" cy="${y}" r="${size}"></circle>${known&&p.shield?`<image href="${esc(p.shield)}" x="${x-size*.58}" y="${y-size*.82}" width="${size*1.16}" height="${size*1.64}"></image>`:`<text x="${x}" y="${y+size*.32}" text-anchor="middle" style="font-size:${size}px;stroke:none">${known?'•':'?'}</text>`}${showLabel?`<text x="${x}" y="${labelY}" text-anchor="middle" style="font-size:${labelSize}px;stroke-width:${unit*3}px">${esc(label)}</text>`:''}</g>`;
  }).join('');
  document.querySelectorAll('.province-name').forEach(e=>e.style.display=full?'':'none');
}

function selectPlace(id){
  if(!state.originId)return;
  if(!eligible.has(id)){tip('Por ahora puedes explorar Bajo Aragón y Matarraña. Ampliaremos el resto de Aragón más adelante.');return;}
  if(!owned(id)&&!frontier().includes(id)){tip('Descubre un municipio que comparta frontera con este para abrir una nueva ruta.');return;}
  selected=id;showPage('map');renderMap();
  if(owned(id)){
    openDialog(`<div class="dialog-inner card-dialog"><p class="eyebrow">Tu colección</p><h2 id="dialog-title">${esc(place(id).name)}</h2>${card(id)}<button class="primary" data-action="review" data-id="${id}">Repasar este municipio</button></div>`);
  }else{
    openDialog(`<div class="dialog-inner"><p class="eyebrow">${esc(destinationLabel(id))}</p><h2 id="dialog-title">Territorio por descubrir</h2><div class="mystery-outline">${silhouette(id)}</div><p>4 pantallas · 3 preguntas · 1 nueva carta</p><button class="primary" data-action="explore" data-id="${id}">Descubrir este municipio →</button></div>`);
  }
}

function card(id,origin=state.originId===id){
  const p=place(id);
  return `<article class="card"><div class="card-face">${symbol(p,'flag','flag')}<div class="shield-stamp">${symbol(p,'shield')}</div></div><div class="card-body"><h3 class="card-name">${esc(p.name)}</h3><div class="card-place">${esc(p.comarca)} · ${esc(p.province)}</div><div class="card-geography">${silhouette(id)}<span><strong>${number(p.areaKm2,2)} km²</strong><small>Superficie municipal</small></span></div><div class="card-population"><strong>${number(p.population)}</strong> habitantes <span>· ${esc(p.populationYear||'Año pendiente')}</span></div><hr class="card-rule"><div class="patron-label">Patrón / patrona</div><div class="patron-name">${esc(p.patron||'Pendiente de contrastar')}</div><div class="patron-date">${esc(p.festivalLabel||'Celebración local')}<br>${esc(p.festival||'Fecha pendiente de contrastar')}</div>${p.singularity?`<div class="card-story"><span>Un detalle para recordar</span><p>${esc(typeof p.singularity==='string'?p.singularity:p.singularity.text)}</p></div>`:''}${origin?'<span class="origin-tag">Aquí empezó tu aventura</span>':''}</div></article>`;
}

function renderStart(){
  const start=$('#onboarding');
  start.hidden=!!state.originId;$('#map-panel').hidden=!state.originId;
  if(state.originId)return;
  // Keep the search field and caret intact during background refreshes.
  if($('#municipality-search'))return;
  start.innerHTML=`<div class="start-card"><p class="eyebrow">Bajo Aragón · Matarraña</p><h1>¿Dónde empezamos?</h1><p>Busca tu municipio de origen y descubre los pueblos que lo rodean.</p><label for="municipality-search" class="search-label">Tu punto de partida</label><div class="search-wrap"><span aria-hidden="true">⌕</span><input id="municipality-search" type="search" placeholder="Escribe un municipio…" autocomplete="off" aria-controls="origin-list"></div><div id="origin-list" class="origin-results" aria-live="polite">${originList('')}</div><p class="start-note">${eligible.size} municipios · Cada descubrimiento abre nuevas rutas.</p></div>`;
}
function originList(query){
 const normalized=stripAccents(query.trim());
 if(!normalized)return '<p class="search-hint">Por ejemplo, La Ginebrosa, Alcorisa o Valderrobres.</p>';
 const ids=[...eligible].filter(id=>stripAccents(place(id).name).includes(normalized)).sort((a,b)=>place(a).name.localeCompare(place(b).name,'es'));
 return ids.length?ids.slice(0,8).map(id=>`<button class="origin-result" data-action="origin" data-id="${id}"><span><strong>${esc(place(id).name)}</strong><small>${esc(place(id).comarca)}</small></span><span aria-hidden="true">→</span></button>`).join('')+(ids.length>8?'<p class="search-hint">Escribe alguna letra más para afinar la búsqueda.</p>':''):'<p class="search-hint">No encontramos ese municipio en Bajo Aragón o Matarraña.</p>';
}
function renderCollection(){
  const ids=practicePool(state).sort((a,b)=>place(a).name.localeCompare(place(b).name,'es'));
  $('#collection').innerHTML=`<p class="eyebrow">Tu colección</p><h1>Tus municipios.</h1><p class="collection-progress">${ids.length} de ${eligible.size} cartas de Bajo Aragón y Matarraña · ${ids.length} de 731 municipios de Aragón</p>${ids.length?`<div class="collection-grid">${ids.map(id=>`<button class="collection-item" data-action="view-card" data-id="${id}" aria-label="Abrir carta de ${esc(place(id).name)}">${card(id)}</button>`).join('')}</div><p class="subtle" style="margin-top:25px">Los futuros juegos de banderas utilizarán únicamente tus municipios descubiertos.</p>`:'<div class="empty"><span aria-hidden="true">✧</span><p class="intro">Toda colección empieza con un lugar.<br>Elige tu municipio y consigue tu primera carta.</p><button class="primary" data-action="map">Elegir mi punto de partida</button></div>'}`;
}
function renderAll(){renderStart();renderMap();renderCollection();}
function showPage(page){$('#explorer').hidden=page!=='map';$('#collection').hidden=page!=='collection';$('#nav-map').classList.toggle('active',page==='map');$('#nav-cards').classList.toggle('active',page==='collection');if(page==='collection')renderCollection();else requestAnimationFrame(renderPins);}

function openDialog(html){
  $('#dialog-content').innerHTML=html;
  if(!dialog.open){lastFocus=document.activeElement;dialog.showModal();}
  dialog.scrollTop=0;
  requestAnimationFrame(()=>{const el=$('#dialog-content .primary')||$('#dialog-content button')||$('#close-dialog');el?.focus({preventScroll:true});});
}
function closeDialog(){session=null;dialog.close();if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});else $('#nav-map').focus({preventScroll:true});}
function miniMap(id){
  const p=place(id),box=fitMini(p),neighbors=new Set(p.neighbors);
  return `<svg class="location-mini" viewBox="${box.join(' ')}" role="img" aria-label="Ubicación de ${esc(p.name)} entre los municipios vecinos"><title>${esc(p.name)} y su entorno</title>${geography.municipalities.filter(m=>m.id===id||neighbors.has(m.id)).map(m=>`<path d="${m.path}" fill="${m.id===id?'#1ba68d':'#e8eff5'}" stroke="#8da9b8" stroke-width=".7" vector-effect="non-scaling-stroke"></path>`).join('')}<circle cx="${p.point[0]}" cy="${p.point[1]}" r="${box[2]*.018}" fill="#ffffff" stroke="#12695e" stroke-width="1" vector-effect="non-scaling-stroke"></circle></svg>`;
}
function fitMini(p){const [x0,y0,x1,y1]=p.bbox;let h=Math.max(15,y1-y0)*1.6,w=Math.max(15,x1-x0)*1.6;if(w/h<1.9)w=h*1.9;else h=w/1.9;return [(x0+x1-w)/2,(y0+y1-h)/2,w,h];}
function startLesson(id,review=false){
  if(review&&!owned(id)){toast('Primero tienes que descubrir este municipio.');return;}
  if(!review&&(!frontier().includes(id)||remaining()===0)){toast('Elige un municipio disponible en el mapa.');return;}
  session={id,review,stage:'lesson',slide:0,question:0,correct:0,answered:false,questions:[]};renderLesson();
}
function renderLesson(){
  const p=place(session.id),step=session.slide;
  const stats=`<div class="area-fact"><strong>${number(p.areaKm2,2)} <small>km²</small></strong><span>Superficie del término municipal</span></div>`;
  const visuals=[
    `${miniMap(session.id)}${stats}<div class="detail-pair"><span>${esc(p.comarca)}</span><span>${esc(p.province)}</span></div>${factLink(p.areaSource,'Cartografía y superficie · Gobierno de Aragón')}`,
    `<div class="lesson-visual">${symbol(p,'flag','lesson-flag')}${symbol(p,'shield','lesson-shield')}</div><div class="lesson-caption"><span>BANDERA</span><span>ESCUDO</span></div>`,
    `<div class="population-hero"><span>UN MUNICIPIO, MUCHAS HISTORIAS</span><strong>${number(p.population)}</strong><span>habitantes · ${esc(p.populationYear||'Año pendiente')}</span>${factLink(p.populationSource,p.populationSourceLabel||'Fuente de población')}</div>${p.singularity?`<div class="story-fact"><span>UN DETALLE PARA RECORDAR</span><p>${esc(typeof p.singularity==='string'?p.singularity:p.singularity.text)}</p>${factLink(p.singularitySource||p.singularity?.source)}</div>`:''}`,
    `<div class="patron-visual"><span aria-hidden="true">✦</span><h3>${esc(p.patron||'Patronazgo pendiente de contrastar')}</h3><p>${esc(p.festivalLabel||'Celebración local')}<br><strong>${esc(p.festival||'Fecha pendiente de contrastar')}</strong></p></div>${factLink(p.festivalSource||p.sources?.[0],'Fuente de la celebración')}`
  ];
  const titles=['Aquí está '+p.name,'Sus símbolos','Conoce el pueblo','Su celebración'];
  const text=['Fíjate en su forma y en el lugar que ocupa dentro de Aragón.',p.flag||p.shield?'Observa los símbolos que están documentados para este municipio.':'Todavía no hay símbolos municipales contrastados para mostrar. No usaremos imágenes inventadas.','Una cifra para situarte y un detalle para llevarte contigo.',p.patron||p.festival?'Conoce las celebraciones que hemos podido documentar.':'Seguimos contrastando las fiestas y el patronazgo de este municipio antes de mostrarlos como datos ciertos.'];
  openDialog(`<div class="dialog-inner"><p class="eyebrow">${session.review?'Volver a conocer':'Conoce'} · ${esc(p.name)}</p><div class="lesson-step" aria-label="Paso ${step+1} de 4">${[0,1,2,3].map(i=>`<i class="${i<=step?'active':''}"></i>`).join('')}</div><h2 id="dialog-title">${esc(titles[step])}</h2><p>${esc(text[step])}</p>${visuals[step]}<div class="button-row">${step>0?'<button class="secondary" data-action="lesson-back">Atrás</button>':''}<button class="primary" data-action="lesson-next">${step===3?'Estoy listo para el reto':'Siguiente'} <span aria-hidden="true">→</span></button></div><p class="subtle" style="text-align:center">${step+1} / 4</p></div>`);
}

function startQuiz(){
  if(session.review&&practicePool(state).length<2){
    openDialog(`<div class="dialog-inner success"><p class="eyebrow">Presentación repasada</p><h2 id="dialog-title">Tu aventura acaba de empezar.</h2><p>Ya has vuelto a mirar tu primera carta. Cuando descubras otro municipio, podrás comparar sus símbolos en los retos de repaso.</p><button class="primary" data-action="success-map">Volver al mapa →</button></div>`);session=null;return;
  }
  // The only new symbols shown in exploration belong to the chosen destination.
  const p=place(session.id),ids=[session.id,...shuffle(practicePool(state).filter(id=>id!==session.id)).slice(0,3)];
  // Only show a heraldic question when another discovered card offers a real comparison.
  // Otherwise use actual municipal silhouettes; do not fabricate symbols.
  const kind=(p.flag&&ids.filter(id=>place(id).flag).length>=2)?'flag':(p.shield&&ids.filter(id=>place(id).shield).length>=2)?'shield':'shape';
  const symbolIds=ids.filter(id=>kind==='shape'||place(id)[kind]);
  const symbolic=symbolIds.length>=2?{
    title:kind==='shape'?`¿Cuál es la silueta de ${p.name}?`:`¿Cuál es ${kind==='flag'?'la bandera':'el escudo'} de ${p.name}?`,type:kind==='shape'?'shape':'flag',
    options:shuffle(symbolIds.map(id=>({id,label:place(id).name,image:kind==='shape'?null:place(id)[kind]}))),answer:session.id,
    explanation:`Esta es la ${kind==='flag'?'bandera':kind==='shape'?'silueta':'imagen del escudo'} de ${p.name}.`
  }:{title:`¿Dónde está ${p.name}?`,type:'text',options:shuffle(['Teruel','Zaragoza','Huesca']).map(label=>({id:label,label})),answer:p.province,explanation:`${p.name} está en la provincia de ${p.province}.`};
  const patronOptions=ids.filter((id,i)=>place(id).patron&&ids.findIndex(other=>place(other).patron===place(id).patron)===i).map(id=>({id,label:place(id).patron}));
  const areas=[...new Set(ids.map(id=>place(id).areaKm2))];
  const third=p.patron&&patronOptions.length>=2?{title:`¿Qué patronos acabas de conocer en ${p.name}?`,type:'text',options:shuffle(patronOptions),answer:session.id,explanation:`${p.patron}. Celebración local: ${p.festival}.`}:areas.length>=2?{title:`¿Qué superficie tiene ${p.name}?`,type:'text',options:shuffle(areas).map(value=>({id:String(value),label:number(value,2)+' km²'})),answer:String(p.areaKm2),explanation:`Su término municipal ocupa ${number(p.areaKm2,2)} km².`}:{title:`¿En qué provincia está ${p.name}?`,type:'text',options:shuffle(['Teruel','Zaragoza','Huesca']).map(label=>({id:label,label})),answer:p.province,explanation:`${p.name} está en ${p.province}.`};
  session.questions=[symbolic,
    {title:`¿A qué comarca pertenece ${p.name}?`,type:'text',options:shuffle([...new Set([p.comarca,'Bajo Aragón','Matarraña / Matarranya','Maestrazgo','Andorra-Sierra de Arcos'])].slice(0,4)).map(label=>({id:label,label})),answer:p.comarca,explanation:`${p.name} pertenece a ${p.comarca}.`},
    third
  ];session.stage='quiz';session.question=0;session.correct=0;session.answered=false;renderQuiz();
}
function renderQuiz(){
  const q=session.questions[session.question],p=place(session.id);
  openDialog(`<div class="dialog-inner"><p class="eyebrow">${esc(p.name)} · Pregunta ${session.question+1} de 3</p><div class="lesson-step" aria-label="Pregunta ${session.question+1} de 3">${[0,1,2].map(i=>`<i class="${i<=session.question?'active':''}"></i>`).join('')}</div><h2 id="dialog-title">${esc(q.title)}</h2><p>Elige una respuesta. Cada acierto te acerca a tu carta.</p><div class="options">${q.options.map((o,i)=>`<button class="option" data-action="answer" data-option="${i}" aria-label="${q.type!=='text'?'Imagen, opción '+String.fromCharCode(65+i):esc(o.label)}"><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span>${q.type==='shape'?silhouette(o.id,'option-silhouette'):q.type==='flag'?`<img src="${esc(o.image)}" alt="Opción ${String.fromCharCode(65+i)}">`:esc(o.label)}</button>`).join('')}</div><div id="answer-feedback" aria-live="polite"></div></div>`);
}
function answer(index){
  if(!session||session.stage!=='quiz'||session.answered)return;
  const q=session.questions[session.question],option=q.options[index];if(!option)return;
  session.answered=true;const correct=option.id===q.answer;if(correct)session.correct++;
  document.querySelectorAll('.option').forEach((el,i)=>{el.disabled=true;if(q.options[i].id===q.answer)el.classList.add('correct');else if(i===index)el.classList.add('wrong');});
  $('#answer-feedback').innerHTML=`<div class="feedback ${correct?'':'wrong'}"><strong>${correct?'¡Bien recordado!':'Una pista para la próxima.'}</strong><br>${esc(q.explanation)}</div><button class="primary" style="margin-top:16px" data-action="${correct?'quiz-next':'quiz-retry'}">${correct?(session.question===2?'Terminar el reto':'Siguiente pregunta'):'Volver a mirar y reintentar'} →</button>${correct?'':'<p class="subtle" style="text-align:center">El intento no consume ningún descubrimiento.</p>'}`;
  $('#answer-feedback button').focus({preventScroll:true});
}
function finishQuiz(){
  const s=session;if(!s||s.correct!==3)return;
  if(s.review){session=null;showSuccess(s.id,true,false);return;}
  const result=discover(state,s.id,municipalities,eligible,true);
  if(!result.ok){session=null;openDialog(`<div class="dialog-inner"><h2 id="dialog-title">Vuelve al mapa para continuar.</h2><p>${result.reason==='daily-limit'?'Has alcanzado el cupo de hoy. Puedes repasar tus cartas y volver a descubrir mañana.':'Este municipio ya no está disponible para este descubrimiento. Vuelve al mapa para continuar.'}</p><button class="primary" data-action="close">Volver al mapa</button></div>`);renderAll();return;}
  state=result.state;persist();selected=s.id;session=null;renderAll();showSuccess(s.id,false,false);
}
function showSuccess(id,review,origin){
  const p=place(id);
  openDialog(`<div class="dialog-inner success"><p class="success-tag">${origin?'AQUÍ EMPIEZA TU AVENTURA':review?'UN PUEBLO BIEN RECORDADO':'UN NUEVO LUGAR EN TU MAPA'}</p><div class="success-seal">${p.shield?symbol(p,'shield'):silhouette(id)}</div><h2 id="dialog-title">${esc(p.name)}</h2><p>${origin?'Tu primera carta ya es tuya. Desde aquí podrás explorar los municipios que comparten frontera con tu pueblo.':review?'Has repasado su identidad, su comarca y sus patronos. El repaso no consume descubrimientos.':'Has conseguido su carta y su territorio se ha iluminado. Tu recorrido por Aragón acaba de crecer.'}</p><p><strong>${origin?'Carta de origen · gratuita':review?'3 de 3 respuestas correctas':'Nuevas fronteras desbloqueadas'}</strong></p>${origin?`<button class="secondary" data-action="review" data-id="${id}">Conocer mi municipio</button>`:''}<button class="primary" data-action="success-map">${origin?'Explorar mis alrededores':'Volver a mi mapa'} <span aria-hidden="true">→</span></button></div>`);
}
function settings(){
  openDialog(`<div class="dialog-inner"><p class="eyebrow">Modo de prueba</p><h2 id="dialog-title">Explora sin límite diario.</h2><p>El límite de tres descubrimientos está pausado. Puedes recorrer los ${eligible.size} municipios de Bajo Aragón y Matarraña en una misma partida.</p><div class="separator"></div><p><strong>Tu progreso se guarda en este navegador.</strong></p><button class="text-button" data-action="ask-reset">Elegir otro origen y empezar desde cero</button></div>`);
}
async function sources(){
  openDialog(`<div class="dialog-inner"><p class="eyebrow">Datos y símbolos reales</p><h2 id="dialog-title">Fuentes y créditos.</h2><div class="source-list"><p>Mapa municipal: <a href="https://icearagon.aragon.es/portal/wfs.jsp" target="_blank" rel="noopener noreferrer">IGEAR · Gobierno de Aragón</a>. Consulta del 15 de octubre de 2026. Geometrías simplificadas para el juego; las vecindades se calculan con los límites originales.</p><h3>Datos de tus municipios</h3><p>Las fuentes de cada nuevo destino aparecen al descubrirlo.</p><ul>${Object.entries(content).filter(([id])=>owned(id)||session?.id===id).map(([id,p])=>`<li><strong>${esc(p.name)}</strong><br>${[...new Set([...(p.sources||[]),p.areaSource,p.populationSource,p.singularitySource].filter(Boolean))].map((url,i)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(new URL(url).hostname.replace('www.',''))}</a>`).join(' · ')}</li>`).join('')}</ul><h3>Banderas y escudos</h3><div id="asset-credits">Cargando atribuciones…</div></div></div>`);
  try{const credits=await loadJson('credits.json');if($('#asset-credits'))$('#asset-credits').innerHTML=credits.filter(c=>c.localFile==='assets/aragon-shield.png'||Object.keys(content).some(id=>(owned(id)||session?.id===id)&&[content[id].flag,content[id].shield].includes(c.localFile))).map(c=>`<p><a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer"><strong>${esc(c.name)}</strong></a><br>${esc(c.author||'Autoría indicada en la fuente')} · <a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(c.license)}</a><br>${esc(c.changes)}</p>`).join('');}catch{if($('#asset-credits'))$('#asset-credits').textContent='No se pudieron cargar las atribuciones. Vuelve a intentarlo.';}
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action,id=button.dataset.id;
  if(action==='select')selectPlace(id);
  else if(action==='back'){selected=null;renderStart();renderMap();}
  else if(action==='origin'){
    const result=chooseOrigin(state,id,eligible);if(!result.ok)return;
    state=result.state;persist();selected=id;renderAll();showZone();showSuccess(id,false,true);
  }
  else if(action==='explore')startLesson(id);
  else if(action==='review')startLesson(id,true);
  else if(action==='lesson-back'&&session){session.slide=Math.max(0,session.slide-1);renderLesson();}
  else if(action==='lesson-next'&&session){if(session.slide<3){session.slide++;renderLesson();}else startQuiz();}
  else if(action==='answer')answer(Number(button.dataset.option));
  else if(action==='quiz-next'&&session){if(session.question===2)finishQuiz();else{session.question++;session.answered=false;renderQuiz();}}
  else if(action==='quiz-retry'&&session){session.stage='lesson';session.slide=0;session.correct=0;session.question=0;session.answered=false;renderLesson();}
  else if(action==='success-map'){closeDialog();selected=null;showPage('map');showZone();renderAll();}
  else if(action==='close')closeDialog();
  else if(action==='collection')showPage('collection');
  else if(action==='map'){showPage('map');selected=null;renderStart();renderMap();}
  else if(action==='locate'){if(dialog.open)closeDialog();selected=id;showPage('map');renderMap();setView(fitIds([id,...municipalities.get(id).neighbors],.1));if(window.innerWidth<700)map.scrollIntoView({behavior:'smooth',block:'center'});}
  else if(action==='view-card')openDialog(`<div class="dialog-inner card-dialog"><p class="eyebrow">Tu colección</p><h2 id="dialog-title">Un lugar descubierto.</h2>${card(id)}${miniMap(id)}<div class="button-row"><button class="secondary" data-action="locate" data-id="${id}">Ver en el mapa</button><button class="primary" data-action="review" data-id="${id}">Repasar</button></div></div>`);
  else if(action==='sources')sources();
  else if(action==='ask-reset')openDialog(`<div class="dialog-inner"><h2 id="dialog-title">¿Volvemos al principio?</h2><p>Se borrará únicamente el progreso de esta prueba en este navegador. Podrás elegir otro municipio de origen.</p><div class="button-row"><button class="secondary" data-action="settings">Conservar mi progreso</button><button class="primary" data-action="reset">Empezar desde cero</button></div></div>`);
  else if(action==='settings')settings();
  else if(action==='reset'){state=freshState();selected=null;$('#onboarding').innerHTML='';persist();closeDialog();showPage('map');setView(geography.bounds);renderAll();toast('Todo listo para una nueva aventura.');}
});
document.addEventListener('input',event=>{if(event.target.id==='municipality-search')$('#origin-list').innerHTML=originList(event.target.value);});
$('#nav-map').addEventListener('click',()=>state&&showPage('map'));
$('#nav-cards').addEventListener('click',()=>state&&showPage('collection'));
$('#settings').addEventListener('click',()=>state&&settings());
$('#sources').addEventListener('click',()=>content&&sources());
$('#close-dialog').addEventListener('click',closeDialog);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeDialog();}});
$('#zoom-in').addEventListener('click',()=>viewport&&zoom(.72));
$('#zoom-out').addEventListener('click',()=>viewport&&zoom(1/.72));
$('#zoom-region').addEventListener('click',()=>geography&&showZone());
$('#zoom-all').addEventListener('click',()=>geography&&setView(geography.bounds));
map.addEventListener('keydown',event=>{const target=event.target.closest('[data-id]');if(target&&['Enter',' '].includes(event.key)){event.preventDefault();selectPlace(target.dataset.id);}});
map.addEventListener('pointerdown',event=>{
  if(event.button!==0||!viewport||pointer||event.isPrimary===false)return;
  pointer={id:event.pointerId,x:event.clientX,y:event.clientY,box:[...viewport],target:event.target.closest('[data-id]')?.dataset.id};dragging=false;
  map.setPointerCapture(event.pointerId);
});
map.addEventListener('pointermove',event=>{
  if(!pointer||event.pointerId!==pointer.id)return;
  const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
  if(Math.hypot(dx,dy)>5)dragging=true;
  if(dragging){map.classList.add('dragging');const scale=Math.max(pointer.box[2]/map.clientWidth,pointer.box[3]/map.clientHeight);setView([pointer.box[0]-dx*scale,pointer.box[1]-dy*scale,pointer.box[2],pointer.box[3]]);}
});
map.addEventListener('pointerup',event=>{
  if(!pointer||event.pointerId!==pointer.id)return;const id=pointer.target;const wasDragging=dragging;pointer=null;dragging=false;map.classList.remove('dragging');map.releasePointerCapture(event.pointerId);if(!wasDragging&&id)selectPlace(id);
});
map.addEventListener('pointercancel',()=>{pointer=null;dragging=false;map.classList.remove('dragging');});
map.addEventListener('wheel',event=>{if(!viewport)return;event.preventDefault();zoom(event.deltaY>0?1.12:.89);},{passive:false});
window.addEventListener('resize',()=>viewport&&renderPins());
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state)renderAll();});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY||!municipalities)return;
  try{state=normalizeState(JSON.parse(event.newValue),municipalities,eligible);selected=null;session=null;if(dialog.open)closeDialog();renderAll();toast('Tu recorrido se ha actualizado desde otra pestaña.');}catch{}
});

try{
  [geography,content]=await Promise.all([loadJson('map-data.json'),loadJson('pilot-content.json')]);
  municipalities=new Map(geography.municipalities.map(m=>[m.id,m]));eligible=new Set(Object.keys(content));
  state=freshState();try{state=normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)),municipalities,eligible);}catch{}
  $('#pilot-count').textContent=`Bajo Aragón y Matarraña · ${eligible.size} municipios`;
  buildMap();setView(state.originId?fitIds([...practicePool(state),...frontier()],.24):geography.bounds);renderAll();
  // Refresh the visible cup when the Madrid calendar day changes, including idle tabs.
  let observedDay=dayKey();setInterval(()=>{const today=dayKey();if(today!==observedDay){observedDay=today;renderAll();}},30000);
}catch(error){
  console.error(error);$('#main').innerHTML='<div class="error-box"><h1>El mapa aún no ha llegado.</h1><p>No se han podido cargar los datos. Comprueba la conexión y vuelve a abrir la página.</p><button class="primary" onclick="location.reload()">Volver a intentarlo</button></div>';
}
