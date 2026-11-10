const NEW=process.env.NEW!=='0';const TAPER=process.env.TAPER==='1';
const E=require('./engine.js');const {PRESETS}=E;
const INT={light:{g:.6,l:.6},normal:{g:1,l:1},heavy:{g:1.4,l:1.5}};
const projF=(G,f,p,i)=>Math.max(0,f.fatigue+PRESETS[p].load*INT[i].l*7-(10+G.fac.recovery*5+G.fac.kitchen*2)-(p==="rest"?22:0));
const AX={punch:"punch",kick:"kick",knee:"knee",defense:"guard",cond:"stamina"};
function weakPreset(f){const a=f.a;const c=[["punch",a.punch],["kick",a.kick],["knee",(a.knee+a.clinch)/2],["defense",(a.guard+a.counter)/2],["cond",(a.stamina+a.dur)/2]];return c.sort((x,y)=>x[1]-y[1])[0][0];}
function strongPreset(f){const a=f.a;const c=[["punch",a.punch],["kick",a.kick],["knee",(a.knee+a.clinch)/2]];return c.sort((x,y)=>y[1]-x[1])[0][0];}
function safeInt(G,f,p,cap,allowHeavy){for(const i of allowHeavy?["heavy","normal","light"]:["normal","light"])if(projF(G,f,p,i)<=cap)return i;return "light";}
const nextB=(G,f)=>G.bookings.filter(b=>b.a===f.id&&b.week>=G.week).sort((x,y)=>x.week-y.week)[0];
function train(G,P,rng){for(const f of E.roster(G)){if(f.injury)continue;const b=nextB(G,f),wk=b?b.week-G.week:99;
  if(P==="casual"){if(f.fatigue>70)f.plan={preset:"rest",intensity:"normal"};else if(wk===0&&rng()<.5)f.plan={preset:"prep",intensity:"normal"};else f.plan={preset:["punch","kick","knee","defense","cond"][Math.floor(rng()*5)],intensity:"normal"};continue;}
  const cap=P==="expert"?{rest:55,f:50,n:66}:{rest:52,f:45,n:60};
  if(f.fatigue>=cap.rest){f.plan={preset:"rest",intensity:"light"};continue;}
  if(wk===0){f.plan={preset:"prep",intensity:safeInt(G,f,"prep",45,false)};continue;}
  if(TAPER&&wk===1&&f.fatigue>22){f.plan={preset:"rest",intensity:"light"};continue;}
  if(wk<=2){const cp=E.counterPreset(G.F[b.b]);f.plan={preset:cp,intensity:safeInt(G,f,cp,cap.f,P==="expert")};continue;}
  const p=P==="expert"&&G.week%3===0?strongPreset(f):weakPreset(f);f.plan={preset:p,intensity:safeInt(G,f,p,cap.n,P==="expert")};}}
function winRate(G,a,b,rounds,n){let w=0;for(let i=0;i<n;i++){const F=E.quickFight(G.F[a],G.F[b],777+i*11,rounds);if(F.result.win==="A")w++;}return w/n;}
function fightP(G,b,P,seed){const fa=G.F[b.a],fb=G.F[b.b];let plan="balanced";
  if(P!=="casual"){const A=E.advise(G,b.a,b.b,b.rounds,P==="expert"?16:8);plan=A.best;}
  const F=E.newFight(fa,fb,{seed,rounds:b.rounds,tier:b.tier,planA:plan});
  while(!F.over){F.A.instr=P==="casual"?"none":E.aiCorner(F,F.A,F.B);F.B.instr=E.aiCorner(F,F.B,F.A);E.fightRound(F);}return F;}
