(function(){
  "use strict";

  var modal=document.getElementById("iaoModal");
  var openButton=document.getElementById("iaoCardOpen");
  var slides=Array.prototype.slice.call(document.querySelectorAll(".iao-slide"));
  var navButtons=Array.prototype.slice.call(document.querySelectorAll(".iao-deck-nav [data-slide]"));
  var prev=document.getElementById("deckPrev");
  var next=document.getElementById("deckNext");
  var currentEl=document.getElementById("deckCurrent");
  var totalEl=document.getElementById("deckTotal");
  var progress=document.getElementById("deckProgress");
  var current=0;

  function setSlide(index){
    current=Math.max(0,Math.min(slides.length-1,index));
    slides.forEach(function(slide,i){
      slide.classList.toggle("is-active",i===current);
      if(i===current && slide.classList.contains("iao-slide--results")){
        window.setTimeout(function(){slide.classList.add("is-animated");},60);
      }
    });
    navButtons.forEach(function(btn,i){btn.classList.toggle("is-active",i===current);});
    currentEl.textContent=String(current+1).padStart(2,"0");
    totalEl.textContent=String(slides.length).padStart(2,"0");
    progress.style.width=((current+1)/slides.length*100)+"%";
    prev.disabled=current===0;
    next.disabled=current===slides.length-1;
  }

  function openModal(){
    setSlide(0);
    document.body.classList.add("iao-lock");
    if(typeof modal.showModal==="function"){
      if(!modal.open){modal.showModal();}
    }else{
      modal.setAttribute("open","");
    }
  }

  function afterClose(){
    document.body.classList.remove("iao-lock");
    if(openButton){openButton.focus({preventScroll:true});}
  }

  if(openButton && modal){
    openButton.addEventListener("click",openModal);
    modal.addEventListener("close",afterClose);
    modal.addEventListener("cancel",function(){
      document.body.classList.remove("iao-lock");
    });
    modal.addEventListener("click",function(event){
      if(event.target===modal){
        if(typeof modal.close==="function"){modal.close();}
        else{modal.removeAttribute("open");afterClose();}
      }
    });
  }

  navButtons.forEach(function(btn){
    btn.addEventListener("click",function(){setSlide(Number(btn.getAttribute("data-slide")));});
  });
  prev.addEventListener("click",function(){setSlide(current-1);});
  next.addEventListener("click",function(){setSlide(current+1);});

  document.addEventListener("keydown",function(event){
    if(!modal.open){return;}
    if(event.key==="ArrowRight"){setSlide(current+1);}
    if(event.key==="ArrowLeft"){setSlide(current-1);}
  });

  var phaseCopy={
    solid:{title:"Sólido",range:"0%–48,0%",body:"Estructura estable y predecible: alta dependencia de procesos, baja capacidad de reconfiguración y respuesta lenta ante cambios."},
    liquid:{title:"Líquido · medio",range:"48,1%–62,0%",body:"Inicia la Respuesta Eficiente: núcleo de la agilidad. Comienza a emerger un equilibrio más significativo en la coordinabilidad y aparecen respuestas más sincrónicas ante fluctuaciones."},
    fluid:{title:"Fluido",range:"62,1%–75,0%",body:"La organización redistribuye capacidades con mayor facilidad y reduce fricciones entre estructuras, equipos y decisiones."},
    adaptive:{title:"Adaptativo",range:"75,1%–100%",body:"El sistema aprende, se reconfigura y convierte la incertidumbre en una fuente recurrente de renovación."}
  };

  var phaseTitle=document.getElementById("phaseTitle");
  var phaseRange=document.getElementById("phaseRange");
  var phaseText=document.getElementById("phaseText");
  var phaseHeaderState=document.getElementById("phaseHeaderState");
  var phaseButtons=Array.prototype.slice.call(document.querySelectorAll("#phaseTrack [data-phase]"));
  var phaseScenes=Array.prototype.slice.call(document.querySelectorAll(".phase-scene"));

  phaseButtons.forEach(function(btn){
    btn.addEventListener("click",function(){
      var state=btn.getAttribute("data-phase");
      var data=phaseCopy[state];
      if(!data){return;}
      phaseButtons.forEach(function(item){item.classList.toggle("is-active",item===btn);});
      phaseScenes.forEach(function(scene){scene.classList.toggle("is-active",scene.getAttribute("data-state")===state);});
      phaseTitle.textContent=data.title;
      phaseRange.textContent=data.range;
      phaseText.textContent=data.body;
      phaseHeaderState.textContent=data.title.toUpperCase();
    });
  });

  setSlide(0);
})();