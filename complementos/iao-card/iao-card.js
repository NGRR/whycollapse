(function(){
  var CAPACITIES=[
    {title:"Anticipación",body:"Percibir señales, cambios y oportunidades antes de que resulten evidentes.",x:380,y:110,labelX:380,labelY:76},
    {title:"Agilidad",body:"Responder con rapidez, coordinación y capacidad de decisión.",x:638,y:298,labelX:676,labelY:288},
    {title:"Aprendizaje",body:"Convertir la experiencia y la información en nuevas capacidades.",x:540,y:602,labelX:570,labelY:642},
    {title:"Adecuación",body:"Reinventar la organización y renovar su propuesta de valor.",x:220,y:602,labelX:188,labelY:642},
    {title:"Antifragilidad",body:"Aprender de la incertidumbre y fortalecerse; convertir las crisis en ventajas competitivas.",x:122,y:298,labelX:84,labelY:288}
  ];

  var SIGNALS=[
    {title:"La IA se incorpora sin transformar la organización",body:"La tecnología avanza más rápido que los roles, capacidades y formas de trabajo.",cost:"Infraestructura costosa infrautilizada, frustración y resistencia."},
    {title:"La innovación existe, pero no consigue escalar",body:"Hay ideas y pilotos, aunque pocas soluciones llegan al negocio.",cost:"Pruebas piloto que no impactan resultados ni generan nuevas vías de ingreso."},
    {title:"La respuesta al mercado llega tarde",body:"Las decisiones pierden velocidad entre áreas, procesos y niveles jerárquicos.",cost:"Pérdida progresiva de competitividad frente a organizaciones más ágiles."},
    {title:"La transformación no produce cambios sostenibles",body:"Las iniciativas avanzan, pero la organización vuelve a sus hábitos anteriores.",cost:"Fatiga por cambio, gasto recurrente y desconfianza en la dirección."},
    {title:"La propuesta de valor pierde vigencia",body:"La organización conoce el cambio, pero no logra convertirlo en una nueva oferta.",cost:"Erosión de márgenes y fuga de clientes hacia alternativas más actuales."}
  ];

  var BENEFITS=[
    ["Una visión compartida","Comprender cómo responde realmente la organización ante los cambios."],
    ["Fricciones visibles","Detectar qué bloquea el aprendizaje, la agilidad y la renovación de la propuesta de valor."],
    ["Prioridades claras","Concentrar el presupuesto solo en las palancas con impacto real."],
    ["Decisiones fundamentadas","Sustituir percepciones aisladas por una lectura compartida y basada en evidencias."],
    ["Una hoja de ruta","Traducir los resultados en acciones, responsables y mecanismos de seguimiento."]
  ];

  var PROCESS=[
    ["Contextualizamos","Definimos el desafío, el alcance y los colectivos que conviene escuchar."],
    ["Medimos","Obtenemos el IAO global y por capacidades, áreas, roles o equipos."],
    ["Interpretamos","Identificamos patrones, brechas y palancas de transformación."],
    ["Priorizamos","Construimos una hoja de ruta con iniciativas, responsables y seguimiento."]
  ];

  var ns="http://www.w3.org/2000/svg";
  var card=document.getElementById("iaoCard");
  var panel=document.getElementById("iaoPanel");
  var close=document.getElementById("iaoClose");
  var nodeLayer=document.getElementById("capacityNodes");
  var detailIndex=document.getElementById("detailIndex");
  var detailTitle=document.getElementById("detailTitle");
  var detailBody=document.getElementById("detailBody");

  function svgEl(tag,attrs){
    var n=document.createElementNS(ns,tag);
    Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k]);});
    return n;
  }

  CAPACITIES.forEach(function(item,i){
    var g=svgEl("g",{"class":"capacity-group","tabindex":"0","role":"button","aria-label":item.title});
    var ring=svgEl("circle",{cx:item.x,cy:item.y,r:24,"class":"capacity-ring"});
    var dot=svgEl("circle",{cx:item.x,cy:item.y,r:10,"class":"capacity-dot"});
    var idx=svgEl("text",{x:item.x,y:item.y-34,"text-anchor":"middle","class":"capacity-index"});
    idx.textContent=String(i+1).padStart(2,"0");
    var label=svgEl("text",{x:item.labelX,y:item.labelY,"text-anchor":"middle","class":"capacity-label"});
    label.textContent=item.title.toUpperCase();
    g.appendChild(ring);g.appendChild(dot);g.appendChild(idx);g.appendChild(label);

    function select(){
      Array.prototype.forEach.call(nodeLayer.querySelectorAll(".capacity-group"),function(x){x.classList.remove("is-active");});
      g.classList.add("is-active");
      detailIndex.textContent=String(i+1).padStart(2,"0");
      detailTitle.textContent=item.title;
      detailBody.textContent=item.body;
    }
    g.addEventListener("click",select);
    g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();select();}});
    nodeLayer.appendChild(g);
    if(i===0){g.classList.add("is-active");}
  });

  var signalGrid=document.getElementById("signalGrid");
  SIGNALS.forEach(function(item,i){
    var article=document.createElement("article");
    article.className="signal-card";
    article.innerHTML='<span class="signal-card__index">'+String(i+1).padStart(2,"0")+'</span><h3>'+item.title+'</h3><p>'+item.body+'</p><small>'+item.cost+'</small>';
    signalGrid.appendChild(article);
  });

  var benefitList=document.getElementById("benefitList");
  BENEFITS.forEach(function(item,i){
    var row=document.createElement("article");
    row.className="benefit-item";
    row.innerHTML='<span class="benefit-item__index">'+String(i+1).padStart(2,"0")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p>';
    benefitList.appendChild(row);
  });

  var processList=document.getElementById("processList");
  PROCESS.forEach(function(item,i){
    var li=document.createElement("li");
    li.innerHTML='<b>'+String(i+1).padStart(2,"0")+'</b><div><h3>'+item[0]+'</h3><p>'+item[1]+'</p></div>';
    processList.appendChild(li);
  });

  function activateView(name){
    Array.prototype.forEach.call(document.querySelectorAll(".iao-tab"),function(tab){
      tab.classList.toggle("is-active",tab.getAttribute("data-view")===name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".iao-view"),function(view){
      view.classList.toggle("is-active",view.getAttribute("data-panel")===name);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".iao-tab"),function(tab){
    tab.addEventListener("click",function(){activateView(tab.getAttribute("data-view"));});
  });

  function openPanel(){
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden","false");
    card.setAttribute("aria-expanded","true");
    document.body.classList.add("iao-lock");
    activateView("overview");
  }
  function closePanel(){
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    card.setAttribute("aria-expanded","false");
    document.body.classList.remove("iao-lock");
    card.focus();
  }

  card.addEventListener("click",openPanel);
  close.addEventListener("click",closePanel);
  panel.addEventListener("click",function(e){if(e.target===panel){closePanel();}});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("is-open")){closePanel();}});
})();