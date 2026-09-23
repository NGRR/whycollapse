(function(){
  var modal=document.getElementById("iaoModal");
  var card=document.getElementById("iaoCard");
  var closeButtons=Array.prototype.slice.call(document.querySelectorAll("[data-close]"));
  var slides=Array.prototype.slice.call(document.querySelectorAll(".iao-slide"));
  var navButtons=Array.prototype.slice.call(document.querySelectorAll(".iao-deck-nav button"));
  var prev=document.getElementById("deckPrev");
  var next=document.getElementById("deckNext");
  var currentEl=document.getElementById("deckCurrent");
  var totalEl=document.getElementById("deckTotal");
  var progress=document.getElementById("deckProgress");
  var current=0;

  var CAPACITIES=[
    {code:"A1",title:"Anticipación",value:61.09},
    {code:"A2",title:"Agilidad",value:58.12},
    {code:"A3",title:"Aprendizaje",value:53.17},
    {code:"A4",title:"Adecuación",value:58.48},
    {code:"A5",title:"Antifragilidad",value:60.09}
  ];

  var PIE=[
    {code:"A1",value:56,color:"#0066ff"},
    {code:"A2",value:56,color:"#3288ff"},
    {code:"A3",value:53,color:"#65a8ff"},
    {code:"A4",value:53,color:"#8ec0ff"},
    {code:"A5",value:54,color:"#bedcff"}
  ];

  var INDICATORS=[
    {code:"A1",title:"Anticipación",bars:[["AE",62],["RE",68],["VE",61],["SF",60]],items:["Análisis de entorno (AE)","Realidad estadística (RE)","Visión estratégica futura (VE)","Simulación de futuros (SF)"]},
    {code:"A2",title:"Agilidad",bars:[["VD",61],["ADP",58],["REC",52],["SR",65]],items:["Velocidad de decisión (VD)","Autonomía (ADP)","Redes de comunicación (REC)","Soluciones rápidas (SR)"]},
    {code:"A3",title:"Aprendizaje",bars:[["DR",58],["CC",51],["RC",51],["DO",52]],items:["Obtención de insights (DR)","Gestión del conocimiento (CC)","Redes de colaboración (RC)","Desaprendizaje organizacional (DO)"]},
    {code:"A4",title:"Adecuación",bars:[["FE",53],["CCI",59],["AC",63],["APV",66]],items:["Fluidez estructural (FE)","Coordinación colaborativa (CCI)","Alineación ágil (AC)","Ajuste de la propuesta de valor (APV)"]},
    {code:"A5",title:"Antifragilidad",bars:[["CE",66],["REP",60],["CDI",66],["TO",62],["GAC",56]],items:["Convivencia evolutiva (CE)","Capitalización de riesgos (REP)","Aprovechamiento del desorden (CDI)","Análisis transformacional (TO)","Gestión de conflictos (GAC)"]}
  ];

  var SIGNALS=[
    ["La IA se incorpora sin transformar la organización","La tecnología avanza más rápido que los roles, capacidades y formas de trabajo.","Licencias e infraestructura tecnológica costosa infrautilizadas, con aumento de la frustración y resistencia."],
    ["La innovación existe, pero no consigue escalar","Hay ideas y pilotos, aunque pocas soluciones llegan al negocio.","Inversión a fondo perdido en pruebas piloto que nunca impactan resultados ni generan nuevas vías de ingreso."],
    ["La respuesta al mercado llega tarde","Las decisiones pierden velocidad entre áreas, procesos y niveles jerárquicos.","Pérdida paulatina de cuota de mercado e ingresos frente a organizaciones más ágiles."],
    ["La transformación no produce cambios sostenibles","Las iniciativas avanzan, pero la organización vuelve a sus hábitos anteriores.","Gasto recurrente y fatiga por cambio, con pérdida de confianza en las iniciativas."],
    ["La propuesta de valor pierde vigencia","La organización conoce el cambio, pero no logra convertirlo en una nueva oferta.","Erosión de márgenes y fuga de clientes hacia alternativas más actuales."]
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

  function setSlide(index){
    current=Math.max(0,Math.min(slides.length-1,index));
    slides.forEach(function(slide,i){slide.classList.toggle("is-active",i===current);});
    navButtons.forEach(function(btn,i){btn.classList.toggle("is-active",i===current);});
    currentEl.textContent=String(current+1).padStart(2,"0");
    totalEl.textContent=String(slides.length).padStart(2,"0");
    progress.style.width=((current+1)/slides.length*100)+"%";
    prev.disabled=current===0;
    next.disabled=current===slides.length-1;
    if(current===1){animateResults();}
  }

  card.addEventListener("click",function(){
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    card.setAttribute("aria-expanded","true");
    document.body.classList.add("iao-lock");
    setSlide(0);
    window.setTimeout(function(){document.querySelector(".iao-modal__close").focus({preventScroll:true});},40);
  });

  function closeModal(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    card.setAttribute("aria-expanded","false");
    document.body.classList.remove("iao-lock");
    card.focus({preventScroll:true});
  }
  closeButtons.forEach(function(btn){btn.addEventListener("click",closeModal);});
  document.addEventListener("keydown",function(e){
    if(!modal.classList.contains("is-open")) return;
    if(e.key==="Escape") closeModal();
    if(e.key==="ArrowRight") setSlide(current+1);
    if(e.key==="ArrowLeft") setSlide(current-1);
  });
  navButtons.forEach(function(btn){btn.addEventListener("click",function(){setSlide(Number(btn.getAttribute("data-slide")));});});
  prev.addEventListener("click",function(){setSlide(current-1);});
  next.addEventListener("click",function(){setSlide(current+1);});

  function polar(cx,cy,r,angle){
    var a=(angle-90)*Math.PI/180;
    return [cx+r*Math.cos(a),cy+r*Math.sin(a)];
  }

  function renderRadar(){
    var svg=document.getElementById("resultsRadar");
    var staticG=document.getElementById("radarStatic");
    var polygon=document.getElementById("radarPolygon");
    var dots=document.getElementById("radarDots");
    var legend=document.getElementById("radarLegend");
    var cx=210,cy=210,maxR=145;

    [20,40,60,80].forEach(function(level){
      var r=maxR*(level/80);
      var pts=CAPACITIES.map(function(_,i){return polar(cx,cy,r,i*72);}).map(function(p){return p.join(",");}).join(" ");
      var poly=document.createElementNS("http://www.w3.org/2000/svg","polygon");
      poly.setAttribute("points",pts);staticG.appendChild(poly);
    });
    CAPACITIES.forEach(function(item,i){
      var out=polar(cx,cy,maxR,i*72);
      var line=document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1",cx);line.setAttribute("y1",cy);line.setAttribute("x2",out[0]);line.setAttribute("y2",out[1]);staticG.appendChild(line);
      var lab=polar(cx,cy,maxR+27,i*72);
      var t=document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x",lab[0]);t.setAttribute("y",lab[1]);t.setAttribute("text-anchor","middle");t.textContent=item.code;staticG.appendChild(t);
    });
    var dataPts=CAPACITIES.map(function(item,i){
      var r=maxR*(item.value/80);
      return polar(cx,cy,r,i*72);
    });
    polygon.setAttribute("points",CAPACITIES.map(function(_,i){return cx+","+cy;}).join(" "));
    window.setTimeout(function(){polygon.setAttribute("points",dataPts.map(function(p){return p.join(",");}).join(" "));},80);

    dataPts.forEach(function(p){
      var dot=document.createElementNS("http://www.w3.org/2000/svg","circle");
      dot.setAttribute("cx",p[0]);dot.setAttribute("cy",p[1]);dot.setAttribute("r",4);dot.setAttribute("class","radar-dot");dots.appendChild(dot);
    });

    CAPACITIES.forEach(function(item){
      var b=document.createElement("button");b.type="button";
      b.innerHTML="<b>"+item.code+" · "+item.title+"</b><span>"+item.value.toFixed(2).replace(".",",")+"%</span>";
      legend.appendChild(b);
    });
  }

  function renderPie(){
    var legend=document.getElementById("pieLegend");
    PIE.forEach(function(item){
      var row=document.createElement("div");
      row.innerHTML='<i style="background:'+item.color+'"></i><span>'+item.code+'</span><b>'+item.value+'%</b>';
      legend.appendChild(row);
    });
  }

  function renderBars(){
    var wrap=document.getElementById("miniBars");
    INDICATORS.forEach(function(dim){
      var card=document.createElement("article");card.className="mini-bar";
      var bars=dim.bars.map(function(bar){
        return '<div data-height="'+bar[1]+'"><span>'+bar[1]+'</span><small>'+bar[0]+'</small></div>';
      }).join("");
      var items=dim.items.map(function(x){return "<li>"+x+"</li>";}).join("");
      card.innerHTML='<h4>'+dim.code+' · '+dim.title+'</h4><div class="barplot">'+bars+'</div><ul>'+items+'</ul>';
      wrap.appendChild(card);
    });
  }

  function animateCounts(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'),function(el){
      var target=Number(el.getAttribute("data-count"));
      var start=performance.now();
      function frame(now){
        var p=Math.min(1,(now-start)/850);
        var eased=1-Math.pow(1-p,3);
        el.textContent=(target*eased).toFixed(2).replace(".",",")+"%";
        if(p<1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  var resultsAnimated=false;
  function animateResults(){
    if(resultsAnimated) return;
    resultsAnimated=true;
    animateCounts();
    window.setTimeout(function(){
      Array.prototype.forEach.call(document.querySelectorAll(".barplot div"),function(bar){
        bar.style.height=(Number(bar.getAttribute("data-height"))/80*100)+"%";
      });
    },120);
  }

  var phaseText=document.getElementById("phaseText");
  var phaseTitle=document.getElementById("phaseTitle");
  var phaseRange=document.getElementById("phaseRange");
  var phaseHeaderState=document.getElementById("phaseHeaderState");
  var phaseCopy={
    solid:{
      title:"Sólido",
      range:"0%–48,0%",
      body:"Estructura estable y predecible: alta dependencia de procesos, baja capacidad de reconfiguración y respuesta lenta ante cambios."
    },
    liquid:{
      title:"Líquido · medio",
      range:"48,1%–62,0%",
      body:"Inicia la Respuesta Eficiente: núcleo de la agilidad. Comienza a emerger un equilibrio más significativo en la coordinabilidad y aparecen respuestas más sincrónicas ante fluctuaciones."
    },
    fluid:{
      title:"Fluido",
      range:"62,1%–75,0%",
      body:"La organización redistribuye capacidades con mayor facilidad y reduce fricciones entre estructuras, equipos y decisiones."
    },
    adaptive:{
      title:"Adaptativo",
      range:"75,1%–100%",
      body:"El sistema aprende, se reconfigura y convierte la incertidumbre en una fuente recurrente de renovación."
    }
  };
  Array.prototype.forEach.call(document.querySelectorAll("#phaseTrack button"),function(btn){
    btn.addEventListener("click",function(){
      var state=btn.getAttribute("data-phase");
      var data=phaseCopy[state];
      Array.prototype.forEach.call(document.querySelectorAll("#phaseTrack button"),function(x){x.classList.remove("is-active");});
      Array.prototype.forEach.call(document.querySelectorAll(".phase-scene"),function(x){x.classList.toggle("is-active",x.getAttribute("data-state")===state);});
      btn.classList.add("is-active");
      phaseTitle.textContent=data.title;
      phaseRange.textContent=data.range;
      phaseText.textContent=data.body;
      phaseHeaderState.textContent=data.title.toUpperCase();
    });
  });

  function renderSignals(){
    var wrap=document.getElementById("signalsList");
    SIGNALS.forEach(function(item,i){
      var row=document.createElement("article");row.className="signal-row";
      row.innerHTML='<span class="signal-row__n">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+item[0]+'</h3><p>'+item[1]+'</p></div><aside><b>Consecuencia</b><br>'+item[2]+'</aside>';
      wrap.appendChild(row);
    });
  }

  function renderBenefits(){
    var wrap=document.getElementById("benefitsGrid");
    BENEFITS.forEach(function(item,i){
      var el=document.createElement("article");el.className="benefit-card";
      el.innerHTML='<span class="benefit-card__n">'+String(i+1).padStart(2,"0")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p>';
      wrap.appendChild(el);
    });
  }

  function renderProcess(){
    var wrap=document.getElementById("processTrack");
    PROCESS.forEach(function(item,i){
      var el=document.createElement("article");el.className="process-step";
      el.innerHTML='<b>'+String(i+1).padStart(2,"0")+'</b><h3>'+item[0]+'</h3><p>'+item[1]+'</p>';
      wrap.appendChild(el);
    });
  }

  renderRadar();
  renderPie();
  renderBars();
  renderSignals();
  renderBenefits();
  renderProcess();
  setSlide(0);
})();