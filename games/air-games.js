/* Cub Quest — flying animal mini-game registrations. */
(function(){
  "use strict";
  function ready(fn){if(window.CubQuestGames)fn();else window.addEventListener("cubquest-games-ready",fn,{once:true});}
  ready(function(){var G=window.CubQuestGames;
    G.register({id:"bat",title:"Midge Munch",goal:"Use echo pulses and catch 10 tiny midges!",openNarration:"Midge Munch! Tap Echo to reveal the midges, then fly through them to catch ten.",mode:"search",target:10,scoreLabel:"Midges",playerEmoji:"🦇",targetEmoji:"•",hiddenEmoji:"·",hideTargets:true,obstacles:4,obstacleEmoji:["🌳","🌿","🪨"],colors:["#0d1830","#162945"],hint:"Tap Echo, then drag to the midges",pulseNarration:"Ping! The echoes show where the midges are.",facts:[{at:3,title:"Echo power!",text:"Bats listen for echoes to find their way."},{at:7,title:"Midge muncher!",text:"Many Irish bats eat lots of tiny insects."},{at:10,title:"Eyes too!",text:"Bats are not blind. Their eyes work too."}]});

    G.register({id:"barn-owl",title:"Silent Glide",goal:"Glide through 9 moonlit gaps without bumping branches!",openNarration:"Silent Glide! Drag up and down to help the barn owl glide through the moonlit gaps.",mode:"runner",target:9,scoreLabel:"Gaps",playerEmoji:"🦉",targetEmoji:"🌙",obstacles:0,colors:["#10182b","#273044"],hint:"Drag up and down",scrollSpeed:145,facts:[{at:3,title:"Silent feathers!",text:"Barn owl feathers help them fly very quietly."},{at:6,title:"Amazing ears!",text:"Their ears are slightly uneven, which helps pinpoint sounds."},{at:9,title:"Screech!",text:"Barn owls screech. They do not make the classic hoot."}]});

    G.register({id:"moth",title:"Moonlight Maze",goal:"Fly past 9 lamps and keep heading toward the moon!",openNarration:"Moonlight Maze! Guide the moth through the night and keep it away from the bright lamps.",mode:"runner",target:9,scoreLabel:"Moon marks",playerEmoji:"🦋",targetEmoji:"🌙",obstacles:0,colors:["#11172c","#27213b"],hint:"Drag up and down",scrollSpeed:135,facts:[{at:3,title:"Night navigator!",text:"Moths often use the brightest natural light to help orient their bodies."},{at:6,title:"Bat trick!",text:"Some moths can interfere with a bat's sonar."},{at:9,title:"So many moths!",text:"Ireland has around fifteen hundred kinds of moth."}]});
  });
})();
