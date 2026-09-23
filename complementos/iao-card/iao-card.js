(function(){
  var CAPACITIES=[
    {title:"Anticipación",body:"Percibir señales, cambios y oportunidades antes de que resulten evidentes.",x:380,y:110,labelX:380,labelY:76},
    {title:"Agilidad",body:"Responder con rapidez, coordinación y capacidad de decisión.",x:638,y:298,labelX:680,labelY:288},
    {title:"Aprendizaje",body:"Convertir la experiencia y la información en nuevas capacidades.",x:540,y:602,labelX:570,labelY:642},
    {title:"Adecuación",body:"Reinventar la organización y renovar su propuesta de valor. Rediseño ágil de la propuesta de valor.",x:220,y:602,labelX:188,labelY:642},
    {title:"Antifragilidad",body:"Aprender de la incertidumbre y fortalecerse. Capacidad de convertir las crisis en ventajas competitivas.",x:122,y:298,labelX:78,labelY:288}
  ];

  var SIGNALS=[
    ["La IA se incorpora sin transformar la organización","La tecnología avanza más rápido que los roles, capacidades y formas de trabajo.","Licencias e infraestructura tecnológica costosa infrautilizadas, con aumento de la frustración y resistencia en los equipos."],
    ["La innovación existe, pero no consigue escalar","Hay ideas y pilotos, aunque pocas soluciones llegan al negocio.","Inversión a fondo perdido en pruebas piloto que nunca impactan en la cuenta de resultados ni generan nuevas vías de ingresos."],
    ["La respuesta al mercado llega tarde","Las decisiones pierden velocidad entre áreas, procesos y niveles jerárquicos.","Pérdida paulatina de cuota de mercado e ingresos frente a competidores más ágiles que captan antes la demanda."],
    ["La transformación no produce cambios sostenibles","Las iniciativas avanzan, pero la organización vuelve a sus hábitos anteriores.","Gasto recurrente en consultoría e iniciativas que se diluyen, generando fatiga por cambio y desconfianza en la dirección."],
    ["La propuesta de valor pierde vigencia","La organización conoce el cambio, pero no logra convertirlo en una nueva oferta.","Erosión progresiva de los márgenes y fuga de clientes clave hacia alternativas más modernas y alineadas con sus necesidades."]
  ];

  var BENEFITS=[
    ["Una visión compartida","Comprender cómo responde realmente la organización ante los cambios."],
    ["Fricciones visibles","Detectar qué bloquea el aprendizaje, la agilidad y la renovación de la propuesta de valor."],
    ["Prioridades claras","Inversión optimizada: concentra el presupuesto solo en las palancas con impacto real."],
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
  var modal=document.getElementById("iaoModal");
  var close=document.getElementById("iaoClose");
  var scroll=document.getElementById("iaoScroll");
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

  var signalsList=document.getElementById("signalsList");
  SIGNALS.forEach(function(item,i){
    var row=document.createElement("article");
    row.className="signal-row";
    row.innerHTML='<span class="signal-row__n">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+item[0]+'</h3><p>'+item[1]+'</p></div><aside><b>Consecuencia</b><br>'+item[2]+'</aside>';
    signalsList.appendChild(row);
  });

  var benefitsGrid=document.getElementById("benefitsGrid");
  BENEFITS.forEach(function(item,i){
    var card=document.createElement("article");
    card.className="benefit-card";
    card.innerHTML='<span class="benefit-card__n">'+String(i+1).padStart(2,"0")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p>';
    benefitsGrid.appendChild(card);
  });

  var processTrack=document.getElementById("processTrack");
  PROCESS.forEach(function(item,i){
    var step=document.createElement("article");
    step.className="process-step";
    step.innerHTML='<b>'+String(i+1).padStart(2,"0")+'</b><h3>'+item[0]+'</h3><p>'+item[1]+'</p>';
    processTrack.appendChild(step);
  });

  var railButtons=Array.prototype.slice.call(document.querySelectorAll(".iao-modal__rail button"));
  railButtons.forEach(function(button){
    button.addEventListener("click",function(){
      var target=document.getElementById(button.getAttribute("data-target"));
      if(target){target.scrollIntoView({behavior:"smooth",block:"start"});}
    });
  });

  if("IntersectionObserver" in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id=entry.target.id;
          railButtons.forEach(function(btn){btn.classList.toggle("is-active",btn.getAttribute("data-target")===id);});
        }
      });
    },{root:scroll,threshold:.42});
    Array.prototype.forEach.call(document.querySelectorAll(".iao-product-section"),function(section){observer.observe(section);});
  }

  function syncModal(){
    var open=window.location.hash==="#iaoModal";
    modal.classList.toggle("is-open",open);
    modal.setAttribute("aria-hidden",open?"false":"true");
    card.setAttribute("aria-expanded",open?"true":"false");
    document.body.classList.toggle("iao-lock",open);
    if(open){
      window.setTimeout(function(){scroll.scrollTop=0;},0);
      if(close){close.focus({preventScroll:true});}
    }
  }

  card.addEventListener("click",function(){
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    card.setAttribute("aria-expanded","true");
    document.body.classList.add("iao-lock");
  });

  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&window.location.hash==="#iaoModal"){
      window.location.hash="";
      syncModal();
      card.focus({preventScroll:true});
    }
  });

  window.addEventListener("hashchange",syncModal);
  syncModal();
})();