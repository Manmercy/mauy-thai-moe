const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
const LOG=[];const log=(...a)=>{LOG.push(a.join(' '));fs.writeFileSync('deep/log.txt',LOG.join('\n'));};const errs=[];
p.on('pageerror',e=>{errs.push(e.message);log('!!PAGEERROR',e.message,(e.stack||'').slice(0,200));});
p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_TUNNEL|net::/.test(m.text())){errs.push(m.text());log('!!CONSOLE',m.text());}});
let sn=0;const shot=async(l)=>{sn++;await p.screenshot({path:`deep/${String(sn).padStart(3,'0')}_${l}.png`});};
const has=async s=>!!(await p.$(s));const tap=async(s)=>{if(await has(s)){await p.click(s,{timeout:1500}).catch(()=>p.click(s,{force:true,timeout:1500}).catch(()=>{}));await p.waitForTimeout(60);return true;}return false;};
const ev=(f,a)=>p.evaluate(f,a);
const seenModal=new Set(),issues=new Map();const issue=(k,v)=>{if(!issues.has(k))issues.set(k,v);};
async function audit(tag){const r=await ev(()=>{const o={};o.hscroll=document.documentElement.scrollWidth>innerWidth+2;
  o.over=[...document.querySelectorAll('button,.btn,.pill,b,small')].filter(e=>e.offsetParent&&e.scrollWidth>e.clientWidth+3&&getComputedStyle(e).overflow!=='visible'&&e.clientWidth>0).slice(0,5).map(e=>(e.className||e.tagName)+':'+e.textContent.trim().slice(0,30));
  o.offscreen=[...document.querySelectorAll('button,.btn')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.width>0&&(r.right>innerWidth+2||r.left<-2);}).slice(0,5).map(e=>e.textContent.trim().slice(0,25));
  o.broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src).map(i=>i.src.split('/').pop()).slice(0,5);
  o.tiny=[...document.querySelectorAll('button,.btn,[data-act]')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.width>0&&r.height>0&&(r.height<28)&&getComputedStyle(e).display!=='inline';}).slice(0,4).map(e=>(e.dataset.act||'')+':'+e.textContent.trim().slice(0,15)+':'+Math.round(e.getBoundingClientRect().height));
  return o;});
  if(r.hscroll)issue('hscroll@'+tag,'มีสกรอลแนวนอนที่ '+tag);for(const x of r.over)issue('over:'+x,tag);for(const x of r.offscreen)issue('off:'+x,tag);for(const x of r.broken)issue('img:'+x,tag);for(const x of r.tiny)issue('tiny:'+x,tag);}
// play scenes through the API but log every line
const sceneTexts=[];
async function scenes(tag,maxSteps=400){for(let i=0;i<maxSteps;i++){const st=await ev(()=>{const S=UI.scene;if(!S)return null;const c=S.cur||{};return {n:c.n,who:c.who,t:c.t,ch:c.choice?c.choice.map(x=>x.t):null,bg:S.bg};});
  if(!st){if(await has('[data-act=spotskip]'))await tap('[data-act=spotskip]');return;}
  if(st.t){const line=`${st.n==='npc'?st.who:st.n}: ${st.t}`;if(sceneTexts[sceneTexts.length-1]!==line)sceneTexts.push(line);}
  if(st.ch){const k=(await ev(()=>G.week))%st.ch.length;sceneTexts.push(`   >> [${st.ch.join(' | ')}] เลือก: ${st.ch[k]}`);await ev(k=>sceneChoose(k),k);}else await ev(()=>sceneNext());}}
