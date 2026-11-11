// ================= MUAY THAI MOE v1.23 — MAILBOX, SIDE QUESTS, ODD FIGHTS, CALENDAR, GRAPHS, NEWS BAR =================
// ---------- odd opponents (sprite sheets in a/<sprite>_sheet.webp, same 6-row layout as the girls) ----------
const QK={
  gang1:{name:"Red-Helmet Grunt",sprite:"gang1",lvl:-1.6,tilt:{punch:1.5,power:1,iq:-2,guard:-1.5,comp:-1},color:"#c8283c",grp:"gang"},
  gang2:{name:"Black Jacket, Red Helmet",sprite:"gang2",lvl:-.8,tilt:{punch:1.5,kick:1,iq:-1.5,comp:-1},color:"#a01f2f",grp:"gang"},
  gang3:{name:"Black-Red Helmet Lieutenant",sprite:"gang3",lvl:.1,tilt:{punch:1.5,knee:1,power:1,iq:-1},color:"#5a1420",grp:"gang"},
  gang4:{name:"Gold Helmet Boss",sprite:"gang4",lvl:.8,tilt:{power:2,punch:1.5,dur:1,foot:-1},color:"#d9a520",grp:"gang"},
  gang5:{name:"Big Boss Golden Helmet",sprite:"gang5",lvl:1.6,tilt:{power:2,punch:2,dur:1.5,comp:1,foot:-1},color:"#f7d24a",grp:"gang"},
  rooster1:{name:"Hot-Headed Bantam",sprite:"rooster1",lvl:-.9,tilt:{speed:2.5,kick:2,dur:-2,power:-1},color:"#e8a23a",grp:"rooster"},
  rooster2:{name:"Singburi Gray Rooster",sprite:"rooster2",lvl:-.2,tilt:{speed:2,kick:2,foot:1,dur:-1.5},color:"#8a8f9a",grp:"rooster"},
  rooster3:{name:"Temple-Boxing White Rooster",sprite:"rooster3",lvl:.4,tilt:{speed:2,kick:2.5,counter:1,dur:-1.5},color:"#f4f1ea",grp:"rooster"},
  rooster4:{name:"Black Red-Tail",sprite:"rooster4",lvl:.9,tilt:{speed:2,kick:2,power:1,guard:1,dur:-1},color:"#c8283c",grp:"rooster"},
  rooster5:{name:"Golden Rooster Godfather",sprite:"rooster5",lvl:1.5,tilt:{speed:2,kick:2.5,power:1.5,comp:1,dur:-.5},color:"#f7d24a",grp:"rooster"},
  bull1:{name:"Fresh Milk, the Runaway Cow",sprite:"bull1",lvl:-.6,tilt:{power:2,dur:2.5,clinch:1,speed:-2,iq:-1},color:"#f4f1ea",grp:"bull"},
  bull2:{name:"Red Curved-Horn",sprite:"bull2",lvl:.7,tilt:{power:2.5,dur:2,knee:1.5,speed:-1.5},color:"#a0522d",grp:"bull"},
  bull3:{name:"Mafia Buffalo",sprite:"bull3",lvl:1.4,tilt:{power:3,dur:2.5,clinch:2,speed:-1.5,foot:-1},color:"#2b2530",grp:"bull"},
};
const QGRP_BG={gang:"bg_food.webp",rooster:"bg_fair.webp",bull:"bg_fair.webp"};
function qTarget(G,fid){const f=fid&&G.F[fid];if(f)return ovr(f.a);const R=roster(G);return R.length?R.reduce((s,x)=>s+ovr(x.a),0)/R.length:9;}
function makeQ(G,kind,fid,tag){const K=QK[kind],t=qTarget(G,fid)+K.lvl,rng=mulberry32((G.seed^(G.week*977))+kind.length*31);const a={};
  for(const [k] of ATTRS)a[k]=clamp(t+(K.tilt[k]||0)+(rng()*1.6-.8),3,19.5);
  const d=t-ovr(a);for(const [k] of ATTRS)a[k]=clamp(a[k]+d,3,19.5);
  const id=`q_${kind}_${tag||G.week}`;const f=baseFighter(id,{name:K.name,full:K.name,div:"X",camp:"quest",color:K.color,potential:t+2,a});
  f.sprite=K.sprite;f.kind=kind;f.grp=K.grp;f.lvl=clamp(Math.round(t-6),1,10);f.fatigue=0;f.morale=70;G.F[id]=f;return id;}
function qCleanup(G){const keep=new Set([...G.bookings.map(b=>b.b),...G.offers.map(o=>o.b),...(G.mail||[]).filter(m=>!m.done&&m.qid).map(m=>m.qid)]);
  for(const id of Object.keys(G.F))if(id.startsWith("q_")&&!keep.has(id)&&G.week-(G.F[id].lastFight>0?G.F[id].lastFight:0)>2)delete G.F[id];}

// ---------- mail ----------
let MAILN=0;
function addMail(G,m){G.mail=G.mail||[];m.id="m"+G.week+"_"+(++MAILN)+"_"+Math.floor(Math.random()*1e4);m.wk=G.week;m.read=false;G.mail.unshift(m);G.mail=G.mail.slice(0,40);return m;}
const mailOpen=m=>!m.done&&!m.expired&&["take","pay","quiz","quest"].includes(m.kind);
function mailBadge(){if(!G||!G.mail)return 0;return G.mail.filter(m=>!m.read||mailOpen(m)).length;}
const MAILBOX_PX=pxIcon(["....kkkk....","...kffffk...","..krrrrrrk..",".krrrrrrrrk.",".krwwwwwwrk.",".krwkkkkwrk.",".krwwwwwwrk.",".krrrrrrrrk.",".kkkkkkkkkk.",".....kk.....",".....kk.....","....kkkk...."],{k:"#2a1a10",r:"#c8283c",w:"#f4ead8",f:"#f7d24a"});
const BILLS=[["Subdistrict Municipality","Fine: your camp's rooster crows above the legal limit at 4 a.m. (14 complaints)",300],
 ["Uncle Wang, motorbike taxi","Windshield repair: a kick knocked something off the bag and over the fence",800],
 ["Jae Tim's Chicken Rice","Invoice: your fighters ate 46 plates on credit (countersigned by Coach Daeng)",1840],
 ["Tube Ice Cooperative","This month's ice: your ice baths use more than every fish factory in the district",900],
 ["Auntie Taew, som tam","Broken mortar: someone from your camp 'demonstrated a spinning elbow' on Auntie's mortar",450],
 ["Signage Office","Sign tax: your camp sign is bigger than the temple's, extra fee",600,G=>G.fac.brand>=1],
 ["Provincial Electricity Authority","Special electricity charge: your camp floodlights are so bright birds are flying the wrong way",1200,G=>(G.fac.lights||0)>=1],
 ["Temple Route Songthaew Association","Songthaew parking fee at the temple (your students were cheering inside the vehicle)",350,G=>(G.fac.van||0)>=1],
 ["Subdistrict Animal Clinic","Treatment for the camp's orange cat: ate too much khanom khrok",500]];
