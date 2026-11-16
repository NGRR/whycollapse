(() => {
'use strict';
const NS='http://www.w3.org/2000/svg', byId=id=>document.getElementById('v41-eai-'+id), svg=byId('map');
if(!svg)return;
const model=new Map(); let nodes=new Map(), edges=[];
const el=(tag,attrs={},parent=svg)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));parent.append(n);return n;};
const text=(x,y,content,size=18,attrs={},parent=svg)=>{const n=el('text',{x,y,'font-size':size,class:'map-label',...attrs},parent);if(Array.isArray(content)){content.forEach((s,i)=>{const line=el('tspan',{x,dy:i===0?0:size*1.18},n);line.textContent=s;});}else n.textContent=content;return n;};
const path=(d,cls='map-line',parent=svg)=>el('path',{d,class:cls},parent);
const point=(x,y,r=4)=>el('circle',{cx:x,cy:y,r,class:'map-point'});
const edge=(d,ids,cls='map-line')=>{const n=path(d,'map-edge '+cls);edges.push({n,ids});};
const add=(id,label,type,desc,links,group)=>model.set(id,{id,label,type,desc,links,group});
const D=[
{id:'p',x:447,name:'PERCEPCIÓN',short:'Percepción',integrated:'perceptor',pill:['Perceptor','Integrado'],labels:[['pv','P. Vigilante'],['pi','P. Introspectivo'],['pin','P. Interna'],['pex','P. Externa']]},
{id:'c',x:824,name:['COORDINACIÓN','CREATIVA'],short:'Coordinación creativa',integrated:'configurador',pill:['Configurador','Integrado'],labels:[['cc','C. Conservativa'],['ct','C. Transformadora'],['ce','C. Estabilizador'],['ctr','C. Transformador']]},
{id:'a',x:1201,name:'COMPRENSIÓN',short:'Comprensión',integrated:'asimilador',pill:['Asimilador','Integrado'],labels:[['at','A. Teórico'],['ap','A. Pragmático'],['cte','C. Teórica'],['cp','C. Práctica']]}
];
for(const d of D){
add(d.id,d.short,'Dimensión','Dimensión central del mapa, con las cuatro expresiones indicadas y su estilo integrado.',[d.integrated,...d.labels.map(l=>l[0])],'Dimensiones');
add(d.integrated,d.pill.join(' '),'Estilo integrado','Conectado directamente con '+d.short.toLowerCase()+' y con los estilos de relación que aparecen en la parte superior del esquema.',[d.id,...(d.id==='p'?['navegante','interprete']:d.id==='c'?['navegante','estratega']:['estratega','interprete'])],'Estilos');
for(const [id,label] of d.labels)add(id,label,'Expresión de '+d.short,'Expresión nombrada en la lámina, situada alrededor de '+d.short.toLowerCase()+'.',[d.id],'Expresiones');
}
add('navegante','Navegante','Relación entre estilos','Se sitúa en el enlace entre Perceptor Integrado y Configurador Integrado.',['perceptor','configurador'],'Estilos');
add('estratega','Estratega','Relación entre estilos','Se sitúa en el enlace entre Configurador Integrado y Asimilador Integrado.',['configurador','asimilador'],'Estilos');
add('interprete','Intérprete','Relación entre estilos','El arco superior conecta Perceptor Integrado y Asimilador Integrado.',['perceptor','asimilador'],'Estilos');
add('armonizador','Armonizador Adaptativo','Marco del mapa','La denominación aparece en el contorno que reúne las tres dimensiones y sus relaciones.',['perceptor','configurador','asimilador','navegante','estratega','interprete'],'Estilos');
add('persona','Persona','Representación central','El símbolo de persona ocupa el centro inferior, conectado gráficamente a las dimensiones.',['p','c','a'],'Dimensiones');
const descriptors={"p":"Reconocer señales, distinguir cambios relevantes e integrar información del entorno con la experiencia y los propios supuestos.","c":"Articular recursos, ideas y acciones para dar continuidad a lo que funciona y construir respuestas diferentes cuando la situación lo requiere.","a":"Construir sentido a partir de la información, relacionar principios con situaciones concretas y revisar interpretaciones mediante la experiencia.","perceptor":"Integra la atención al entorno y la reflexión sobre la propia experiencia. Contrasta señales externas con supuestos internos antes de interpretar una situación.","configurador":"Combina continuidad y transformación: organiza capacidades existentes y ensaya configuraciones alternativas en función del desafío.","asimilador":"Vincula análisis conceptual y aplicación práctica. Integra lo aprendido con la evidencia de la experiencia para orientar nuevas decisiones.","navegante":"Conecta la lectura de señales con la capacidad de reorganizar acciones. Ajusta el rumbo mientras cambian las condiciones, sin perder el propósito.","estratega":"Articula comprensión y configuración de respuestas. Prioriza opciones, anticipa consecuencias y convierte una interpretación en una línea de acción revisable.","interprete":"Relaciona lo observado con marcos de comprensión. Contrasta perspectivas y reconoce patrones para formular interpretaciones útiles ante la incertidumbre.","armonizador":"Integra percepción, coordinación creativa y comprensión. Equilibra continuidad y cambio, reflexión y acción, ajustando su respuesta a las condiciones del contexto.","persona":"La persona constituye el punto de encuentro entre la observación, la construcción de sentido y la acción. La adaptabilidad se manifiesta en la forma de articular estas capacidades.","pv":"Atención a señales, cambios y acontecimientos que pueden alterar la situación.","pi":"Examen de los propios supuestos, reacciones y patrones de pensamiento.","pin":"Registro de la experiencia propia, las necesidades y los estados internos.","pex":"Observación del contexto, las interacciones y las condiciones externas.","cc":"Organización de recursos y prácticas existentes para mantener su utilidad.","ct":"Exploración de configuraciones alternativas cuando las condiciones cambian.","ce":"Consolidación de prácticas que aportan continuidad, consistencia y coordinación.","ctr":"Reconfiguración de prácticas o relaciones para responder a nuevas demandas.","at":"Integración de principios, modelos y relaciones conceptuales para explicar una situación.","ap":"Valoración de alternativas a partir de su utilidad y sus efectos en situaciones concretas.","cte":"Comprensión de las relaciones y principios que permiten explicar un fenómeno.","cp":"Comprensión que se construye y contrasta mediante la aplicación y la experiencia."};
for(const [id,info] of model) info.desc=descriptors[id];
// Geometría vectorial reconstruida a partir de la lámina.
path('M104 198H1474 M104 262H1553 M104 477H1537 M104 624H1554 M104 773H1474 M135 226V812 M620 313V787 M824 162V792 M1026 313V787 M1437 165V812','map-guide');
path('M54 56V810 M47 56H61 M47 810H61 M107 857H1553 M107 849V865 M1553 849V865 M1578 262V624 M1570 262H1586 M1570 624H1586','map-soft');
for(const [x,y] of [[135,262],[135,773],[1437,262],[1437,773]])path('M'+(x-9)+' '+y+'H'+(x+9)+' M'+x+' '+(y-9)+'V'+(y+9),'map-soft');
text(31,443,'β',27,{'font-family':'Georgia,serif','font-style':'italic'});text(1590,468,'β',27,{'font-family':'Georgia,serif','font-style':'italic'});text(824,883,'α',27,{'text-anchor':'middle','font-family':'Georgia,serif','font-style':'italic'});
text(104,81,['Estilo de','Adaptabilidad','Individual (EAI)'],43,{'font-weight':300,'letter-spacing':-1.1});text(1115,63,'MAPA DE ESTILOS INDIVIDUALES',19,{'font-weight':500});path('M1459 56H1536','map-soft');
edge('M624 123 C405 123 202 280 202 477 C202 674 406 830 650 830 H1001 C1235 830 1432 673 1432 477 C1432 279 1240 123 1024 123',['armonizador']);
path('M609 163C352 164 218 321 218 477C218 669 415 819 648 819H1000C1228 819 1418 669 1418 477C1418 316 1262 164 1036 163','map-guide');
path('M352 274 Q577 87 824 216 Q1060 87 1291 274','map-guide');
edge('M463 272V260Q463 217 521 217H1128Q1186 217 1186 260V272',['perceptor','interprete','asimilador']);
edge('M530 304H738',['perceptor','navegante','configurador']);edge('M909 304H1118',['configurador','estratega','asimilador']);
edge('M447 339V397',['perceptor','p']);edge('M824 339V397',['configurador','c']);edge('M1201 339V397',['asimilador','a']);
edge('M202 477H329 M565 477H683 M966 477H1086 M1320 477H1432',['p','c','a'],'map-soft');
edge('M447 550V624 M1201 550V624',['p','a','persona']);edge('M824 550V590 M824 685V759',['c','persona']);
edge('M447 624 Q485 699 572 727 Q824 803 1075 727 Q1161 699 1201 624 M572 727L781 656 M1075 727L866 656',['p','c','a','persona'],'map-dotted');
for(const [x,y,r] of [[463,272,4],[1186,272,4],[530,304,4.5],[738,304,4.5],[909,304,4.5],[1118,304,4.5],[447,339,4],[824,339,4],[1201,339,4],[620,477,4.5],[1026,477,4.5],[447,624,4],[1201,624,4],[572,727,3.5],[1075,727,3.5],[824,759,4]])point(x,y,r);
function node(id,x,y,w,h,lines,size=20,pill=false){
const interactive=model.get(id).group!=='Expresiones';
const g=el('g',interactive?{class:'map-node',tabindex:0,role:'button','aria-label':model.get(id).label,'aria-haspopup':'dialog','data-id':id}:{class:'map-attribute','data-id':id});
el('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:pill?h/2:4,class:pill?'node-pill':'node-hit'},g);
const arr=Array.isArray(lines)?lines:[lines];text(x,y-(arr.length-1)*size*.59+size*.34,arr,size,{'text-anchor':'middle','font-weight':pill||model.get(id).type==='Dimensión'?650:400},g);
nodes.set(id,{g,x,y,w,h});return g;
}
for(const d of D){
const x=d.x,wide=d.id==='c'?141:118;
edge('M'+(x-wide)+' 477Q'+(x-63)+' 397 '+x+' 397Q'+(x+63)+' 397 '+(x+wide)+' 477Q'+(x+63)+' 550 '+x+' 550Q'+(x-63)+' 550 '+(x-wide)+' 477Z',[d.id,...d.labels.map(l=>l[0])],'map-soft');
el('ellipse',{cx:x,cy:477,rx:d.id==='c'?92:89,ry:77,class:'map-dotted'});
for(const [dx,y] of [[-wide,477],[wide,477],[-62,414],[62,414],[-62,533],[62,533],[0,397],[0,550]])point(x+dx,y,Math.abs(dx)===wide?4.7:3.9);
for(const [i,[id,label]] of d.labels.entries()){
const px=x+(i%2===0?-83:83),py=i<2?378:568,lineX=x+(i%2===0?-62:62);edge('M'+lineX+' '+(i<2?394:540)+'V'+(i<2?409:558),[d.id,id],'map-soft');node(id,px,py,150,34,label,17);
}
node(d.id,x,477,d.id==='c'?220:210,65,d.name,21);node(d.integrated,x,305,d.id==='c'?170:164,66,d.pill,20,true);
}
node('navegante',636,287,116,31,'Navegante',16,true);point(636,304,4);node('estratega',1020,302,127,35,'Estratega',17,true);
node('interprete',824,215,139,37,'Intérprete',19,true);node('armonizador',824,124,402,46,'Armonizador Adaptativo',29,true);
const person=el('g',{class:'map-node',tabindex:0,role:'button','aria-label':'Persona','aria-haspopup':'dialog','data-id':'persona'});
el('circle',{cx:824,cy:637,r:48,class:'node-hit'},person);el('circle',{cx:824,cy:637,r:47,fill:'none',stroke:'#171717','stroke-width':1.5},person);el('circle',{cx:824,cy:620,r:11,fill:'#111'},person);el('path',{d:'M802 661V656C802 629 846 629 846 656V661Z',fill:'#111'},person);nodes.set('persona',{g:person,x:824,y:637,w:96,h:96});

const desktop={children:[...svg.children],nodes,edges,box:[0,0,1648,928]};
svg.replaceChildren();nodes=new Map();edges=[];
/* Mobile: a continuous vertical redrawing, not a cropped/scaled desktop.
 * The two adjacent pair links and the outer interpreter bridge are preserved. */
path('M18 83V1239 M382 83V1239 M28 110H372 M28 360H372 M28 695H372 M28 1030H372 M28 1195H372','map-guide');
path('M12 90V1230 M7 90H17 M7 1230H17 M30 1256H370 M30 1251V1261 M370 1251V1261','map-soft');
text(8,660,'β',12,{'font-style':'italic'});text(200,1278,'α',15,{'text-anchor':'middle','font-style':'italic'});
edge('M89 70 Q20 83 20 160V1155 Q20 1238 110 1238H290 Q380 1238 380 1155V160 Q380 83 311 70',['armonizador']);
path('M36 165V1140Q36 1223 120 1223H280Q364 1223 364 1140V165','map-guide');
node('armonizador',200,70,244,44,'Armonizador Adaptativo',17,true);
const rows=[190,525,860];
// The pair links occupy their own vertical corridor, distinct from the dimensions.
edge('M120 190H58V525H120',['perceptor','navegante','configurador']);
edge('M120 525H58V860H120',['configurador','estratega','asimilador']);
edge('M280 190H354V860H280',['perceptor','interprete','asimilador']);
node('navegante',58,409,99,44,'Navegante',13,true);
node('estratega',58,744,99,44,'Estratega',13,true);
node('interprete',342,409,85,44,'Intérprete',13,true);
for(const [i,d] of D.entries()){
 const y=rows[i], cy=y+120,x=200,w=126;
 edge('M200 '+(y+26)+'V'+(cy-52),[d.integrated,d.id]);
 edge('M74 '+cy+'Q126 '+(cy-52)+' 200 '+(cy-52)+'Q274 '+(cy-52)+' 326 '+cy+'Q274 '+(cy+52)+' 200 '+(cy+52)+'Q126 '+(cy+52)+' 74 '+cy+'Z',[d.id,...d.labels.map(l=>l[0])],'map-soft');
 el('ellipse',{cx:x,cy,rx:94,ry:52,class:'map-dotted'});
 for(const [dx,dy] of [[-w,0],[w,0],[-65,-41],[65,-41],[-65,41],[65,41],[0,-52],[0,52]])point(x+dx,cy+dy,3);
 for(const [j,[id,label]] of d.labels.entries()){
 const px=x+(j%2===0?-88:88), py=cy+(j<2?-65:65), lx=x+(j%2===0?-65:65);
 edge('M'+lx+' '+(cy+(j<2?-42:42))+'V'+(py+(j<2?10:-10)),[d.id,id],'map-soft');
 node(id,px,py,160,22,label,14);
 }
 node(d.id,x,cy,205,54,d.name,17);
 node(d.integrated,x,y,160,52,d.pill,16,true);
 point(120,y,3);point(280,y,3);
}
// Direct adjacency of the three dimensions is retained by the dotted axis.
// Persona connections travel independently of the style bridges.
edge('M200 362V405 M200 453V477 M200 697V740 M200 788V812',['p','c','a'],'map-dotted');
edge('M326 310H367V1162H238 M326 645H367 M326 980H367',['p','c','a','persona'],'map-dotted');
edge('M200 1032V1133',['a','persona'],'map-dotted');
const pm=el('g',{class:'map-node',tabindex:0,role:'button','aria-label':'Persona','aria-haspopup':'dialog','data-id':'persona'});
el('circle',{cx:200,cy:1162,r:38,class:'node-hit'},pm);el('circle',{cx:200,cy:1162,r:36,fill:'none',stroke:'#171717','stroke-width':1.3},pm);el('circle',{cx:200,cy:1150,r:9,fill:'#111'},pm);el('path',{d:'M182 1180V1175C182 1155 218 1155 218 1175V1180Z',fill:'#111'},pm);nodes.set('persona',{g:pm,x:200,y:1162,w:76,h:76});
const mobile={children:[...svg.children],nodes,edges,box:[0,0,400,1290]};
const dialog=byId('detail');let activeLayout=desktop,selected=null,trigger=null;
function clear(){selected=null;for(const layout of [desktop,mobile]){for(const {g} of layout.nodes.values())g.classList.remove('is-selected','is-related');for(const e of layout.edges)e.n.classList.remove('is-highlighted');}}
function select(id,target){
 const info=model.get(id);if(!info||info.group==='Expresiones')return;
 clear();selected=id;trigger=target;
 for(const layout of [desktop,mobile]){for(const [key,{g}] of layout.nodes){g.classList.toggle('is-selected',key===id);g.classList.toggle('is-related',info.links.includes(key));}layout.edges.forEach(e=>e.n.classList.toggle('is-highlighted',e.ids.includes(id)));}
 byId('detail-type').textContent=info.type.toUpperCase();byId('detail-title').textContent=info.label;byId('detail-desc').textContent=info.desc;
 const panel=byId('detail-expressions');panel.replaceChildren();const d=D.find(d=>d.id===id);
 if(d){const dl=document.createElement('dl');for(const [key,label] of d.labels){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=descriptors[key];dl.append(dt,dd);}panel.append(dl);}
 if(!dialog.open)dialog.showModal();byId('close').focus();
}
for(const layout of [desktop,mobile])for(const [id,{g}] of layout.nodes){if(model.get(id).group==='Expresiones')continue;g.addEventListener('click',()=>select(id,g));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(id,g);}});}
byId('close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{const n=trigger;clear();if(n&&n.isConnected)n.focus({preventScroll:true});else svg.focus({preventScroll:true});});
function render(mobileMode){activeLayout=mobileMode?mobile:desktop;svg.replaceChildren(...activeLayout.children);svg.setAttribute('viewBox',activeLayout.box.join(' '));svg.setAttribute('tabindex','-1');svg.style.aspectRatio=activeLayout.box[2]+'/'+activeLayout.box[3];}
if(model.size!==23||[desktop,mobile].some(l=>l.nodes.size!==model.size||l.edges.some(e=>e.ids.some(id=>!model.has(id))))||[...model.values()].some(m=>!m.desc||m.links.some(id=>!model.has(id))))throw Error('Inventario EAI incoherente');
// The same drawing and descriptors are reused in both locations. Use the
// available drawing width instead of the outer page width.
const artboard=byId('artboard'), inline=byId('inline'), expanded=byId('expanded'), expandBody=byId('expanded-body'), expandButton=byId('expand'), expandClose=byId('expanded-close');
let mobileMode=null;
function syncLayout(){
 const width=artboard.getBoundingClientRect().width;
 if(width<=0)return;
 const next=width<=760;
 if(next!==mobileMode){mobileMode=next;render(next);}
}
function returnInline(){
 if(artboard.parentNode!==inline)inline.insertBefore(artboard,expandButton);
 mobileMode=null;syncLayout();
 if(expandButton.isConnected)expandButton.focus({preventScroll:true});
}
expandButton.addEventListener('click',()=>{
 if(expanded.open)return;
 expandBody.append(artboard);
 try{expanded.showModal();}catch(error){returnInline();return;}
 mobileMode=null;syncLayout();expandClose.focus({preventScroll:true});
});
expandClose.addEventListener('click',()=>expanded.close());
expanded.addEventListener('click',e=>{if(e.target===expanded)expanded.close();});
expanded.addEventListener('close',returnInline);
svg.removeAttribute('hidden');
syncLayout();
byId('fallback').hidden=true;
expandButton.hidden=false;
if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(syncLayout);ro.observe(artboard);}
window.addEventListener('resize',syncLayout,{passive:true});
})();