let aiC=null;const FT=[];
function season(seed,P){const G=E.newGame({diff:process.env.DIFF||'normal',seed});E.genOffers(G);const rng=E.mulberry32(seed*99);let kpFinal=null,kp=[];
  while(!G.ended){
    if(P!=="casual"&&G.week>=10&&G.F.mali.camp!=="player"&&G.cash>(P==="expert"?14000:20000)){G.F.mali.camp="player";G.cash-=8000;if(E.stageOf(G.week)==="local")G.rank.B.mali={pts:0,w:0,l:0,d:0};E.genOffers(G);}
    if(P==="casual"&&G.week===14&&G.cash>15000){G.F.mali.camp="player";G.cash-=8000;if(E.stageOf(G.week)==="local")G.rank.B.mali={pts:0,w:0,l:0,d:0};}
    if(P==="expert"&&G.week>=16&&G.F.rin.camp!=="player"&&G.cash>34000){G.F.rin.camp="player";G.cash-=15000;if(E.stageOf(G.week)==="local")G.rank.A.rin={pts:0,w:0,l:0,d:0};E.genOffers(G);}
    const buf=P==="expert"?12000:P==="average"?20000:45000;
    for(const k of (P==="casual"?['gym','classroom']:['classroom','brand','gym','recovery','kitchen','dorm','hill','video','ring','clinic','shrine','van','sauna','lights','hall'])){const c=E.FACILITIES[k].cost[G.fac[k]||0];if(c!==undefined&&G.cash-c>buf)E.buyFacility(G,k);}
    if(NEW&&P!=="casual"){const want=P==="expert"?["nok","paeng","wit","jan","yai","tong"]:["nok","paeng","jan"];for(const k of want){if(G.cash-E.STAFF[k].fee>buf+15000&&E.hireStaff(G,k))break;}if(G.cash<8000&&G.staff.length)E.fireStaff(G,G.staff[G.staff.length-1]);}
    for(const f of E.roster(G))while(f.sp>0){const sk=(E.SKILLS[f.id]||[]).find(s=>(f.skills[s.id]||0)<3&&(s.lv||1)<=f.lvl);if(!sk||!E.learnSkill(G,f.id,sk.id))break;}
    if(P!=="casual"){const ks=["media","spar","ladies","class","merit"];const k=G.cash<10000?"class":ks.find(k=>E.doCampAction&&G.rep>=({media:28,spar:12,ladies:16}[k]||0));if(k)E.doCampAction(G,k);}
    for(const f of E.roster(G)){if(f.injury)continue;const os=G.offers.filter(o=>o.a===f.id&&o.tier!=="exhibition");
      if(P==="casual"){if(os[0]&&f.fatigue<60)E.acceptOffer(G,os[0].id);continue;}
      if(f.fatigue>55||G.bookings.some(b=>b.a===f.id&&Math.abs(b.week-(os[0]||{}).week)<=(P==="expert"?2:1)))continue;
      const sc=os.map(o=>({o,r:winRate(G,o.a,o.b,o.rounds||3,P==="expert"?14:8)})).sort((x,y)=>y.r-x.r);if(sc[0]&&sc[0].r>=(P==="expert"?.5:.42))E.acceptOffer(G,sc[0].o.id);}
    if(P!=="casual"){G.scout=G.scout||{};for(const b of G.bookings)if(G.F[b.a].camp==="player"&&!(G.scout[b.b]!=null&&G.week-G.scout[b.b]<=8)&&G.cash>(P==="expert"?1000:3000)){G.scout[b.b]=G.week;G.cash-=400;}}train(G,P,rng);if(NEW&&P!=="casual")for(const f of E.roster(G)){const pr=f.plan.preset;if(!f.injury&&pr!=='rest'&&pr!=='prep'){const n=f.plan.intensity==='light'?2:3;let b=0;for(let i=0;i<n;i++){const r=rng();b+=r<.3?4:r<.85?2:0;}f.drillBonus=b/100;}}E.weekTrain(G);
    for(const b of G.bookings.filter(b=>b.week===G.week)){const pl=G.F[b.a].camp==="player";
      const F=pl?fightP(G,b,P,G.seed+G.week*13+b.a.length):E.quickFight(G.F[b.a],G.F[b.b],G.seed+G.week*13+b.a.length,b.rounds);
      if(b.tier==="final"&&b.a==="kati")FT.push([G.F.kati.fatigue,G.F.kati.injury,G.F.kati.morale,G.F.kati.grit||0,E.mastery(G.F.kati),F.result.win]);if(b.tier==="final"&&((b.a==="kati"&&b.b==="ploy")||(b.a==="ploy"&&b.b==="kati")))kpFinal=(F.result.win==="A")===(b.a==="kati");
      if((b.a==="kati"&&b.b==="ploy"))kp.push([G.week,F.result.win,E.ovr(G.F.kati.a).toFixed(1),E.ovr(G.F.ploy.a).toFixed(1)]);
      E.finishBracket(G,b,F);E.applyResult(G,F,b);}
    G.bookings=G.bookings.filter(b=>b.week!==G.week);{const c0=G.cash;E.weekFinish(G);G.gross=(G.gross||0)+G.history[G.history.length-1].inc;}if(G.week===30)G.c30=G.cash;if([26,30,34,38,44,48].includes(G.week)&&G.F.ploy.camp==='rival'){G.wr=G.wr||{};G.wr[G.week]=winRate(G,'kati','ploy',3,24);}if(G.week===45){G.c45=G.cash;G.s45=E.students(G);G.f45=Object.keys(E.FACILITIES).reduce((s,k)=>s+(E.FACILITIES[k].cost.length-(G.fac[k]||0)),0);}if(!G.fullWk&&Object.keys(E.FACILITIES).every(k=>(G.fac[k]||0)>=E.FACILITIES[k].cost.length))G.fullWk=G.week;}
  const k=G.F.kati;return {wr:G.wr||{},gross:G.gross,fightInc:G.history.reduce((a,h)=>a+(h.fight||0),0),c30:G.c30,c45:G.c45,s45:G.s45,f45:G.f45,fullWk:G.fullWk||0,cashMax:G.cashMax||0,stud:E.students(G),staff:(G.staff||[]).length,facs:["hill","video","ring","clinic","shrine"].reduce((s,x)=>s+(G.fac[x]||0),0),end:G.ended,cash:Math.round(G.cash),kovr:E.ovr(k.a),povr:E.ovr(G.F.ploy.a),grit:k.grit||0,lv:k.lvl,rec:k.rec,
    qual:G.qual.A.includes('kati'),semi:(G.semis.A||[]).includes('kati'),fin:G.finalists.A.includes('kati'),champA:G.champ.A,champ:G.champ.A,champB:G.champ.B,kpFinal,kp,
    mali:G.F.mali.camp==="player"?G.F.mali.rec:null,rin:G.F.rin.camp==="player"};}
