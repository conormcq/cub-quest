/* Cub Quest — Badger Dash narration only. Game placement is handled by games/publish-games.js. */
(function(){
  "use strict";

  var launch=document.getElementById("badgerGameBtn");
  if(!launch) return;

  /* Keep the legacy button hidden. The production game tile is injected at the
     end of the Badger lesson grid by publish-games.js, same as every animal. */
  launch.classList.remove("on","badger-test-tile","badger-game-tile");
  launch.style.display="none";

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

  /* Narration for the legacy Badger Dash implementation remains intact. */
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