const QUIZ=[["Before a fight, what ritual do Muay Thai fighters perform in the ring?",["Wai khru ram muay","Sing the national anthem","Show-off push-ups"],0],
 ["Muay Thai is known as the art of how many limbs?",["Six limbs","Eight limbs","Ten limbs"],1],
 ["What is the headpiece fighters wear during the wai khru called?",["Mongkhon headband","Prajiad armband","A headband"],0],
 ["What is the cloth tied around a fighter's upper arm called?",["Mongkhon headband","Prajiad armband","Sai sin (sacred thread)"],1],
 ["Per the Muay Thai verse 'Heavy fists of Korat, clever Lopburi, fine form of Chaiya…', which city's style is known for cleverness?",["Korat","Lopburi","Chaiya"],1],
 ["Which legendary fighter, captured and taken to Burma, defeated many Burmese boxers?",["Nai Khanom Tom","Nai Khanom Khrok","Nai Khanom Chan"],0],
 ["What instruments are central to the music played during Muay Thai fights?",["Pi chawa, khaek drums, ching","Guitar, drum kit","Ranat, khim"],0],
 ["Under standard professional rules, how many rounds is a Muay Thai fight?",["3 rounds","5 rounds","12 rounds"],1],
 ["What is the person in the ring who enforces the rules called?",["The referee","The cornerman","The promoter"],0],
 ["On what date is National Muay Thai Day?",["February 6","March 17","April 1"],1],
 ["Which body part does the 'sok' strike use?",["Elbow","Knee","Heel"],0],
 ["What is the liniment rubbed on fighters before a bout called?",["Muay oil (namman muay)","Coconut oil","Vegetable oil"],0],
 ["What kind of strike is 'Crocodile Sweeps Its Tail'?",["Spinning back kick","Flying knee","Straight punch"],0],
 ["In Muay Thai, grabbing the opponent's neck and kneeing is part of what?",["Plam (clinch)","Throw","Arm lock"],0],
 ["In professional Muay Thai, what do fighters wear on their hands?",["Boxing gloves","Socks","Oven mitts"],0],
 ["What does Coach Daeng say matters most before fight day?",["Getting enough sleep","Eating moo kratha","Watching the evening soap opera"],0],
 ["What does Sirichai Camp's orange cat love eating most? (listener question)",["Khanom khrok","Mackerel","Chicken rice"],0],
 ["Which king is famed for disguising himself to box with commoners?",["King Suea (the Tiger King)","King Chang Phueak","King Prasat Thong"],0]];

const WIN_BONUS=[
 ["Jae Tim's Chicken Rice","Win bonus!","Last night customers cheered for your camp so hard they forgot to pay, but today was a record day. Here's a share for the camp (the 46-plate tab still stands)"],
 ["The District Gas Station","Winner of the week award","The station awards a bonus to yesterday's winning camp, plus one car-wash coupon (Tuesdays only)"],
 ["Our Women's Muay Thai Fan Club","A whip-round for the winners","Everyone in the LINE group chipped in a little. So happy to see a small camp win. Don't forget to go live sometimes"],
 ["Auntie Taew's Som Tam","A share of sales","Customers flocked in for 'fighter-level spicy som tam' after yesterday's fight. Here's a share of the profit. Still haven't bought a new mortar, by the way"],
 ["Market moto-taxi stand","The moto-taxi guys chip in","We backed your camp and won. Here's a cut for the camp. Call it fuel for the heart"],
 ["Tube Ice Cooperative","Ice bill refund","Congratulations on the win. The co-op is refunding part of this month's ice bill, since your camp got the whole district taking ice baths"]];
const GIG_WEEKS=[10,15,20,25,30,35];
const GIGS=[
 ["New convenience store","Ribbon-cutting appearance fee","Thank you, Sirichai fighters, for the bag-kicking show outside our store. The crowd jammed the whole soi. Here's the agreed fee"],
 ["Ban Nong Faek School","Self-defense demo fee","The kids loved it. Now the whole school does wai khru all day. The principal sends the camp this fee"],
 ["Provincial Red Cross Fair","Stage show fee","Your camp's ram muay show drew a bigger crowd than the beauty pageant. The organizers are very grateful"],
 ["YouTube channel 'Eat & Fight'","Viral clip ad revenue","The clip of your fighters eating moo kratha after training hit a million views. Here's your ad-revenue share (the restaurant really did run out of pork)"],
 ["Riverside Ping Hotel","Tourist Muay Thai class fee","The foreign guests loved it. They want to book another class, and a photo with the orange cat"],
 ["Provincial Football Club","Fitness training fee","The whole squad's legs shook for three days after training with your camp. The coach says it was worth every baht"]];
