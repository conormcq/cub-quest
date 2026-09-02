/* Cub Quest — all-access quizzes and games. Quizzes are picture-first and always available. */
(function(){
  "use strict";
  var ALWAYS_AVAILABLE=true;
  if(!ALWAYS_AVAILABLE)return;

  /* Each lesson has a six-question pool. A round draws three at random, so a
     repeat visit feels fresh without becoming too long for a young child.
     Tuple shape: question, answer labels, correct label index, narration id. */
  var BANK={
    "Badgers":[
      ["What does a badger like to eat?",["Worms","Bananas","Fish"],0,"qz_badger_eat"],
      ["Where does a badger sleep?",["In a sett","In a nest","In the sea"],0,"qz_badger_home"],
      ["Is a badger awake in the daytime, or at night?",["At night","At lunchtime","Only in winter"],0,"qz_badger_daynight"]
    ],
    "Foxes":[
      ["What is a fox called in Irish?",["Madra rua","Loscán","Rón mór"],0,"qz_fox_q1"],
      ["What is a fox's bushy tail called?",["A brush","A paddle","A fan"],0,"qz_fox_q2"],
      ["What can a fox hear in long grass?",["A tiny mouse","A whale","A shark"],0,"qz_fox_q3"],
      ["Where does a fox raise its cubs?",["In a den","In a cocoon","On a lily pad"],0,"qz_fox_q4"],
      ["What are baby foxes called?",["Cubs","Pufflings","Owlets"],0,"qz_fox_q5"],
      ["When do foxes often come out to explore?",["At night","Only at noon","Only in summer"],0,"qz_fox_q6"]
    ],
    "Bats":[
      ["What are bats the only furry animals able to do?",["Really fly","Breathe underwater","Change colour"],0,"qz_bat_q1"],
      ["What does a bat use to find things in the dark?",["Echolocation","A torch","Its whiskers"],0,"qz_bat_q2"],
      ["What is a baby bat called?",["A pup","A calf","A hoglet"],0,"qz_bat_q3"],
      ["What do many Irish bats love to eat?",["Midges","Apples","Seaweed"],0,"qz_bat_q4"],
      ["How does a bat rest?",["Hanging upside down","Floating on its back","Standing on one leg"],0,"qz_bat_q5"],
      ["What do many bats do in winter?",["Hibernate","Build sandcastles","Grow feathers"],0,"qz_bat_q6"]
    ],
    "Hedgehogs":[
      ["What covers a hedgehog's back?",["Spines","Feathers","Scales"],0,"qz_hedgehog_q1"],
      ["What does a hedgehog do when frightened?",["Rolls into a ball","Flies away","Jumps into water"],0,"qz_hedgehog_q2"],
      ["What is a baby hedgehog called?",["A hoglet","A puffling","A kit"],0,"qz_hedgehog_q3"],
      ["What might a hedgehog eat in a garden?",["Slugs","Pencils","Seaweed"],0,"qz_hedgehog_q4"],
      ["What does a hedgehog do in winter?",["Hibernates","Flies south","Lives underwater"],0,"qz_hedgehog_q5"],
      ["What helps a hedgehog travel between gardens?",["A small fence gap","A tall ladder","A boat"],0,"qz_hedgehog_q6"]
    ],
    "Barn Owls":[
      ["How does a barn owl fly?",["Very quietly","Very noisily","Only underwater"],0,"qz_owl_q1"],
      ["What shape is a barn owl's face?",["A heart","A square","A triangle"],0,"qz_owl_q2"],
      ["What does a barn owl cough up after eating?",["A pellet","A shell","A cocoon"],0,"qz_owl_q3"],
      ["What sound does a barn owl make?",["A screech","A moo","A croak"],0,"qz_owl_q4"],
      ["What does a barn owl hunt?",["Mice","Plankton","Apples"],0,"qz_owl_q5"],
      ["What helps a barn owl pinpoint tiny sounds?",["Uneven ears","A long tongue","Webbed feet"],0,"qz_owl_q6"]
    ],
    "Otters":[
      ["Where does an otter live?",["In a holt","In a sett","In a cocoon"],0,"qz_otter_q1"],
      ["What do otters love to eat?",["Fish","Grass","Acorns"],0,"qz_otter_q2"],
      ["What helps an otter feel fish moving in muddy water?",["Whiskers","Horns","Feathers"],0,"qz_otter_q3"],
      ["What keeps an otter warm in cold water?",["Two coats of fur","A woolly hat","Feathers"],0,"qz_otter_q4"],
      ["How many toes show in an otter footprint?",["Five","Two","Ten"],0,"qz_otter_q5"],
      ["What is a baby otter called?",["A cub","A puffling","An owlet"],0,"qz_otter_q6"]
    ],
    "Pine Martens":[
      ["Where is a pine marten happiest?",["Climbing in woods","Swimming in the sea","Living on open sand"],0,"qz_marten_q1"],
      ["What is the creamy patch on its chest called?",["A bib","A hood","A mask"],0,"qz_marten_q2"],
      ["What are baby pine martens called?",["Kits","Calves","Owlets"],0,"qz_marten_q3"],
      ["What is a pine marten called in Irish?",["Cat crainn","Madra rua","Rón mór"],0,"qz_marten_q4"],
      ["How can a pine marten climb down a tree?",["Head first","Only backwards","With a parachute"],0,"qz_marten_q5"],
      ["What is special about each pine marten's bib?",["Its pattern is unique","It glows at night","It changes every day"],0,"qz_marten_q6"]
    ],
    "Stoats":[
      ["What colour is the tip of a stoat's tail?",["Black","Blue","Orange"],0,"qz_stoat_q1"],
      ["What shape is a stoat's body?",["Long and thin","Round and flat","Short and spiky"],0,"qz_stoat_q2"],
      ["What are baby stoats called?",["Kits","Pups","Pufflings"],0,"qz_stoat_q3"],
      ["What is a stoat called in Irish?",["Easóg","Loscán","Puifín"],0,"qz_stoat_q4"],
      ["Which small hunter lives wild in Ireland?",["A stoat","A weasel","A meerkat"],0,"qz_stoat_q5"],
      ["Why can a stoat slip through tiny gaps?",["Its body is long and thin","It has no bones","It turns into smoke"],0,"qz_stoat_q6"]
    ],
    "Frogs":[
      ["What do frog eggs in a pond form?",["Frogspawn","A cocoon","A pellet"],0,"qz_frog_q1"],
      ["What does a tadpole grow first?",["Back legs","Wings","Feathers"],0,"qz_frog_q2"],
      ["What can a frog breathe through?",["Its skin","Its shell","Its fur"],0,"qz_frog_q3"],
      ["What is a young frog with a tiny tail called?",["A froglet","A hoglet","A puffling"],0,"qz_frog_q4"],
      ["Where might a frog sleep through winter?",["In pond mud","In a bird nest","On a sunny beach"],0,"qz_frog_q5"],
      ["What does a frog catch with its sticky tongue?",["Flies","Fish","Acorns"],0,"qz_frog_q6"]
    ],
    "Moths":[
      ["What does a moth start life as?",["An egg","A fish","A pup"],0,"qz_moth_q1"],
      ["What does a moth use to drink nectar?",["A long curled tongue","A beak","Whiskers"],0,"qz_moth_q2"],
      ["What do many moths help flowers with?",["Pollination","Digging","Swimming"],0,"qz_moth_q3"],
      ["About how many kinds of moth live in Ireland?",["One thousand five hundred","Fifteen","Five"],0,"qz_moth_q4"],
      ["What does a caterpillar make before becoming a moth?",["A cocoon","A sett","A pellet"],0,"qz_moth_q5"],
      ["What can some moths do to a bat's sonar?",["Jam it","Paint it","Eat it"],0,"qz_moth_q6"]
    ],
    "Grey Seals":[
      ["What is a baby seal called?",["A pup","A kit","A hoglet"],0,"qz_seal_q1"],
      ["What do seals mainly eat?",["Fish","Leaves","Berries"],0,"qz_seal_q2"],
      ["What helps a seal detect movement in water?",["Whiskers","Antlers","Wings"],0,"qz_seal_q3"],
      ["What happens to a seal's nostrils underwater?",["They close","They glow","They grow longer"],0,"qz_seal_q4"],
      ["What is special about grey seal milk?",["It is very rich","It is bright blue","It tastes like seaweed"],0,"qz_seal_q5"],
      ["What should you do if you see a seal pup resting?",["Give it lots of space","Take it home","Feed it a sandwich"],0,"qz_seal_q6"]
    ],
    "Puffins":[
      ["What is a baby puffin called?",["A puffling","A calf","A hoglet"],0,"qz_puffin_q1"],
      ["Where does a puffin nest?",["In a burrow","In a tall tree","Underwater"],0,"qz_puffin_q2"],
      ["What can a puffin carry lots of in its beak?",["Fish","Apples","Stones"],0,"qz_puffin_q3"],
      ["What is a puffin called in Irish?",["Puifín","Easóg","Cat crainn"],0,"qz_puffin_q4"],
      ["How many eggs does a puffin usually lay?",["One","Ten","One hundred"],0,"qz_puffin_q5"],
      ["What does a puffin use its wings for underwater?",["Swimming","Digging","Holding fish"],0,"qz_puffin_q6"]
    ],
    "Dolphins":[
      ["How does a dolphin breathe?",["Through a blowhole","Through gills","Through its skin"],0,"qz_dolphin_q1"],
      ["What is a baby dolphin called?",["A calf","A kit","A pup"],0,"qz_dolphin_q2"],
      ["How does a dolphin find fish in dark water?",["Echolocation","A lantern","Smell alone"],0,"qz_dolphin_q3"],
      ["How does a dolphin sleep without forgetting to breathe?",["Half its brain rests","It sleeps on land","It stops breathing"],0,"qz_dolphin_q4"],
      ["What special sound can be like a dolphin's name?",["A signature whistle","A roar","A screech"],0,"qz_dolphin_q5"],
      ["Where does Ireland's resident dolphin family live?",["The Shannon Estuary","A mountain cave","A forest pond"],0,"qz_dolphin_q6"]
    ],
    "Basking Sharks":[
      ["What does a basking shark eat?",["Plankton","Seals","People"],0,"qz_shark_q1"],
      ["How big can a basking shark grow?",["About as long as a bus","About as long as a pencil","About as long as a shoe"],0,"qz_shark_q2"],
      ["Is a basking shark dangerous to people?",["No — it is harmless","Yes — it hunts people","Only on land"],0,"qz_shark_q3"],
      ["How does a basking shark collect its dinner?",["It filters sea water","It digs underground","It picks berries"],0,"qz_shark_q4"],
      ["What is surprising about a basking shark's teeth?",["It hardly uses them","They are as big as bananas","It has only one"],0,"qz_shark_q5"],
      ["What can a basking shark sometimes do above the water?",["Jump","Climb a tree","Build a nest"],0,"qz_shark_q6"]
    ]
  };

  var ANIMAL_ICON={"Badgers":"🦡","Foxes":"🦊","Bats":"🦇","Hedgehogs":"🦔","Barn Owls":"🦉","Otters":"🦦","Pine Martens":"🌲","Stoats":"🐾","Frogs":"🐸","Moths":"🦋","Grey Seals":"🦭","Puffins":"🐧","Dolphins":"🐬","Basking Sharks":"🦈"};

  var GENERIC_DONE_CLIP="audio/qz_generic_done.mp3";
  var QUIZ_WINS_KEY="cubQuestQuizWinsV1";
  var quizAudio=null,quizTimings=null,timingsPromise=null,quizAudioDone=null;
  var activeWords=null,activeTiming=null,quizNarrationKey=null;
  function quizPlayer(){
    if(!quizAudio){
      quizAudio=new Audio();
      quizAudio.addEventListener("timeupdate",highlightSpokenWord);
      quizAudio.addEventListener("ended",function(){
        highlightSpokenWord(true);
        var done=quizAudioDone;quizAudioDone=null;
        if(done)done();
      });
    }
    return quizAudio;
  }
  function loadTimings(){
    if(quizTimings)return Promise.resolve(quizTimings);
    if(!timingsPromise)timingsPromise=fetch("audio/timings.json").then(function(r){if(!r.ok)throw new Error("timings unavailable");return r.json();}).then(function(data){quizTimings=data;return data;}).catch(function(){return{};});
    return timingsPromise;
  }
  function highlightSpokenWord(finished){
    if(!activeWords||!activeTiming||!quizAudio)return;
    var ms=finished===true?Infinity:quizAudio.currentTime*1000;
    for(var i=0;i<activeWords.length;i++){
      var span=activeTiming.t[i];
      activeWords[i].classList.toggle("heard",!!span&&ms>=span[0]);
      activeWords[i].classList.toggle("speaking",!!span&&ms>=span[0]&&ms<span[1]);
    }
  }
  function renderQuestion(target,text,key){
    target.textContent=text;activeWords=null;activeTiming=null;
    loadTimings().then(function(data){
      if(!target.isConnected||quizNarrationKey!==key||!data[key])return;
      var timing=data[key];target.innerHTML="";
      timing.w.forEach(function(word){var s=document.createElement("span");s.className="cq-quiz-word";s.textContent=word;target.appendChild(s);target.appendChild(document.createTextNode(" "));});
      activeWords=target.querySelectorAll(".cq-quiz-word");activeTiming=timing;highlightSpokenWord();
    });
  }
  function quizWins(){try{return JSON.parse(localStorage.getItem(QUIZ_WINS_KEY)||"{}");}catch(e){return{};}}
  function hasQuizWin(name){return !!quizWins()[name];}
  function saveQuizWin(name){try{var wins=quizWins();wins[name]=(wins[name]||0)+1;localStorage.setItem(QUIZ_WINS_KEY,JSON.stringify(wins));}catch(e){}}
  /* Plays one narration clip, replacing whatever this quiz was already
     saying. Silently does nothing if there is no clip for this moment
     (e.g. an animal not yet in NAME_TO_ID) rather than erroring. */
  function speakClip(src,key,target,onDone){
    quizAudioDone=null;
    if(!src){if(onDone)onDone();return;}
    quizNarrationKey=key||null;
    if(target&&key)renderQuestion(target,target.textContent,key);
    else{activeWords=null;activeTiming=null;}
    if(window.muted)return;
    try{
      var a=quizPlayer();
      a.pause();
      a.src=src;
      a.currentTime=0;
      quizAudioDone=onDone||null;
      var p=a.play();
      if(p&&p.catch)p.catch(function(){var done=quizAudioDone;quizAudioDone=null;if(done)done();});
    }catch(e){var done=quizAudioDone;quizAudioDone=null;if(done)done();}
  }
  function stopClip(){
    quizAudioDone=null;
    quizNarrationKey=null;
    if(!quizAudio)return;
    try{quizAudio.pause();}catch(e){}activeWords=null;activeTiming=null;
  }
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
    "Plankton":"✨","Seals":"🦭","People":"🧍","About as long as a bus":"🚌","About as long as a pencil":"✏️","About as long as a shoe":"👟","No — it is harmless":"💚","Yes — it hunts people":"⚠️","Only on land":"🏞️",
    "In a den":"🕳️","In a cocoon":"🧶","A sett":"🕳️","On a lily pad":"🪷","Cubs":"🦊","At noon":"☀️","Only at noon":"☀️","Only in summer":"🌻",
    "Midges":"🦟","Seaweed":"🌿","Hanging upside down":"🙃","Floating on its back":"🦦","Standing on one leg":"🦩","Hibernate":"💤","Build sandcastles":"🏰","Grow feathers":"🪶",
    "Slugs":"🐌","Pencils":"✏️","Hibernates":"💤","Flies south":"🪽","Lives underwater":"🌊","A small fence gap":"🚪","A tall ladder":"🪜","A boat":"⛵",
    "A screech":"📣","A moo":"🐄","A croak":"🐸","Mice":"🐭","Apples":"🍎","Uneven ears":"👂","A long tongue":"👅","Webbed feet":"🐾",
    "Two coats of fur":"🧥","A woolly hat":"🧢","Five":"🖐️","Two":"✌️","Ten":"🔟","A cub":"🐾","An owlet":"🦉",
    "Cat crainn":"🌲","Head first":"⬇️","Only backwards":"↩️","With a parachute":"🪂","Its pattern is unique":"✨","It glows at night":"💡","It changes every day":"🔄",
    "Easóg":"🐾","Puifín":"🐧","A stoat":"🐾","A weasel":"🐾","A meerkat":"🐾","Its body is long and thin":"➖","It has no bones":"🫠","It turns into smoke":"💨",
    "A froglet":"🐸","In pond mud":"🟤","In a bird nest":"🪺","On a sunny beach":"🏖️","Flies":"🪰",
    "One thousand five hundred":"✨","Fifteen":"1️⃣5️⃣","A cocoon":"🧶","Jam it":"📡","Paint it":"🎨","Eat it":"🍽️",
    "They close":"🙈","They glow":"💡","They grow longer":"📏","It is very rich":"🥛","It is bright blue":"🔵","It tastes like seaweed":"🌿","Give it lots of space":"↔️","Take it home":"🏠","Feed it a sandwich":"🥪",
    "One":"1️⃣","One hundred":"💯","Holding fish":"🐟",
    "Half its brain rests":"🧠","It sleeps on land":"🏖️","It stops breathing":"🫧","A signature whistle":"🎵","A roar":"🦁","The Shannon Estuary":"🌊","A mountain cave":"⛰️","A forest pond":"🌲",
    "It filters sea water":"🌊","It digs underground":"⛏️","It picks berries":"🫐","It hardly uses them":"🦷","They are as big as bananas":"🍌","It has only one":"1️⃣","Jump":"⬆️","Climb a tree":"🌳","Build a nest":"🪺"
  };

  /* A few answer words are too abstract for one generic emoji. These
     question-specific pictograms keep babies, animal names and actions
     literal while the visible caption supplies the exact wording. */
  var CONTEXT_ICONS={
    "qz_bat_q1":["🦇🪽","🐟💧","🦎🎨"],
    "qz_bat_q2":["🦇📡","🔦","🐱〰️"],
    "qz_bat_q3":["🦇🍼","🐄🍼","🦔🍼"],
    "qz_otter_q3":["🦦〰️","🦌","🪶"],
    "qz_otter_q6":["🦦🍼","🐧🍼","🦉🍼"],
    "qz_marten_q2":["🐾🟨","🧥","🎭"],
    "qz_marten_q3":["🌲🐾","🐄🍼","🦉🍼"],
    "qz_marten_q4":["🌲🐾","🦊","🦭"],
    "qz_stoat_q3":["🐾🍼","🐶🍼","🐧🍼"],
    "qz_stoat_q4":["🐾🇮🇪","🐸🇮🇪","🐧🇮🇪"],
    "qz_stoat_q5":["🐾🇮🇪","🐾🌿","🐾🏜️"],
    "qz_moth_q4":["1️⃣5️⃣0️⃣0️⃣","1️⃣5️⃣","5️⃣"],
    "qz_seal_q1":["🦭🍼","🐱🍼","🦔🍼"],
    "qz_seal_q6":["🦭↔️","🦭🏠","🦭🥪"],
    "qz_dolphin_q1":["🐬💨","🐟","🐸"],
    "qz_dolphin_q2":["🐬🍼","🐱🍼","🐶🍼"],
    "qz_shark_q4":["🦈🌊","⛏️","🫐"],
    "qz_shark_q5":["🦈🦷","🦷🍌","1️⃣🦷"]
  };
  function iconFor(label,clip,originalIndex){var reviewed=CONTEXT_ICONS[clip];return reviewed&&reviewed[originalIndex]||EXACT[label]||"❓";}
  function animalName(){var n=document.getElementById("lessonName");return n?n.textContent.trim():"";}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function arrangedChoices(q){
    var all=q[1].map(function(label,idx){return{label:label,correct:idx===q[2],originalIndex:idx};});
    var correct=all.filter(function(choice){return choice.correct;})[0];
    var wrong=all.filter(function(choice){return !choice.correct;});
    var match=q[3].match(/_q(\d+)$/),position=match?(Number(match[1])-1)%3:0;
    wrong.splice(position,0,correct);
    return wrong;
  }
  function voice(detail){
    detail=detail||{};
    /* Default narration: the question itself, and a closing well-done —
       same two moments the badger quiz speaks, sound-only feedback (no
       recorded line) for a correct/wrong tap, same as badger's chime/tone. */
    if(detail.type==="question"&&detail.clip){
      speakClip("audio/"+detail.clip+".mp3",detail.clip,detail.target,function(){
        speakClip("audio/"+detail.clip+"_options.mp3",detail.clip+"_options");
      });
    }else if(detail.type==="complete"){
      speakClip(GENERIC_DONE_CLIP);
    }else if(detail.type==="stop"){
      stopClip();
    }
    /* Still dispatched/hookable, so a future narration source (or a test)
       can override or add to the default above without editing this file. */
    try{window.dispatchEvent(new CustomEvent("cubquest-quiz-voice",{detail:detail}));}catch(e){}
    if(typeof window.CubQuestQuizVoice==="function")try{window.CubQuestQuizVoice(detail);}catch(e){}
  }
  function feedbackSound(correct){
    if(window.muted)return;
    if(correct&&typeof window.chime==="function"){try{window.chime();return;}catch(e){}}
    if(typeof window.tone==="function"){try{window.tone(correct?720:290,correct?0.2:0.28,"sine",.08,0);return;}catch(e){}}
    if(window.CubQuestGameSfx&&correct)try{window.CubQuestGameSfx.collect();}catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById("cqAllAccessStyle"))return;
    var s=document.createElement("style");s.id="cqAllAccessStyle";
    s.textContent=`
      .cq-all-quiz{--tint:#FFC24F!important;border-color:#8b6b14!important;background:linear-gradient(145deg,#4b3b14,#66501a)!important;min-height:150px}.cq-all-quiz .cq-q-art{width:84px;height:84px;display:grid;place-items:center;border-radius:24px;background:#FFC24F;color:#241704;font-size:3rem}.cq-all-quiz.won .cq-q-art{background:#74C99B}.cq-all-quiz .cq-q-meta b{color:#fff!important}.cq-all-quiz .cq-q-meta small{display:block;margin-top:5px;color:#F7F2E4;font-weight:800}
      .cq-quiz-overlay{position:fixed;inset:0;z-index:20000;background:linear-gradient(180deg,#101B2E,#14243a);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}.cq-quiz-box{width:min(680px,100%);background:#17263d;border:3px solid #FFC24F;border-radius:30px;padding:18px;color:#fff;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.45)}
      .cq-quiz-animal{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:#FFC24F;margin:0 auto 8px;font-size:3.3rem;box-shadow:0 8px 24px rgba(0,0,0,.28)}.cq-quiz-box h2{margin:0 0 5px;font-family:"Grandstander",sans-serif;color:#FFC24F;font-size:1.65rem}.cq-quiz-step{font-weight:900;color:#bfc8da;font-size:.8rem}.cq-quiz-pips{display:flex;justify-content:center;gap:8px;margin:7px 0}.cq-quiz-pip{width:13px;height:13px;border-radius:50%;border:2px solid #7d8aa0;background:transparent}.cq-quiz-pip.done{border-color:#74C99B;background:#74C99B}.cq-quiz-pip.now{border-color:#FFC24F;box-shadow:0 0 0 4px rgba(255,194,79,.16)}.cq-quiz-question{font-family:"Grandstander",sans-serif;font-size:clamp(1.25rem,5vw,1.75rem)!important;line-height:1.3;margin:12px auto 14px!important;max-width:570px}.cq-quiz-word{border-radius:6px;padding:0 2px;margin:0 -1px;transition:color .08s,background .08s}.cq-quiz-word.heard{color:#ffe39a}.cq-quiz-word.speaking{color:#241704;background:#FFC24F}
      .cq-quiz-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cq-quiz-choice{font:inherit;border:3px solid #2C4064;border-radius:22px;background:#F7F2E4;color:#101B2E;min-height:176px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;box-shadow:0 7px 0 #0b1422;transition:transform .12s,border-color .12s}.cq-quiz-choice:active{transform:translateY(3px);box-shadow:0 4px 0 #0b1422}.cq-quiz-choice .pic{width:94px;height:94px;border-radius:22px;display:grid;place-items:center;background:#fff;font-size:3.65rem;line-height:1;white-space:nowrap}.cq-quiz-choice .pic.multi{font-size:2.35rem}.cq-quiz-choice .caption{font-weight:950;font-size:.94rem;line-height:1.08}.cq-quiz-good{background:#74C99B!important;border-color:#a9efca!important}.cq-quiz-bad{background:#EE7C8C!important;border-color:#ffc0c8!important;animation:cqShake .32s}.cq-quiz-close{margin-top:15px;background:transparent;color:#fff;border:2px solid #61708a;border-radius:16px;padding:9px 17px;font-weight:900}.cq-quiz-finish{font-size:4.5rem;margin:10px 0}.cq-quiz-replay{grid-column:1/-1;min-height:74px!important;background:#74C99B!important;font-weight:950;font-size:1.1rem}
      .cq-quiz-choice:disabled{cursor:default}.cq-quiz-feedback{min-height:1.5em;margin:7px 0 0;font-weight:950;color:#FFC24F}.cq-quiz-spark{position:fixed;z-index:20001;pointer-events:none;font-size:1.6rem;animation:cqSpark .72s ease-out forwards}
      @keyframes cqShake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}@keyframes cqSpark{from{transform:translate(-50%,-50%) scale(.3);opacity:1}to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--turn)) scale(1.15);opacity:0}}@media(prefers-reduced-motion:reduce){.cq-quiz-choice,.cq-quiz-word{transition:none}.cq-quiz-bad{animation:none}.cq-quiz-spark{display:none}}@media(max-width:560px){.cq-quiz-box{padding:14px 10px}.cq-quiz-choices{gap:7px}.cq-quiz-choice{min-height:148px;padding:7px 4px;border-radius:18px}.cq-quiz-choice .pic{width:75px;height:75px;font-size:3rem;border-radius:18px}.cq-quiz-choice .caption{font-size:.76rem}.cq-quiz-animal{width:72px;height:72px;font-size:2.7rem}}
    `;
    document.head.appendChild(s);
  }

  function openQuiz(name){
    var pool=BANK[name];if(!pool)return;
    var qs=shuffle(pool).slice(0,3),i=0,score=0,locked=false;
    var returnFocus=document.activeElement;
    var o=document.createElement("div");o.className="cq-quiz-overlay";
    o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",name+" quiz");
    o.innerHTML='<div class="cq-quiz-box"><div class="cq-quiz-animal" aria-hidden="true">'+(ANIMAL_ICON[name]||"🐾")+'</div><h2>'+name+' Quiz</h2><div class="cq-quiz-step" id="cqQuizStep"></div><div class="cq-quiz-pips" id="cqQuizPips" aria-hidden="true"></div><p class="cq-quiz-question" id="cqQuizQuestion"></p><div class="cq-quiz-choices" id="cqQuizChoices"></div><p class="cq-quiz-feedback" id="cqQuizFeedback" aria-live="polite"></p><button class="cq-quiz-close" type="button">Close</button></div>';
    document.body.appendChild(o);
    function close(){voice({type:"stop",animal:name});o.remove();if(returnFocus&&returnFocus.focus)returnFocus.focus();}
    o.querySelector(".cq-quiz-close").onclick=close;
    o.addEventListener("keydown",function(e){if(e.key==="Escape")close();});

    function progress(){
      var pips=o.querySelector("#cqQuizPips");pips.innerHTML="";
      for(var n=0;n<qs.length;n++){var dot=document.createElement("span");dot.className="cq-quiz-pip"+(n<i?" done":n===i?" now":"");pips.appendChild(dot);}
    }
    function sparkle(button){
      if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
      var rect=button.getBoundingClientRect(),icons=["✨","⭐","●","✦","●","✨"];
      for(var n=0;n<12;n++){var s=document.createElement("i"),angle=Math.PI*2*n/12;s.className="cq-quiz-spark";s.textContent=icons[n%icons.length];s.style.left=(rect.left+rect.width/2)+"px";s.style.top=(rect.top+rect.height/2)+"px";s.style.setProperty("--dx",Math.cos(angle)*(62+(n%3)*16)+"px");s.style.setProperty("--dy",Math.sin(angle)*(62+(n%3)*16)+"px");s.style.setProperty("--turn",(n%2?220:-220)+"deg");document.body.appendChild(s);setTimeout(function(el){el.remove();},760,s);}
    }

    function next(){
      var p=o.querySelector("#cqQuizQuestion"),c=o.querySelector("#cqQuizChoices"),step=o.querySelector("#cqQuizStep"),feedback=o.querySelector("#cqQuizFeedback");
      if(i>=qs.length){
        locked=true;step.textContent="Adventure complete";progress();p.textContent="Quiz Champion! You got all "+qs.length+" right!";feedback.textContent="A new quiz mix is ready whenever you want to play again.";
        c.innerHTML='<div class="cq-quiz-finish" style="grid-column:1/-1" aria-hidden="true">🏆✨</div><button class="cq-quiz-choice cq-quiz-replay" type="button"><span class="caption">Play a new mix</span></button>';
        saveQuizWin(name);sync();
        c.querySelector("button").onclick=function(){qs=shuffle(pool).slice(0,3);i=0;score=0;locked=false;next();};
        voice({type:"complete",animal:name,text:p.textContent,score:score,total:qs.length});return;
      }
      locked=false;feedback.textContent="";progress();
      var q=qs[i];step.textContent="Question "+(i+1)+" of "+qs.length;p.textContent=q[0];c.innerHTML="";
      var choices=arrangedChoices(q);
      choices.forEach(function(choice){
        var b=document.createElement("button");b.type="button";b.className="cq-quiz-choice";b.setAttribute("aria-label",choice.label);
        var picture=iconFor(choice.label,q[3],choice.originalIndex),pictureClass=picture.length>4?"pic multi":"pic";
        b.innerHTML='<span class="'+pictureClass+'" aria-hidden="true">'+picture+'</span><span class="caption">'+choice.label+'</span>';
        b.onclick=function(){
          if(locked)return;
          stopClip();
          if(choice.correct){locked=true;score++;b.classList.add("cq-quiz-good");feedback.textContent="Correct!";feedbackSound(true);sparkle(b);c.querySelectorAll("button").forEach(function(x){x.disabled=true;if(x!==b)x.style.opacity=".5";});voice({type:"correct",animal:name,text:choice.label,question:q[0]});setTimeout(function(){i++;next();},1000);}
          else{b.classList.add("cq-quiz-bad");feedback.textContent="Try again.";feedbackSound(false);voice({type:"wrong",animal:name,text:"Try again",question:q[0]});setTimeout(function(){b.classList.remove("cq-quiz-bad");},420);}
        };
        c.appendChild(b);
      });
      voice({type:"question",animal:name,text:q[0],choices:choices.map(function(x){return x.label;}),clip:q[3],target:p,total:qs.length});
    }
    next();
    o.querySelector(".cq-quiz-close").focus();
  }

  function refreshQuizTile(tile,name){
    var won=hasQuizWin(name),art=tile.querySelector(".cq-q-art"),small=tile.querySelector("small");
    tile.classList.toggle("won",won);
    var artText=won?"🏆":"?",smallText=won?"Quiz complete • Play a new mix":"Three questions from a pool of six";
    var label=won?"Quiz complete. Play a new mix.":"Play the "+name+" quiz. Three questions from a pool of six.";
    if(art.textContent!==artText)art.textContent=artText;if(small.textContent!==smallText)small.textContent=smallText;if(tile.getAttribute("aria-label")!==label)tile.setAttribute("aria-label",label);
  }

  function sync(){
    ensureStyle();var grid=document.getElementById("grid");if(!grid||!grid.classList.contains("on"))return;var cards=grid.querySelector(".cards");if(!cards)return;var name=animalName();if(!BANK[name])return;
    var old=cards.querySelector(".quiz-tile");if(old){old.classList.remove("locked");old.setAttribute("aria-label","Quiz: always available");}
    var custom=cards.querySelector(".cq-all-quiz");if(name==="Badgers"&&old){if(custom)custom.remove();return;}
    if(!custom){custom=document.createElement("button");custom.type="button";custom.className="card cq-all-quiz";custom.innerHTML='<span class="cq-q-art" aria-hidden="true">?</span><span class="cq-q-meta"><b>Quiz</b><small></small></span>';custom.onclick=function(){openQuiz(animalName());};cards.appendChild(custom);}refreshQuizTile(custom,name);
    var game=cards.querySelector(".cq-published-game");if(game&&game.previousElementSibling!==custom)cards.insertBefore(custom,game);
  }
  var queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;sync();});}
  new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});window.addEventListener("pageshow",queue);queue();
})();