await p.goto('http://localhost:8766/t.html');await p.waitForTimeout(1200);await shot('title');
await tap('.tapstart');await tap('[data-act=newgame]');await tap('[data-act=pickslot][data-v="1"]');await p.fill('#pname','มาน');await shot('creator');await tap('[data-act=startGame]');await p.waitForTimeout(400);
await shot('prologue');await scenes('prologue');
for(let i=0;i<12;i++){if(!(await tap('[data-act=spotnext]')))break;}
await audit('home-w1');await shot('home_w1');
let fightN=0;const weekly=[];
async function playFight(){fightN++;const info=await ev(()=>{const U=UI.fight;if(!U||!U.b)return '';const a=G.F[U.b.a],o=G.F[U.b.b];return `${a.name} vs ${o.name} (${U.b.tier}) ovr ${ovr(a.a).toFixed(1)}-${ovr(o.a).toFixed(1)} scouted ${!!(G.scout&&G.scout[o.id]!=null)}`;});log('FIGHT',info);
  if(fightN<=2||fightN%5===0)await shot('prefight_'+fightN);await audit('prefight');
  await tap('[data-act=fstart]');await p.waitForTimeout(200);await scenes('wai');
  await ev(()=>{UI.speed=2;});let usedSk=0,shotRound=false;
  for(let t=0;t<900;t++){const st=await ev(()=>UI.fight&&UI.fight.stage);if(!st)break;
    if(st==='playing'){if(!usedSk){const n=await ev(()=>UI.fight&&UI.fight.F?UI.fight.F.round:0);if(n>=2&&(await tap('[data-act=fskill]:not([disabled])'))){usedSk++;log('  skill used r',n);}}
      if(!shotRound&&(fightN<=2)){await p.waitForTimeout(1500);await shot('fight_'+fightN);await audit('fight');shotRound=true;}await p.waitForTimeout(250);}
    else if(st==='corner'){if(fightN<=2)await shot('corner_'+fightN);await audit('corner');
      const pick=await ev(()=>{if(!UI.fight||!UI.fight.F)return 'none';const R=cornerRate(UI.fight.F);const g=Object.keys(R).find(k=>R[k][0]==='g');return g||'none';});await tap(`[data-act=cpick][data-v=${pick}]`);await tap('[data-act=cgo]');await p.waitForTimeout(200);}
    else if(st==='done'){const r=await ev(()=>{const F=UI.fight.F;if(!F)return 'noF';return `${F.result.win} ${F.result.how||''} cards ${JSON.stringify(F.cards)} bubble: ${UI.fight.bubble||''}`;});log('  RESULT',r);
      if(fightN<=3||fightN%4===0)await shot('result_'+fightN);await audit('result');await tap('[data-act=fdone]');await p.waitForTimeout(200);break;}
    else await p.waitForTimeout(150);}
  await scenes('after-fight');}
