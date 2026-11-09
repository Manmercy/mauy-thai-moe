const E=require('./engine.js');
function season(seed,verbose){
  const G=E.newGame({seed});E.genOffers(G);
  const firsts={};let c12=0,c26=0;
  while(!G.ended){
    // auto manager
    for(const f of E.roster(G)){f.plan=f.fatigue>60?{preset:"rest",intensity:"normal"}:{preset:(G.week%3===0?"defense":f.id==="kati"?"punch":"kick"),intensity:f.fatigue<30?"heavy":"normal"};
      if(E.isBooked(G,f.id)&&G.bookings.find(b=>b.a===f.id).week-G.week<=1)f.plan={preset:"prep",intensity:"normal"};}
    if(G.week===8&&G.cash>15000){G.F.mali.camp="player";G.cash-=8000;if(E.stageOf(G.week)==="local")G.rank.B.mali={pts:0,w:0,l:0,d:0};}
    for(const k of ['classroom','gym','brand','recovery','kitchen','dorm'])if(G.cash>45000)E.buyFacility(G,k); if(G.cash>45000)E.upgradeDaeng(G); const o=G.offers.find(o=>o.tier!=="exhibition"&&G.F[o.a].fatigue<50);if(o)E.acceptOffer(G,o.id);
    E.weekTrain(G);
    for(const b of G.bookings.filter(b=>b.week===G.week)){
      const F=E.quickFight(G.F[b.a],G.F[b.b],G.seed+G.week*13+b.a.length,b.rounds,G.F[b.a].camp==='player'?{focus:'auto',pace:'steady',target:'body'}:null);
      E.finishBracket(G,b,F);
      E.applyResult(G,F,b);
    }
    G.bookings=G.bookings.filter(b=>b.week!==G.week);
    E.weekFinish(G);if(G.week===13)c12=Math.round(G.cash);if(G.week===27)c26=Math.round(G.cash);
  }
  const k=G.F.kati;
  return {c12,c26,end:G.ended,cash:Math.round(G.cash),debt:G.debt,rep:G.rep.toFixed(1),kati:`${k.rec.w}-${k.rec.l}-${k.rec.d}`,katiOvr:E.ovr(k.a).toFixed(1),
    fahOvr:E.ovr(G.F.fah.a).toFixed(1),qualA:G.qual.A.includes('kati'),semiA:(G.semis.A||[]).includes('kati'),finalA:G.finalists.A.includes('kati'),champA:G.champ.A,champB:G.champ.B,mali:`${G.F.mali.rec.w}-${G.F.mali.rec.l}`};
}
const res=[];for(let s=1;s<=40;s++)res.push(season(s));
console.table(res.slice(0,10));
const c=k=>res.filter(r=>r[k]).length;
const avg=k=>Math.round(res.reduce((s,r)=>s+r[k],0)/res.length);console.log('avg c12',avg('c12'),'c26',avg('c26'),'end',avg('cash'));console.log('bankrupt',res.filter(r=>r.end==='bankrupt').length,'qualA',c('qualA'),'semiA',c('semiA'),'finalA',c('finalA'),'katiChamp',res.filter(r=>r.champA==='kati').length,'maliChamp',res.filter(r=>r.champB==='mali').length);
// head to head at start
const G=E.newGame({seed:5});let w=0,d=0,ko=0;for(let i=0;i<1000;i++){const F=E.quickFight(G.F.kati,G.F.fah,i,3);if(F.result.win==='A')w++;if(F.result.win==='D')d++;if(/KO|TKO/.test(F.result.type))ko++;}
console.log('Kati vs Fah start win%',w/10,'draw%',d/10,'stoppage%',ko/10);
w=0;for(let i=0;i<1000;i++){const F=E.quickFight(G.F.kati,G.F.nA0,i,3);if(F.result.win==='A')w++;}console.log('Kati vs weakest NPC',w/10);
w=0;for(let i=0;i<1000;i++){const F=E.quickFight(G.F.mali,G.F.ploy,i,3);if(F.result.win==='A')w++;}console.log('Mali vs Ploy',w/10);
// seed determinism
const a=E.quickFight(G.F.kati,G.F.fah,42,3),b=E.quickFight(G.F.kati,G.F.fah,42,3);console.log('deterministic',JSON.stringify(a.cards)===JSON.stringify(b.cards));
// diagnostic
{const E2=E;for(const seed of [3,4,6]){const G=E2.newGame({seed});E2.genOffers(G);
 while(G.week<=40&&!G.ended){for(const f of E2.roster(G))f.plan=f.fatigue>60?{preset:"rest",intensity:"normal"}:{preset:"punch",intensity:"normal"};
  const o=G.offers.find(o=>o.tier!=="exhibition"&&G.F[o.a].fatigue<50);if(o)E2.acceptOffer(G,o.id);E2.weekTrain(G);
  for(const b of G.bookings.filter(b=>b.week===G.week)){const F=E2.quickFight(G.F[b.a],G.F[b.b],G.seed+G.week*13,b.rounds);E2.applyResult(G,F,b);}
  G.bookings=G.bookings.filter(b=>b.week!==G.week);
  if(G.week===40)console.log(seed,E2.standings(G,'A').map(s=>`${s.f.name}:${s.pts}(${s.w}-${s.l}) ovr${E2.ovr(s.f.a).toFixed(1)}`).join(' | '));
  E2.weekFinish(G);}
 console.log(' kati attrs',Object.entries(G.F.kati.a).map(([k,v])=>k+v.toFixed(1)).join(' '));}}
