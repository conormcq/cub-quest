/* Cub Quest — all-access quizzes and games. Quizzes are picture-first and always available. */
(function(){
  "use strict";
  var ALWAYS_AVAILABLE=true;
  if(!ALWAYS_AVAILABLE)return;

  var BANK={
    "Badgers":[["What do badgers love to eat?",["Worms","Bananas","Fish"],0],["Where does a badger sleep?",["In a sett","In a nest","In the sea"],0],["When are badgers usually awake?",["At night","At lunchtime","Only in winter"],0]],
    "Foxes":[["What is a fox called in Irish?",["Madra rua","Loscán","Rón mór"],0],["What is a fox's bushy tail called?",["A brush","A paddle","A fan"],0],["What can a fox hear in long grass?",["A tiny mouse","A whale","A shark"],0]],
    "Bats":[["What are bats the only furry animals able to do?",["Really fly","Breathe underwater","Change colour"],0],["What does a bat use to find things in the dark?",["Echolocation","A torch","Its whiskers"],0],["What is a baby bat called?",["A pup","A calf","A hoglet"],0]],
    "Hedgehogs":[["What covers a hedgehog's back?",["Spines","Feathers","Scales"],0],["What does a hedgehog do when frightened?",["Rolls into a ball","Flies away","Jumps into water"],0],["What is a baby hedgehog called?",["A hoglet","A puffling","A kit"],0]],
    "Barn Owls":[["How does a barn owl fly?",["Very quietly","Very noisily","Only underwater"],0],["What shape is a barn owl's face?",["A heart","A square","A triangle"],0],["What does a barn owl cough up after eating?",["A pellet","A shell","A cocoon"],0]],
    "Otters":[["Where does an otter live?",["In a holt","In a sett","In a cocoon"],0],["What do otters love to eat?",["Fish","Grass","Acorns"],0],["What helps an otter feel fish moving in muddy water?",["Whiskers","Horns","Feathers"],0]],
    "Pine Martens":[["Where is a pine marten happiest?",["Climbing in woods","Swimming in the sea","Living on open sand"],0],["What is the creamy patch on its chest called?",["A bib","A hood","A mask"],0],["What are baby pine martens called?",["Kits","Calves","Owlets"],0]],
    "Stoats":[["What colour is the tip of a stoat's tail?",["Black","Blue","Orange"],0],["What shape is a stoat's body?",["Long and thin","Round and flat","Short and spiky"],0],["What are baby stoats called?",["Kits","Pups","Pufflings"],0]],
    "Frogs":[["What do frog eggs in a pond form?",["Frogspawn","A cocoon","A pellet"],0],["What does a tadpole grow first?",["Back legs","Wings","Feathers"],0],["What can a frog breathe through?",["Its skin","Its shell","Its fur"],0]],
    "Moths":[["What does a moth start life as?",["An egg","A fish","A pup"],0],["What does a moth use to drink nectar?",["A long curled tongue","A beak","Whiskers"],0],["What do many moths help flowers with?",["Pollination","Digging","Swimming"],0]],
    "Grey Seals":[["What is a baby seal called?",["A pup","A kit","A hoglet"],0],["What do seals mainly eat?",["Fish","Leaves","Berries"],0],["What helps a seal detect movement in water?",["Whiskers","Antlers","Wings"],0]],
    "Puffins":[["What is a baby puffin called?",["A puffling","A calf","A hoglet"],0],["Where does a puffin nest?",["In a burrow","In a tall tree","Underwater"],0],["What can a puffin carry lots of in its beak?",["Fish","Apples","Stones"],0]],
    "Dolphins":[["How does a dolphin breathe?",["Through a blowhole","Through gills","Through its skin"],0],["What is a baby dolphin called?",["A calf","A kit","A pup"],0],["How does a dolphin find fish in dark water?",["Echolocation","A lantern","Smell alone"],0]],
    "Basking Sharks":[["What does a basking shark eat?",["Plankton","Seals","People"],0],["How big can a basking shark grow?",["About as long as a bus","About as long as a pencil","About as long as a shoe"],0],["Is a basking shark dangerous to people?",["No, it is harmless","Yes, it hunts people","Only on land"],0]]
  };

  var ANIMAL_ICON={"Badgers":"🦡","Foxes":"🦊","Bats":"🦇","Hedgehogs":"🦔","Barn Owls":"🦉","Otters":"🦦","Pine Martens":"🌲","Stoats":"🐾","Frogs":"🐸","Moths":"🦋","Grey Seals":"🦭","Puffins":"🐧","Dolphins":"🐬","Basking Sharks":"🦈"};
  var EXACT={
    "Worms":"🪱","Bananas":"🍌","Fish":"🐟","In a sett":"🕳️","In a nest":"🪺","In the sea":"🌊","At night":"🌙","At lunchtime":"☀️","Only in winter":"❄️",
    "Madra rua":"🦊","Loscán":"🐸","Rón mór":"🦭","A brush":"🦊","A paddle":"🛶","A fan":"🪭","A tiny mouse":"🐭","A whale":"🐋","A shark":"🦈",
    "Really fly":"🪽","Breathe underwater":"🌊","Change colour":"🌈","Echolocation":"📡","A torch":"🔦","Its whiskers":"〰️","A pup":"🐾","A calf":"🐣","A hoglet":"🦔",
    "Spines":"🦔","Feathers":"🪶","Scales":"🐟","Rolls into a ball":"⚫","Flies away":"🪽","Jumps into water":"💦","A puffling":"🐧","A kit":"🐾",
    "Very quietly":"🤫","Very noisily":"📣","Only underwater":"🌊","A heart":"❤️","A square":"🟨","A triangle":"🔺","A pellet":"🟤","A shell":"🐚","A cocoon":"🧶",
    "In a holt":"🪵","Grass":"🌿","Acorns":"🌰","Whiskers":"〰️","Horns":"🦌",
    "Climbing in woods":"🌲","Swimming in the sea":"🌊","Living on open sand":"🏖️","A bib":"🟨","A hood":"🧥","A mask":"🎭","Kits":"🐾","Calves":"🐣","Owlets":"🦉",
    "Black":"⚫","Blue":"🔵","Orange":"🟠","Long and thin":"➖","Round and flat":"⭕","Short and spiky":"✳️","Pups":"🐾","Pufflings":"🐧",
    "Frogspawn":"🫧","Back legs":"🦵","Wings":"🪽","Its skin":"🐸","Its shell":"🐚","Its fur":"🧶",
    "An egg":"🥚","A fish":"🐟","A long curled tongue":"👅","A beak":"🐦","Pollination":"🌼","Digging":"⛏️","Swimming":"🏊",
    "Leaves":"🍃","Berries":"🫐","Antlers":"🦌","In a burrow":"🕳️","In a tall tree":"🌳","Underwater":"🌊","Apples":"🍎","Stones":"🪨",
    "Through a blowhole":"💨","Through gills":"🐟","Through its skin":"🐸","A lantern":"🏮","Smell alone":"👃",
    "Plankton":"✨","Seals":"🦭","People":"🧍","About as long as a bus":"🚌","About as long as a pencil":"✏️","About as long as a shoe":"👟","No, it is harmless":"💚","Yes, it hunts people":"⚠️","Only on land":"🏞️"
  };

  function iconFor(label){return EXACT[label]||"❓";}
  function animalName(){var n=document.getElementById("lessonName");return n?n.textContent.trim():"";}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function voice(detail){
    detail=detail||{};
    try{window.dispatchEvent(new CustomEvent("cubquest-quiz-voice",{detail:detail}));}catch(e){}
    if(typeof window.CubQuestQuizVoice==="function")try{window.CubQuestQuizVoice(detail);}catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById("cqAllAccessStyle"))return;
    var s=document.createElement("style");s.id="cqAllAccessStyle";
    s.textContent=`
      .cq-all-quiz{--tint:#FFC24F!important;border-color:#8b6b14!important;background:linear-gradient(145deg,#4b3b14,#66501a)!important;min-height:150px}.cq-all-quiz .cq-q-art{width:84px;height:84px;display:grid;place-items:center;border-radius:24px;background:#FFC24F;color:#241704;font-size:3rem}.cq-all-quiz .cq-q-meta b{color:#fff!important}.cq-all-quiz .cq-q-meta small{display:block;margin-top:5px;color:#F7F2E4;font-weight:800}
      .cq-quiz-overlay{position:fixed;inset:0;z-index:20000;background:linear-gradient(180deg,#101B2E,#14243a);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.cq-quiz-box{width:min(680px,100%);background:#17263d;border:3px solid #FFC24F;border-radius:30px;padding:18px;color:#fff;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.45)}
      .cq-quiz-animal{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:#FFC24F;margin:0 auto 8px;font-size:3.3rem;box-shadow:0 8px 24px rgba(0,0,0,.28)}.cq-quiz-box h2{margin:0 0 5px;font-family:"Grandstander",sans-serif;color:#FFC24F;font-size:1.65rem}.cq-quiz-step{font-weight:900;color:#bfc8da;font-size:.8rem}.cq-quiz-question{font-family:"Grandstander",sans-serif;font-size:clamp(1.25rem,5vw,1.75rem)!important;line-height:1.18;margin:12px auto 14px!important;max-width:570px}
      .cq-quiz-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cq-quiz-choice{font:inherit;border:3px solid #2C4064;border-radius:22px;background:#F7F2E4;color:#101B2E;min-height:176px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;box-shadow:0 7px 0 #0b1422;transition:transform .12s,border-color .12s}.cq-quiz-choice:active{transform:translateY(3px);box-shadow:0 4px 0 #0b1422}.cq-quiz-choice .pic{width:94px;height:94px;border-radius:22px;display:grid;place-items:center;background:#fff;font-size:3.65rem;line-height:1}.cq-quiz-choice .caption{font-weight:950;font-size:.94rem;line-height:1.08}.cq-quiz-good{background:#74C99B!important;border-color:#a9efca!important}.cq-quiz-bad{background:#EE7C8C!important;border-color:#ffc0c8!important;animation:cqShake .32s}.cq-quiz-close{margin-top:15px;background:transparent;color:#fff;border:2px solid #61708a;border-radius:16px;padding:9px 17px;font-weight:900}.cq-quiz-finish{font-size:4.5rem;margin:10px 0}.cq-quiz-replay{grid-column:1/-1;min-height:74px!important;background:#74C99B!important;font-weight:950;font-size:1.1rem}
      @keyframes cqShake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}@media(max-width:560px){.cq-quiz-box{padding:14px 10px}.cq-quiz-choices{gap:7px}.cq-quiz-choice{min-height:148px;padding:7px 4px;border-radius:18px}.cq-quiz-choice .pic{width:75px;height:75px;font-size:3rem;border-radius:18px}.cq-quiz-choice .caption{font-size:.76rem}.cq-quiz-animal{width:72px;height:72px;font-size:2.7rem}}
    `;
    document.head.appendChild(s);
  }

  function openQuiz(name){
    var qs=BANK[name];if(!qs)return;
    var i=0,score=0;
    var o=document.createElement("div");o.className="cq-quiz-overlay";
    o.innerHTML='<div class="cq-quiz-box"><div class="cq-quiz-animal" aria-hidden="true">'+(ANIMAL_ICON[name]||"🐾")+'</div><h2>'+name+' Quiz</h2><div class="cq-quiz-step" id="cqQuizStep"></div><p class="cq-quiz-question" id="cqQuizQuestion"></p><div class="cq-quiz-choices" id="cqQuizChoices"></div><button class="cq-quiz-close" type="button">Close</button></div>';
    document.body.appendChild(o);
    o.querySelector(".cq-quiz-close").onclick=function(){voice({type:"stop",animal:name});o.remove();};

    function next(){
      var p=o.querySelector("#cqQuizQuestion"),c=o.querySelector("#cqQuizChoices"),step=o.querySelector("#cqQuizStep");
      if(i>=qs.length){
        step.textContent="";p.textContent="Quiz Champion! You got "+score+" out of "+qs.length+" right!";
        c.innerHTML='<div class="cq-quiz-finish" style="grid-column:1/-1" aria-hidden="true">🏆✨</div><button class="cq-quiz-choice cq-quiz-replay" type="button"><span class="caption">Play again</span></button>';
        c.querySelector("button").onclick=function(){i=0;score=0;next();};
        voice({type:"complete",animal:name,text:p.textContent,score:score,total:qs.length});return;
      }
      var q=qs[i];step.textContent="Question "+(i+1)+" of "+qs.length;p.textContent=q[0];c.innerHTML="";
      var choices=shuffle(q[1].map(function(label,idx){return{label:label,correct:idx===q[2]};}));
      choices.forEach(function(choice){
        var b=document.createElement("button");b.type="button";b.className="cq-quiz-choice";b.setAttribute("aria-label",choice.label);
        b.innerHTML='<span class="pic" aria-hidden="true">'+iconFor(choice.label)+'</span><span class="caption">'+choice.label+'</span>';
        b.onclick=function(){
          if(choice.correct){score++;b.classList.add("cq-quiz-good");voice({type:"correct",animal:name,text:choice.label,question:q[0]});setTimeout(function(){i++;next();},650);}
          else{b.classList.add("cq-quiz-bad");voice({type:"wrong",animal:name,text:"Try again",question:q[0]});setTimeout(function(){b.classList.remove("cq-quiz-bad");},420);}
        };
        c.appendChild(b);
      });
      voice({type:"question",animal:name,text:q[0],choices:choices.map(function(x){return x.label;}),questionIndex:i,total:qs.length});
    }
    next();
  }

  function sync(){
    ensureStyle();var grid=document.getElementById("grid");if(!grid||!grid.classList.contains("on"))return;var cards=grid.querySelector(".cards");if(!cards)return;var name=animalName();if(!BANK[name])return;
    var old=cards.querySelector(".quiz-tile");if(old){old.classList.remove("locked");old.setAttribute("aria-label","Quiz: always available");}
    var custom=cards.querySelector(".cq-all-quiz");if(name==="Badgers"&&old){if(custom)custom.remove();return;}
    if(!custom){custom=document.createElement("button");custom.type="button";custom.className="card cq-all-quiz";custom.innerHTML='<span class="cq-q-art" aria-hidden="true">?</span><span class="cq-q-meta"><b>Quiz</b><small>Play the '+name+' quiz</small></span>';custom.onclick=function(){openQuiz(animalName());};cards.appendChild(custom);}
    var game=cards.querySelector(".cq-published-game");if(game&&game.previousElementSibling!==custom)cards.insertBefore(custom,game);
  }
  var queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;sync();});}
  new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});window.addEventListener("pageshow",queue);queue();
})();