// story & flavour letters (once each)
const STORY_MAIL=[
 {id:"ml_landlord",when:G=>G.week>=3,from:"Jae Muay (landlady)",title:"About the camp's debt",body:"To the new manager: Grandpa Chai's debt is still outstanding, dear. The system deducts it every 4 weeks automatically, don't panic. P.S. Next time you come to pay at my house, please bring a pack of green-tea KitKats. Not mandatory (mandatory)"},
 {id:"ml_kidfan",when:G=>G.flags&&G.flags.firstWin,from:"Nam Wan, Grade 3",title:"To the fighter",body:"Dear fighter, I watched you fight at the temple fair, you're so good. I drew you a picture too (attached: a round fighter with horns… probably a mongkhon). When I grow up I'll be a fighter like you, or else sell meatballs"},
 {id:"ml_district",when:G=>G.week>=21&&G.flags.qualDone,from:"District Muay Thai Association",title:"Welcome to the district round",body:"Congratulations on passing the subdistrict round. Points reset for the district round; the top 4 go to the provincial semis in week 44. Please dress respectfully. No fighting roosters in the stadium (we remember)"},
 {id:"ml_ploy",when:G=>G.flags&&G.flags.beat_ploy>=1,from:"Ploy, Golden Tiger Camp",title:"(very neat handwriting)",body:"Congratulations. This one belongs to Kati, I admit it. But thank you too… no one has made me afraid to lose in a long time. From tonight I'll train like someone who has never won. See you in the final — Ploy"},
 {id:"ml_fah",when:G=>G.flags&&G.flags.beat_fah>=1,from:"Fah, Golden Tiger Camp",title:"READ THIS!!",body:"Pure luck!! (crossed out) …Fine, you're good. But Fah will run up the mountain every morning until she wins it back. Tell Mali not to celebrate yet!! P.S. The snacks you sent were tasty (not a compliment)"},
 {id:"ml_semis",when:G=>G.week>=41&&G.flags.finalDone,from:"Provincial Muay Thai Association",title:"Invitation to the provincial semifinals",body:"You are invited to the provincial semifinals in week 44. Winners fight for the belt in week 49. Streamed live on the association page (312 views last year, aiming for 400 this year)"},
 {id:"ml_grandpa_fan",when:G=>G.rep>=20,from:"Uncle Chan, Grandpa Chai's old friend",title:"News of the camp reached Uncle",body:"Uncle read it in the seniors' LINE group: Sirichai is really back. Grandpa Chai must be smiling up there. Uncle has no money to help, but sends you an amulet. They say it protects from harm (Uncle isn't sure)"}];
// earned money — sponsors only write after real results
const SPONSOR_MAIL=[
 {id:"sp_moo",when:G=>roster(G).some(f=>f.form&&f.form.slice(0,3).join("")==="WWW"),from:"Auntie Sri's Grilled Pork",title:"A small sponsorship",body:"I saw your fighters win three in a row. May I put my shop's sign in the corner of your camp ring? This is all I can give",amt:1500},
 {id:"sp_oil",when:G=>(G.cal||[]).filter(c=>c.res==="W").length>=8,from:"Three-Headed Elephant Muay Oil",title:"Sponsorship offer",body:"Our company would like to support a camp on a winning streak, in exchange for your fighters wearing our muay oil on camera (strong smell, our apologies in advance)",amt:4000},
 {id:"sp_pump",when:G=>G.week>=41&&[...((G.semis||{}).A||[]),...((G.semis||{}).B||[])].some(id=>G.F[id]&&G.F[id].camp==="player"),from:"The District Gas Station",title:"Cheering our district's semifinalists",body:"The station would like to support our district's representative camp. Fill up 500 baht, get free drinking water (customers only). The camp receives the following sponsorship",amt:8000},
 {id:"sp_beatploy",when:G=>G.flags&&G.flags.beat_ploy>=1,from:"Women's Muay Thai Fan Club",title:"The Giant-Slayer Award",body:"A prize for the camp that finally beat Ploy, for the first time in two seasons. The fans chipped in",amt:5000}];

function mailWeekly(G){G.mail=G.mail||[];G.gang=G.gang||{st:0,next:0};G.mailSeen=G.mailSeen||{};const rng=mulberry32(G.seed+G.week*4441);
  for(const m of G.mail)if(m.exp&&G.week>m.exp&&!m.done)m.expired=true;
  for(const M of STORY_MAIL)if(!G.mailSeen[M.id]&&M.when(G)){G.mailSeen[M.id]=1;addMail(G,{kind:"letter",from:M.from,title:M.title,body:M.body});}
  for(const M of SPONSOR_MAIL)if(!G.mailSeen[M.id]&&M.when(G)){G.mailSeen[M.id]=1;addMail(G,{kind:"take",from:M.from,title:M.title,body:M.body,amt:M.amt});}
  // gang: after the first market fight, the next tier writes in every few weeks
  if(G.gang.st>=1&&G.gang.st<5&&G.week>=G.gang.next&&!G.mail.some(m=>m.q==="gang"&&!m.done&&!m.expired)&&G.week<=48){const k="gang"+(G.gang.st+1);
    addMail(G,{kind:"quest",q:"gang",qk:k,from:"Morning-market vendors (unsigned)",title:G.gang.st>=4?"Big Boss Golden Helmet is coming himself!":"The helmet gang is back",
      body:[`They're back collecting interest again. This time "${QK[k].name}" is in charge. Anyone who doesn't pay twenty percent gets their stall wrecked. Can you help us one more time?`,`${QK[k].name} threatened to seize Grandma Waew's meatball cart. If Sirichai doesn't stop him, no one can`,`The whole market has gone silent, because "${QK[k].name}" has been sitting guard since five a.m. Please`,`They say the big boss "${QK[k].name}" is coming to collect himself. The whole market owes him. Take this one down and the gang is finished`][G.gang.st-1],exp:G.week+3});G.gang.next=G.week+5;}
  // cow on the loose — once, mid season
  if(!G.mailSeen.cow&&G.week>=12&&rng()<.35){G.mailSeen.cow=1;addMail(G,{kind:"quest",q:"cow",qk:"bull1",from:"Uncle Chaloem, dairy farm",title:"Help! The cow's loose!!",body:"Fresh Milk, the fiercest cow on the farm, broke out of her pen. She watches Muay Thai on TV every night and now she can hold a guard! She's blocking the road in front of the market and kicks anyone who comes near. Send a fighter, please. Uncle will pay, plus a bucket of fresh milk",exp:G.week+2,pay:1500});}
  if(!G.mailSeen.rooster&&G.week>=7&&rng()<.3){G.mailSeen.rooster=1;addMail(G,{kind:"quest",q:"rooster",qk:"rooster1",from:"Sia Tong, rooster arena",title:"My rooster flew into your camp",body:"My hot-headed bantam flew over the fence and has been pecking your heavy bag since morning. It squares up at anyone who comes close. Please catch it for me. I'll pay, plus two trays of eggs",exp:G.week+2,pay:1000});}
  // rivals we keep ignoring write in to taunt us
  const sn=Object.entries(G.snub||{}).filter(([id,n])=>n>=3&&G.F[id]&&!G.F[id].canon&&(G.F[id].camp==="npc"||G.F[id].camp==="rival")&&!G.mailSeen["ch_"+id]).sort((a,b)=>b[1]-a[1])[0];
  if(sn&&rng()<.5&&G.week<=46){const op=G.F[sn[0]];G.mailSeen["ch_"+op.id]=1;
    addMail(G,{kind:"quest",q:"challenge",npc:op.id,from:op.name,title:"Why won't you take my fight?",body:[`I sent offers ${sn[1]} times and Sirichai never accepted once. Scared? If you've got guts, meet me behind the fresh market. No referee, no points, just pride`,`I hear your camp picks its opponents well. Only the ones you can beat. I'm challenging you right here: an exhibition in front of the temple, packed crowd. If you don't show, I'll tell the whole subdistrict you ran`,`I've been on your offers list for ${sn[1]} weeks. Like a menu item nobody orders. Today I'm ordering myself: an exhibition, against anyone in your camp`][sn[1]%3],exp:G.week+3,pay:1500});}
  // quiz from the community radio
  // v1.26: mid-season income — sponsors reward a win, paid appearances every few weeks
  const won=(G.cal||[]).some(c=>c.wk>=G.week-1&&c.res==="W"&&G.F[c.a]&&G.F[c.a].camp==="player"&&!(TIER[c.tier]&&TIER[c.tier].off));
  if(won&&G.week>=6&&G.week<=42&&rng()<.45){const B=WIN_BONUS[(G.week+G.seed)%WIN_BONUS.length];addMail(G,{kind:"take",from:B[0],title:B[1],body:B[2],amt:Math.round((1500+G.week*70)/100)*100});}
  const gi=GIG_WEEKS.indexOf(G.week);if(gi>=0){const g=GIGS[gi%GIGS.length];addMail(G,{kind:"take",from:g[0],title:g[1],body:g[2],amt:Math.round((3000+G.week*90)/100)*100});}
  if(G.week%3===1&&G.week>=4&&G.week<=49){const q=QUIZ[(Math.floor(G.week/3)+G.seed)%QUIZ.length];addMail(G,{kind:"quiz",from:"Community radio 'Our Muay Thai'",title:"Weekly prize quiz",body:"Answer correctly to win prize money from the show's sponsor (one answer only)",q:q[0],opts:q[1],ans:q[2],amt:Math.round((800+Math.min(2200,G.week*45))/10)*10,exp:G.week+2});}
  // odd bills
  if(G.week>=5&&rng()<.22){const L=BILLS.filter(b=>!b[3]||b[3](G));const b=L[Math.floor(rng()*L.length)];addMail(G,{kind:"pay",from:b[0],title:"Invoice",body:b[1],amt:Math.round(b[2]*(1+G.week/60)/10)*10,exp:G.week+2});}
  // odd fights posted to the offers board (rare, pays well)
  beastOffer(G,rng);
  qCleanup(G);}
