/* Cub Quest — publish animal mini-games inside their normal lesson grids. */
(function(){
  "use strict";

  var aliases={
    fox:"fox",foxes:"fox",
    bat:"bat",bats:"bat",
    hedgehog:"hedgehog",hedgehogs:"hedgehog",
    barnowl:"barn-owl","barn-owl":"barn-owl","barn owl":"barn-owl","barn owls":"barn-owl",
    otter:"otter",otters:"otter",
    pinemarten:"pine-marten","pine-marten":"pine-marten","pine marten":"pine-marten","pine martens":"pine-marten",
    stoat:"stoat",stoats:"stoat",
    frog:"frog",frogs:"frog",
    moth:"moth",moths:"moth",
    greyseal:"grey-seal","grey-seal":"grey-seal","grey seal":"grey-seal","grey seals":"grey-seal",
    puffin:"puffin",puffins:"puffin",
    dolphin:"dolphin",dolphins:"dolphin",
    baskingshark:"basking-shark","basking-shark":"basking-shark","basking shark":"basking-shark","basking sharks":"basking-shark"
  };

  var icons={fox:"🦊",bat:"🦇",hedgehog:"🦔","barn-owl":"🦉",otter:"🦦","pine-marten":"🌲",stoat:"🐾",frog:"🐸",moth:"🦋","grey-seal":"🦭",puffin:"🐧",dolphin:"🐬","basking-shark":"🦈"};

  var style=document.createElement("style");
  style.textContent=`
    .cq-published-game{--tint:#74C99B!important;border-color:#39795c!important;background:linear-gradient(145deg,#17392d,#214b3b)!important;min-height:150px}
    .cq-published-game .cq-game-art{width:84px;height:84px;display:grid;place-items:center;border-radius:24px;background:#74C99B;color:#102018;font-size:2.5rem;position:relative;z-index:1;box-shadow:0 8px 20px rgba(0,0,0,.22)}
    .cq-published-game .cq-game-meta{position:relative;z-index:1}.cq-published-game .cq-game-meta b{color:#FFC24F!important}.cq-published-game .cq-game-meta small{display:block;margin-top:5px;color:#F7F2E4;font-weight:800;font-size:.78rem;line-height:1.2}
    .cq-published-game::after{content:"▶";position:absolute;right:13px;top:13px;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:#FFC24F;color:#241704;font-size:.8rem;padding-left:2px;z-index:2}
    @media(min-width:660px){.cq-published-game .cq-game-art{width:92px;height:92px}}
  `;
  document.head.appendChild(style);

  function norm(v){return String(v||"").toLowerCase().trim().replace(/[_]+/g,"-").replace(/\s+/g," ");}
  function currentGameId(){
    var l=window.lesson||window.currentLesson||null;
    var vals=l?[l.id,l.slug,l.name,l.title]:[];
    for(var i=0;i<vals.length;i++){
      var n=norm(vals[i]),compact=n.replace(/[ -]/g,"");
      if(aliases[n])return aliases[n];
      if(aliases[compact])return aliases[compact];
    }
    return null;
  }

  function addTile(){
    if(!window.CubQuestGames)return;
    var screen=document.getElementById("grid");
    if(!screen||!screen.classList.contains("on"))return;
    var cards=screen.querySelector(".cards");
    if(!cards)return;
    var old=cards.querySelector(".cq-published-game");
    if(old)old.remove();

    var id=currentGameId();
    if(!id)return;
    var game=window.CubQuestGames.list().filter(function(g){return g.id===id;})[0];
    if(!game)return;

    var tile=document.createElement("button");
    tile.type="button";
    tile.className="card cq-published-game";
    tile.setAttribute("aria-label","Play "+game.title+". "+game.goal);
    tile.innerHTML='<span class="cq-game-art" aria-hidden="true">'+(icons[id]||"🎮")+'</span><span class="cq-game-meta"><b>'+game.title+'</b><small>Play the '+game.title+' game</small></span>';
    tile.addEventListener("click",function(){window.CubQuestGames.open(id);});
    cards.appendChild(tile);
  }

  var queued=false;
  function queue(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;addTile();});}
  new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
  window.addEventListener("cubquest-games-ready",queue);
  window.addEventListener("pageshow",queue);
  queue();
})();