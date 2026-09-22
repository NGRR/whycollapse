(function(){
  var DATA=[
    {id:"percepcion",x:500,y:300,r:31,title:"Percepción",body:"Explora cómo se configura la entrada y lectura de información.",axis:"Percepción",mode:"Integración",relation:"P. interna / externa"},
    {id:"comprension",x:688,y:510,r:34,title:"Comprensión",body:"Representa la elaboración conceptual y práctica de la experiencia.",axis:"Comprensión",mode:"Asimilación",relation:"Teórica / práctica"},
    {id:"coordinacion",x:312,y:510,r:34,title:"Coordinación creativa",body:"Organiza la respuesta y la transformación creativa dentro del sistema.",axis:"Coordinación",mode:"Configuración",relation:"Conservativa / transformadora"},
    {id:"interna",x:596,y:232,r:20,title:"P. interna",body:"Lectura orientada hacia señales y procesos internos.",axis:"Percepción",mode:"Vigilancia",relation:"Percepción"},
    {id:"externa",x:404,y:374,r:20,title:"P. externa",body:"Lectura orientada hacia información y señales externas.",axis:"Percepción",mode:"Exploración",relation:"Percepción"},
    {id:"teorica",x:690,y:414,r:20,title:"C. teórica",body:"Comprensión apoyada en marcos conceptuales y abstracción.",axis:"Comprensión",mode:"Interpretación",relation:"Comprensión"},
    {id:"practica",x:688,y:610,r:20,title:"C. práctica",body:"Comprensión orientada a la aplicación y resolución concreta.",axis:"Comprensión",mode:"Aplicación",relation:"Comprensión"},
    {id:"conservativa",x:202,y:515,r:20,title:"C. conservativa",body:"Coordinación que estabiliza, conserva y da continuidad.",axis:"Coordinación",mode:"Estabilización",relation:"Coordinación"},
    {id:"transformadora",x:386,y:520,r:20,title:"C. transformadora",body:"Coordinación que modifica patrones y abre alternativas.",axis:"Coordinación",mode:"Transformación",relation:"Coordinación"}
  ];

  var ns="http://www.w3.org/2000/svg";
  var layer=document.getElementById("iaosNodes");
  var ticks=document.getElementById("iaosTicks");
  var panel=document.getElementById("iaosPanel");
  var card=document.getElementById("iaosCard");
  var close=document.getElementById("iaosClose");
  var title=document.getElementById("infoTitle");
  var body=document.getElementById("infoBody");
  var index=document.getElementById("infoIndex");
  var metricAxis=document.getElementById("metricAxis");
  var metricMode=document.getElementById("metricMode");
  var metricRelation=document.getElementById("metricRelation");

  function el(tag,attrs){
    var node=document.createElementNS(ns,tag);
    Object.keys(attrs||{}).forEach(function(k){node.setAttribute(k,attrs[k]);});
    return node;
  }

  function buildTicks(){
    var cx=500,cy=500,r1=350;
    for(var i=0;i<72;i+=1){
      var major=i%6===0;
      var angle=(i/72)*Math.PI*2-Math.PI/2;
      var inner=r1+(major?8:12);
      var outer=r1+(major?27:21);
      var x1=cx+Math.cos(angle)*inner;
      var y1=cy+Math.sin(angle)*inner;
      var x2=cx+Math.cos(angle)*outer;
      var y2=cy+Math.sin(angle)*outer;
      ticks.appendChild(el("line",{x1:x1.toFixed(2),y1:y1.toFixed(2),x2:x2.toFixed(2),y2:y2.toFixed(2),"class":major?"tick tick--major":"tick"}));
    }
  }

  function selectNode(item,i,group){
    Array.prototype.forEach.call(layer.querySelectorAll(".node-group"),function(g){g.classList.remove("is-active");});
    if(group){group.classList.add("is-active");}
    index.textContent=String(i+1).padStart(2,"0");
    title.textContent=item.title;
    body.textContent=item.body;
    metricAxis.textContent=item.axis;
    metricMode.textContent=item.mode;
    metricRelation.textContent=item.relation;
  }

  DATA.forEach(function(item,i){
    var g=el("g",{"class":"node-group","tabindex":"0","role":"button","aria-label":item.title});
    var ring2=el("circle",{cx:item.x,cy:item.y,r:item.r+19,"class":"node-ring node-ring--dash"});
    var ring=el("circle",{cx:item.x,cy:item.y,r:item.r+10,"class":"node-ring"});
    var node=el("circle",{cx:item.x,cy:item.y,r:item.r,"class":"node"});
    var label=el("text",{x:item.x,y:item.y+item.r+31,"text-anchor":"middle","class":"node-label"});
    label.textContent=item.title;
    g.appendChild(ring2);g.appendChild(ring);g.appendChild(node);g.appendChild(label);
    g.addEventListener("click",function(){selectNode(item,i,g);});
    g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();selectNode(item,i,g);}});
    layer.appendChild(g);
  });

  function openPanel(){
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden","false");
    card.setAttribute("aria-expanded","true");
    document.body.classList.add("iaos-lock");
  }
  function closePanel(){
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    card.setAttribute("aria-expanded","false");
    document.body.classList.remove("iaos-lock");
    card.focus();
  }

  buildTicks();
  card.addEventListener("click",openPanel);
  close.addEventListener("click",closePanel);
  panel.addEventListener("click",function(e){if(e.target===panel){closePanel();}});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("is-open")){closePanel();}});
})();