const BEAST_WEEKS=[9,15,21,27,33,38,44];
function beastOffer(G,rng){if(!BEAST_WEEKS.includes(G.week))return;const R=roster(G).filter(f=>!f.injury);if(!R.length)return;
  const i=BEAST_WEEKS.indexOf(G.week);const kinds=["rooster2","bull2","rooster3","rooster4","bull3","rooster5","bull3"];const kind=kinds[i];const f=R[Math.floor(rng()*R.length)];
  const wk=G.week+2;if(G.bookings.some(b=>b.a===f.id&&Math.abs(b.week-wk)<=1))return;const qid=makeQ(G,kind,f.id,"o"+G.week);const K=QK[kind];
  const win=Math.round((6000+G.week*180)*(1+K.lvl*.2)/100)*100,lose=Math.round(win*.35/100)*100;
  G.offers.unshift({id:`ob${G.week}_${f.id}`,a:f.id,b:qid,week:wk,tier:"beast",beast:kind,win,lose});
  const ev=K.grp==="rooster"?["Ban Pong Temple Fair","Human vs Fighting Rooster"]:["District Annual Fair","Bull Wrestling (Muay Thai edition)"];
  addMail(G,{kind:"letter",from:ev[0],title:`Invitation: "${ev[1]}"`,body:`We invite ${f.name} to a special bout with "${K.name}" in week ${wk}. Better purse than a normal fight (doesn't affect record or rankings). The offer is on the Fights page; accept it this week`});}

// ---------- quest fights ----------
function questFighters(){return roster(G).filter(f=>!f.injury);}
function startQuest(spec,fid,done){const f=G.F[fid];if(!f){done&&done();return;}
  const opp=spec.npc||makeQ(G,spec.qk,fid,spec.tag||("w"+G.week));const tier="quest";
  const b={id:"q"+G.week+"_"+fid+"_"+Math.floor(Math.random()*1e4),a:fid,b:opp,week:G.week,tier,rounds:spec.rounds||3,win:spec.purse||0,lose:0,quest:spec};
  b.bg=spec.npc?"bg_food.webp":QGRP_BG[QK[spec.qk].grp];
  openFight(b,()=>questAfter(b,done));}
function questAfter(b,done){const S=b.quest,res=(G.cal||[]).slice(-1)[0];const win=res&&res.b===b.b&&res.res==="W";const me=G.F[b.a],op=G.F[b.b]||{name:"Opponent"};
  const fin=()=>{save();render();done&&done();};
  if(S.q==="gang"){G.gang=G.gang||{st:0,next:0};if(win){G.gang.st=Math.max(G.gang.st,+S.qk.slice(4));G.gang.next=G.week+4;G.rep+=S.qk==="gang5"?2:.5;
      const amt=S.qk==="gang5"?12000:S.qk==="gang4"?5000:S.qk==="gang3"?2000:200+Math.floor(Math.random()*7)*50;
      addMail(G,{kind:"take",from:"(sender unknown)",title:S.qk==="gang5"?"The morning market thanks Sirichai":"A brown envelope with no name",body:S.qk==="gang5"?"The helmet gang has disbanded. The whole market's loan-shark debts are void. Every stall chipped in for the camp. Thank you for not just standing by":"Inside: money and a note in shaky handwriting: 'Thank you for helping the market. We sold out today'",amt});
      playScene([{n:"npc",who:"Auntie Sri, vegetable vendor",t:S.qk==="gang5"?"The Golden Helmet boss is down!! The whole market is free!":"They're gone! They rode off on their bikes! Thank you, dear"},{n:b.a,f:"happy",l:"fight",t:S.qk==="gang5"?"This market has protection now. Its name is Sirichai Camp!":"Anyone who bullies this market goes through Sirichai first!"},{n:"nar",t:"By evening, a brown envelope with no sender is tucked into the camp mailbox"}],fin,{bg:"food",look:"fight"});return;}
    playScene([{n:"npc",who:op.name,t:"Ha! Some fight camp! Tell the vendors to get the interest ready!"},{n:b.a,f:"sad",l:"fight",t:"…I'm sorry, auntie. Next time I won't lose"},{n:"nar",t:"The vendor says it's okay. They'll be back, and the camp will get another chance"}],()=>{G.gang.next=G.week+3;fin();},{bg:"food",look:"fight"});return;}
  if(win&&S.pay){addMail(G,{kind:"take",from:S.from||"Client",title:"Fee as agreed",body:S.q==="cow"?"Your fee plus a bucket of fresh milk (the milk was gone within ten minutes, courtesy of the camp's fighters)":S.q==="rooster"?"Your fee plus two trays of eggs. The bantam went home to sulk; the owner says it had never lost before":"Ringside bets pooled by the crowd. The whole subdistrict is talking about this fight",amt:S.pay});G.rep+=.6;}
  if(S.q==="challenge")op&&(win?G.rep+=1:0);
  fin();}

