/* Cub Quest — Badger Dash
   Lightweight, dependency-free canvas mini-game so it remains fully offline.
   Loaded after the main Cub Quest script and offered only after the badger quiz. */
(function(){
  "use strict";

  var HONEY="#FFC24F", NIGHT="#101B2E", DEEP="#0A1220", SOFT="#1A2942",
      LINE="#2C4064", MOON="#F7F2E4", DIM="#BFC8DA", MOSS="#74C99B",
      EARTH="#A9713F", BERRY="#EE7C8C";

  var style=document.createElement("style");
  style.textContent=`
    #badgerGame{position:fixed;inset:0;z-index:120;display:none;flex-direction:column;background:linear-gradient(180deg,#091421,#102239 55%,#162d2a);color:${MOON};font-family:"Nunito",system-ui,sans-serif;overscroll-behavior:none;touch-action:none}
    #badgerGame.on{display:flex}
    .bg-head{display:flex;align-items:center;gap:12px;padding:calc(12px + env(safe-area-inset-top)) 14px 10px;max-width:820px;width:100%;margin:0 auto}
    .bg-head h2{font-family:"Grandstander","Nunito",sans-serif;font-size:clamp(1.35rem,5vw,2rem);color:${HONEY};margin:0;line-height:1}
    .bg-head p{margin:2px 0 0;color:${DIM};font-size:.82rem;font-weight:700}
    .bg-close{margin-left:auto;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:${SOFT};border:2px solid ${LINE};font-size:1.4rem;font-weight:900}
    .bg-hud{width:min(100% - 28px,790px);margin:0 auto 10px;display:flex;align-items:center;gap:10px}
    .bg-score{background:${SOFT};border:2px solid ${LINE};border-radius:999px;padding:8px 14px;font-family:"Grandstander",sans-serif;font-weight:800;color:${HONEY}}
    .bg-tip{margin-left:auto;color:${DIM};font-size:.8rem;font-weight:700;text-align:right}
    .bg-stage{position:relative;flex:1;min-height:300px;width:min(100%,820px);margin:0 auto;overflow:hidden}
    #badgerCanvas{display:block;width:100%;height:100%;touch-action:none}
    .bg-fact{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.92);width:min(88%,500px);padding:22px 20px;background:rgba(10,18,32,.96);border:3px solid ${HONEY};border-radius:26px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:.22s ease}
    .bg-fact.on{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}
    .bg-fact b{display:block;font-family:"Grandstander",sans-serif;color:${HONEY};font-size:1.45rem;margin-bottom:7px}
    .bg-fact p{margin:0 0 16px;font-size:1.05rem;line-height:1.45}
    .bg-fact button,.bg-start{background:${HONEY};color:#241704;border-radius:999px;padding:12px 20px;font-family:"Grandstander",sans-serif;font-weight:900;border:0;font-size:1rem}
    .bg-win b{font-size:1.8rem}
    #badgerGameBtn{display:none}
    #badgerGameBtn.on{display:inline-flex;align-items:center;gap:8px;background:${MOSS}!important;color:#102018!important}
    #badgerGameBtn::before{content:"🐾";font-size:1.05em}
    @media(max-width:520px){.bg-head{padding-left:12px;padding-right:12px}.bg-tip{font-size:.72rem}.bg-hud{width:calc(100% - 20px)}.bg-stage{min-height:260px}}
  `;
  document.head.appendChild(style);

  var overlay=document.createElement("section");
  overlay.id="badgerGame";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");
  overlay.setAttribute("aria-label","Badger Dash game");
  overlay.innerHTML=`
    <div class="bg-head">
      <div><h2>Badger Dash</h2><p>Wiggle through the woods and find 10 worms!</p></div>
      <button class="bg-close" id="badgerGameClose" aria-label="Close game">×</button>
    </div>
    <div class="bg-hud"><span class="bg-score" id="badgerScore">Worms 0 / 10</span><span class="bg-tip">Drag or tap to move<br>Arrow keys work too</span></div>
    <div class="bg-stage" id="badgerStage">
      <canvas id="badgerCanvas"></canvas>
      <div class="bg-fact" id="badgerFact"><b id="badgerFactTitle"></b><p id="badgerFactText"></p><button id="badgerFactNext">Keep exploring</button></div>
    </div>`;
  document.body.appendChild(overlay);

  var quizDone=document.getElementById("quizDone");
  var exits=quizDone && quizDone.querySelector(".party-exits");
  var launch=document.createElement("button");
  launch.id="badgerGameBtn";
  launch.className="again";
  launch.type="button";
  launch.textContent="Play Badger Dash";
  if(exits) exits.insertBefore(launch, document.getElementById("quizDoneHome") || null);

  var canvas=document.getElementById("badgerCanvas"), ctx=canvas.getContext("2d"), stage=document.getElementById("badgerStage");
  var scoreEl=document.getElementById("badgerScore"), fact=document.getElementById("badgerFact"), factTitle=document.getElementById("badgerFactTitle"), factText=document.getElementById("badgerFactText"), factNext=document.getElementById("badgerFactNext");
  var W=800,H=520, running=false, paused=false, last=0, score=0, target=null, keys={};
  var player={x:100,y:260,vx:0,vy:0,r:25};
  var worms=[], obstacles=[];
  var milestones={3:false,6:false,10:false};
  var facts={
    3:["Super sniffer!","Badgers can smell worms hiding under the ground."],
    6:["Night explorer!","Badgers usually come out after dark to search for food."],
    10:["Worm champion!","Earthworms are one of a badger's favourite foods. Great exploring!"]
  };

  function resize(){
    var r=stage.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(r.width*dpr)); canvas.height=Math.max(1,Math.round(r.height*dpr));
    canvas.style.width=r.width+"px"; canvas.style.height=r.height+"px";
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  }
  window.addEventListener("resize",function(){ if(running) resize(); });

  function rand(a,b){return a+Math.random()*(b-a)}
  function dist2(a,b){var dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy}
  function reset(){
    score=0; scoreEl.textContent="Worms 0 / 10"; milestones={3:false,6:false,10:false};
    player.x=90;player.y=H/2;player.vx=player.vy=0;target=null;
    obstacles=[
      {x:260,y:120,r:42,type:"rock"},{x:400,y:350,r:52,type:"log"},{x:590,y:155,r:46,type:"bush"},{x:650,y:390,r:38,type:"rock"}
    ];
    worms=[];
    for(var i=0;i<10;i++) spawnWorm(i);
  }
  function safeSpot(x,y){
    if(x<55||x>W-55||y<60||y>H-55) return false;
    for(var i=0;i<obstacles.length;i++){var o=obstacles[i],dx=x-o.x,dy=y-o.y;if(dx*dx+dy*dy<(o.r+48)*(o.r+48))return false;}
    for(var j=0;j<worms.length;j++){var w=worms[j],ax=x-w.x,ay=y-w.y;if(ax*ax+ay*ay<55*55)return false;}
    return true;
  }
  function spawnWorm(i){
    var x,y,tries=0; do{x=rand(70,W-60);y=rand(70,H-55);tries++;}while(!safeSpot(x,y)&&tries<100);
    worms.push({x:x,y:y,r:13,alive:true,phase:i*.8+Math.random()*2});
  }

  function showFact(n){
    paused=true; var f=facts[n]; factTitle.textContent=f[0]; factText.textContent=f[1];
    factNext.textContent=n===10?"Play again":"Keep exploring";
    fact.classList.toggle("bg-win",n===10); fact.classList.add("on");
  }
  factNext.addEventListener("click",function(){
    fact.classList.remove("on","bg-win");
    if(score>=10){reset();}
    paused=false; last=performance.now(); requestAnimationFrame(loop);
  });

  function collect(){
    worms.forEach(function(w){
      if(!w.alive)return;
      if(dist2(player,w)<(player.r+w.r+5)*(player.r+w.r+5)){
        w.alive=false;score++;scoreEl.textContent="Worms "+score+" / 10";
        if(window.chime) try{window.chime();}catch(e){}
        if((score===3||score===6||score===10)&&!milestones[score]){milestones[score]=true;showFact(score);}
      }
    });
  }
  function resolveObstacle(o){
    var dx=player.x-o.x,dy=player.y-o.y,d=Math.sqrt(dx*dx+dy*dy)||1,min=player.r+o.r;
    if(d<min){var nx=dx/d,ny=dy/d,p=min-d;player.x+=nx*p;player.y+=ny*p;var dot=player.vx*nx+player.vy*ny;if(dot<0){player.vx-=1.55*dot*nx;player.vy-=1.55*dot*ny;}player.vx*=.62;player.vy*=.62;}
  }
  function update(dt){
    var ax=0,ay=0,acc=950;
    if(keys.ArrowLeft||keys.a)ax-=1;if(keys.ArrowRight||keys.d)ax+=1;if(keys.ArrowUp||keys.w)ay-=1;if(keys.ArrowDown||keys.s)ay+=1;
    if(target){var dx=target.x-player.x,dy=target.y-player.y,d=Math.sqrt(dx*dx+dy*dy);if(d>8){ax+=dx/d;ay+=dy/d}else target=null;}
    var m=Math.sqrt(ax*ax+ay*ay);if(m>1){ax/=m;ay/=m;}
    player.vx+=ax*acc*dt;player.vy+=ay*acc*dt;
    var drag=Math.pow(.055,dt);player.vx*=drag;player.vy*=drag;
    var sp=Math.sqrt(player.vx*player.vx+player.vy*player.vy),max=235;if(sp>max){player.vx=player.vx/sp*max;player.vy=player.vy/sp*max;}
    player.x+=player.vx*dt;player.y+=player.vy*dt;
    if(player.x<player.r){player.x=player.r;player.vx=Math.abs(player.vx)*.45}if(player.x>W-player.r){player.x=W-player.r;player.vx=-Math.abs(player.vx)*.45}
    if(player.y<player.r){player.y=player.r;player.vy=Math.abs(player.vy)*.45}if(player.y>H-player.r){player.y=H-player.r;player.vy=-Math.abs(player.vy)*.45}
    obstacles.forEach(resolveObstacle); collect();
  }

  function circle(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
  function drawBadger(){
    var a=Math.atan2(player.vy,player.vx),moving=Math.abs(player.vx)+Math.abs(player.vy)>18;
    ctx.save();ctx.translate(player.x,player.y);ctx.rotate(a||0);
    ctx.fillStyle="#282832";ctx.beginPath();ctx.ellipse(0,0,31,23,0,0,Math.PI*2);ctx.fill();
    circle(21,0,18,"#E8E1D4");
    ctx.strokeStyle="#1B1B22";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(10,-14);ctx.lineTo(30,-5);ctx.moveTo(10,14);ctx.lineTo(30,5);ctx.stroke();
    circle(32,0,4,"#11131a");circle(22,-7,2.2,"#11131a");
    ctx.fillStyle="#22232b";ctx.beginPath();ctx.moveTo(-27,-9);ctx.lineTo(-44,-17);ctx.lineTo(-38,-3);ctx.closePath();ctx.fill();
    var bob=moving?Math.sin(performance.now()/85)*2:0;ctx.fillStyle="#15161d";ctx.fillRect(-15,18+bob,10,7);ctx.fillRect(9,18-bob,10,7);
    ctx.restore();
  }
  function drawWorm(w,t){
    if(!w.alive)return;var wig=Math.sin(t*.006+w.phase)*5;
    ctx.strokeStyle=BERRY;ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(w.x-13,w.y);ctx.quadraticCurveTo(w.x-5,w.y-10+wig,w.x+2,w.y);ctx.quadraticCurveTo(w.x+9,w.y+10-wig,w.x+15,w.y);ctx.stroke();
    circle(w.x+16,w.y-1,1.8,"#241704");
  }
  function drawObstacle(o){
    if(o.type==="rock"){circle(o.x,o.y,o.r,"#586272");circle(o.x-9,o.y-10,o.r*.55,"#6c7787");}
    else if(o.type==="bush"){circle(o.x-16,o.y+5,o.r*.72,"#2f6b50");circle(o.x+13,o.y,o.r*.8,"#39795c");circle(o.x,o.y-17,o.r*.65,"#468b69");}
    else{ctx.save();ctx.translate(o.x,o.y);ctx.rotate(-.38);ctx.fillStyle="#76502f";ctx.fillRect(-o.r,-18,o.r*2,36);circle(-o.r,0,18,"#9b6c40");circle(o.r,0,18,"#9b6c40");ctx.restore();}
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#112b35");g.addColorStop(1,"#19372d");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(var i=0;i<45;i++){var x=(i*97)%W,y=(i*53)%H;circle(x,y,1+(i%3)*.5,"rgba(247,242,228,.16)");}
    ctx.fillStyle="rgba(10,18,20,.28)";for(var j=0;j<9;j++){ctx.beginPath();ctx.ellipse((j*103+35)%W,H-12,78,26,0,0,Math.PI*2);ctx.fill();}
    obstacles.forEach(drawObstacle);worms.forEach(function(w){drawWorm(w,t)});drawBadger();
  }
  function loop(t){
    if(!running||paused)return;var dt=Math.min(.033,(t-last)/1000||.016);last=t;update(dt);draw(t);requestAnimationFrame(loop);
  }

  function pointer(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
  canvas.addEventListener("pointerdown",function(e){target=pointer(e);canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener("pointermove",function(e){if(e.buttons||e.pointerType==="touch")target=pointer(e);});
  window.addEventListener("keydown",function(e){if(!running)return;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","a","d","w","s"].indexOf(e.key)>=0){keys[e.key]=true;e.preventDefault();}});
  window.addEventListener("keyup",function(e){keys[e.key]=false;});

  function openGame(){
    if(window.stopSpeaking) try{window.stopSpeaking();}catch(e){}
    overlay.classList.add("on");running=true;paused=false;reset();resize();last=performance.now();requestAnimationFrame(loop);
  }
  function closeGame(){running=false;paused=false;target=null;keys={};fact.classList.remove("on","bg-win");overlay.classList.remove("on");}
  launch.addEventListener("click",openGame);document.getElementById("badgerGameClose").addEventListener("click",closeGame);

  /* The core app owns quiz completion. Wrap it rather than changing the large
     single-file app: only a completed Badger quiz reveals the game button. */
  var originalFinish=window.finishQuiz;
  if(typeof originalFinish==="function"){
    window.finishQuiz=function(){
      originalFinish.apply(this,arguments);
      var isBadger=window.lesson && window.lesson.id==="badger";
      launch.classList.toggle("on",!!isBadger);
    };
  }
  var originalStart=window.startQuiz;
  if(typeof originalStart==="function"){
    window.startQuiz=function(){launch.classList.remove("on");return originalStart.apply(this,arguments);};
  }
  var originalHome=window.goHome;
  if(typeof originalHome==="function"){
    window.goHome=function(){closeGame();launch.classList.remove("on");return originalHome.apply(this,arguments);};
  }
})();
