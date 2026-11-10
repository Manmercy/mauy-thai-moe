// ================= MUAY THAI MOE v1.23 — MAILBOX, SIDE QUESTS, ODD FIGHTS, CALENDAR, GRAPHS, NEWS BAR =================
// ---------- odd opponents (sprite sheets in a/<sprite>_sheet.webp, same 6-row layout as the girls) ----------
const QK={
  gang1:{name:"ลูกกระจ๊อกหมวกแดง",sprite:"gang1",lvl:-1.6,tilt:{punch:1.5,power:1,iq:-2,guard:-1.5,comp:-1},color:"#c8283c",grp:"gang"},
  gang2:{name:"ไอ้แจ็กเก็ตดำ หมวกแดง",sprite:"gang2",lvl:-.8,tilt:{punch:1.5,kick:1,iq:-1.5,comp:-1},color:"#a01f2f",grp:"gang"},
  gang3:{name:"รองหัวหน้าหมวกดำแดง",sprite:"gang3",lvl:.1,tilt:{punch:1.5,knee:1,power:1,iq:-1},color:"#5a1420",grp:"gang"},
  gang4:{name:"หัวหน้าหมวกทอง",sprite:"gang4",lvl:.8,tilt:{power:2,punch:1.5,dur:1,foot:-1},color:"#d9a520",grp:"gang"},
  gang5:{name:"เสี่ยหมวกทองคำ",sprite:"gang5",lvl:1.6,tilt:{power:2,punch:2,dur:1.5,comp:1,foot:-1},color:"#f7d24a",grp:"gang"},
  rooster1:{name:"ไก่แจ้หัวร้อน",sprite:"rooster1",lvl:-.9,tilt:{speed:2.5,kick:2,dur:-2,power:-1},color:"#e8a23a",grp:"rooster"},
  rooster2:{name:"ไก่เทาสิงห์บุรี",sprite:"rooster2",lvl:-.2,tilt:{speed:2,kick:2,foot:1,dur:-1.5},color:"#8a8f9a",grp:"rooster"},
  rooster3:{name:"ไก่ขาวมวยวัด",sprite:"rooster3",lvl:.4,tilt:{speed:2,kick:2.5,counter:1,dur:-1.5},color:"#f4f1ea",grp:"rooster"},
  rooster4:{name:"เจ้าดำหางแดง",sprite:"rooster4",lvl:.9,tilt:{speed:2,kick:2,power:1,guard:1,dur:-1},color:"#c8283c",grp:"rooster"},
  rooster5:{name:"พญาไก่ทองนักเลง",sprite:"rooster5",lvl:1.5,tilt:{speed:2,kick:2.5,power:1.5,comp:1,dur:-.5},color:"#f7d24a",grp:"rooster"},
  bull1:{name:"แม่นมสด วัวหลุดฟาร์ม",sprite:"bull1",lvl:-.6,tilt:{power:2,dur:2.5,clinch:1,speed:-2,iq:-1},color:"#f4f1ea",grp:"bull"},
  bull2:{name:"เจ้าแดงเขาโค้ง",sprite:"bull2",lvl:.7,tilt:{power:2.5,dur:2,knee:1.5,speed:-1.5},color:"#a0522d",grp:"bull"},
  bull3:{name:"ไอ้ทุยมาเฟีย",sprite:"bull3",lvl:1.4,tilt:{power:3,dur:2.5,clinch:2,speed:-1.5,foot:-1},color:"#2b2530",grp:"bull"},
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
const BILLS=[["เทศบาลตำบล","ค่าปรับ: ไก่ของค่ายขันเสียงดังเกินเกณฑ์ตอนตีสี่ (ร้องเรียน 14 ราย)",300],
 ["ลุงหวังวินมอไซค์","ค่าซ่อมกระจกหน้ารถ ลูกเตะหลุดจากกระสอบลอยข้ามรั้วมา",800],
 ["ร้านข้าวมันไก่เจ๊ติ๋ม","ใบแจ้งหนี้: นักมวยค่ายท่านกินเชื่อไว้ 46 จาน (มีลายเซ็นครูแดงกำกับ)",1840],
 ["สหกรณ์น้ำแข็งหลอด","ค่าน้ำแข็งเดือนนี้ — อ่างน้ำแข็งของท่านใช้มากกว่าโรงงานปลาทั้งอำเภอ",900],
 ["ป้าแต๋ว ส้มตำ","ค่าครกแตก: มีคนในค่ายท่าน 'สาธิตศอกกลับ' ใส่ครกป้า",450],
 ["สำนักงานป้ายโฆษณา","ภาษีป้าย: ป้ายค่ายท่านใหญ่กว่าป้ายวัด ต้องเสียเพิ่ม",600,G=>G.fac.brand>=1],
 ["การไฟฟ้าส่วนภูมิภาค","ค่าไฟพิเศษ: สปอตไลท์ค่ายท่านสว่างจนนกบินผิดทาง",1200,G=>(G.fac.lights||0)>=1],
 ["สมาคมสองแถวสายวัด","ค่าธรรมเนียมจอดสองแถวหน้าวัด (มีนักเรียนท่านตะโกนเชียร์ในรถ)",350,G=>(G.fac.van||0)>=1],
 ["คลินิกสัตว์ ตำบล","ค่ารักษาแมวส้มประจำค่าย: กินขนมครกมากเกินไป",500]];
const QUIZ=[["ก่อนขึ้นชก นักมวยไทยทำพิธีอะไรบนเวที?",["ไหว้ครูรำมวย","ร้องเพลงชาติ","วิดพื้นโชว์"],0],
 ["มวยไทยได้ชื่อว่าเป็นศิลปะแห่งกี่อาวุธ?",["หกอาวุธ","แปดอาวุธ","สิบอาวุธ"],1],
 ["เครื่องสวมศีรษะที่นักมวยใส่ตอนไหว้ครู เรียกว่าอะไร?",["มงคล","ประเจียด","ผ้าคาดผม"],0],
 ["ผ้าที่ผูกต้นแขนนักมวย เรียกว่าอะไร?",["มงคล","ประเจียด","สายสิญจน์"],1],
 ["ตามกลอนมวยไทย 'หมัดหนักโคราช ฉลาดลพบุรี ท่าดีไชยา…' มวยเมืองไหนขึ้นชื่อเรื่องฉลาด?",["โคราช","ลพบุรี","ไชยา"],1],
 ["นักมวยไทยในตำนานที่ถูกจับไปพม่า แล้วชกชนะนักมวยพม่าหลายคน คือใคร?",["นายขนมต้ม","นายขนมครก","นายขนมชั้น"],0],
 ["วงดนตรีที่บรรเลงระหว่างชกมวยไทย ใช้เครื่องดนตรีอะไรเป็นหลัก?",["ปี่ชวา กลองแขก ฉิ่ง","กีตาร์ กลองชุด","ระนาด ขิม"],0],
 ["มวยไทยอาชีพตามมาตรฐานทั่วไป ชกกันกี่ยก?",["3 ยก","5 ยก","12 ยก"],1],
 ["คนบนเวทีที่ดูแลให้ชกตามกติกา เรียกว่าอะไร?",["กรรมการห้ามมวย","พี่เลี้ยง","โปรโมเตอร์"],0],
 ["พระมหากษัตริย์ที่เลื่องลือว่าปลอมพระองค์ไปชกมวยกับชาวบ้าน คือพระองค์ใด?",["พระเจ้าเสือ","พระเจ้าช้างเผือก","พระเจ้าปราสาททอง"],0]];

// story & flavour letters (once each)
const STORY_MAIL=[
 {id:"ml_landlord",when:G=>G.week>=3,from:"เจ๊หมวย (เจ้าของที่ดิน)",title:"เรื่องหนี้ค่าย",body:"ถึงผู้จัดการคนใหม่ หนี้ของปู่ชัยยังเหลืออยู่นะจ๊ะ ระบบจะหักเองทุก 4 สัปดาห์ ไม่ต้องตกใจ ป.ล. ครั้งหน้ามาจ่ายที่บ้าน ช่วยหิ้วคิทแคทชาเขียวมาด้วยห่อนึง ไม่ได้บังคับ (บังคับ)"},
 {id:"ml_kidfan",when:G=>G.flags&&G.flags.firstWin,from:"ด.ญ.น้ำหวาน ป.3",title:"ถึงพี่นักมวย",body:"พี่ค่ะ หนูดูพี่ชกที่งานวัด พี่เก่งมากเลย หนูวาดรูปพี่มาให้ด้วย (รูปติดมากับซอง: นักมวยตัวกลมมีเขา…น่าจะเป็นมงคล) โตขึ้นหนูจะเป็นนักมวยเหมือนพี่ หรือไม่ก็เป็นแม่ค้าขายลูกชิ้น"},
 {id:"ml_district",when:G=>G.week>=21&&G.flags.qualDone,from:"สมาคมมวยอำเภอ",title:"ยินดีต้อนรับสู่รอบอำเภอ",body:"ขอแสดงความยินดีที่ผ่านรอบตำบล รอบอำเภอแต้มเริ่มนับใหม่ ท็อป 4 ได้ไปรองชิงจังหวัดสัปดาห์ 44 กรุณาแต่งกายสุภาพ ห้ามนำไก่ชนเข้าสนาม (เราจำได้นะ)"},
 {id:"ml_ploy",when:G=>G.flags&&G.flags.beat_ploy>=1,from:"พลอย ค่ายพยัคฆ์ทอง",title:"(ลายมือเรียบร้อยมาก)",body:"ยินดีด้วยนะคะ ครั้งนี้เป็นของกะทิ ฉันยอมรับ แต่ฉันขอบคุณด้วย…ไม่มีใครทำให้ฉันกลัวแพ้มานานแล้ว ตั้งแต่คืนนี้ฉันจะซ้อมเหมือนคนที่ยังไม่เคยชนะ เจอกันที่นัดชิงค่ะ — พลอย"},
 {id:"ml_fah",when:G=>G.flags&&G.flags.beat_fah>=1,from:"ฟ้า ค่ายพยัคฆ์ทอง",title:"อ่านด้วย!!",body:"ฟลุคย่ะ!! (ขีดฆ่า) …ก็ได้ เก่งจริง แต่ฟ้าจะวิ่งขึ้นเขาทุกเช้าจนกว่าจะชนะคืน บอกมะลิด้วยว่าอย่าเพิ่งดีใจ!! ป.ล. ขนมที่ฝากมาอร่อย (ไม่ได้ชม)"},
 {id:"ml_semis",when:G=>G.week>=41&&G.flags.finalDone,from:"สมาคมมวยจังหวัด",title:"บัตรเชิญศึกรองชิงจังหวัด",body:"ขอเชิญเข้าร่วมศึกรองชนะเลิศระดับจังหวัด สัปดาห์ที่ 44 ผู้ชนะชิงเข็มขัดสัปดาห์ที่ 49 ถ่ายทอดสดทางเพจสมาคม (ยอดวิวปีที่แล้ว 312 วิว ปีนี้ตั้งเป้า 400)"},
 {id:"ml_grandpa_fan",when:G=>G.rep>=20,from:"ลุงชาญ เพื่อนเก่าปู่ชัย",title:"ข่าวค่ายถึงหูลุงแล้ว",body:"ลุงอ่านข่าวในกลุ่มไลน์ผู้สูงอายุ ค่ายศิริชัยกลับมาแล้วจริง ๆ ปู่ชัยคงยิ้มอยู่ข้างบน ลุงไม่มีเงินช่วย แต่ส่งพระเครื่องมาให้องค์นึง เขาว่าดีทางแคล้วคลาด (ลุงไม่แน่ใจ)"}];
// earned money — sponsors only write after real results
const SPONSOR_MAIL=[
 {id:"sp_moo",when:G=>roster(G).some(f=>f.form&&f.form.slice(0,3).join("")==="WWW"),from:"ร้านหมูปิ้งป้าศรี",title:"ขอเป็นสปอนเซอร์เล็ก ๆ",body:"เห็นนักมวยค่ายชนะสามไฟต์ติด ป้าขอแปะป้ายร้านที่มุมเวทีค่ายได้ไหม ป้ามีให้เท่านี้นะ",amt:1500},
 {id:"sp_oil",when:G=>(G.cal||[]).filter(c=>c.res==="W").length>=8,from:"น้ำมันมวยตราช้างสามเศียร",title:"ข้อเสนอสปอนเซอร์",body:"ทางบริษัทขอสนับสนุนค่ายที่ชนะต่อเนื่อง แลกกับให้นักมวยทาน้ำมันมวยตราเราออกสื่อ (กลิ่นแรง ขออภัยล่วงหน้า)",amt:4000},
 {id:"sp_pump",when:G=>G.week>=41&&[...((G.semis||{}).A||[]),...((G.semis||{}).B||[])].some(id=>G.F[id]&&G.F[id].camp==="player"),from:"ปั๊มน้ำมันหน้าอำเภอ",title:"ร่วมเชียร์ค่ายเข้ารองชิง",body:"ทางปั๊มขอสนับสนุนค่ายตัวแทนอำเภอ เติมน้ำมันครบ 500 รับน้ำดื่มฟรี (สำหรับลูกค้า) ส่วนค่ายรับเงินสนับสนุนตามนี้ครับ",amt:8000},
 {id:"sp_beatploy",when:G=>G.flags&&G.flags.beat_ploy>=1,from:"สมาคมแฟนมวยหญิง",title:"รางวัลล้มยักษ์",body:"ขอมอบเงินรางวัลให้ค่ายที่ล้มพลอยได้ เป็นครั้งแรกในรอบสองฤดูกาล กองเชียร์ลงขันกันมาค่ะ",amt:5000}];

function mailWeekly(G){G.mail=G.mail||[];G.gang=G.gang||{st:0,next:0};G.mailSeen=G.mailSeen||{};const rng=mulberry32(G.seed+G.week*4441);
  for(const m of G.mail)if(m.exp&&G.week>m.exp&&!m.done)m.expired=true;
  for(const M of STORY_MAIL)if(!G.mailSeen[M.id]&&M.when(G)){G.mailSeen[M.id]=1;addMail(G,{kind:"letter",from:M.from,title:M.title,body:M.body});}
  for(const M of SPONSOR_MAIL)if(!G.mailSeen[M.id]&&M.when(G)){G.mailSeen[M.id]=1;addMail(G,{kind:"take",from:M.from,title:M.title,body:M.body,amt:M.amt});}
  // gang: after the first market fight, the next tier writes in every few weeks
  if(G.gang.st>=1&&G.gang.st<5&&G.week>=G.gang.next&&!G.mail.some(m=>m.q==="gang"&&!m.done&&!m.expired)&&G.week<=48){const k="gang"+(G.gang.st+1);
    addMail(G,{kind:"quest",q:"gang",qk:k,from:"แม่ค้าตลาดเช้า (ไม่ลงชื่อ)",title:G.gang.st>=4?"เสี่ยหมวกทองคำมาเอง!":"พวกหมวกกันน็อกกลับมาอีกแล้ว",
      body:[`พวกมันกลับมาเก็บดอกอีกแล้ว คราวนี้มี "${QK[k].name}" มาคุม ใครไม่จ่ายร้อยละยี่สิบ โดนพังแผง ช่วยพวกเราอีกครั้งได้ไหม`,`ไอ้${QK[k].name}มันขู่ว่าจะยึดรถเข็นลูกชิ้นของยายแหวว ถ้าค่ายศิริชัยยังไม่หยุดมันก็ไม่มีใครหยุดได้แล้ว`,`ตลาดทั้งตลาดเงียบหมด เพราะ "${QK[k].name}" มานั่งเฝ้าตั้งแต่ตีห้า ขอร้องล่ะ`,`เขาว่าหัวหน้าใหญ่ "${QK[k].name}" จะมาเก็บเงินเอง ทั้งตลาดเป็นหนี้มันหมด ถ้าล้มตัวนี้ได้ แก๊งจบแน่`][G.gang.st-1],exp:G.week+3});G.gang.next=G.week+5;}
  // cow on the loose — once, mid season
  if(!G.mailSeen.cow&&G.week>=12&&rng()<.35){G.mailSeen.cow=1;addMail(G,{kind:"quest",q:"cow",qk:"bull1",from:"ลุงเฉลิม ฟาร์มโคนม",title:"ช่วยด้วย! วัวหลุด!!",body:"แม่นมสดวัวที่ดุที่สุดในฟาร์มหลุดคอก มันดูมวยทางทีวีทุกคืนจนตั้งการ์ดเป็น! ตอนนี้ยืนขวางถนนหน้าตลาด ใครเข้าใกล้โดนถีบหมด ส่งนักมวยมาช่วยที ลุงให้ค่าเหนื่อยพร้อมนมสดอีกหนึ่งถัง",exp:G.week+2,pay:1500});}
  if(!G.mailSeen.rooster&&G.week>=7&&rng()<.3){G.mailSeen.rooster=1;addMail(G,{kind:"quest",q:"rooster",qk:"rooster1",from:"เสี่ยต๋อง สนามไก่",title:"ไก่ผมหลุดเข้าค่ายคุณ",body:"ไก่แจ้หัวร้อนของผมบินข้ามรั้วไปจิกกระสอบทรายค่ายคุณตั้งแต่เช้า ใครเข้าใกล้มันตั้งท่ามวยใส่ ช่วยจับให้ทีครับ ผมให้ค่าจ้างและไข่ไก่สองแผง",exp:G.week+2,pay:1000});}
  // rivals we keep ignoring write in to taunt us
  const sn=Object.entries(G.snub||{}).filter(([id,n])=>n>=3&&G.F[id]&&!G.F[id].canon&&(G.F[id].camp==="npc"||G.F[id].camp==="rival")&&!G.mailSeen["ch_"+id]).sort((a,b)=>b[1]-a[1])[0];
  if(sn&&rng()<.5&&G.week<=46){const op=G.F[sn[0]];G.mailSeen["ch_"+op.id]=1;
    addMail(G,{kind:"quest",q:"challenge",npc:op.id,from:op.name,title:"ทำไมไม่รับไฟต์ฉัน?",body:[`ส่งข้อเสนอไปตั้ง ${sn[1]} ครั้ง ค่ายศิริชัยไม่รับสักที กลัวเหรอ? ถ้าแน่จริงมาเจอกันหลังตลาดสด ไม่มีกรรมการ ไม่มีแต้ม มีแต่ศักดิ์ศรี`,`ได้ข่าวว่าค่ายพวกเธอเลือกคู่ชกเก่งนะ เลือกแต่คนที่ชนะได้ ฉันท้าตรงนี้เลย ไฟต์โชว์หน้าวัด คนดูเต็ม ถ้าไม่มาฉันจะบอกทั้งตำบลว่าพวกเธอหนี`,`ฉันอยู่ในลิสต์ข้อเสนอเธอมา ${sn[1]} สัปดาห์ เหมือนเมนูที่ไม่มีใครสั่ง วันนี้ฉันสั่งเอง: ไฟต์โชว์ กับใครก็ได้ในค่ายเธอ`][sn[1]%3],exp:G.week+3,pay:1500});}
  // quiz from the community radio
  if(G.week%6===4){const q=QUIZ[(Math.floor(G.week/6)+G.seed)%QUIZ.length];addMail(G,{kind:"quiz",from:"วิทยุชุมชน 'มวยบ้านเรา'",title:"ชิงรางวัลประจำสัปดาห์",body:"ตอบถูกรับเงินรางวัลจากผู้สนับสนุนรายการ (ตอบได้ครั้งเดียว)",q:q[0],opts:q[1],ans:q[2],amt:500+Math.min(1500,G.week*25),exp:G.week+2});}
  // odd bills
  if(G.week>=5&&rng()<.22){const L=BILLS.filter(b=>!b[3]||b[3](G));const b=L[Math.floor(rng()*L.length)];addMail(G,{kind:"pay",from:b[0],title:"ใบแจ้งหนี้",body:b[1],amt:Math.round(b[2]*(1+G.week/60)/10)*10,exp:G.week+2});}
  // odd fights posted to the offers board (rare, pays well)
  beastOffer(G,rng);
  qCleanup(G);}
const BEAST_WEEKS=[9,15,21,27,33,38,44];
function beastOffer(G,rng){if(!BEAST_WEEKS.includes(G.week))return;const R=roster(G).filter(f=>!f.injury);if(!R.length)return;
  const i=BEAST_WEEKS.indexOf(G.week);const kinds=["rooster2","bull2","rooster3","rooster4","bull3","rooster5","bull3"];const kind=kinds[i];const f=R[Math.floor(rng()*R.length)];
  const wk=G.week+2;if(G.bookings.some(b=>b.a===f.id&&Math.abs(b.week-wk)<=1))return;const qid=makeQ(G,kind,f.id,"o"+G.week);const K=QK[kind];
  const win=Math.round((6000+G.week*180)*(1+K.lvl*.2)/100)*100,lose=Math.round(win*.35/100)*100;
  G.offers.unshift({id:`ob${G.week}_${f.id}`,a:f.id,b:qid,week:wk,tier:"beast",beast:kind,win,lose});
  const ev=K.grp==="rooster"?["งานวัดบ้านโป่ง","ศึกคนปะทะไก่ชน"]:["งานประจำปีอำเภอ","ศึกล้มวัว (ฉบับมวยไทย)"];
  addMail(G,{kind:"letter",from:ev[0],title:`เชิญร่วม "${ev[1]}"`,body:`ขอเชิญ${f.name}ขึ้นเวทีพิเศษกับ "${K.name}" สัปดาห์ ${wk} ค่าตัวดีกว่าไฟต์ปกติ (ไม่มีผลต่อสถิติและอันดับ) ข้อเสนออยู่ที่หน้าไฟต์แล้ว รับภายในสัปดาห์นี้นะครับ`});}

// ---------- quest fights ----------
function questFighters(){return roster(G).filter(f=>!f.injury);}
function startQuest(spec,fid,done){const f=G.F[fid];if(!f){done&&done();return;}
  const opp=spec.npc||makeQ(G,spec.qk,fid,spec.tag||("w"+G.week));const tier="quest";
  const b={id:"q"+G.week+"_"+fid+"_"+Math.floor(Math.random()*1e4),a:fid,b:opp,week:G.week,tier,rounds:spec.rounds||3,win:spec.purse||0,lose:0,quest:spec};
  b.bg=spec.npc?"bg_food.webp":QGRP_BG[QK[spec.qk].grp];
  openFight(b,()=>questAfter(b,done));}
function questAfter(b,done){const S=b.quest,res=(G.cal||[]).slice(-1)[0];const win=res&&res.b===b.b&&res.res==="W";const me=G.F[b.a],op=G.F[b.b]||{name:"คู่ชก"};
  const fin=()=>{save();render();done&&done();};
  if(S.q==="gang"){G.gang=G.gang||{st:0,next:0};if(win){G.gang.st=Math.max(G.gang.st,+S.qk.slice(4));G.gang.next=G.week+4;G.rep+=S.qk==="gang5"?2:.5;
      const amt=S.qk==="gang5"?12000:S.qk==="gang4"?5000:S.qk==="gang3"?2000:200+Math.floor(Math.random()*7)*50;
      addMail(G,{kind:"take",from:"(ไม่ระบุชื่อผู้ส่ง)",title:S.qk==="gang5"?"ตลาดเช้าขอบคุณค่ายศิริชัย":"ซองสีน้ำตาลไม่มีชื่อ",body:S.qk==="gang5"?"แก๊งหมวกกันน็อกยุบแล้ว หนี้นอกระบบของทั้งตลาดเป็นโมฆะ แม่ค้าทุกแผงลงขันกันมาให้ค่าย ขอบคุณที่ไม่ยืนดูเฉย ๆ":"ข้างในมีเงินกับกระดาษโน้ตลายมือสั่น ๆ: 'ขอบคุณที่ช่วยตลาด วันนี้ขายได้เต็มแผงเลย'",amt});
      playScene([{n:"npc",who:"ป้าศรี แม่ค้าผัก",t:S.qk==="gang5"?"เสี่ยหมวกทองคำล้มแล้ว!! ทั้งตลาดเป็นอิสระแล้วจ้า!":"ไปแล้ว! พวกมันขี่มอไซค์หนีไปแล้ว! ขอบใจนะหนู"},{n:b.a,f:"happy",l:"fight",t:S.qk==="gang5"?"ตลาดนี้มีคนคุ้มครองแล้วค่ะ ชื่อค่ายศิริชัย!":"ใครรังแกตลาดนี้ ต้องผ่านค่ายศิริชัยก่อนค่ะ!"},{n:"nar",t:"ตกเย็นมีซองสีน้ำตาลไม่มีชื่อผู้ส่งเสียบอยู่ที่ตู้จดหมายค่าย"}],fin,{bg:"food",look:"fight"});return;}
    playScene([{n:"npc",who:op.name,t:"ฮ่า! ค่ายมวยก็แค่นี้! บอกแม่ค้าให้เตรียมดอกไว้!"},{n:b.a,f:"sad",l:"fight",t:"…ขอโทษนะคะ ป้า คราวหน้าหนูไม่แพ้แล้ว"},{n:"nar",t:"แม่ค้าบอกว่าไม่เป็นไร พวกมันจะกลับมาอีก และค่ายจะมีโอกาสอีกครั้ง"}],()=>{G.gang.next=G.week+3;fin();},{bg:"food",look:"fight"});return;}
  if(win&&S.pay){addMail(G,{kind:"take",from:S.from||"ผู้ว่าจ้าง",title:"ค่าเหนื่อยตามสัญญา",body:S.q==="cow"?"ค่าเหนื่อยพร้อมนมสดหนึ่งถัง (นมถูกดื่มหมดภายในสิบนาทีโดยนักมวยในค่าย)":S.q==="rooster"?"ค่าจ้างพร้อมไข่สองแผง ไก่แจ้กลับบ้านไปนอนซึม เจ้าของบอกว่ามันไม่เคยแพ้ใครมาก่อน":"เดิมพันข้างเวทีที่คนดูลงขันกัน ทั้งตำบลพูดถึงไฟต์นี้",amt:S.pay});G.rep+=.6;}
  if(S.q==="challenge")op&&(win?G.rep+=1:0);
  fin();}

// first time — the market scene, then straight into the ring
function gangEventSteps(){const R=questFighters();const steps=[{n:"nar",t:"เช้าวันเสาร์ ตลาดสดหน้าวัด เสียงโวยวายดังมาจากแผงผัก"},
  {n:"npc",who:"ป้าศรี แม่ค้าผัก",t:"ไม่มีจริง ๆ จ้ะพ่อหนุ่ม เดือนนี้ผักเน่าไปครึ่งแผง ขอผ่อนอีกอาทิตย์นะ…"},
  {n:"npc",who:"ลูกกระจ๊อกหมวกแดง",t:"ดอกร้อยละยี่สิบต่อเดือนนะป้า! ไม่จ่ายวันนี้ แผงนี้พรุ่งนี้หายทั้งแผง!"},
  {n:"coach",t:"แก๊งหมวกกันน็อก… ปล่อยเงินกู้นอกระบบ ดอกร้อยละยี่สิบต่อเดือน ดูดเลือดชาวตลาดมาหลายปีแล้ว"},
  {n:"kati",f:"angry",l:"train",t:"ผู้จัดการคะ! ปู่ชัยสอนว่ามวยมีไว้ปกป้องคนที่สู้ไม่ได้ เราจะยืนดูเฉย ๆ ไม่ได้นะคะ!"},
  {choice:[...R.slice(0,3).map(f=>({t:`ส่ง${f.name}ไปจัดการ (ชกทันที · ล้า ${Math.round(f.fatigue)})`,fx:()=>{UI.qpend={q:"gang",qk:"gang1",fid:f.id};},then:[{n:"npc",who:"ลูกกระจ๊อกหมวกแดง",t:`ห๊ะ? นักมวยผู้หญิง? ${f.name}งั้นเหรอ มาเลย จะได้รู้ว่าหมวกกันน็อกไม่ได้ใส่ไว้โชว์!`}]})),
    {t:"แจ้งตำรวจแทน (ไม่ชก)",fx:()=>{UI.qpend=null;G.gang={st:0,next:G.week+6,skip:1};},then:[{n:"nar",t:"ตำรวจมาถึงช้าไปสิบห้านาที พวกหมวกกันน็อกหายไปแล้ว ป้าศรีถอนหายใจยาว"},{n:"kati",f:"sad",l:"train",t:"…ครั้งหน้าถ้าเจออีก หนูไม่ยอมแล้วนะคะ"}]}]}];return steps;}
function questExtra(done,rng){if(!G||G.ended)return false;G.gang=G.gang||{st:0,next:0};
  const again=G.gang.skip&&G.gang.st===0&&!G.seen.q_gang_again&&G.week>=G.gang.next;
  const ok=(!G.seen.q_gang_first||again)&&G.week>=6&&G.week<=44&&questFighters().length;
  if(!ok||rng()>=.2)return false;if(G.seen.q_gang_first)G.seen.q_gang_again=true;G.seen.q_gang_first=true;
  UI.qpend=null;playScene(gangEventSteps(),()=>{const p=UI.qpend;UI.qpend=null;if(!p){done();return;}G.gang.st=Math.max(G.gang.st,0);startQuest({q:"gang",qk:"gang1"},p.fid,done);},{bg:"food",look:"train"});return true;}

// ---------- modals ----------
function mailListHTML(){const L=G.mail||[];
  return `<h2 class="mailh">${MAILBOX_PX}ตู้จดหมาย</h2>${L.length?`<div class="mlist2">${L.map(m=>`<button class="mrow2 ${m.read?"":"unread"} ${mailOpen(m)?"act":""} ${m.done||m.expired?"old":""}" data-act="mopen" data-v="${m.id}"><span class="mk ${m.kind}">${{letter:"จดหมาย",take:"เงินเข้า",pay:"ใบแจ้งหนี้",quiz:"ตอบคำถาม",quest:"ขอความช่วยเหลือ"}[m.kind]}</span><span class="mt"><b>${esc(m.title)}</b><small>${esc(m.from)} · สด.${m.wk}${m.expired?" · หมดเวลา":m.done?" · จัดการแล้ว":m.exp?` · ภายใน สด.${m.exp}`:""}</small></span>${mailOpen(m)?'<i class="dot"></i>':""}</button>`).join("")}</div>`:`<p class="lead">ยังไม่มีจดหมาย</p>`}`;}
function letterHTML(m){m.read=true;let act="";
  if(m.kind==="take")act=m.done?`<p class="meta center">รับแล้ว ${fmt(m.amt)}</p>`:`<button class="btn primary" data-act="mtake" data-v="${m.id}">รับเงิน ${fmt(m.amt)}</button>`;
  if(m.kind==="pay")act=m.done?`<p class="meta center">${m.paid?"จ่ายแล้ว":"ไม่จ่าย (ชื่อเสียง −0.3)"}</p>`:m.expired?"":`<button class="btn" data-act="mskip" data-v="${m.id}">ไม่จ่าย (ชื่อเสียง −0.3)</button><button class="btn primary" data-act="mpay" data-v="${m.id}" ${G.cash<m.amt?"disabled":""}>จ่าย ${fmt(m.amt)}</button>`;
  if(m.kind==="quiz")act=m.done?`<p class="meta center">${m.ok?`ตอบถูก! ได้ ${fmt(m.amt)}`:`ผิดจ้า คำตอบคือ "${esc(m.opts[m.ans])}"`}</p>`:m.expired?"":`<p class="qz"><b>${esc(m.q)}</b></p><div class="qopts">${m.opts.map((o,i)=>`<button class="btn" data-act="mquiz" data-v="${m.id}" data-k="${i}">${esc(o)}</button>`).join("")}</div>`;
  if(m.kind==="quest")act=m.done?`<p class="meta center">${m.declined?"ปฏิเสธแล้ว":"ส่งนักมวยไปแล้ว"}</p>`:m.expired?`<p class="meta center">หมดเวลาแล้ว</p>`:`<button class="btn" data-act="mdecl" data-v="${m.id}">ไม่ไป</button><button class="btn primary" data-act="macc" data-v="${m.id}">รับงาน · เลือกนักมวย</button>`;
  const opp=m.qk?QK[m.qk]:m.npc?G.F[m.npc]:null;
  return `<button class="btn sm ghost mback" data-act="mail">◂ ตู้จดหมาย</button><div class="letter px"><div class="lhead"><small>จาก</small><b>${esc(m.from)}</b><small>สัปดาห์ ${m.wk}</small></div><h3>${esc(m.title)}</h3><p>${esc(m.body)}</p>
   ${m.kind==="take"||m.kind==="pay"?`<p class="lamt ${m.kind}">${m.kind==="take"?"+":"−"}${fmt(m.amt)}</p>`:""}
   ${opp&&m.kind==="quest"?`<div class="qopp">${m.qk?`<canvas width="96" height="96" data-qsprite="${QK[m.qk].sprite}"></canvas>`:faceImg(opp)}<span><b>${esc(opp.name)}</b><small>${m.q==="challenge"?"ไฟต์โชว์ ไม่นับสถิติ":"ชกทันที · ไม่นับสถิติและอันดับ · นักมวยล้าเพิ่ม"}${m.pay?` · ค่าเหนื่อย ${fmt(m.pay)}`:m.q==="gang"?" · ค่าตอบแทนมาทางตู้จดหมาย":""}</small></span></div>`:""}</div>
   <div class="mfoot lact">${act}</div>`;}
function qpickHTML(mid){const m=(G.mail||[]).find(x=>x.id===mid);const R=roster(G);
  return `<h2>ส่งใครไป?</h2><p class="meta">${m?esc(m.title):""} · ชกทันทีสัปดาห์นี้ ล้าเพิ่ม ไม่นับสถิติ</p><div class="qpick">${R.map(f=>`<button class="qpf px" data-act="qsend" data-id="${f.id}" data-v="${mid}" ${f.injury?"disabled":""}>${faceImg(f,"sm")}<span><b>${esc(f.name)} Lv.${f.lvl}</b><small>${f.injury?`บาดเจ็บ ${f.injury} สด.`:`ล้า ${Math.round(f.fatigue)} · ความพร้อม ${condition(f)}`}</small></span></button>`).join("")}</div>`;}
// cash flow & fame graphs
function lineSVG(pts,key,col,fmtY){if(pts.length<2)return `<p class="meta">ยังไม่มีข้อมูลพอ เล่นต่ออีกสักสัปดาห์</p>`;const W=320,H=130,P=26;const ys=pts.map(p=>p[key]);let mn=Math.min(0,...ys),mx=Math.max(...ys);if(mx===mn)mx=mn+1;
  const x=i=>P+(W-P-6)*i/(pts.length-1),y=v=>H-16-(H-28)*(v-mn)/(mx-mn);const d=pts.map((p,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join("");
  const z=mn<0?`<line x1="${P}" x2="${W-6}" y1="${y(0)}" y2="${y(0)}" class="g0"/>`:"";
  return `<svg class="lsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="กราฟ"><line x1="${P}" x2="${W-6}" y1="${H-16}" y2="${H-16}" class="gax"/>${z}<path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"/>
   ${pts.map((p,i)=>`<rect x="${x(i)-2}" y="${y(p[key])-2}" width="4" height="4" fill="${col}"><title>สด.${p.w}: ${fmtY(p[key])}</title></rect>`).join("")}
   <text x="${P-4}" y="${y(mx)+4}" text-anchor="end" class="gt">${fmtY(mx)}</text><text x="${P-4}" y="${y(mn)+4}" text-anchor="end" class="gt">${fmtY(mn)}</text>
   <text x="${x(0)}" y="${H-3}" class="gt">สด.${pts[0].w}</text><text x="${x(pts.length-1)}" y="${H-3}" text-anchor="end" class="gt">สด.${pts[pts.length-1].w}</text></svg>`;}
const kfmt=v=>Math.abs(v)>=1000?(v<0?"-":"")+"฿"+(Math.abs(v)/1000).toFixed(Math.abs(v)>=10000?0:1)+"k":fmt(v);
function cashflowHTML(){const H=(G.history||[]);const L=H.slice(-8).reverse();const inc=classIncome(G),up=upkeep(G),wg=wages(G);
  return `<h2>กระแสเงินสด</h2>${lineSVG(H.slice(-26),"cash","var(--gold)",kfmt)}
   <h3>ต่อสัปดาห์ตอนนี้</h3><div class="kv-row"><span>ค่าเรียน ${students(G)} คน</span><b class="num pos">+${fmt(inc)}</b></div><div class="kv-row"><span>ค่าดูแลค่าย</span><b class="num neg">−${fmt(up)}</b></div><div class="kv-row"><span>ค่าจ้างนักมวย+ครู</span><b class="num neg">−${fmt(wg)}</b></div><div class="kv-row tot"><span>สุทธิประจำ</span><b class="num ${inc-up-wg<0?"neg":"pos"}">${fmt(inc-up-wg)}</b></div>
   <h3>ย้อนหลัง</h3><div class="tbl-wrap"><table class="cft"><thead><tr><th>สด.</th><th>ประจำ</th><th>ไฟต์</th><th>อื่น ๆ</th><th>คงเหลือ</th></tr></thead><tbody>${L.map(h=>`<tr><td class="num">${h.w}</td><td class="num ${h.inc!=null&&h.inc-h.up-h.wg-(h.debt||0)<0?"negt":""}">${h.inc!=null?kfmt(h.inc-h.up-h.wg-(h.debt||0)):"–"}</td><td class="num">${h.fight?"+"+kfmt(h.fight):"–"}</td><td class="num ${h.oth<0?"negt":""}">${h.oth!=null&&Math.abs(h.oth)>=1?kfmt(h.oth):"–"}</td><td class="num">${kfmt(h.cash)}</td></tr>`).join("")}</tbody></table></div>
   <p class="meta">"ประจำ" = ค่าเรียน − ค่าดูแล − ค่าจ้าง − หนี้ · "อื่น ๆ" = ซื้อของ อัปเกรด ของขวัญ เหตุการณ์ จดหมาย</p>`;}
function repgraphHTML(){return `<h2>ชื่อเสียงค่าย ${G.rep.toFixed(1)}</h2>${lineSVG((G.history||[]).slice(-30),"rep","var(--pink,#ff7b9c)",v=>v.toFixed(0))}${G.rep>40?`<p class="meta warnt">ชื่อเสียงเกิน 40 จะค่อย ๆ ลดลงเองทุกสัปดาห์ ต้องชนะต่อเนื่องเพื่อรักษาไว้</p>`:""}`+repInfoHTML().replace(/^<h2>.*?<\/h2>/,"");}
// fight calendar under the rankings
function calendarHTML(){const past={},next={};for(const c of G.cal||[])(past[c.wk]=past[c.wk]||[]).push(c);for(const b of G.bookings)if(G.F[b.a]&&G.F[b.a].camp==="player")(next[b.week]=next[b.week]||[]).push(b);
  const mark={20:"ตัดรอบตำบล",40:"ตัดรอบอำเภอ",44:"รองชิง",49:"ชิงแชมป์"};
  return `<section class="px card cal"><div class="card-h"><h3>ปฏิทินไฟต์</h3><span class="legend"><i class="cw"></i>ชนะ <i class="cl"></i>แพ้ <i class="cn"></i>นัดถัดไป</span></div>
   <div class="calg">${Array.from({length:52},(_,i)=>i+1).map(w=>{const p=past[w],n=next[w];const r=p?(p.some(c=>c.res==="W")?(p.every(c=>c.res==="W")?"w":"m"):p.some(c=>c.res==="D")?"d":"l"):"";
     return `<button class="cday ${w<G.week?"gone":""} ${w===G.week?"now":""} ${p?"has "+r:""} ${n?"nx":""} ${mark[w]?"mk":""}" data-act="calday" data-v="${w}" ${p||n?"":"tabindex=\"-1\""} title="${mark[w]||""}" aria-label="สัปดาห์ ${w}${p?" มีผลไฟต์":n?" มีนัดชก":""}"><b>${w}</b>${p||n?`<i>${p?p.length:""}${n?"●":""}</i>`:""}${mark[w]?`<s></s>`:""}</button>`;}).join("")}</div>
   <p class="meta">แตะวันที่มีไฟต์เพื่อดูผล · ช่องขีดทอง = สัปดาห์ตัดรอบ (20, 40) และรองชิง/ชิง (44, 49)</p></section>`;}
function caldayHTML(w){const p=(G.cal||[]).filter(c=>c.wk===w),n=G.bookings.filter(b=>b.week===w&&G.F[b.a]&&G.F[b.a].camp==="player");
  return `<h2>สัปดาห์ ${w}</h2>${p.map(c=>{const me=G.F[c.a];return `<div class="calres px ${c.res==="W"?"w":c.res==="L"?"l":"d"}"><b>${esc(me?me.name:c.a)} ${c.res==="W"?"ชนะ":c.res==="L"?"แพ้":"เสมอ"} ${esc(c.bn)}</b><span class="meta">${TIER[c.tier]?TIER[c.tier].name:""} · ${esc(c.type||"")} · ได้ ${fmt(c.pay||0)}</span><span class="cards">${(c.cards||[]).map((k,i)=>`<i>ย${i+1} ${k[0]}–${k[1]}</i>`).join("")}</span></div>`;}).join("")}
   ${n.map(b=>`<div class="calres px nx"><b>${esc(G.F[b.a].name)} vs ${esc(G.F[b.b].name)}</b><span class="meta">นัดชก · ${TIER[b.tier].name} · ${b.rounds} ยก</span></div>`).join("")}${!p.length&&!n.length?`<p class="meta">ไม่มีไฟต์ของค่ายในสัปดาห์นี้</p>`:""}`;}
const RANK_HELP=`<ul class="fp-list"><li><b>ชนะ 3 แต้ม</b> (ล้มคนที่เก่งกว่า +1) · เสมอ 1 · แพ้ 0 — นับเฉพาะไฟต์ "ระดับตำบล/อำเภอ"</li><li><b>สัปดาห์ 1–20 รอบตำบล:</b> ท็อป 4 ของรุ่นได้ไปรอบอำเภอ</li><li><b>สัปดาห์ 21–40 รอบอำเภอ:</b> แต้มเริ่มใหม่ ท็อป 4 ได้ไปรองชิงจังหวัด</li><li><b>สัปดาห์ 44 รองชิง · 49 ชิงแชมป์จังหวัด</b> เงินรางวัลก้อนใหญ่และชื่อเสียงสูงสุด</li><li>ไฟต์งานวัด ไฟต์พิเศษ และไฟต์นอกตาราง <b>ไม่ได้แต้ม</b> แต่ได้เงิน EXP และชื่อเสียง</li></ul>`;
const XMODAL={
  mail:()=>({body:mailListHTML(),foot:true}),
  letter:m=>{const x=(G.mail||[]).find(y=>y.id===m.id);return x?{body:letterHTML(x),foot:false}:{body:mailListHTML(),foot:true};},
  qpick:m=>({body:qpickHTML(m.id),foot:true}),
  cashflow:()=>({body:cashflowHTML(),foot:true}),
  repgraph:()=>({body:repgraphHTML(),foot:true}),
  calday:m=>({body:caldayHTML(m.w),foot:true}),
  rankhelp:()=>({body:`<h2>อันดับมีผลยังไง?</h2><div class="ctip big"><img src="${faceSrc("coach")}" alt=""><span><b>ครูแดง:</b> เป้าหมายฤดูกาลนี้คือพากะทิ${G.F.mali.camp==="player"?"กับมะลิ":""}ขึ้นไป<b>ท็อป 4</b> ของรุ่น ผ่านสองด่านให้ได้ แล้วไปเจอพยัคฆ์ทองที่นัดชิง</span></div>${RANK_HELP}`,foot:true}),
  declo:m=>{const o=G.offers.find(x=>x.id===m.id);if(!o)return {body:"",foot:true};return {body:`<h2>ปฏิเสธข้อเสนอนี้?</h2><p>${esc(G.F[o.a].name)} vs ${esc(G.F[o.b].name)} · สด.${o.week} · ${TIER[o.tier].name}</p><p class="meta">ข้อเสนอจะหายไปจากรายการ (ถ้าปฏิเสธคนเดิมบ่อย ๆ เขาอาจเขียนจดหมายมาท้า)</p><div class="mfoot"><button class="btn ghost" data-act="closeModal">ไม่ใช่</button><button class="btn primary" data-act="declyes" data-v="${o.id}">ปฏิเสธเลย</button></div>`,foot:false};}};
Object.assign(ACT,{
  mail:()=>{UI.modal={type:"mail"};render();},
  mopen:d=>{UI.modal={type:"letter",id:d.v};render();save();},
  mtake:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;G.cash+=m.amt;m.done=true;AU.sfx("level");toast(`ได้รับ ${fmt(m.amt)}`);save();render();},
  mpay:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done||G.cash<m.amt)return;G.cash-=m.amt;m.done=true;m.paid=true;AU.sfx("ui");save();render();},
  mskip:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;G.rep=Math.max(0,G.rep-.3);m.done=true;save();render();},
  mquiz:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;m.done=true;m.ok=+d.k===m.ans;if(m.ok){G.cash+=m.amt;AU.sfx("level");}else AU.sfx("miss");save();render();},
  mdecl:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m)return;m.done=true;m.declined=true;if(m.q==="gang"&&G.gang)G.gang.next=G.week+4;save();render();},
  macc:d=>{UI.modal={type:"qpick",id:d.v};render();},
  qsend:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;m.done=true;UI.modal=null;
    const spec=m.q==="challenge"?{q:"challenge",npc:m.npc,pay:m.pay,from:m.from}:{q:m.q,qk:m.qk,pay:m.pay,from:m.from,rounds:m.qk==="gang5"?4:3};
    const intro=m.q==="gang"?[{n:"nar",t:"ตลาดเช้า… มอเตอร์ไซค์สิบกว่าคันจอดเรียงหน้าแผงผัก"},{n:"npc",who:QK[m.qk].name,t:m.qk==="gang5"?"ได้ยินว่ามีค่ายมวยมาเกะกะธุรกิจฉัน วันนี้หัวหน้าใหญ่ลงมาเอง!":"ไหนใครที่ไล่ลูกน้องฉัน ออกมาเลย!"},{n:d.id,f:"angry",l:"fight",t:"ฉันเอง!"}]
      :m.q==="challenge"?[{n:"nar",t:"ลานหลังตลาดสด คนมามุงเต็มสองฝั่ง มีคนตั้งโต๊ะรับพนันน้ำแดง"},{n:"npc",who:G.F[m.npc].name,t:"มาจนได้นะ นึกว่าจะหนีตลอดฤดูกาล"},{n:d.id,f:"angry",l:"fight",t:"ไม่ได้หนี แค่ยังไม่ว่าง ตอนนี้ว่างแล้ว!"}]
      :m.q==="cow"?[{n:"nar",t:"กลางถนนหน้าตลาด วัวนมตัวใหญ่ยืนตั้งการ์ด ขาหน้าเต้นฟุตเวิร์กแบบที่ไม่มีวัวตัวไหนควรทำได้"},{n:"npc",who:"ลุงเฉลิม",t:"นั่นแหละ! ระวังถีบนะหนู มันดูไฟต์ย้อนหลังทุกคืน!"},{n:d.id,f:"surprised",l:"fight",t:"…วัวตั้งการ์ดได้จริง ๆ ด้วย!?"}]
      :[{n:"nar",t:"ไก่แจ้ตัวเล็กยืนบนกระสอบทราย อกพองโต ขนคอตั้งชัน"},{n:"npc",who:"เสี่ยต๋อง",t:"อย่าดูถูกมันนะครับ มันเคยไล่สุนัขพันธุ์ใหญ่ทั้งซอยมาแล้ว"},{n:d.id,f:"happy",l:"fight",t:"มาเลยเจ้าไก่! หนูไม่ใช่สุนัขนะ!"}];
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
  if(!want){if(NEWS.el&&G&&UI.tab!=="home"){UI.newsWeek=G.week;}if(NEWS.el){NEWS.el.remove();NEWS.el=null;}return;}
  const hud=document.querySelector(".hud");const top=Math.round(hud.getBoundingClientRect().bottom)+6;
  if(NEWS.el){NEWS.el.style.top=top+"px";return;}
  if(NEWS.wk!==G.week){NEWS.wk=G.week;NEWS.q=newsItems().slice(0,3);NEWS.i=0;}if(!NEWS.q.length||NEWS.i>=NEWS.q.length){UI.newsWeek=G.week;return;}
  const el=document.createElement("div");el.className="newsbar";el.setAttribute("role","status");el.style.top=top+"px";
  el.innerHTML=`<b class="nlab">ข่าวมวย</b><div class="ntrack"><span class="ncr"></span></div><button class="nclose" aria-label="ปิดข่าว">×</button>`;document.body.appendChild(el);NEWS.el=el;
  el.querySelector(".nclose").onclick=()=>{UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;},300);};
  const show=()=>{if(!el.isConnected)return;if(NEWS.i>=NEWS.q.length){UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;},400);return;}
    const sp=el.querySelector(".ncr");const t=NEWS.q[NEWS.i];sp.textContent=t;sp.style.animation="none";void sp.offsetWidth;
    const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;const dur=reduce?4:Math.min(16,Math.max(7,t.length/6));sp.style.animation=reduce?"none":`ncr ${dur}s linear 1 forwards`;
    clearTimeout(NEWS.tm);NEWS.tm=setTimeout(()=>{NEWS.i++;show();},dur*1000);};show();}