// first time — the market scene, then straight into the ring
function gangEventSteps(){const R=questFighters();const steps=[{n:"nar",t:"Saturday morning, the fresh market by the temple. Shouting comes from a vegetable stall"},
  {n:"npc",who:"Auntie Sri, vegetable vendor",t:"I really don't have it, young man. Half my vegetables rotted this month, let me pay next week…"},
  {n:"npc",who:"Red-Helmet Grunt",t:"Twenty percent a month, auntie! Don't pay today and tomorrow this stall is gone!"},
  {n:"coach",t:"The helmet gang… loan sharks charging twenty percent a month, bleeding the market dry for years"},
  {n:"kati",f:"angry",l:"train",t:"Manager! Grandpa Chai taught that Muay Thai is for protecting people who can't fight back. We can't just stand here!"},
  {choice:[...R.slice(0,3).map(f=>({t:`Send ${f.name} to handle it (fight now · fatigue ${Math.round(f.fatigue)})`,fx:()=>{UI.qpend={q:"gang",qk:"gang1",fid:f.id};},then:[{n:"npc",who:"Red-Helmet Grunt",t:`Huh? A girl fighter? ${f.name}? Bring it, you'll learn these helmets aren't just for show!`}]})),
    {t:"Call the police instead (no fight)",fx:()=>{UI.qpend=null;G.gang={st:0,next:G.week+6,skip:1};},then:[{n:"nar",t:"The police arrive fifteen minutes too late. The helmet gang is gone. Auntie Sri lets out a long sigh"},{n:"kati",f:"sad",l:"train",t:"…Next time I see them, I won't let it go"}]}]}];return steps;}
function questExtra(done,rng){if(!G||G.ended)return false;G.gang=G.gang||{st:0,next:0};
  const again=G.gang.skip&&G.gang.st===0&&!G.seen.q_gang_again&&G.week>=G.gang.next;
  const ok=(!G.seen.q_gang_first||again)&&G.week>=6&&G.week<=44&&questFighters().length;
  if(!ok||rng()>=.2)return false;if(G.seen.q_gang_first)G.seen.q_gang_again=true;G.seen.q_gang_first=true;
  UI.qpend=null;playScene(gangEventSteps(),()=>{const p=UI.qpend;UI.qpend=null;if(!p){done();return;}G.gang.st=Math.max(G.gang.st,0);startQuest({q:"gang",qk:"gang1"},p.fid,done);},{bg:"food",look:"train"});return true;}

// ---------- modals ----------
function mailListHTML(){const L=G.mail||[];
  return `<h2 class="mailh">${MAILBOX_PX} Mailbox</h2>${L.length?`<div class="mlist2">${L.map(m=>`<button class="mrow2 ${m.read?"":"unread"} ${mailOpen(m)?"act":""} ${m.done||m.expired?"old":""}" data-act="mopen" data-v="${m.id}"><span class="mk ${m.kind}">${{letter:"Letter",take:"Money",pay:"Invoice",quiz:"Quiz",quest:"Request"}[m.kind]}</span><span class="mt"><b>${esc(m.title)}</b><small>${esc(m.from)} · wk ${m.wk}${m.expired?" · expired":m.done?" · handled":m.exp?` · by wk ${m.exp}`:""}</small></span>${mailOpen(m)?'<i class="dot"></i>':""}</button>`).join("")}</div>`:`<p class="lead">No mail yet</p>`}`;}
function letterHTML(m){m.read=true;let act="";
  if(m.kind==="take")act=m.done?`<p class="meta center">Received ${fmt(m.amt)}</p>`:`<button class="btn primary" data-act="mtake" data-v="${m.id}">Collect ${fmt(m.amt)}</button>`;
  if(m.kind==="pay")act=m.done?`<p class="meta center">${m.paid?"Paid":"Didn't pay (fame −0.3)"}</p>`:m.expired?"":`<button class="btn" data-act="mskip" data-v="${m.id}">Don't pay (fame −0.3)</button><button class="btn primary" data-act="mpay" data-v="${m.id}" ${G.cash<m.amt?"disabled":""}>Pay ${fmt(m.amt)}</button>`;
  if(m.kind==="quiz")act=m.done?`<p class="meta center">${m.ok?`Correct! You won ${fmt(m.amt)}`:`Wrong! The answer was "${esc(m.opts[m.ans])}"`}</p>`:m.expired?"":`<p class="qz"><b>${esc(m.q)}</b></p><div class="qopts">${m.opts.map((o,i)=>`<button class="btn" data-act="mquiz" data-v="${m.id}" data-k="${i}">${esc(o)}</button>`).join("")}</div>`;
  if(m.kind==="quest")act=m.done?`<p class="meta center">${m.declined?"Declined":"Fighter sent"}</p>`:m.expired?`<p class="meta center">Expired</p>`:`<button class="btn" data-act="mdecl" data-v="${m.id}">Not going</button><button class="btn primary" data-act="macc" data-v="${m.id}">Take the job · choose a fighter</button>`;
  const opp=m.qk?QK[m.qk]:m.npc?G.F[m.npc]:null;
  return `<button class="btn sm ghost mback" data-act="mail">◂ Mailbox</button><div class="letter px"><div class="lhead"><small>From</small><b>${esc(m.from)}</b><small>Week ${m.wk}</small></div><h3>${esc(m.title)}</h3><p>${esc(m.body)}</p>
   ${m.kind==="take"||m.kind==="pay"?`<p class="lamt ${m.kind}">${m.kind==="take"?"+":"−"}${fmt(m.amt)}</p>`:""}
   ${opp&&m.kind==="quest"?`<div class="qopp">${m.qk?`<canvas width="96" height="96" data-qsprite="${QK[m.qk].sprite}"></canvas>`:faceImg(opp)}<span><b>${esc(opp.name)}</b><small>${m.q==="challenge"?"Exhibition, off the record":"Fight now · off the record and rankings · extra fatigue"}${m.pay?` · fee ${fmt(m.pay)}`:m.q==="gang"?" · reward arrives by mail":""}</small></span></div>`:""}</div>
   <div class="mfoot lact">${act}</div>`;}
