/* Cub Quest — publish every animal mini-game as the final lesson-grid tile. */
(function(){
  "use strict";

  var aliases={
    badger:"badger",badgers:"badger",
    fox:"fox",foxes:"fox",
    bat:"bat",bats:"bat",
    hedgehog:"hedgehog",hedgehogs:"hedgehog",
    owl:"barn-owl",barnowl:"barn-owl","barn-owl":"barn-owl","barn owl":"barn-owl","barn owls":"barn-owl",
    otter:"otter",otters:"otter",
    marten:"pine-marten",pinemarten:"pine-marten","pine-marten":"pine-marten","pine marten":"pine-marten","pine martens":"pine-marten",
    stoat:"stoat",stoats:"stoat",
    frog:"frog",frogs:"frog",
    moth:"moth",moths:"moth",
    seal:"grey-seal",greyseal:"grey-seal","grey-seal":"grey-seal","grey seal":"grey-seal","grey seals":"grey-seal",
    puffin:"puffin",puffins:"puffin",
    dolphin:"dolphin",dolphins:"dolphin",
    shark:"basking-shark",baskingshark:"basking-shark","basking-shark":"basking-shark","basking shark":"basking-shark","basking sharks":"basking-shark"
  };

  var icons={badger:"🦡",fox:"🦊",bat:"🦇",hedgehog:"🦔","barn-owl":"🦉",otter:"🦦","pine-marten":"🌲",stoat:"🐾",frog:"🐸",moth:"🦋","grey-seal":"🦭",puffin:"🐧",dolphin:"🐬","basking-shark":"🦈"};

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
    if(!vals.length){var name=document.getElementById("lessonName");if(name)vals=[name.textContent];}
    for(var i=0;i<vals.length;i++){
      var n=norm(vals[i]),compact=n.replace(/[ -]/g,"");
      if(aliases[n])return aliases[n];
      if(aliases[compact])return aliases[compact];
    }
    return null;
  }

  function gameInfo(id){
    if(id==="badger") return {id:"badger",title:"Badger Dash",goal:"Find 10 wriggly worms!",legacy:true};
    if(!window.CubQuestGames)return null;
    return window.CubQuestGames.list().filter(function(g){return g.id===id;})[0]||null;
  }

  function launch(id){
    if(id==="badger"){
      var legacy=document.getElementById("badgerGameBtn");
      if(legacy) legacy.click();
      return;
    }
    if(window.CubQuestGames) window.CubQuestGames.open(id);
  }

  function removePublishedTiles(){document.querySelectorAll(".cq-published-game").forEach(function(el){el.remove();});}

  function syncTile(){
    var screen=document.getElementById("grid");
    if(!screen||!screen.classList.contains("on")){removePublishedTiles();return;}
    var cards=screen.querySelector(".cards");if(!cards)return;
    var id=currentGameId();if(!id){removePublishedTiles();return;}
    var game=gameInfo(id);if(!game){removePublishedTiles();return;}
    var tile=cards.querySelector('.cq-published-game[data-game-id="'+id+'"]');
    cards.querySelectorAll(".cq-published-game").forEach(function(el){if(el!==tile)el.remove();});
    if(!tile){
      tile=document.createElement("button");tile.type="button";tile.className="card cq-published-game";tile.dataset.gameId=id;
      tile.setAttribute("aria-label","Play "+game.title+". "+game.goal);
      tile.innerHTML='<span class="cq-game-art" aria-hidden="true">'+(icons[id]||"🎮")+'</span><span class="cq-game-meta"><b>'+game.title+'</b><small>Play the '+game.title+' game</small></span>';
      tile.addEventListener("click",function(){launch(id);});
    }
    if(cards.lastElementChild!==tile)cards.appendChild(tile);
  }

  var queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;syncTile();});}
  new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});
  window.addEventListener("cubquest-games-ready",queue);window.addEventListener("pageshow",queue);queue();
})();