for(let w=0;w<60;w++){
  const ended=await ev(()=>!!(G&&G.ended)||!!document.querySelector('.endpage'));if(ended)break;
  const S=await ev(()=>({wk:G.week,cash:Math.round(G.cash),rep:+G.rep.toFixed(1),R:roster(G).map(f=>`${f.name} L${f.lvl} ovr${ovr(f.a).toFixed(1)} fat${Math.round(f.fatigue)} bond${Math.round(f.bond||0)} ${f.rec.w}-${f.rec.l}`).join(' | '),ploy:ovr(G.F.ploy.a).toFixed(1),book:G.bookings.length,off:G.offers.length,tips:(typeof coachTips==='function'?coachTips().slice(0,2).map(t=>t.t):[])}));
  weekly.push(S);log(`== WEEK ${S.wk} cash ${S.cash} rep ${S.rep} | ${S.R} | ploy ${S.ploy} | bookings ${S.book} offers ${S.off}`);log('   tips:',S.tips.join(' / '));
  if(w%6===0){await ev(()=>{ACT.tab({v:'home'})});await p.waitForTimeout(500);await shot('home_w'+S.wk);await audit('home');}
  {const sg=await ev(()=>{const c=Object.values(G.F).filter(f=>f.camp==='free'&&f.canon&&f.met&&G.cash>=f.fee).map(f=>f.id);return c;});for(const id of sg){await ev(id=>{ACT.sign({v:id,ok:1});},id);await p.waitForTimeout(200);await scenes('sign');log('   signed',id);}}
  // skills
  await ev(()=>{for(const f of roster(G)){let g=0;while(f.sp>0&&g++<5){const L=(SKILLS[f.id]||[]).filter(k=>(k.lv||1)<=f.lvl&&(f.skills[k.id]||0)<3);if(!L.length)break;learnSkill(G,f.id,L[0].id);}}});
  // fights: scout booked opponents, accept a green/gold offer per fighter
  await ev(()=>{ACT.tab({v:'fights'})});await p.waitForTimeout(150);
  if(w<2||w%8===0){await shot('fights_w'+S.wk);await audit('fights');}
  for(let k=0;k<3;k++){if(!(await tap('[data-act=scout]:not([disabled])')))break;}
  const acc=await ev(()=>{const out=[];for(const f of roster(G)){if(G.bookings.filter(b=>b.a===f.id).length>=2||f.injury)continue;const os=G.offers.filter(o=>o.a===f.id).map(o=>({o,d:ovr(G.F[o.b].a)-ovr(f.a)}));const pick=os.filter(x=>x.d<.8).sort((a,b)=>b.d-a.d)[0];if(pick){acceptOffer(G,pick.o.id);out.push(`${f.name}→${G.F[pick.o.b].name} d${pick.d.toFixed(1)} wk${pick.o.week} ${pick.o.tier}`);}}save();render();return out;});
  if(acc.length)log('   accepted:',acc.join('; '));
  // training: open advice, choose road 1 every other week, then confirm + drill
  await ev(()=>{ACT.tab({v:'train'})});await p.waitForTimeout(150);if(w<2||w%10===0){await shot('train_w'+S.wk);await audit('train');}
  const ids=await ev(()=>roster(G).map(f=>f.id));
  for(const id of ids){if(await tap(`[data-act=advice][data-id=${id}]`)){if(!seenModal.has('advice')){seenModal.add('advice');await shot('advice');await audit('advice');}
      const rb=await p.$$(`[data-act=useroad]`);if(rb.length){await rb[w%rb.length].click().catch(()=>{});}else await tap('.mfoot [data-act=closeModal]');}
    if(await tap(`[data-act=tlock][data-id=${id}]`)){if(await has('[data-act=dtap]')){for(let i=0;i<3;i++){await tap('[data-act=dtap]');await p.waitForTimeout(250);}await p.waitForTimeout(900);if(!seenModal.has('drill')){seenModal.add('drill');await shot('drill');}await tap('.dres [data-act=dskip]');}}}
  // people: alternate gift and date
  await ev(()=>{ACT.tab({v:'people'})});await p.waitForTimeout(150);if(w===1)await shot('people');
  const who=ids[w%ids.length];
  const rich=await ev(()=>G.cash>12000);
  if(rich&&w%2===0){if(await tap(`[data-act=giftpick][data-id=${who}]`)){if(w<3)await shot('gift');const g=await p.$$('[data-act=give]:not([disabled])');if(g.length){await g[(w*3)%g.length].click().catch(()=>{});await p.waitForTimeout(150);await scenes('gift');}else await tap('.modal .xbtn');}}
  else if(rich){const ds=await p.$$(`[data-act=date][data-id=${who}]`);if(!ds.length){await tap(`[data-act=datepick][data-id=${who}]`);}const d2=await p.$$('[data-act=date]');if(d2.length){await d2[w%d2.length].click().catch(()=>{});await p.waitForTimeout(150);await scenes('date');}}
  await ev(()=>{UI.modal=null;});
  // camp: activity, facilities, staff
  await ev(()=>{ACT.tab({v:'home'})});await p.waitForTimeout(100);
  if(await tap('[data-act=campacts]')){if(!seenModal.has('campacts')){seenModal.add('campacts');await shot('campacts');await audit('campacts');}
    const acts=await p.$$('[data-act=campick]:not([disabled])');if(acts.length){await acts[w%acts.length].click().catch(()=>{});await tap('[data-act=campok]');await p.waitForTimeout(1200);if(w%7===3)await shot('campfx_w'+S.wk);await ev(()=>{UI.modal=null;render();});}else await tap('.modal .xbtn');}
  await ev(()=>{const order=['classroom','gym','recovery','brand','kitchen','video','hill','ring','dorm','clinic','shrine','van','sauna','lights','hall'];for(const k of order){const F=FACILITIES[k],l=G.fac[k]||0;if(l<F.cost.length&&!facLocked(G,k)&&G.cash-F.cost[l]>25000){buyFacility(G,k);break;}}
    for(const k of ['nok','paeng','jan','wit','ying','yai','tong'])if(G.cash>40000&&hireStaff(G,k))break;save();});
  // end week
  await ev(()=>{ACT.tab({v:'home'})});
  await tap('[data-act=endweek]');await p.waitForTimeout(150);if(await has('[data-act=endgo]')){if(w===0)await shot('endconfirm');await tap('[data-act=endgo]');}
  await p.waitForTimeout(300);if(w===0)await shot('montage');await tap('[data-act=montageDone]');
  for(let k=0;k<12;k++){await scenes('week');
    if(await has('[data-act=fstart]')){await playFight();continue;}
    if(await has('.modal')){const mt=await ev(()=>UI.modal&&UI.modal.type);if(mt&&!seenModal.has(mt)){seenModal.add(mt);await shot('modal_'+mt);await audit('modal_'+mt);log('   modal',mt);}
      if(!(await tap('.mfoot [data-act=closeModal]')))if(!(await tap('.modal .xbtn')))await ev(()=>{UI.modal=null;render();});}
    if(!(await has('.vn'))&&!(await has('.modal'))&&!(await has('[data-act=fstart]')))break;}
}
await p.waitForTimeout(800);await shot('end');await scenes('end');await shot('end2');
const fin=await ev(()=>G?{wk:G.week,cash:Math.round(G.cash),rep:G.rep,ended:G.ended,champ:G.champions||null,R:roster(G).map(f=>`${f.name} L${f.lvl} ${f.rec.w}-${f.rec.l}`),seen:Object.keys(G.seen).length}:null);
log('FINAL',JSON.stringify(fin));
fs.writeFileSync('deep/log.txt',LOG.join('\n'));fs.writeFileSync('deep/scenes.txt',sceneTexts.join('\n'));fs.writeFileSync('deep/issues.txt',[...issues].map(([k,v])=>k+' @ '+v).join('\n'));
console.log('errs',errs.length,'fights',fightN,'issues',issues.size,'scenes',sceneTexts.length,JSON.stringify(fin));await b.close();})();
