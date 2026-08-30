/* Cub Quest — explicitly unlock the real MP3 narration player in iOS standalone mode.
   iOS treats Web Audio (the small UI chimes) and HTMLAudioElement playback as
   separate user-gesture permissions. A silent, user-initiated play on Cub
   Quest's existing player primes that same element before lesson narration. */
(function(){
  "use strict";

  var standalone=(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||
    window.navigator.standalone===true;
  if(!standalone)return;

  var done=false,trying=false;
  /* Tiny silent WAV. It is local data, so priming does not depend on Wi-Fi or
     the service worker. The real lesson MP3 replaces it on the next say(). */
  var SILENT="data:audio/wav;base64,UklGRioAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQYAAACAgICAgA==";

  function getPlayer(){return window.player||null;}

  function preparePlayer(){
    var p=getPlayer();
    if(!p)return null;
    p.setAttribute("playsinline","");
    p.setAttribute("webkit-playsinline","");
    p.playsInline=true;
    p.preload="auto";
    return p;
  }

  function unlock(){
    if(done||trying)return;
    var p=preparePlayer();
    if(!p)return;
    trying=true;

    /* Resume Cub Quest's Web Audio context too, but do not rely on that to
       unlock the separate HTML audio element used by lesson narration. */
    try{if(typeof window.audio==="function")window.audio();}catch(e){}

    var hadRealSource=!!(p.getAttribute("src")&&p.getAttribute("src").indexOf("data:audio/wav")!==0);
    if(!hadRealSource){
      try{p.src=SILENT;p.currentTime=0;}catch(e){}
    }

    var playPromise;
    try{playPromise=p.play();}catch(e){trying=false;return;}

    if(playPromise&&typeof playPromise.then==="function"){
      playPromise.then(function(){
        done=true;trying=false;
        /* Only stop the silent primer. If the same tap already started real
           narration (for example the welcome clip), leave that playback alone. */
        try{
          if((p.currentSrc||p.src||"").indexOf("data:audio/wav")===0){
            p.pause();p.currentTime=0;
          }
        }catch(e){}
      }).catch(function(){trying=false;});
    }else{
      done=true;trying=false;
    }
  }

  /* Capture phase means this runs inside the trusted touch gesture before the
     app's own click handlers call say(). The first start/menu tap normally
     primes audio long before a child reaches a lesson card. */
  document.addEventListener("pointerdown",unlock,{capture:true,passive:true});
  document.addEventListener("touchstart",unlock,{capture:true,passive:true});
  document.addEventListener("click",unlock,true);

  /* Re-apply media attributes after restoring a suspended Home Screen app. */
  document.addEventListener("visibilitychange",function(){
    if(!document.hidden)preparePlayer();
  });
  window.addEventListener("pageshow",preparePlayer);
})();