function qpickHTML(mid){const m=(G.mail||[]).find(x=>x.id===mid);const R=roster(G);
  return `<h2>Who will you send?</h2><p class="meta">${m?esc(m.title):""} · fight right now, extra fatigue, off the record</p><div class="qpick">${R.map(f=>`<button class="qpf px" data-act="qsend" data-id="${f.id}" data-v="${mid}" ${f.injury?"disabled":""}>${faceImg(f,"sm")}<span><b>${esc(f.name)} Lv.${f.lvl}</b><small>${f.injury?`Injured ${f.injury} wk`:`Fatigue ${Math.round(f.fatigue)} · readiness ${condition(f)}`}</small></span></button>`).join("")}</div>`;}
// cash flow & fame graphs
function lineSVG(pts,key,col,fmtY){if(pts.length<2)return `<p class="meta">Not enough data yet, play another week`;const W=320,H=130,P=26;const ys=pts.map(p=>p[key]);let mn=Math.min(0,...ys),mx=Math.max(...ys);if(mx===mn)mx=mn+1;
  const x=i=>P+(W-P-6)*i/(pts.length-1),y=v=>H-16-(H-28)*(v-mn)/(mx-mn);const d=pts.map((p,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join("");
  const z=mn<0?`<line x1="${P}" x2="${W-6}" y1="${y(0)}" y2="${y(0)}" class="g0"/>`:"";
  return `<svg class="lsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart"><line x1="${P}" x2="${W-6}" y1="${H-16}" y2="${H-16}" class="gax"/>${z}<path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"/>
   ${pts.map((p,i)=>`<rect x="${x(i)-2}" y="${y(p[key])-2}" width="4" height="4" fill="${col}"><title>wk ${p.w}: ${fmtY(p[key])}</title></rect>`).join("")}
   <text x="${P-4}" y="${y(mx)+4}" text-anchor="end" class="gt">${fmtY(mx)}</text><text x="${P-4}" y="${y(mn)+4}" text-anchor="end" class="gt">${fmtY(mn)}</text>
   <text x="${x(0)}" y="${H-3}" class="gt">wk ${pts[0].w}</text><text x="${x(pts.length-1)}" y="${H-3}" text-anchor="end" class="gt">wk ${pts[pts.length-1].w}</text></svg>`;}
const kfmt=v=>Math.abs(v)>=1000?(v<0?"-":"")+"฿"+(Math.abs(v)/1000).toFixed(Math.abs(v)>=10000?0:1)+"k":fmt(v);
function cashflowHTML(){const H=(G.history||[]);const inc=classIncome(G),up=upkeep(G),wg=wages(G),net=inc-up-wg;
  const L=H.slice(-7).map((h,i,a)=>i?{w:h.w,d:h.cash-a[i-1].cash,cash:h.cash,fight:h.fight}:null).filter(Boolean).reverse();
  const tip=net<0?(G.cash/-net<6?`Regular costs exceed income. Cash lasts about ${Math.max(1,Math.floor(G.cash/-net))} weeks. Take a fight or check the mailbox for income`:`Regular costs exceed income, so you rely on fight purses. More students (upgrade the classroom) will help`):G.cash>25000?`Plenty of cash. Try upgrading the camp or hiring another coach`:`Money is healthy. Save up for the next camp upgrade`;
  return `<h2>Finances</h2><div class="bigcash"><small>Cash right now</small><b class="num">${fmt(G.cash)}</b><span class="num ${net<0?"negt":"post"}">${net<0?"−":"+"}${fmt(Math.abs(net))} per week</span></div>
   <div class="ctip"><img src="${ASSET}coach.webp" alt=""><span>${tip}</span></div>
   <div class="kv-row"><span>Class fees, ${students(G)} students</span><b class="num pos">+${fmt(inc)}</b></div><div class="kv-row"><span>Upkeep + wages</span><b class="num neg">−${fmt(up+wg)}</b></div>
   <h3>Recent money in / out</h3>${L.length?L.map(h=>`<div class="kv-row"><span>Week ${h.w}${h.fight?" · fight purse":""}</span><b class="num ${h.d<0?"negt":"post"}">${h.d<0?"−":"+"}${fmt(Math.abs(Math.round(h.d)))}</b></div>`).join(""):`<p class="meta">No history yet. Play another week</p>`}`;}
function repgraphHTML(){const r=G.rep,S=repSteps();const nx=S.find(([n])=>r<n),pv=[...S].reverse().find(([n])=>r>=n);const lo=pv?pv[0]:0,hi=nx?nx[0]:Math.max(lo+1,r);
  return `<h2>Camp fame</h2><div class="repg"><div class="repg-h"><b class="num">${r.toFixed(1)}</b><span>${nx?`${(nx[0]-r).toFixed(1)} more to unlock: ${nx[1]}`:"Everything unlocked"}</span></div>
    <div class="gauge" role="img" aria-label="Fame ${r.toFixed(1)}"><i style="width:${Math.round(100*Math.min(1,(r-lo)/(hi-lo)))}%"></i></div><div class="repg-f"><small class="num">${lo}</small><small class="num">${nx?hi:""}</small></div></div>
   <p class="meta">Earned by winning fights, camp activities and hosting fight nights · higher fame means more students and bigger purses ${r>40?" · above 40 it slowly drops, so keep winning":""}</p>
   <div class="replist">${S.map(([n,t])=>`<div class="${r>=n?"on":""}"><b>${r>=n?"✓":n}</b><span>${t}</span></div>`).join("")}</div>`;}
// fight calendar under the rankings
function calendarHTML(){const past={},next={};for(const c of G.cal||[])(past[c.wk]=past[c.wk]||[]).push(c);for(const b of G.bookings)if(G.F[b.a]&&G.F[b.a].camp==="player")(next[b.week]=next[b.week]||[]).push(b);
  const mark={20:"Subdistrict cut",40:"District cut",44:"Semifinal",49:"Final"};
  return `<section class="px card cal"><div class="card-h"><h3>Fight calendar</h3><span class="legend"><i class="cw"></i>Win <i class="cl"></i>Loss <i class="cn"></i>Upcoming</span></div>
   <div class="calg">${Array.from({length:52},(_,i)=>i+1).map(w=>{const p=past[w],n=next[w];const r=p?(p.some(c=>c.res==="W")?(p.every(c=>c.res==="W")?"w":"m"):p.some(c=>c.res==="D")?"d":"l"):"";
     return `<button class="cday ${w<G.week?"gone":""} ${w===G.week?"now":""} ${p?"has "+r:""} ${n?"nx":""} ${mark[w]?"mk":""}" data-act="calday" data-v="${w}" ${p||n?"":"tabindex=\"-1\""} title="${mark[w]||""}" aria-label="Week ${w}${p?" has fight results":n?" has a booked fight":""}"><b>${w}</b>${p||n?`<i>${p?p.length:""}${n?"●":""}</i>`:""}${mark[w]?`<s></s>`:""}</button>`;}).join("")}</div>
   <p class="meta">Tap a fight week to see results · gold underline = cut weeks (20, 40) and semis/final (44, 49)</p></section>`;}
function caldayHTML(w){const p=(G.cal||[]).filter(c=>c.wk===w),n=G.bookings.filter(b=>b.week===w&&G.F[b.a]&&G.F[b.a].camp==="player");
  return `<h2>Week ${w}</h2>${p.map(c=>{const me=G.F[c.a];return `<div class="calres px ${c.res==="W"?"w":c.res==="L"?"l":"d"}"><b>${esc(me?me.name:c.a)} ${c.res==="W"?"Win":c.res==="L"?"Loss":"Draw"} ${esc(c.bn)}</b><span class="meta">${TIER[c.tier]?TIER[c.tier].name:""} · ${esc(c.type||"")} · earned ${fmt(c.pay||0)}</span><span class="cards">${(c.cards||[]).map((k,i)=>`<i>R${i+1} ${k[0]}–${k[1]}</i>`).join("")}</span></div>`;}).join("")}
   ${n.map(b=>`<div class="calres px nx"><b>${esc(G.F[b.a].name)} vs ${esc(G.F[b.b].name)}</b><span class="meta">Booked · ${TIER[b.tier].name} · ${b.rounds} rounds</span></div>`).join("")}${!p.length&&!n.length?`<p class="meta">No camp fights this week</p>`:""}`;}
const RANK_HELP=`<ul class="fp-list"><li><b>Win = 3 points</b> (beat a stronger fighter +1) · draw 1 · loss 0 — only "subdistrict/district" fights count</li><li><b>Weeks 1–20, subdistrict round:</b> the top 4 of each division advance to the district round</li><li><b>Weeks 21–40, district round:</b> points reset, the top 4 go to the provincial semis</li><li><b>Week 44 semis · week 49 provincial final</b>: big prize money and top fame</li><li>Temple-fair, special and off-the-books fights <b>give no points</b>, but do give money, EXP and fame</li></ul>`;
const XMODAL={
  mail:()=>({body:mailListHTML(),foot:true}),
  letter:m=>{const x=(G.mail||[]).find(y=>y.id===m.id);return x?{body:letterHTML(x),foot:false}:{body:mailListHTML(),foot:true};},
  qpick:m=>({body:qpickHTML(m.id),foot:true}),
  cashflow:()=>({body:cashflowHTML(),foot:true}),
  repgraph:()=>({body:repgraphHTML(),foot:true}),
  calday:m=>({body:caldayHTML(m.w),foot:true}),
  rankhelp:()=>({body:`<h2>How do rankings work?</h2><div class="ctip big"><img src="${faceSrc("coach")}" alt=""><span><b>Coach Daeng:</b> This season's goal is to get Kati ${G.F.mali.camp==="player"?" and Mali":""} into the division's <b>top 4</b>, clear both stages, then face Golden Tiger in the final</span></div>${RANK_HELP}`,foot:true}),
  declo:m=>{const o=G.offers.find(x=>x.id===m.id);if(!o)return {body:"",foot:true};return {body:`<h2>Decline this offer?</h2><p>${esc(G.F[o.a].name)} vs ${esc(G.F[o.b].name)} · wk ${o.week} · ${TIER[o.tier].name}</p><p class="meta">The offer will disappear from the list (decline the same person often and they may write you a challenge)</p><div class="mfoot"><button class="btn ghost" data-act="closeModal">No</button><button class="btn primary" data-act="declyes" data-v="${o.id}">Decline</button></div>`,foot:false};}};
Object.assign(ACT,{
  mail:()=>{UI.modal={type:"mail"};render();},
  mopen:d=>{UI.modal={type:"letter",id:d.v};render();save();},
  mtake:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;G.cash+=m.amt;m.done=true;AU.sfx("level");toast(`Received ${fmt(m.amt)}`);save();render();},
  mpay:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done||G.cash<m.amt)return;G.cash-=m.amt;m.done=true;m.paid=true;AU.sfx("ui");save();render();},
  mskip:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;G.rep=Math.max(0,G.rep-.3);m.done=true;save();render();},
  mquiz:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;m.done=true;m.ok=+d.k===m.ans;if(m.ok){G.cash+=m.amt;AU.sfx("level");}else AU.sfx("miss");save();render();},
  mdecl:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m)return;m.done=true;m.declined=true;if(m.q==="gang"&&G.gang)G.gang.next=G.week+4;save();render();},
  macc:d=>{UI.modal={type:"qpick",id:d.v};render();},
  qsend:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;m.done=true;UI.modal=null;
    const spec=m.q==="challenge"?{q:"challenge",npc:m.npc,pay:m.pay,from:m.from}:{q:m.q,qk:m.qk,pay:m.pay,from:m.from,rounds:m.qk==="gang5"?4:3};
    const intro=m.q==="gang"?[{n:"nar",t:"Morning market… more than ten motorbikes are lined up in front of the vegetable stalls"},{n:"npc",who:QK[m.qk].name,t:m.qk==="gang5"?"I hear some fight camp is meddling in my business. Today the big boss came down himself!":"So who chased off my boys? Come on out!"},{n:d.id,f:"angry",l:"fight",t:"Me!"}]
      :m.q==="challenge"?[{n:"nar",t:"The yard behind the fresh market. Crowds on both sides; someone has set up a table taking bets in red soda"},{n:"npc",who:G.F[m.npc].name,t:"So you finally came. I thought you'd run all season"},{n:d.id,f:"angry",l:"fight",t:"I wasn't running, I was busy. Now I'm free!"}]
      :m.q==="cow"?[{n:"nar",t:"In the middle of the road by the market, a huge dairy cow holds a guard, front hooves doing footwork no cow should be able to do"},{n:"npc",who:"Uncle Chaloem",t:"That's her! Watch out for the kicks, dear, she watches fight replays every night!"},{n:d.id,f:"surprised",l:"fight",t:"…A cow really can hold a guard!?"}]
      :[{n:"nar",t:"A small bantam stands on the heavy bag, chest puffed, neck feathers bristling"},{n:"npc",who:"Sia Tong",t:"Don't underestimate him. He once chased every big dog on the street"},{n:d.id,f:"happy",l:"fight",t:"Come on, chicken! I'm not a dog!"}];
    playScene(intro,()=>startQuest(spec,d.id,()=>{}),{bg:m.q==="gang"||m.q==="challenge"?"food":"fair",look:"fight"});},
  cashflow:()=>{UI.modal={type:"cashflow"};render();},
  repgraph:()=>{UI.modal={type:"repgraph"};render();},
  calday:d=>{const w=+d.v;if(!(G.cal||[]).some(c=>c.wk===w)&&!G.bookings.some(b=>b.week===w))return;UI.modal={type:"calday",w};render();},
  rankhelp:()=>{UI.modal={type:"rankhelp"};render();},
  declo:d=>{UI.modal={type:"declo",id:d.v};render();},
  declyes:d=>{const o=G.offers.find(x=>x.id===d.v);if(o){G.offers=G.offers.filter(x=>x.id!==o.id);if(!o.beast){G.snub=G.snub||{};G.snub[o.b]=(G.snub[o.b]||0)+1;}}UI.modal=null;save();render();},
});
// a quest sprite preview canvas (in letters)
function mountQSprites(){document.querySelectorAll("canvas[data-qsprite]").forEach(cv=>{const x=cv.getContext("2d");const sh=img(cv.dataset.qsprite+"_sheet.webp");
  LOOPS.add(t=>{if(!cv.isConnected)return;x.clearRect(0,0,cv.width,cv.height);const fr=Math.floor(t/200)%4;x.imageSmoothingEnabled=true;drawFrame(x,sh,ROW.guard,fr,cv.width/2,cv.height*.97,cv.height*.95,true);});});startLoops();}

