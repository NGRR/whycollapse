(() => {
'use strict';
const NS='http://www.w3.org/2000/svg', svg=document.getElementById('map'), byId=id=>document.getElementById(id);
const model=new Map(), nodes=new Map(), edges=[];
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
const g=el('g',{class:'map-node',tabindex:0,role:'button','aria-label':model.get(id).label,'aria-pressed':'false','data-id':id});
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
const person=el('g',{class:'map-node',tabindex:0,role:'button','aria-label':'Persona','aria-pressed':'false','data-id':'persona'});
el('circle',{cx:824,cy:637,r:48,class:'node-hit'},person);el('circle',{cx:824,cy:637,r:47,fill:'none',stroke:'#171717','stroke-width':1.5},person);el('circle',{cx:824,cy:620,r:11,fill:'#111'},person);el('path',{d:'M802 661V656C802 629 846 629 846 656V661Z',fill:'#111'},person);nodes.set('persona',{g:person,x:824,y:637,w:96,h:96});
const views={all:{box:[0,0,1648,928],label:'VISTA GENERAL'},p:{box:[237,254,420,398],label:'PERCEPCIÓN'},c:{box:[590,254,468,456],label:'COORDINACIÓN CREATIVA'},a:{box:[991,254,420,398],label:'COMPRENSIÓN'}};
let currentView='all',selected=null;
function setView(id){if(!views[id])return;currentView=id;svg.dataset.view=id;const {box,label}=views[id];svg.setAttribute('viewBox',box.join(' '));svg.style.aspectRatio=box[2]+'/'+box[3];byId('view-label').textContent=label;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===id)));for(const {g,x,y,w,h} of nodes.values()){const shown=x-w/2>=box[0]&&y-h/2>=box[1]&&x+w/2<=box[0]+box[2]&&y+h/2<=box[1]+box[3];g.setAttribute('tabindex',shown?'0':'-1');g.setAttribute('aria-hidden',String(!shown));}}
function button(id){const b=document.createElement('button');b.type='button';b.textContent=model.get(id).label;b.dataset.concept=id;b.setAttribute('aria-pressed',String(id===selected));b.addEventListener('click',()=>select(id,true));return b;}
function select(id,reveal=false){
const info=model.get(id);if(!info)return;selected=id;
if(reveal&&currentView!=='all'){const d=D.find(d=>d.id===id||d.integrated===id||d.labels.some(l=>l[0]===id));setView(d?d.id:'all');}
for(const [key,{g}] of nodes){g.classList.toggle('is-selected',key===id);g.classList.toggle('is-related',info.links.includes(key));g.setAttribute('aria-pressed',String(key===id));}
edges.forEach(e=>e.n.classList.toggle('is-highlighted',e.ids.includes(id)));
byId('detail-type').textContent=info.type.toUpperCase();byId('detail-title').textContent=info.label;byId('detail-desc').textContent=info.desc;
byId('related').replaceChildren(...info.links.map(key=>button(key)));document.querySelectorAll('[data-concept]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.concept===id)));
}
function reset(){selected=null;setView('all');for(const {g} of nodes.values()){g.classList.remove('is-selected','is-related');g.setAttribute('aria-pressed','false');}edges.forEach(e=>e.n.classList.remove('is-highlighted'));document.querySelectorAll('[data-concept]').forEach(b=>b.setAttribute('aria-pressed','false'));byId('detail-type').textContent='LECTURA DEL MAPA';byId('detail-title').textContent='Tres dimensiones, un mapa';byId('detail-desc').textContent='Selecciona un concepto para destacar las relaciones representadas en el esquema.';byId('related').replaceChildren();}
for(const [id,{g}] of nodes){g.addEventListener('click',()=>select(id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(id);}});}
for(const group of ['Dimensiones','Estilos','Expresiones']){const box=document.createElement('div');box.className='concept-group';const heading=document.createElement('h3');heading.textContent=group;box.append(heading,...[...model.values()].filter(n=>n.group===group).map(n=>button(n.id)));byId('concept-list').append(box);}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));byId('reset').addEventListener('click',reset);document.addEventListener('keydown',e=>{if(e.key==='Escape')reset();});
if(model.size!==23||nodes.size!==model.size||[...model.values()].some(m=>m.links.some(id=>!model.has(id)))||edges.some(e=>e.ids.some(id=>!model.has(id))))throw Error('Inventario de conceptos incoherente');
const mq=matchMedia('(max-width:760px)');setView(mq.matches?'p':'all');mq.addEventListener('change',e=>setView(e.matches?'p':'all'));
})();