/* Cub Quest — development Game Lab. Only visible when ?games=1 is present. */
(function(){
  "use strict";
  var params=new URLSearchParams(location.search);
  if(params.get("games")!=="1") return;

  var style=document.createElement("style");
  style.textContent=`
    #cqGameLabBtn{position:fixed;right:12px;top:calc(12px + env(safe-area-inset-top));z-index:150;border:0;border-radius:999px;padding:10px 14px;background:#FFC24F;color:#241704;font-family:"Grandstander","Nunito",sans-serif;font-weight:900;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    #cqGameLab{position:fixed;inset:0;z-index:155;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,10,18,.86);font-family:"Nunito",system-ui,sans-serif}#cqGameLab.on{display:flex}
    .cql-card{width:min(94vw,720px);max-height:86dvh;overflow:auto;background:#101B2E;border:3px solid #2C4064;border-radius:28px;padding:18px;color:#F7F2E4}.cql-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}.cql-head h2{margin:0;flex:1;font-family:"Grandstander",sans-serif;color:#FFC24F}.cql-close{width:46px;height:46px;border-radius:50%;border:2px solid #2C4064;background:#1A2942;color:#F7F2E4;font-size:1.3rem}.cql-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}.cql-game{min-height:88px;border:2px solid #2C4064;border-radius:20px;background:#1A2942;color:#F7F2E4;text-align:left;padding:12px;font-weight:800}.cql-game b{display:block;color:#FFC24F;font-family:"Grandstander",sans-serif;font-size:1.05rem;margin-bottom:3px}.cql-game small{color:#BFC8DA;font-size:.75rem}
  `;
  document.head.appendChild(style);

  var btn=document.createElement("button");btn.id="cqGameLabBtn";btn.textContent="🎮 Game Lab";document.body.appendChild(btn);
  var panel=document.createElement("div");panel.id="cqGameLab";panel.innerHTML='<div class="cql-card"><div class="cql-head"><h2>Game Lab</h2><button class="cql-close" aria-label="Close Game Lab">×</button></div><div class="cql-grid" id="cqGameLabGrid"></div></div>';document.body.appendChild(panel);
  var grid=panel.querySelector("#cqGameLabGrid");

  function render(){
    if(!window.CubQuestGames)return;
    grid.innerHTML="";
    window.CubQuestGames.list().forEach(function(g){var b=document.createElement("button");b.className="cql-game";b.innerHTML="<b>"+g.title+"</b><small>"+g.goal+"</small>";b.addEventListener("click",function(){panel.classList.remove("on");window.CubQuestGames.open(g.id);});grid.appendChild(b);});
  }
  btn.addEventListener("click",function(){render();panel.classList.add("on");});
  panel.querySelector(".cql-close").addEventListener("click",function(){panel.classList.remove("on");});
})();
