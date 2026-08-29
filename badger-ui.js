/* Cub Quest — Badger Dash presentation and narration. */
(function(){
  "use strict";

  var launch=document.getElementById("badgerGameBtn");
  var quizDone=document.getElementById("quizDone");
  var exits=quizDone && quizDone.querySelector(".party-exits");
  if(!launch) return;

  /* TEMP TEST MODE: keep the game available everywhere. Revert this flag to
     false later to return the tile to the completed Badger quiz only. */
  var ALWAYS_AVAILABLE_FOR_TESTING=true;

  if(ALWAYS_AVAILABLE_FOR_TESTING){
    document.body.appendChild(launch);
  }else if(exits && launch.parentNode!==exits){
    exits.insertBefore(launch, document.getElementById("quizDoneHome") || null);
  }

  launch.classList.add("badger-game-tile");
  launch.classList.toggle("badger-test-tile",ALWAYS_AVAILABLE_FOR_TESTING);
  launch.removeAttribute("style");
  launch.innerHTML='<span class="badger-tile-art" aria-hidden="true">🐾</span><span class="badger-tile-copy"><b>Badger Dash</b><small>Find 10 wriggly worms!</small></span><span class="badger-tile-play" aria-hidden="true">▶</span>';
  launch.setAttribute("aria-label","Play Badger Dash. Find 10 wriggly worms.");
  if(ALWAYS_AVAILABLE_FOR_TESTING) launch.classList.add("on");

  var style=document.createElement("style");
  style.textContent=`
    #badgerGameBtn.badger-game-tile{display:none;width:min(100%,520px);min-height:112px;margin:16px auto 8px;padding:15px 18px;align-items:center;gap:15px;text-align:left;border:3px solid #74C99B!important;border-radius:26px;background:linear-gradient(135deg,#17392d,#214b3b)!important;color:#F7F2E4!important;box-shadow:0 12px 28px rgba(0,0,0,.3);position:relative!important;right:auto!important;bottom:auto!important;z-index:auto!important}
    #badgerGameBtn.badger-game-tile.on{display:flex}
    #badgerGameBtn.badger-game-tile::before{content:none}
    #badgerGameBtn.badger-game-tile:active{transform:scale(.97)}
    #badgerGameBtn.badger-test-tile{position:fixed!important;left:12px!important;right:12px!important;bottom:calc(12px + env(safe-area-inset-bottom))!important;z-index:115!important;width:auto!important;max-width:520px!important;margin:0 auto!important;box-shadow:0 16px 40px rgba(0,0,0,.48)}
    .badger-tile-art{width:68px;height:68px;display:grid;place-items:center;flex:none;border-radius:22px;background:#74C99B;color:#102018;font-size:2rem}
    .badger-tile-copy{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
    .badger-tile-copy b{font-family:"Grandstander","Nunito",sans-serif;font-size:1.35rem;color:#FFC24F;line-height:1.05}
    .badger-tile-copy small{font-size:.9rem;font-weight:800;color:#F7F2E4}
    .badger-tile-play{width:46px;height:46px;display:grid;place-items:center;flex:none;border-radius:50%;background:#FFC24F;color:#241704;font-size:1.05rem;padding-left:3px}
    @media(max-width:520px){#badgerGameBtn.badger-game-tile{min-height:96px;padding:11px 12px}.badger-tile-art{width:56px;height:56px}.badger-tile-copy b{font-size:1.18rem}.badger-tile-copy small{font-size:.8rem}}
  `;
  document.head.appendChild(style);

  function canSpeak(){
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance==="function";
  }
  function speak(text){
    if(!canSpeak() || !text) return;
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang="en-IE";
      u.rate=.9;
      u.pitch=1.08;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  function stopNarration(){
    if(canSpeak()) try{window.speechSynthesis.cancel();}catch(e){}
  }

  launch.addEventListener("click",function(){
    setTimeout(function(){
      speak("Badger Dash! Help the badger wiggle through the woods and find ten worms. Drag your finger, or tap where you want the badger to go.");
    },180);
  });

  var fact=document.getElementById("badgerFact");
  var title=document.getElementById("badgerFactTitle");
  var text=document.getElementById("badgerFactText");
  if(fact){
    new MutationObserver(function(){
      if(fact.classList.contains("on")){
        speak(((title&&title.textContent)||"")+" "+((text&&text.textContent)||""));
      }
    }).observe(fact,{attributes:true,attributeFilter:["class"]});
  }

  var next=document.getElementById("badgerFactNext");
  if(next) next.addEventListener("click",stopNarration);
  var close=document.getElementById("badgerGameClose");
  if(close) close.addEventListener("click",stopNarration);
})();