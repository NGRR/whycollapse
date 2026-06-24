(function(){
  const canvas=document.getElementById('protea-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const points=[];
  let w,h,mouse={x:.7,y:.42};
  function resize(){
    w=canvas.width=window.innerWidth*devicePixelRatio;
    h=canvas.height=window.innerHeight*devicePixelRatio;
    canvas.style.width=window.innerWidth+'px';
    canvas.style.height=window.innerHeight+'px';
    points.length=0;
    for(let i=0;i<90;i++) points.push({x:Math.random()*w,y:Math.random()*h,r:1+Math.random()*2,a:.1+Math.random()*.35});
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.globalAlpha=.45;
    ctx.strokeStyle='rgba(7,18,38,.20)';
    ctx.lineWidth=1*devicePixelRatio;
    for(const p of points){
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*devicePixelRatio,0,Math.PI*2);ctx.stroke();
    }
    ctx.strokeStyle='rgba(255,90,0,.18)';
    for(let i=0;i<points.length-1;i+=3){
      ctx.beginPath();ctx.moveTo(points[i].x,points[i].y);ctx.lineTo(points[i+1].x,points[i+1].y);ctx.stroke();
    }
    ctx.restore();
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  window.addEventListener('pointermove',e=>{mouse.x=e.clientX/window.innerWidth;mouse.y=e.clientY/window.innerHeight;});
  resize();draw();
})();
