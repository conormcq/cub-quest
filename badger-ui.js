/* Cub Quest — Badger Dash narration only. Game placement is handled by games/publish-games.js. */
(function(){
  "use strict";

  var launch=document.getElementById("badgerGameBtn");
  if(!launch) return;

  /* Keep the legacy button hidden. The production game tile is injected at the
     end of the Badger lesson grid by publish-games.js, same as every animal. */
  launch.classList.remove("on","badger-test-tile","badger-game-tile");
  launch.style.display="none";

  var ownPlayer=null,factCount=0;
  function canSpeak(){return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance==="function";}
  function fallbackSpeak(text){if(!canSpeak()||!text)return;try{window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang="en-IE";u.rate=.9;u.pitch=1.08;window.speechSynthesis.speak(u);}catch(e){}}
  function narrationPlayer(){if(window.player)return window.player;if(!ownPlayer){ownPlayer=new Audio();ownPlayer.preload="auto";ownPlayer.setAttribute("playsinline","");}return ownPlayer;}
  function speak(key,text){stopNarration();if(window.muted)return;var p=narrationPlayer(),fallback=false;function useFallback(){if(fallback)return;fallback=true;fallbackSpeak(text);}try{p.src="audio/"+key+".mp3";p.currentTime=0;var play=p.play();if(play&&play.catch)play.catch(useFallback);}catch(e){useFallback();}}
  function stopNarration(){
    if(canSpeak()) try{window.speechSynthesis.cancel();}catch(e){}
    if(window.stopSpeaking) try{window.stopSpeaking();}catch(e){}
    else if(ownPlayer) try{ownPlayer.pause();}catch(e){}
  }

  /* Narration for the legacy Badger Dash implementation remains intact. */
  launch.addEventListener("click",function(){
    factCount=0;
    speak("game_badger_open","Badger Dash! Help the badger wiggle through the woods and find ten worms. Drag your finger, or tap where you want the badger to go.");
  });

  var fact=document.getElementById("badgerFact");
  var title=document.getElementById("badgerFactTitle");
  var text=document.getElementById("badgerFactText");
  if(fact){
    new MutationObserver(function(){
      if(fact.classList.contains("on")){
        factCount=Math.min(3,factCount+1);
        speak("game_badger_fact_"+factCount,((title&&title.textContent)||"")+" "+((text&&text.textContent)||""));
      }
    }).observe(fact,{attributes:true,attributeFilter:["class"]});
  }

  var next=document.getElementById("badgerFactNext");
  if(next) next.addEventListener("click",stopNarration);
  var close=document.getElementById("badgerGameClose");
  if(close) close.addEventListener("click",stopNarration);
})();
