const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mob=process.argv[2]==='m';const vp=mob?{width:390,height:844}:{width:1280,height:860};const tag=process.argv[2]||'d';
const p=await b.newPage({viewport:vp,hasTouch:mob});p.on('pageerror',e=>{errs.push(e.message);console.log('PERR',e.message,(e.stack||'').slice(0,300));});p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_TUNNEL/.test(m.text()))errs.push(m.text())});
const has=async s=>!!(await p.$(s));const tap=async(s,t=1500)=>{if(await has(s)){await p.click(s,{timeout:t}).catch(async()=>{await p.click(s,{timeout:t,force:true}).catch(()=>{});});await p.waitForTimeout(40);return true;}return false;};
const shot=(n,full)=>p.screenshot({path:`shots18/${tag}_${n}.png`,fullPage:!!full});
await p.goto('http://localhost:8766/t.html');await p.waitForTimeout(500);await shot('01_title');
await tap('.tapstart');await p.waitForTimeout(300);await shot('01b_menu');await tap('[data-act=newgame]');await p.waitForTimeout(200);await shot('01c_slots');await tap('[data-act=pickslot][data-v="1"]');await p.waitForTimeout(300);await shot('02_creator',true);
await p.fill('#pname','มาวิน');await tap('[data-act=startGame]');await p.waitForTimeout(300);
for(let i=0;i<6;i++)await tap('.vtap');await p.waitForTimeout(400);await shot('03_vn');
async function adv(max=150){for(let i=0;i<max;i++){if(!(await has('.vn'))){await tap('[data-act=spotskip]');return;}if(!(await tap('[data-act=vchoose]')))await tap('.vtap');}}
await adv();await p.waitForTimeout(500);await shot('04_home',true);
await tap('[data-act=tab][data-v=train]');await p.waitForTimeout(500);await shot('05_train',true);
await tap('.trow .tr-anim');await p.waitForTimeout(400);await shot('05b_popup_train');await tap('[data-act=ptab][data-v=over]');await p.waitForTimeout(200);await shot('05c_popup_over');await tap('[data-act=ptab][data-v=skill]');await p.waitForTimeout(200);await shot('05e_popup_skill');await tap('[data-act=ptab][data-v=rel]');await p.waitForTimeout(200);await shot('05d_popup_rel');await tap('.modal .xbtn');
await tap('[data-act=tab][data-v=people]');await p.waitForTimeout(200);await shot('06_people',true);await tap('[data-act=giftpick][data-id=kati]');await p.waitForTimeout(200);await shot('06b_gift');await tap('[data-act=give][data-v=khanom]');await p.waitForTimeout(300);await shot('06c_giftvn');await adv();
await tap('[data-act=date][data-v=eat]');for(let i=0;i<3;i++)await tap('.vtap');await p.waitForTimeout(300);await shot('07_date');
await adv();await tap('[data-act=tab][data-v=camp]');await p.waitForTimeout(300);await shot('08_camp',true);
await tap('[data-act=tab][data-v=fights]');await p.waitForTimeout(300);await shot('09a_offers',true);if(await tap('[data-act=consider]')){await p.waitForTimeout(300);await shot('09_consider');await tap('.mfoot [data-act=closeModal]');await tap('.obtns3 [data-act=accept]');}await tap('[data-act=fsub][data-v=rank]');await p.waitForTimeout(200);await shot('09b_rank',true);await tap('[data-act=fsub][data-v=offers]');
await tap('[data-act=tab][data-v=home]');await tap('[data-act=campacts]');await tap('[data-act=campick][data-v=repair]');await shot('09c_confirm');await tap('[data-act=campok]');
let fights=0,watched=false;
for(let w=0;w<120;w++){if(w%5===0)console.log("w",w,await p.evaluate(()=>[G.week,UI.modal&&UI.modal.type,!!UI.scene,UI.fight&&UI.fight.stage].join(",")));
  if(await has('.endpage'))break;
  await tap('[data-act=tab][data-v=fights]');if(await tap('[data-act=consider]')){await tap('.mfoot [data-act=closeModal]');await tap('.obtns3 [data-act=accept]');}
  if(w%3===0){await tap('[data-act=tab][data-v=home]');await tap('[data-act=campacts]');await tap('[data-act=campick]:not([disabled])');await tap('[data-act=campok]');await tap('.modal .xbtn');}
  if(w===10||w===16){await tap('[data-act=tab][data-v=camp]');await tap('[data-act=csub][data-v=staff]');if(await tap('[data-act=sign]:not([disabled])')){await p.waitForTimeout(200);if(await has('.m-signwarn')){await shot('10b_signwarn');await tap('.mfoot [data-act=sign]');}await adv();}await tap('[data-act=csub][data-v=fac]');}
  if(w%4===1){await tap('[data-act=tab][data-v=camp]');await tap('[data-act=buyfac]:not([disabled])');await tap('[data-act=daeng]:not([disabled])');}
  await tap('[data-act=endweek]');await p.waitForTimeout(150);await tap('[data-act=endgo]');await p.waitForTimeout(150);
  if(w===0){await p.waitForTimeout(1500);await shot('10_montage');}
  await tap('[data-act=montageDone]');
  for(let k=0;k<4;k++){
    if(await has('[data-act=fstart]')){fights++;
      if(!watched){watched=true;await shot('11_prefight');await tap('[data-act=fstart]');await p.waitForTimeout(300);await adv();await p.waitForTimeout(5200);await shot('12_fight');
        for(let r=0;r<12;r++){await p.evaluate(()=>ACT.fskip&&ACT.fskip());await p.waitForTimeout(150);if(await has('[data-act=cgo]')){if(r<2)await shot('13_corner');await tap('[data-act=care]');await tap('.ohead [data-act=chint]');await p.waitForTimeout(150);if(r<1)await shot('13b_think');await tap('.fpop [data-act=chint]');await tap('[data-act=cpick]');await tap('[data-act=cgo]');}if(await has('[data-act=fdone]'))break;}
        await p.waitForTimeout(500);await shot('14_result');}
      else await p.evaluate(()=>ACT.fquick());
      await tap('[data-act=fdone]');}
    await tap('[data-act=withdraw]');
  }
  for(let k=0;k<5;k++){if(w===2&&k===0&&await has('.m-report'))await shot('14b_report');await tap('.mfoot [data-act=closeModal]');await adv(300);}
  if(w===24)await shot('15_home_mid',true);
}
await p.waitForTimeout(500);await shot('16_end',true);
const st=await p.evaluate(()=>G?{week:G.week,cash:Math.round(G.cash),ended:G.ended,look:campLook(G),lv:roster(G).map(f=>f.name+f.lvl),seen:Object.keys(G.seen).length}:null);
console.log(tag,JSON.stringify(st),'fights',fights);console.log('ERR',errs.slice(0,8));await b.close();})();