// ---------- rivals answer a loss: one scene each, then the surge shows up in their growth ----------
EVENTS.push(
 {id:"ploy_surge",look:"fight",bg:"night",when:G=>G.flags&&G.flags.beat_ploy>=1&&G.F.ploy.camp==="rival",steps:[
  {n:"nar",t:"ห้าทุ่ม ค่ายพยัคฆ์ทองดับไฟหมดแล้ว เหลือแค่โรงยิมหลังเดียวที่ไฟยังเปิด"},
  {n:"nar",t:"เสียงกระสอบทรายดังเป็นจังหวะเดียวกันมาสามชั่วโมง ไม่ช้าลงเลยสักนิด"},
  {n:"ploy",f:"sad",t:"…แพ้แล้วเจ็บแบบนี้เองสินะ ไม่ได้รู้สึกมานานจนลืมไปแล้ว"},
  {n:"ploy",f:"angry",t:"ขอบคุณนะ กะทิ ตั้งแต่คืนนี้ฉันไม่ใช่อัจฉริยะอีกต่อไป ฉันจะเป็นคนที่ซ้อมหนักที่สุดในจังหวัด"},
  {n:"coach",t:"(ข่าวจากคนในวงการ) พลอยขอเถ้าแก่ย้ายไปนอนในค่าย ซ้อมสามรอบต่อวัน …นัดชิงนี้ไม่ง่ายแล้ว"},
  {fx:G=>{G.F.ploy.morale=Math.min(100,G.F.ploy.morale+20);}}]},
 {id:"fah_surge",look:"fight",bg:"night",when:G=>G.flags&&G.flags.beat_fah>=1&&G.F.fah.camp==="rival",steps:[
  {n:"nar",t:"ตีห้า ทางขึ้นเขาหลังค่ายพยัคฆ์ทอง มีเงาคนหนึ่งวิ่งขึ้นลงเป็นรอบที่สิบ"},
  {n:"fah",f:"angry",t:"ฮึก… อีกรอบ! ใครบอกให้หยุด! ฟ้าไม่ได้แพ้เพราะฟ้าอ่อน ฟ้าแพ้เพราะฟ้าขี้เกียจ!"},
  {n:"fah",f:"sad",t:"…ไว้เจอกันอีกที จะไม่ให้แตะตัวได้สักหมัดเลย คอยดู"},
  {n:"coach",t:"ได้ข่าวว่าฟ้าเปลี่ยนเป็นคนละคน ตื่นก่อนทุกคนในค่ายพยัคฆ์ทอง ระวังให้ดี"}]},
 {id:"ploy_surge2",look:"fight",bg:"final",when:G=>G.flags&&G.flags.beat_ploy>=2&&G.F.ploy.camp==="rival",steps:[
  {n:"ploy",f:"angry",t:"สองครั้งแล้วนะคะ… ครั้งที่สามจะเป็นนัดชิง และฉันจะไม่เหลืออะไรให้เสียใจอีก"},
  {n:"kati",f:"angry",t:"หนูก็เหมือนกัน! ครั้งนี้หนูจะชนะพี่พลอยในวันที่พี่เก่งที่สุด!"}]});