module.exports={season};
if(require.main===module){aiC=E.aiCorner||((F,s,o)=>"none");
 const N=+process.argv[2]||30;
 for(const P of (process.argv[3]||"casual,average,expert").split(",")){const R=[];for(let s=1;s<=N;s++)R.push(season(s,P));
  const c=f=>R.filter(f).length,avg=f=>(R.reduce((s,r)=>s+f(r),0)/R.length);
  const kpF=R.filter(r=>r.kpFinal!==null);const early=R.flatMap(r=>r.kp.filter(x=>x[0]<=30));
  console.log(`\n== ${P} (${N} seasons) ==`);
  console.log(`ล้มละลาย ${c(r=>r.end==="bankrupt")} · เงินจบ avg ฿${Math.round(avg(r=>r.cash))} · กะทิ ovr wk49 ${avg(r=>r.kovr).toFixed(2)} (พลอย ${avg(r=>r.povr).toFixed(2)}) · grit ${(avg(r=>r.grit)*1000).toFixed(0)}% · Lv ${avg(r=>r.lv).toFixed(1)}`);
  console.log('kati vs ploy winrate by wk',[26,30,34,38,44,48].map(w=>w+':'+(avg(r=>r.wr[w]||0)*100).toFixed(0)+'%').join(' '));console.log(`gross class ${avg(r=>r.gross).toFixed(0)} fights ${avg(r=>r.fightInc).toFixed(0)}`);console.log(`cash30 ${avg(r=>r.c30||0).toFixed(0)} cash45 ${avg(r=>r.c45||0).toFixed(0)} stud45 ${avg(r=>r.s45||0).toFixed(1)} facLeft45 ${avg(r=>r.f45||0).toFixed(1)} fullWk ${R.map(r=>r.fullWk).join(',')}`);console.log(`rv fights 25-40: ${R.flatMap(r=>r.kp.filter(x=>x[0]>24&&x[0]<41)).map(x=>x.join('/')).join(' ')}`);console.log(`students ${avg(r=>r.stud).toFixed(0)} staff ${avg(r=>r.staff).toFixed(1)} newfac ${avg(r=>r.facs).toFixed(1)}`);console.log(`กะทิ: ติดท็อป4ตำบล→อำเภอ ${c(r=>r.qual)} · รองชิง ${c(r=>r.semi)} · ไฟนอล ${c(r=>r.fin)} · แชมป์ ${c(r=>r.champ==="kati")} · W-L avg ${avg(r=>r.rec.w).toFixed(1)}-${avg(r=>r.rec.l).toFixed(1)}`);
  console.log(`ไฟนอล กะทิvsพลอย ${kpF.length} ครั้ง กะทิชนะ ${kpF.filter(r=>r.kpFinal).length} · เจอพลอยก่อนสัปดาห์30 ${early.length} ครั้ง ชนะ ${early.filter(x=>x[1]==="A").length}`);
  console.log("finalstate fat",(FT.reduce((s,x)=>s+x[0],0)/FT.length).toFixed(1),"inj",FT.filter(x=>x[1]).length,"mor",(FT.reduce((s,x)=>s+x[2],0)/FT.length).toFixed(0),"mast",(FT.reduce((s,x)=>s+x[4],0)/FT.length).toFixed(2),"n",FT.length);FT.length=0;console.log(`แชมป์A: ${JSON.stringify(R.reduce((m,r)=>(m[r.champA||r.champ||'-']=(m[r.champA||r.champ||'-']||0)+1,m),{}))} · แชมป์B: ${JSON.stringify(R.reduce((m,r)=>(m[r.champB||'-']=(m[r.champB||'-']||0)+1,m),{}))} · มะลิแชมป์ ${c(r=>r.champB==="mali")} · จ้างริน ${c(r=>r.rin)}`);}}