// ---------- news bar: home only, one item at a time, slides through once, then gone ----------
var NEWS={el:null,q:[],i:0,wk:0};
function newsSync(){if(!NEWS)return;const want=G&&!UI.ending&&UI.tab==="home"&&!UI.scene&&!UI.fight&&!UI.montage&&!UI.modal&&UI.spot==null&&UI.newsWeek!==G.week&&!!document.querySelector(".hud");
  if(!want){if(NEWS.el&&G&&UI.tab!=="home"){UI.newsWeek=G.week;}if(NEWS.el){NEWS.el.remove();NEWS.el=null;}document.body.classList.remove("hasnews");return;}
  const hud=document.querySelector(".hud");const top=Math.round(hud.getBoundingClientRect().bottom)+6;
  if(NEWS.el){NEWS.el.style.top=top+"px";document.body.classList.add("hasnews");return;}
  if(NEWS.wk!==G.week){NEWS.wk=G.week;NEWS.q=newsItems().slice(0,3);NEWS.i=0;}if(!NEWS.q.length||NEWS.i>=NEWS.q.length){UI.newsWeek=G.week;return;}
  const el=document.createElement("div");el.className="newsbar";el.setAttribute("role","status");el.style.top=top+"px";
  el.innerHTML=`<b class="nlab">Fight news</b><div class="ntrack"><span class="ncr"></span></div><button class="nclose" aria-label="Close news">×</button>`;document.body.appendChild(el);NEWS.el=el;document.body.classList.add("hasnews");
  el.querySelector(".nclose").onclick=()=>{UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;document.body.classList.remove("hasnews");},300);};
  const show=()=>{if(!el.isConnected)return;if(NEWS.i>=NEWS.q.length){UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;document.body.classList.remove("hasnews");},400);return;}
    const sp=el.querySelector(".ncr");const t=NEWS.q[NEWS.i];sp.textContent=t;sp.style.animation="none";void sp.offsetWidth;
    const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;const dur=reduce?4:Math.min(16,Math.max(7,t.length/6));sp.style.animation=reduce?"none":`ncr ${dur}s linear 1 forwards`;
    clearTimeout(NEWS.tm);NEWS.tm=setTimeout(()=>{NEWS.i++;show();},dur*1000);};show();}

