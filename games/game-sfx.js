/* Cub Quest — lightweight offline game sound effects.
   Observes the existing game UIs so the physics/game engines stay untouched. */
(function(){
  "use strict";
  var ac=null,lastMove=0,lastScore="",lastBadger="";
  function audio(){
    var C=window.AudioContext||window.webkitAudioContext;
    if(!C)return null;
    if(!ac)ac=new C();
    if(ac.state==="suspended")try{ac.resume();}catch(e){}
    return ac;
  }
  function tone(freq,dur,type,vol,delay,endFreq){
    var a=audio();if(!a)return;var t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();
    o.type=type||"sine";o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||.07,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.03);
  }
  function collect(){tone(560,.11,"sine",.08,0,760);tone(880,.12,"triangle",.045,.07,1040);}
  function move(){var now=performance.now();if(now-lastMove<210)return;lastMove=now;tone(150,.06,"triangle",.025,0,115);}
  function pulse(){tone(310,.38,"sine",.065,0,760);tone(620,.28,"sine",.035,.12,980);}
  function milestone(){tone(523,.22,"triangle",.07,0,659);tone(659,.25,"triangle",.065,.10,784);tone(784,.3,"triangle",.06,.20,1047);}
  function open(){tone(330,.12,"sine",.045,0,440);tone(520,.14,"sine",.04,.08,660);}

  document.addEventListener("pointerdown",function(e){
    if(e.target.closest&&e.target.closest("#cqGameShell canvas,#badgerCanvas"))move();
    if(e.target.closest&&e.target.closest("#cqgPulse"))pulse();
    if(e.target.closest&&e.target.closest(".cq-published-game,#badgerGameBtn"))open();
  },true);

  function watchScore(id,isBadger){
    var el=document.getElementById(id);if(!el)return;
    var prev=el.textContent;
    new MutationObserver(function(){
      var now=el.textContent;if(now===prev)return;prev=now;
      if(isBadger){if(now!==lastBadger){lastBadger=now;collect();}}
      else if(now!==lastScore){lastScore=now;collect();}
    }).observe(el,{childList:true,characterData:true,subtree:true});
  }
  function watchFact(id){
    var el=document.getElementById(id);if(!el)return;
    new MutationObserver(function(){if(el.classList.contains("on"))milestone();}).observe(el,{attributes:true,attributeFilter:["class"]});
  }
  function init(){watchScore("cqgScore",false);watchScore("badgerScore",true);watchFact("cqgFact");watchFact("badgerFact");}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
  window.CubQuestGameSfx={collect:collect,pulse:pulse,milestone:milestone,open:open};
})();