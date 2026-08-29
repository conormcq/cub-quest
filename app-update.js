/* Cub Quest — keep installed iOS/PWA copies fresh without losing offline use. */
(function(){
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  var reloading = false;
  var lastCheck = 0;
  var MIN_CHECK_GAP = 30 * 1000;

  function reloadForNewWorker(){
    if (reloading) return;
    reloading = true;
    /* A newly activated worker now controls this page. Reload once so the
       visible app shell matches that worker's freshly installed cache. */
    window.location.reload();
  }

  function checkForUpdate(registration, force){
    var now = Date.now();
    if (!force && now - lastCheck < MIN_CHECK_GAP) return Promise.resolve();
    lastCheck = now;
    return registration.update().catch(function(){});
  }

  navigator.serviceWorker.addEventListener("controllerchange", reloadForNewWorker);

  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(function(registration){
      /* Check immediately whenever the installed app is opened. */
      checkForUpdate(registration, true);

      /* iOS often leaves a Home Screen app suspended rather than closing it.
         Check again when the child returns to it. */
      document.addEventListener("visibilitychange", function(){
        if (!document.hidden) checkForUpdate(registration, false);
      });
      window.addEventListener("pageshow", function(){
        checkForUpdate(registration, false);
      });
      window.addEventListener("online", function(){
        checkForUpdate(registration, true);
      });
    }).catch(function(){});
  });
})();