// ---------- rivals answer a loss: one scene each, then the surge shows up in their growth ----------
EVENTS.push(
 {id:"ploy_surge",look:"fight",bg:"night",when:G=>G.flags&&G.flags.beat_ploy>=1&&G.F.ploy.camp==="rival",steps:[
  {n:"nar",t:"Eleven at night. All the lights at Golden Tiger are off except in one gym"},
  {n:"nar",t:"The heavy bag has thudded at the same rhythm for three hours, not slowing one bit"},
  {n:"ploy",f:"sad",t:"…So this is how losing hurts. It's been so long I'd forgotten"},
  {n:"ploy",f:"angry",t:"Thank you, Kati. From tonight I'm no longer a prodigy. I'll be the hardest-training fighter in the province"},
  {n:"coach",t:"(word from inside the scene) Ploy asked the boss to let her sleep at the camp, training three times a day… this final won't be easy"},
  {fx:G=>{G.F.ploy.morale=Math.min(100,G.F.ploy.morale+20);}}]},
 {id:"fah_surge",look:"fight",bg:"night",when:G=>G.flags&&G.flags.beat_fah>=1&&G.F.fah.camp==="rival",steps:[
  {n:"nar",t:"Five a.m., the hill path behind Golden Tiger. A figure runs up and down for the tenth time"},
  {n:"fah",f:"angry",t:"Hngh… one more! Who said stop! Fah didn't lose because Fah's weak, Fah lost because Fah was lazy!"},
  {n:"fah",f:"sad",t:"…Next time we meet, she won't land a single punch. Just watch"},
  {n:"coach",t:"Word is Fah's a different person now, up before everyone at Golden Tiger. Watch out"}]},
 {id:"ploy_surge2",look:"fight",bg:"final",when:G=>G.flags&&G.flags.beat_ploy>=2&&G.F.ploy.camp==="rival",steps:[
  {n:"ploy",f:"angry",t:"That's twice now… the third time will be the final, and I won't leave anything to regret"},
  {n:"kati",f:"angry",t:"Me too! This time I'll beat Ploy on the day she's at her best!"}]});
