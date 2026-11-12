// ================= MUAY THAI MOE v1.23 — MAILBOX, SIDE QUESTS, ODD FIGHTS, CALENDAR, GRAPHS, NEWS BAR =================
// ---------- odd opponents (sprite sheets in a/<sprite>_sheet.webp, same 6-row layout as the girls) ----------
const QK={
  gang1:{name:"ลูกกระจ๊อกหมวกแดง",sprite:"gang1",lvl:-1.6,tilt:{punch:1.5,power:1,iq:-2,guard:-1.5,comp:-1},color:"#c8283c",grp:"gang"},
  gang2:{name:"ไอ้แจ็กเก็ตดำ หมวกแดง",sprite:"gang2",lvl:-.8,tilt:{punch:1.5,kick:1,iq:-1.5,comp:-1},color:"#a01f2f",grp:"gang"},
  gang3:{name:"รองหัวหน้าหมวกดำแดง",sprite:"gang3",lvl:.1,tilt:{punch:1.5,knee:1,power:1,iq:-1},color:"#5a1420",grp:"gang"},
  gang4:{name:"หัวหน้าหมวกเงิน",sprite:"gang4",lvl:.8,tilt:{power:2,punch:1.5,dur:1,foot:-1},color:"#d9a520",grp:"gang"},
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
const BELT_WEEKS=[10,18,26,34,42];
function beltHolder(G,div){G.belt=G.belt||{};if(!G.belt[div]){const c=Object.values(G.F).filter(f=>f.div===div&&f.camp!=="player"&&f.camp!=="free"&&!f.canon).sort((a,b)=>ovr(b.a)-ovr(a.a))[0];if(!c)return null;G.belt[div]={id:c.id,def:2,since:G.week};}return G.F[G.belt[div].id];}
function beltChallenger(G,div,not){return Object.values(G.F).filter(f=>f.div===div&&f.camp!=="player"&&f.camp!=="free"&&f.id!==not&&!f.injury).sort((a,b)=>ovr(b.a)-ovr(a.a))[0]||null;}
const QGRP_BG={gang:"bg_market.webp",rooster:"bg_rooster.webp",bull:"bg_farm.webp"};
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
 ["วันมวยไทยตรงกับวันที่เท่าไร?",["6 กุมภาพันธ์","17 มีนาคม","1 เมษายน"],1],
 ["อาวุธ 'ศอก' ในมวยไทย ใช้ส่วนไหนของร่างกาย?",["ข้อศอก","หัวเข่า","ส้นเท้า"],0],
 ["น้ำมันที่ทาตัวนักมวยก่อนขึ้นชก เรียกกันว่าอะไร?",["น้ำมันมวย","น้ำมันมะพร้าว","น้ำมันพืช"],0],
 ["ท่า 'จระเข้ฟาดหาง' คือการออกอาวุธแบบไหน?",["หมุนตัวเตะกลับหลัง","กระโดดเข่า","หมัดตรง"],0],
 ["ในมวยไทย การจับคอคู่ชกแล้วตีเข่า เรียกว่าอะไร?",["ปล้ำ","ทุ่ม","ล็อกแขน"],0],
 ["มวยไทยบนเวทีอาชีพ นักมวยสวมอะไรที่มือ?",["นวม","ถุงเท้า","ถุงมือผ้าห่ม"],0],
 ["ครูแดงบอกว่าอะไรสำคัญที่สุดก่อนวันชก?",["นอนให้พอ","กินหมูกระทะ","ดูละครหลังข่าว"],0],
 ["แมวส้มประจำค่ายศิริชัยชอบกินอะไรที่สุด? (คำถามจากแฟนรายการ)",["ขนมครก","ปลาทู","ข้าวมันไก่"],0],
 ["พระมหากษัตริย์ที่เลื่องลือว่าปลอมพระองค์ไปชกมวยกับชาวบ้าน คือพระองค์ใด?",["พระเจ้าเสือ","พระเจ้าช้างเผือก","พระเจ้าปราสาททอง"],0]];

const WIN_BONUS=[
 ["ร้านข้าวมันไก่เจ๊ติ๋ม","โบนัสชนะ!","เมื่อคืนลูกค้าเชียร์ค่ายคุณจนลืมจ่ายเงิน แต่วันนี้ขายดีเป็นประวัติการณ์ เจ๊แบ่งให้ค่ายส่วนหนึ่ง (หนี้ 46 จานยังอยู่นะ)"],
 ["ปั๊มน้ำมันประจำอำเภอ","รางวัลนักมวยชนะประจำสัปดาห์","ทางปั๊มมอบโบนัสให้ค่ายที่ชนะเมื่อวาน แถมคูปองล้างรถหนึ่งใบ (ใช้ได้เฉพาะวันอังคาร)"],
 ["แฟนคลับมวยหญิงบ้านเรา","เรี่ยไรให้ค่ายคนชนะ","ทุกคนในกลุ่มไลน์ลงขันคนละนิด ดีใจที่เห็นค่ายเล็ก ๆ ชนะได้ อย่าลืมไลฟ์ให้ดูบ้างนะ"],
 ["ร้านส้มตำป้าแต๋ว","ส่วนแบ่งยอดขาย","ลูกค้าแห่มาสั่ง 'ส้มตำเผ็ดระดับนักมวย' หลังไฟต์เมื่อวาน ป้าแบ่งกำไรให้ค่าย ครกใหม่ยังไม่ได้ซื้อนะ"],
 ["วินมอเตอร์ไซค์หน้าตลาด","พี่วินลงขัน","พวกพี่แทงข้างค่ายคุณแล้วได้ ขอแบ่งให้ค่ายหน่อย ถือว่าค่าน้ำมันใจ"],
 ["สหกรณ์น้ำแข็งหลอด","คืนเงินค่าน้ำแข็ง","ยินดีด้วยกับชัยชนะ สหกรณ์คืนเงินค่าน้ำแข็งเดือนนี้บางส่วน เพราะค่ายคุณทำให้คนในอำเภอหันมาแช่น้ำแข็งตาม"]];
const GIG_WEEKS=[10,15,20,25,30,35];
const GIGS=[
 ["ร้านสะดวกซื้อเปิดใหม่","ค่าตัวงานตัดริบบิ้น","ขอบคุณนักมวยค่ายศิริชัยที่มาเตะกระสอบโชว์หน้าร้าน ลูกค้ามุงจนรถติดหน้าปากซอย นี่คือค่าตัวตามตกลงค่ะ"],
 ["โรงเรียนบ้านหนองแฝก","ค่าสาธิตป้องกันตัว","เด็ก ๆ ชอบมาก ตอนนี้ทั้งโรงเรียนเดินไหว้ครูกันทั้งวัน ครูใหญ่ฝากค่าตอบแทนมาให้ค่าย"],
 ["งานกาชาดจังหวัด","ค่าตัวขึ้นเวทีโชว์","โชว์รำมวยของค่ายคุณมีคนดูมากกว่าประกวดนางงาม คณะกรรมการจัดงานขอบคุณมาก"],
 ["ช่องยูทูบ 'กินกับมวย'","ค่าโฆษณาคลิปไวรัล","คลิปนักมวยค่ายคุณกินหมูกระทะหลังซ้อมได้ล้านวิว นี่คือส่วนแบ่งค่าโฆษณา (หมูหมดร้านจริง)"],
 ["โรงแรมริมปิง","ค่าคลาสมวยไทยให้นักท่องเที่ยว","แขกต่างชาติติดใจ ขอจองคลาสอีกรอบ และขอถ่ายรูปกับแมวส้มด้วย"],
 ["ทีมฟุตบอลประจำจังหวัด","ค่าเทรนความฟิต","นักเตะทั้งทีมขาสั่นไปสามวันหลังซ้อมกับค่ายคุณ โค้ชบอกว่าคุ้มทุกบาท"]];
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
  if(G.gang.st>=1&&G.gang.st<5&&G.week>=G.gang.next&&!G.mail.some(m=>m.q==="gang"&&!m.done&&!m.expired)&&G.week<=48){const early=G.gang.st===3&&G.loan>0,k=early?"gang5":"gang"+(G.gang.st+1);
    if(early){addMail(G,{kind:"quest",q:"gang",qk:k,early:1,from:"แม่ค้าตลาดเช้า (ไม่ลงชื่อ)",title:"เสี่ยหมวกทองคำลงมาเอง!",body:`ลูกน้องมันแพ้ค่ายศิริชัยมาสามรอบติด เสี่ยหมวกทองคำเสียหน้าหนัก เลยลงมาคุมตลาดเอง แถมรู้ว่าค่ายติดหนี้มันอยู่ เขาลือกันว่าถ้าใครล้มเสี่ยได้ หนี้ทั้งตลาดก็จบ`,exp:G.week+3});G.gang.next=G.week+5;}
    else addMail(G,{kind:"quest",q:"gang",qk:k,from:"แม่ค้าตลาดเช้า (ไม่ลงชื่อ)",title:G.gang.st>=4?"เสี่ยหมวกทองคำมาเอง!":"พวกหมวกกันน็อกกลับมาอีกแล้ว",
      body:[`พวกมันกลับมาเก็บดอกอีกแล้ว คราวนี้มี "${QK[k].name}" มาคุม ใครไม่จ่ายร้อยละยี่สิบ โดนพังแผง ช่วยพวกเราอีกครั้งได้ไหม`,`ไอ้${QK[k].name}มันขู่ว่าจะยึดรถเข็นลูกชิ้นของยายแหวว ถ้าค่ายศิริชัยยังไม่หยุดมันก็ไม่มีใครหยุดได้แล้ว`,`ตลาดทั้งตลาดเงียบหมด เพราะ "${QK[k].name}" มานั่งเฝ้าตั้งแต่ตีห้า ขอร้องล่ะ`,`เขาว่าหัวหน้าใหญ่ "${QK[k].name}" จะมาเก็บเงินเอง ทั้งตลาดเป็นหนี้มันหมด ถ้าล้มตัวนี้ได้ แก๊งจบแน่`][G.gang.st-1],exp:G.week+3});G.gang.next=G.week+5;}
  // v1.41: the Tha Phae stadium belt — the holder is a fixed, real fighter who does not scale with you
  if(BELT_WEEKS.includes(G.week))for(const div of [...new Set(roster(G).map(f=>f.div))]){const h=beltHolder(G,div);if(!h)continue;const ours=h.camp==="player";
    const op=ours?beltChallenger(G,div,h.id):h;if(!op)continue;
    addMail(G,{kind:"quest",q:"belt",npc:op.id,div,defend:ours?h.id:null,from:"โปรโมเตอร์เวทีท่าแพ",title:ours?`ป้องกันเข็มขัด รุ่น ${div}`:`ศึกชิงเข็มขัดแชมป์เวทีท่าแพ รุ่น ${div}`,
      body:ours?`${op.name} ยื่นท้าชิงเข็มขัดของ${h.name}แล้ว ถ้าไม่รับภายในสองสัปดาห์ เข็มขัดถูกริบ ชนะรับ ฿10,000`:`${op.name} ครองเข็มขัดเวทีท่าแพมา ${G.belt[div].def} ครั้งแล้ว ยังไม่มีใครล้มได้ ค่ายไหนกล้าส่งคนมาท้าชิงบ้าง? ห้ายก ชนะรับ ฿15,000 พร้อมเข็มขัด`,exp:G.week+2,pay:ours?10000:15000});}
  // cow on the loose — once, mid season
  if(!G.mailSeen.cow&&G.week>=9&&rng()<.6){G.mailSeen.cow=1;addMail(G,{kind:"quest",q:"cow",qk:"bull1",from:"ลุงเฉลิม ฟาร์มโคนม",title:"ช่วยด้วย! วัวหลุด!!",body:"แม่นมสดวัวที่ดุที่สุดในฟาร์มหลุดคอก มันดูมวยทางทีวีทุกคืนจนตั้งการ์ดเป็น! ตอนนี้ยืนขวางถนนหน้าตลาด ใครเข้าใกล้โดนถีบหมด ส่งนักมวยมาช่วยที ลุงให้ค่าเหนื่อยพร้อมนมสดอีกหนึ่งถัง",exp:G.week+2,pay:1500});}
  if(!G.mailSeen.rooster&&G.week>=5&&rng()<.6){G.mailSeen.rooster=1;addMail(G,{kind:"quest",q:"rooster",qk:"rooster1",from:"เสี่ยต๋อง สนามไก่",title:"ไก่ผมหลุดเข้าค่ายคุณ",body:"ไก่แจ้หัวร้อนของผมบินข้ามรั้วไปจิกกระสอบทรายค่ายคุณตั้งแต่เช้า ใครเข้าใกล้มันตั้งท่ามวยใส่ ช่วยจับให้ทีครับ ผมให้ค่าจ้างและไข่ไก่สองแผง",exp:G.week+2,pay:1000});}
  // rivals we keep ignoring write in to taunt us
  const sn=Object.entries(G.snub||{}).filter(([id,n])=>n>=3&&G.F[id]&&!G.F[id].canon&&(G.F[id].camp==="npc"||G.F[id].camp==="rival")&&!G.mailSeen["ch_"+id]).sort((a,b)=>b[1]-a[1])[0];
  if(sn&&rng()<.5&&G.week<=46){const op=G.F[sn[0]];G.mailSeen["ch_"+op.id]=1;
    addMail(G,{kind:"quest",q:"challenge",npc:op.id,from:op.name,title:"ทำไมไม่รับไฟต์ฉัน?",body:[`ส่งข้อเสนอไปตั้ง ${sn[1]} ครั้ง ค่ายศิริชัยไม่รับสักที กลัวเหรอ? ถ้าแน่จริงมาเจอกันหลังตลาดสด ไม่มีกรรมการ ไม่มีแต้ม มีแต่ศักดิ์ศรี`,`ได้ข่าวว่าค่ายพวกเธอเลือกคู่ชกเก่งนะ เลือกแต่คนที่ชนะได้ ฉันท้าตรงนี้เลย ไฟต์โชว์หน้าวัด คนดูเต็ม ถ้าไม่มาฉันจะบอกทั้งตำบลว่าพวกเธอหนี`,`ฉันอยู่ในลิสต์ข้อเสนอเธอมา ${sn[1]} สัปดาห์ เหมือนเมนูที่ไม่มีใครสั่ง วันนี้ฉันสั่งเอง: ไฟต์โชว์ กับใครก็ได้ในค่ายเธอ`][sn[1]%3],exp:G.week+3,pay:1500});}
  // v1.33: temple-fair purses arrive by mail the week after
  for(const p of (G.fairPay||[]))addMail(G,{kind:"take",from:"กรรมการงานวัด",title:p.res==="W"?"ค่าตัวไฟต์งานวัด (ชนะ)":"ค่าตัวไฟต์งานวัด",body:p.res==="W"?`ซองค่าตัวจากงานวัด ชนะ${p.op}มา คนดูชอบใจ ใส่ซองเพิ่มให้นิดหน่อย`:`ซองค่าตัวจากงานวัด แม้จะแพ้${p.op} แต่คนดูก็ปรบมือให้`,amt:p.amt});
  G.fairPay=[];
  // quiz from the community radio
  // v1.26: mid-season income — sponsors reward a win, paid appearances every few weeks
  const won=(G.cal||[]).some(c=>c.wk>=G.week-1&&c.res==="W"&&G.F[c.a]&&G.F[c.a].camp==="player"&&!(TIER[c.tier]&&TIER[c.tier].off));
  if(won&&G.week>=6&&G.week<=42&&rng()<.45){const B=WIN_BONUS[(G.week+G.seed)%WIN_BONUS.length];addMail(G,{kind:"take",from:B[0],title:B[1],body:B[2],amt:Math.round((1500+G.week*70)/100)*100});}
  const gi=GIG_WEEKS.indexOf(G.week);if(gi>=0){const g=GIGS[gi%GIGS.length];addMail(G,{kind:"take",from:g[0],title:g[1],body:g[2],amt:Math.round((3000+G.week*90)/100)*100});}
  if(G.week%3===1&&G.week>=4&&G.week<=49){const q=QUIZ[(Math.floor(G.week/3)+G.seed)%QUIZ.length];addMail(G,{kind:"quiz",from:"วิทยุชุมชน 'มวยบ้านเรา'",title:"ชิงรางวัลประจำสัปดาห์",body:"ตอบถูกรับเงินรางวัลจากผู้สนับสนุนรายการ (ตอบได้ครั้งเดียว)",q:q[0],opts:q[1],ans:q[2],amt:Math.round((800+Math.min(2200,G.week*45))/10)*10,exp:G.week+2});}
  // odd bills
  if(G.week>=5&&rng()<.22){const L=BILLS.filter(b=>!b[3]||b[3](G));const b=L[Math.floor(rng()*L.length)];addMail(G,{kind:"pay",from:b[0],title:"ใบแจ้งหนี้",body:b[1],amt:Math.round(b[2]*(1+G.week/60)/10)*10,exp:G.week+2});}
  // odd fights posted to the offers board (rare, pays well)
  beastOffer(G,rng);
  qCleanup(G);}
const BEAST_WEEKS=[7,11,15,19,23,27,31,35,39,43,47];
function beastOffer(G,rng){if(!BEAST_WEEKS.includes(G.week))return;const R=roster(G).filter(f=>!f.injury);if(!R.length)return;
  const i=BEAST_WEEKS.indexOf(G.week);const kinds=["rooster2","bull2","rooster3","bull2","rooster4","bull3","rooster4","rooster5","bull3","rooster5","bull3"];const kind=kinds[i];const f=R[Math.floor(rng()*R.length)];
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
  b.bg=spec.q==="belt"?"bg_district.webp":spec.npc?"bg_food.webp":QGRP_BG[QK[spec.qk].grp];
  openFight(b,()=>questAfter(b,done));}
function questAfter(b,done){const S=b.quest,res=(G.cal||[]).slice(-1)[0];const win=res&&res.b===b.b&&res.res==="W";const me=G.F[b.a],op=G.F[b.b]||{name:"คู่ชก"};
  const fin=()=>{save();render();done&&done();};
  if(S.q==="gang"){G.gang=G.gang||{st:0,next:0};if(win){G.gang.st=Math.max(G.gang.st,+S.qk.slice(4));G.gang.next=G.week+(G.loan>0?2:4);if(S.qk==="gang5"&&G.loan>0){G.loan=0;G.flags.loanWiped=1;}G.rep+=S.qk==="gang5"?2:.5;
      const amt=S.qk==="gang5"?12000:S.qk==="gang4"?5000:S.qk==="gang3"?2000:200+Math.floor(srand(G,7)*7)*50;
      addMail(G,{kind:"take",from:"(ไม่ระบุชื่อผู้ส่ง)",title:S.qk==="gang5"?"ตลาดเช้าขอบคุณค่ายศิริชัย":"ซองสีน้ำตาลไม่มีชื่อ",body:S.qk==="gang5"?"แก๊งหมวกกันน็อกยุบแล้ว หนี้นอกระบบของทั้งตลาดเป็นโมฆะ แม่ค้าทุกแผงลงขันกันมาให้ค่าย ขอบคุณที่ไม่ยืนดูเฉย ๆ":"ข้างในมีเงินกับกระดาษโน้ตลายมือสั่น ๆ: 'ขอบคุณที่ช่วยตลาด วันนี้ขายได้เต็มแผงเลย'",amt});
      playScene([{n:"npc",who:"ป้าศรี แม่ค้าผัก",t:S.qk==="gang5"?(G.flags.loanWiped===1?(G.flags.loanWiped=2,"เสี่ยหมวกทองคำล้มแล้ว!! ทั้งตลาดเป็นอิสระแล้วจ้า! สมุดหนี้ของมันโดนเผาทิ้งหมด หนี้ที่ค่ายกู้ไว้ก็หายไปด้วยนะ!"):"เสี่ยหมวกทองคำล้มแล้ว!! ทั้งตลาดเป็นอิสระแล้วจ้า!"):"ไปแล้ว! พวกมันขี่มอไซค์หนีไปแล้ว! ขอบใจนะหนู"},{n:b.a,f:"happy",l:"fight",t:S.qk==="gang5"?"ตลาดนี้มีคนคุ้มครองแล้วค่ะ ชื่อค่ายศิริชัย!":"ใครรังแกตลาดนี้ ต้องผ่านค่ายศิริชัยก่อนค่ะ!"},{n:"nar",t:"ตกเย็นมีซองสีน้ำตาลไม่มีชื่อผู้ส่งเสียบอยู่ที่ตู้จดหมายค่าย"}],fin,{bg:"market",look:"fight"});return;}
    playScene([{n:"npc",who:op.name,t:"ฮ่า! ค่ายมวยก็แค่นี้! บอกแม่ค้าให้เตรียมดอกไว้!"},{n:b.a,f:"sad",l:"fight",t:"…ขอโทษนะคะ ป้า คราวหน้าหนูไม่แพ้แล้ว"},{n:"nar",t:"แม่ค้าบอกว่าไม่เป็นไร พวกมันจะกลับมาอีก และค่ายจะมีโอกาสอีกครั้ง"}],()=>{G.gang.next=G.week+3;fin();},{bg:"market",look:"fight"});return;}
  if(win&&S.pay){addMail(G,{kind:"take",from:S.from||"ผู้ว่าจ้าง",title:"ค่าเหนื่อยตามสัญญา",body:S.q==="cow"?"ค่าเหนื่อยพร้อมนมสดหนึ่งถัง (นมถูกดื่มหมดภายในสิบนาทีโดยนักมวยในค่าย)":S.q==="rooster"?"ค่าจ้างพร้อมไข่สองแผง ไก่แจ้กลับบ้านไปนอนซึม เจ้าของบอกว่ามันไม่เคยแพ้ใครมาก่อน":"เดิมพันข้างเวทีที่คนดูลงขันกัน ทั้งตำบลพูดถึงไฟต์นี้",amt:S.pay});G.rep+=.6;}
  if(S.q==="challenge")op&&(win?G.rep+=1:0);
  if(S.q==="belt"){const B=G.belt[S.div];if(win&&!S.defend){G.belt[S.div]={id:me.id,def:0,since:G.week};G.rep+=3;me.belts=(me.belts||0)+1;
      playScene([{n:"nar",t:`กรรมการคาดเข็มขัดแชมป์เวทีท่าแพให้${me.name} คนดูลุกขึ้นยืนทั้งเวที`},{n:me.id,f:"happy",l:"fight",t:"ผู้จัดการ! เข็มขัดจริง ๆ ด้วย! หนักกว่าที่คิดอีก!"},{n:"coach",t:"จำความรู้สึกนี้ไว้ ตั้งแต่วันนี้ทุกคนจะอยากล้มเธอ"}],fin,{bg:"district",look:"fight"});return;}
    if(win&&S.defend){B.def++;G.rep+=1.5;}
    if(!win&&S.defend){G.belt[S.div]={id:op.id,def:0,since:G.week};playScene([{n:"nar",t:`เข็มขัดเวทีท่าแพเปลี่ยนมือไปอยู่กับ${op.name}`},{n:me.id,f:"sad",l:"fight",t:"…ขอโทษนะคะ หนูจะเอาคืนมาให้ได้"}],fin,{bg:"district",look:"fight"});return;}
    if(!win&&!S.defend&&B)B.def++;}
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
  if(!ok||rng()>=(G.loan>0?.5:.2))return false;if(G.seen.q_gang_first)G.seen.q_gang_again=true;G.seen.q_gang_first=true;
  UI.qpend=null;playScene(gangEventSteps(),()=>{const p=UI.qpend;UI.qpend=null;if(!p){done();return;}G.gang.st=Math.max(G.gang.st,0);startQuest({q:"gang",qk:"gang1"},p.fid,done);},{bg:"market",look:"train"});return true;}

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
   ${opp&&m.kind==="quest"?`<div class="qopp">${m.qk?`<canvas width="96" height="96" data-qsprite="${QK[m.qk].sprite}"></canvas>`:faceImg(opp)}<span><b>${esc(opp.name)}</b><small>${m.q==="belt"?`ห้ายก · พลังคู่ชก ${ovr(opp.a).toFixed(1)}`:m.q==="challenge"?"ไฟต์โชว์ ไม่นับสถิติ":"ชกทันที · ไม่นับสถิติและอันดับ · นักมวยล้าเพิ่ม"}${m.pay?` · ค่าเหนื่อย ${fmt(m.pay)}`:m.q==="gang"?" · ค่าตอบแทนมาทางตู้จดหมาย":""}</small></span></div>`:""}</div>
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
function cashflowHTML(){const H=(G.history||[]);const inc=classIncome(G),up=upkeep(G),wg=wages(G),net=inc-up-wg;
  const L=H.slice(-7).map((h,i,a)=>i?{w:h.w,d:h.cash-a[i-1].cash,cash:h.cash,fight:h.fight}:null).filter(Boolean).reverse();
  const tip=net<0?(G.cash/-net<6?`รายจ่ายประจำมากกว่ารายรับ เงินพอใช้อีกราว ${Math.max(1,Math.floor(G.cash/-net))} สัปดาห์ ควรรับไฟต์หรือเปิดตู้จดหมายหารายได้`:`รายจ่ายประจำมากกว่ารายรับ ต้องอาศัยค่าตัวไฟต์ เพิ่มนักเรียนด้วยการอัปเกรดห้องเรียนจะช่วยได้`):G.cash>25000?`เงินเหลือเยอะ ลองอัปเกรดค่ายหรือจ้างครูเพิ่ม`:`การเงินไปได้ดี เก็บเงินไว้อัปเกรดค่ายชิ้นถัดไป`;
  return `<h2>การเงิน</h2><div class="bigcash"><small>เงินสดตอนนี้</small><b class="num">${fmt(G.cash)}</b><span class="num ${net<0?"negt":"post"}">${net<0?"−":"+"}${fmt(Math.abs(net))} ต่อสัปดาห์</span></div>
   <div class="ctip"><img src="${ASSET}coach.webp" alt=""><span>${tip}</span></div>
   <div class="kv-row"><span>ค่าเรียน ${students(G)} คน</span><b class="num pos">+${fmt(inc)}</b></div><div class="kv-row"><span>ค่าดูแลค่าย + ค่าจ้าง</span><b class="num neg">−${fmt(up+wg)}</b></div>
   <h3>เงินเข้าออกล่าสุด</h3>${L.length?L.map(h=>`<div class="kv-row"><span>สัปดาห์ ${h.w}${h.fight?" · มีค่าตัวไฟต์":""}</span><b class="num ${h.d<0?"negt":"post"}">${h.d<0?"−":"+"}${fmt(Math.abs(Math.round(h.d)))}</b></div>`).join(""):`<p class="meta">ยังไม่มีประวัติ เล่นต่ออีกสักสัปดาห์</p>`}`;}
function repgraphHTML(){const r=G.rep,S=repSteps();const nx=S.find(([n])=>r<n),pv=[...S].reverse().find(([n])=>r>=n);const lo=pv?pv[0]:0,hi=nx?nx[0]:Math.max(lo+1,r);
  return `<h2>ชื่อเสียงค่าย</h2><div class="repg"><div class="repg-h"><b class="num">${r.toFixed(1)}</b><span>${nx?`อีก ${(nx[0]-r).toFixed(1)} ปลดล็อก: ${nx[1]}`:"ปลดล็อกครบทุกขั้นแล้ว"}</span></div>
    <div class="gauge" role="img" aria-label="ชื่อเสียง ${r.toFixed(1)}"><i style="width:${Math.round(100*Math.min(1,(r-lo)/(hi-lo)))}%"></i></div><div class="repg-f"><small class="num">${lo}</small><small class="num">${nx?hi:""}</small></div></div>
   <p class="meta">ได้จากชนะไฟต์ กิจกรรมค่าย และจัดศึกที่ค่าย · ยิ่งสูง นักเรียนและค่าตัวไฟต์ยิ่งมาก${r>55?" · เกิน 55 จะค่อย ๆ ลดเอง ต้องชนะต่อเนื่อง":""}</p>
   <div class="replist">${S.map(([n,t])=>`<div class="${r>=n?"on":""}"><b>${r>=n?"✓":n}</b><span>${t}</span></div>`).join("")}</div>`;}
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
  mdecl:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m)return;m.done=true;m.declined=true;if(m.q==="gang"&&G.gang)G.gang.next=G.week+(G.loan>0?2:4);save();render();},
  macc:d=>{UI.modal={type:"qpick",id:d.v};render();},
  qsend:d=>{const m=G.mail.find(x=>x.id===d.v);if(!m||m.done)return;m.done=true;UI.modal=null;
    const spec=m.q==="belt"?{q:"belt",npc:m.npc,pay:m.pay,from:m.from,div:m.div,defend:m.defend,rounds:5}:m.q==="challenge"?{q:"challenge",npc:m.npc,pay:m.pay,from:m.from}:{q:m.q,qk:m.qk,pay:m.pay,from:m.from,rounds:m.qk==="gang5"?4:3};
    const intro=m.q==="gang"?[{n:"nar",t:"ตลาดเช้า… มอเตอร์ไซค์สิบกว่าคันจอดเรียงหน้าแผงผัก"},{n:"npc",who:QK[m.qk].name,t:m.early?"ลูกน้องฉันแพ้เธอซ้ำแล้วซ้ำเล่า เสียชื่อหมด! แถมค่ายเธอยังติดหนี้ฉันอยู่ วันนี้ฉันจัดการเอง!":m.qk==="gang5"?"ได้ยินว่ามีค่ายมวยมาเกะกะธุรกิจฉัน วันนี้หัวหน้าใหญ่ลงมาเอง!":"ไหนใครที่ไล่ลูกน้องฉัน ออกมาเลย!"},{n:d.id,f:"angry",l:"fight",t:"ฉันเอง!"}]
      :m.q==="belt"?[{n:"nar",t:"เวทีมวยท่าแพ ไฟสปอตไลต์ส่องลงกลางเวที โฆษกประกาศชื่อทั้งสองมุม"},{n:"npc",who:G.F[m.npc].name,t:m.defend?"เข็มขัดเส้นนั้นควรเป็นของฉัน วันนี้ฉันมาเอาคืน":"อยากได้เข็มขัดเหรอ? ต้องข้ามศพฉันไปก่อน"},{n:d.id,f:"angry",l:"fight",t:m.defend?"มาเอาให้ได้สิ!":"หนูมาเพื่อสิ่งนั้นแหละ!"}]
      :m.q==="challenge"?[{n:"nar",t:"ลานหลังตลาดสด คนมามุงเต็มสองฝั่ง มีคนตั้งโต๊ะรับพนันน้ำแดง"},{n:"npc",who:G.F[m.npc].name,t:"มาจนได้นะ นึกว่าจะหนีตลอดฤดูกาล"},{n:d.id,f:"angry",l:"fight",t:"ไม่ได้หนี แค่ยังไม่ว่าง ตอนนี้ว่างแล้ว!"}]
      :m.q==="cow"?[{n:"nar",t:"กลางถนนหน้าตลาด วัวนมตัวใหญ่ยืนตั้งการ์ด ขาหน้าเต้นฟุตเวิร์กแบบที่ไม่มีวัวตัวไหนควรทำได้"},{n:"npc",who:"ลุงเฉลิม",t:"นั่นแหละ! ระวังถีบนะหนู มันดูไฟต์ย้อนหลังทุกคืน!"},{n:d.id,f:"surprised",l:"fight",t:"…วัวตั้งการ์ดได้จริง ๆ ด้วย!?"}]
      :[{n:"nar",t:"ไก่แจ้ตัวเล็กยืนบนกระสอบทราย อกพองโต ขนคอตั้งชัน"},{n:"npc",who:"เสี่ยต๋อง",t:"อย่าดูถูกมันนะครับ มันเคยไล่สุนัขพันธุ์ใหญ่ทั้งซอยมาแล้ว"},{n:d.id,f:"happy",l:"fight",t:"มาเลยเจ้าไก่! หนูไม่ใช่สุนัขนะ!"}];
    playScene(intro,()=>startQuest(spec,d.id,()=>{}),{bg:m.q==="gang"?"market":m.q==="belt"?"district":m.q==="challenge"?"food":m.q==="rooster"?"rooster":m.q==="cow"||m.q==="bull"?"farm":"fair",look:"fight"});},
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
  el.innerHTML=`<b class="nlab">ข่าวมวย</b><div class="ntrack"><span class="ncr"></span></div><button class="nclose" aria-label="ปิดข่าว">×</button>`;document.body.appendChild(el);NEWS.el=el;document.body.classList.add("hasnews");
  el.querySelector(".nclose").onclick=()=>{UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;document.body.classList.remove("hasnews");},300);};
  const show=()=>{if(!el.isConnected)return;if(NEWS.i>=NEWS.q.length){UI.newsWeek=G.week;el.classList.add("out");setTimeout(()=>{el.remove();if(NEWS.el===el)NEWS.el=null;document.body.classList.remove("hasnews");},400);return;}
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

// =====================================================================================
// v1.36 DEATH MATCH — a special 8-fighter knockout offer every ~10 weeks, all divisions mixed,
// fought back to back the same week. The player runs every one of the camp's fights.
// =====================================================================================
const DM_WEEKS=[12,24,36,46];
const DM_PRIZE=[0,3000,8000,18000,40000];   // by how far our best fighter got: out in QF / SF / final / champion
const DM_STAGE=["รอบ 8 คน","รอบรองชนะเลิศ","รอบชิงชนะเลิศ"];
const dmOfferOn=G=>DM_WEEKS.includes(G.week)&&!(G.dmSeen||{})[G.week]&&!G.ended;
const dmMine=id=>G.F[id]&&G.F[id].camp==="player";
const dmCanEnter=f=>!f.injury;
function dmBuild(G,mine){const pool=Object.values(G.F).filter(f=>!mine.includes(f.id)&&f.camp!=="player"&&f.camp!=="quest"&&f.camp!=="free"&&!f.injury&&f.div!=="X");
  const avg=mine.reduce((s,id)=>s+ovr(G.F[id].a),0)/mine.length;
  const stars=["ploy","fah"].filter(id=>pool.some(f=>f.id===id));
  const rest=pool.filter(f=>!stars.includes(f.id)).map(f=>[f,Math.abs(ovr(f.a)-(avg+.4))]).sort((a,b)=>a[1]-b[1]).map(x=>x[0].id);
  const others=[...stars,...rest].slice(0,8-mine.length);
  const slots=Array(8).fill(null);[0,4,2,6].slice(0,mine.length).forEach((p,i)=>slots[p]=mine[i]);
  const order=[7,3,5,1,6,2,4,0].filter(p=>!slots[p]);others.forEach((id,i)=>slots[order[i]]=id);
  return {wk:G.week,slots,w:[[],[],[]],r:0,mine:[...mine],out:{},done:false};}
const dmList=D=>D.r===0?D.slots:D.w[D.r-1];
function dmWinFrom(F){const r=F.result;if(r.win==="A"||r.win==="B")return r.win;const s=F.cards.reduce((x,c)=>x+c[0]-c[1],0);return s>0?"A":s<0?"B":(F.A.landed>=F.B.landed?"A":"B");}
// play every match until it is one of ours, then stop and let the player fight it
function dmAdvance(){const D=G.dm;if(!D||D.done)return;
  while(D.r<3){const L=dmList(D);const m=D.w[D.r].length;if(m*2>=L.length){D.r++;if(D.r<3)for(const id of D.w[D.r-1])if(dmMine(id))G.F[id].fatigue=Math.max(0,G.F[id].fatigue-6);continue;}
    const a=L[m*2],b=L[m*2+1];
    if(dmMine(a)||dmMine(b)){save();return;}
    const F=quickFight(G.F[a],G.F[b],(G.seed^(G.week*313))+D.r*17+m,3);D.w[D.r].push(dmWinFrom(F)==="A"?a:b);}
  D.done=true;dmFinish();}
function dmNextMatch(){const D=G.dm;if(!D||D.done||D.r>=3)return null;const L=dmList(D),m=D.w[D.r].length;return [L[m*2],L[m*2+1]];}
function dmFight(meId,opId){const D=G.dm;const b={id:"dm"+G.week+"_"+D.r+"_"+meId,a:meId,b:opId,week:G.week,tier:"dm",rounds:3,win:0,lose:0,dm:1,bg:"bg_hall.webp"};
  UI.modal=null;openFight(b,()=>{const w=b.result;const winner=w==="A"?meId:opId,loser=w==="A"?opId:meId;D.w[D.r].push(winner);if(dmMine(loser))D.out[loser]=D.r+1;
    dmAdvance();UI.modal={type:"dm"};save();render();});}
function dmFinish(){const D=G.dm;const champ=D.w[2][0];D.champ=champ;
  let best=0;for(const id of D.mine){const lv=id===champ?4:(D.out[id]||1);best=Math.max(best,lv);}D.best=best;
  const prize=DM_PRIZE[best]||0;G.cash+=prize;G.wkFight=(G.wkFight||0)+prize;D.prize=prize;
  if(best===4){G.rep+=4;roster(G).forEach(f=>f.morale=Math.min(100,f.morale+10));}else if(best===3)G.rep+=1.5;
  G.dmLog=(G.dmLog||[]).concat([{wk:D.wk,champ,best,prize}]);save();}
function dmBracketHTML(){const D=G.dm;if(!D)return "";const nm=id=>id&&G.F[id]?esc(G.F[id].name):"…";
  const cell=(id,r)=>{if(!id)return `<div class="dmc tbd">…</div>`;const won=(D.w[r]||[]).includes(id),lost=r<3&&D.w[r]&&D.w[r].length*2>((r===0?D.slots:D.w[r-1]).indexOf(id))&&!won;
    return `<div class="dmc ${dmMine(id)?"mine":""} ${won?"won":""} ${lost?"lost":""}">${G.F[id].canon?`<img src="${faceSrc(id,"happy")}" alt="">`:""}<b>${nm(id)}</b><small>${G.F[id].div==="A"?"รุ่น A":"รุ่น B"}</small></div>`;};
  const col=(L,r,title)=>`<div class="dmcol"><h4>${title}</h4>${Array.from({length:L.length/2},(_,i)=>`<div class="dmm">${cell(L[i*2],r)}${cell(L[i*2+1],r)}</div>`).join("")}</div>`;
  const pad=(L,n)=>[...L,...Array(n-L.length).fill(null)];
  const nx=dmNextMatch();let foot="";
  if(D.done){const lab=["","ตกรอบ 8 คน","ตกรอบรองฯ","ได้รองแชมป์","แชมป์!"][D.best];
    foot=`<div class="dmend ${D.best===4?"champ":""}"><b>${D.best===4?`🏆 ${nm(D.champ)} คว้าแชมป์ Death Match!`:`แชมป์คือ ${nm(D.champ)} · ค่ายเรา${lab}`}</b><span>เงินรางวัล ${fmt(D.prize||0)}${D.best===4?" · ชื่อเสียง +4 · กำลังใจทั้งค่าย +10":D.best===3?" · ชื่อเสียง +1.5":""}</span></div><button class="btn primary big" data-act="dmclose">กลับค่าย</button>`;}
  else if(nx){const [a,b]=nx;const both=dmMine(a)&&dmMine(b);
    foot=both?`<p class="meta center">นักมวยค่ายเราเจอกันเอง! เลือกว่าจะคุมใคร อีกคนครูแดงจะคุมให้</p><div class="row2"><button class="btn gold" data-act="dmgo" data-id="${a}" data-v="${b}">คุม${nm(a)}</button><button class="btn gold" data-act="dmgo" data-id="${b}" data-v="${a}">คุม${nm(b)}</button></div>`
      :`<button class="btn primary big" data-act="dmgo" data-id="${dmMine(a)?a:b}" data-v="${dmMine(a)?b:a}">ขึ้นชก! ${nm(dmMine(a)?a:b)} vs ${nm(dmMine(a)?b:a)} ▸</button><p class="meta center">${DM_STAGE[D.r]} · แรงที่เสียไปจะติดตัวไปรอบถัดไป</p>`;}
  return `<h2>ศึก Death Match</h2><p class="meta">8 คน ข้ามรุ่น แพ้คัดออก · ไม่นับอันดับ · ชกรวดเดียวจบในสัปดาห์นี้</p>
   <div class="dmb">${col(D.slots,0,"8 คน")}${col(pad(D.w[0],4),1,"รองฯ")}${col(pad(D.w[1],2),2,"ชิง")}<div class="dmcol"><h4>แชมป์</h4><div class="dmm">${D.w[2][0]?cell(D.w[2][0],3):'<div class="dmc tbd">?</div>'}</div></div></div>${foot}`;}
function dmPickHTML(){const R=roster(G);const sel=UI.dmSel||[];
  return `<h2>ศึก Death Match</h2><p class="meta">โปรโมเตอร์รวมนักมวยเก่ง ๆ ทุกรุ่น 8 คน ชกแพ้คัดออกจบในวันเดียว ค่าย${"ศิริชัย"}จะส่งใครลงบ้าง? (สูงสุด 3 คน)</p>
   <div class="dmprize"><span>ตกรอบแรก ${fmt(DM_PRIZE[1])}</span><span>ตกรองฯ ${fmt(DM_PRIZE[2])}</span><span>รองแชมป์ ${fmt(DM_PRIZE[3])}</span><b>แชมป์ ${fmt(DM_PRIZE[4])}</b></div>
   <div class="list">${R.map(f=>`<button class="dmpick ${sel.includes(f.id)?"on":""}" data-act="dmsel" data-id="${f.id}" ${dmCanEnter(f)?"":"disabled"}>${faceImg(f,"sm")}<span><b>${esc(f.name)} Lv.${f.lvl}</b><small>${f.injury?"บาดเจ็บ":`ล้า ${Math.round(f.fatigue)} · กำลังใจ ${Math.round(f.morale)}`}</small></span><i>${sel.includes(f.id)?"✓":""}</i></button>`).join("")}</div>
   <div class="row2"><button class="btn" data-act="dmno">ไม่ร่วม</button><button class="btn primary" data-act="dmstart" ${sel.length?"":"disabled"}>ลงแข่ง ${sel.length} คน ▸</button></div>`;}
function dmCardHTML(){if(G.dm&&!G.dm.done&&G.dm.wk===G.week)return `<section class="px card dmcard"><div><b>ศึก Death Match กำลังดำเนินอยู่</b><span class="meta">${DM_STAGE[Math.min(2,G.dm.r)]}</span></div><button class="btn primary" data-act="dmopen">ไปต่อ ▸</button></section>`;
  if(!dmOfferOn(G))return "";return `<section class="px card dmcard"><span class="ribbon">ข้อเสนอพิเศษ</span><div><b>ศึก Death Match 8 คน ข้ามรุ่น</b><span class="meta">ชกรวดเดียวจบในสัปดาห์นี้ · ไม่นับอันดับ · แชมป์ ${fmt(DM_PRIZE[4])}</span></div><button class="btn gold" data-act="dmpick">ดูรายละเอียด</button></section>`;}
Object.assign(ACT,{
  dmpick:()=>{UI.dmSel=roster(G).filter(dmCanEnter).slice(0,1).map(f=>f.id);UI.modal={type:"dmpick"};render();},
  dmsel:d=>{const s=UI.dmSel||[];UI.dmSel=s.includes(d.id)?s.filter(x=>x!==d.id):s.length<3?[...s,d.id]:s;render();},
  dmno:()=>{G.dmSeen=G.dmSeen||{};G.dmSeen[G.week]=1;UI.modal=null;save();render();},
  dmstart:()=>{const sel=(UI.dmSel||[]).filter(id=>dmMine(id)&&dmCanEnter(G.F[id]));if(!sel.length)return;G.dmSeen=G.dmSeen||{};G.dmSeen[G.week]=1;
    G.dm=dmBuild(G,sel);UI.modal=null;save();
    playScene([{n:"npc",who:"โฆษกสนาม",t:vary("dm1",["ท่านผู้ชมครับ! คืนนี้ไม่มีพรุ่งนี้! แปดนักชกจากทุกรุ่น ชกจนเหลือคนสุดท้าย! ศึก Death Match!!","กลับมาอีกครั้งครับ! ศึกที่ไม่มีคำว่าพัก! แปดคนเข้า หนึ่งคนออก! Death Match!!","ใครเหนื่อยกลับบ้านไปได้เลยครับ! คืนนี้ชกรวดเดียวจนได้แชมป์! Death Match!!","คนดูแน่นจนเต็นท์จะพัง! แปดยอดมวยหญิงทุกรุ่น ศึก Death Match มาแล้วครับ!!"])},
      {n:"coach",t:G=>`${ME(G)} ฟังนะ ชนะแล้วต้องชกต่อเลย แรงที่เสียไปไม่กลับมาทันหรอก ยกแรก ๆ อย่าเปลืองแรง`},
      {n:sel[0],f:"angry",l:"fight",t:"ทุกคนเก่งหมดเลย… แต่ค่ายเรามาเพื่อชนะค่ะ!"}],()=>{dmAdvance();UI.modal={type:"dm"};render();},{bg:"hall",look:"fight"});},
  dmopen:()=>{UI.modal={type:"dm"};render();},
  dmgo:d=>dmFight(d.id,d.v),
  dmclose:()=>{const D=G.dm;UI.modal=null;if(D&&D.best===4)playScene([{n:"nar",t:"กระดาษสีทองโปรยลงมาทั่วเวที เสียงคนดูดังจนพื้นสั่น"},{n:D.champ,f:"happy",l:"fight",t:G=>`${ME(G)}!! เราทำได้! ชนะรวดทุกคนเลย!`},{n:"coach",t:"ปู่ชัยเคยบอกว่าค่ายเราไม่มีวันได้แชมป์ Death Match …ปู่ผิดแล้วล่ะ"}],()=>render(),{bg:"hall",look:"fight"});else render();},
});

// ===== v1.64: MINIGAME — kick the heavy bag to the khong khaek drum (rhythm, taiko-style) =====
// self-contained overlay: its own DOM + animation loop, so the main render() never touches it mid-song
const BAG_DIFF={easy:{name:"ง่าย",bpm:92,bars:8,dens:0,mul:1},normal:{name:"ปกติ",bpm:108,bars:10,dens:1,mul:1.25},hard:{name:"ยาก",bpm:124,bars:12,dens:2,mul:1.6}};
const BAG_PAT=[["L...L...","L...R...","R...R...","L.L.R...","L...R.R.","R...L..."],["L.R.L.R.","LLR.L...","L.RRL...","R.L.R.L.","L.L.RR.."],["LRLRL.R.","L.LRR.L.","RRL.RRL.","LLRRL.R.","LRRLLRR."]];
const BAG_WIN={perfect:.06,great:.12,ok:.19};
function bagChart(G,dk,salt=0){const D=BAG_DIFF[dk],beat=60/D.bpm,half=beat/2,N=[];let t=4*beat;/* one bar of count-in */
  for(let b=0;b<D.bars;b++){const pool=[].concat(...BAG_PAT.slice(0,D.dens+1));const p=b===D.bars-1?"L.......":pool[Math.floor(srand(G,700+salt+b*13+D.dens*101+G.week)*pool.length)];
    for(let i=0;i<8;i++){if(p[i]!==".")N.push({t:t+i*half,k:p[i],j:null});}t+=4*beat;}
  return {notes:N,end:t+beat,beat};}
const MG_MODES={
 bag:{icon:"🥁",title:"เตะกระสอบตามกลองแขก",L:"ตุ๊บ",R:"ติ๊ง",Ls:"เตะ",Rs:"หมัด",note:"ฝึกจังหวะเตะ/หมัด · ได้ค่าพลัง กำลังใจ เศษดาว",open:G=>G.week>=2},
 somtam:{icon:"🥗",title:"ตำส้มตำร้านป้าแต๋ว",L:"ตำ",R:"คลุก",Ls:"สาก",Rs:"ช้อน",note:"ช่วยร้านป้าแต๋วตอนลูกค้าแน่น · ได้ค่าจ้าง ชื่อเสียงนิดหน่อย",open:G=>G.week>=4}};
function mgPlayed(G,m){const k=m||"bag";return !!(G.mini&&G.mini[k+"Wk"]===G.week&&G.mini[k+"S"]===(G.season||1));}
function bagPlayed(G){return mgPlayed(G,"bag");}
function mgChipText(G){return Object.entries(MG_MODES).filter(([k,M])=>M.open(G)).map(([k,M])=>M.icon+(mgPlayed(G,k)?"✓":"")).join(" ");}
function bagFighters(G){return roster(G).filter(f=>f.camp==="player"&&!f.injury);}
const BAG={st:null,
  clock(){return AU.ctx?AU.ctx.currentTime:performance.now()/1000;},
  drum(k,t){if(!AU.ctx||AU.muted)return;try{if(k==="L"){AU.tone(t,{f:150,to:55,type:"sine",dur:.28,peak:.9,bus:AU.sfxBus});AU.noiseHit(t,{f:420,dur:.08,peak:.5});}
    else{AU.noiseHit(t,{f:2600,type:"bandpass",q:2.2,dur:.07,peak:.7});AU.tone(t,{f:340,to:300,type:"triangle",dur:.09,peak:.35,bus:AU.sfxBus});}}catch(e){}},
  wood(k,t){if(!AU.ctx||AU.muted)return;try{if(k==="L"){AU.noiseHit(t,{f:700,dur:.06,peak:.8});AU.tone(t,{f:240,to:120,type:"triangle",dur:.12,peak:.6,bus:AU.sfxBus});}
    else{AU.noiseHit(t,{f:5200,type:"highpass",q:.7,dur:.09,peak:.35,sweep:.6});}}catch(e){}},
  ching(t,open){if(!AU.ctx||AU.muted)return;try{AU.tone(t,{f:open?2350:2100,type:"sine",dur:open?.5:.08,peak:open?.16:.12,bus:AU.sfxBus});AU.tone(t,{f:open?3130:2900,type:"sine",dur:open?.35:.06,peak:.07,bus:AU.sfxBus});}catch(e){}},
  open(){const F=bagFighters(G);if(!F.length){toast("ไม่มีนักมวยที่พร้อมซ้อม");return;}
    const pick=(G.mini&&G.mini.bagLast&&F.find(f=>f.id===G.mini.bagLast))||F.slice().sort((a,b)=>(b.bond||0)-(a.bond||0))[0];
    this.st={phase:"hub",mode:"bag",id:pick.id,dk:(G.mini&&G.mini.bagDk)||"normal",practice:false};this.mount();this.draw();},
  mount(){let el=document.getElementById("minibag");if(!el){el=document.createElement("div");el.id="minibag";el.className="mgame";document.body.appendChild(el);}
    el.onclick=e=>{const b=e.target.closest("[data-mb]");if(!b)return;const a=b.dataset.mb,v=b.dataset.v;
      if(a==="mode"){this.st.mode=v;this.st.phase="pick";this.st.practice=mgPlayed(G,v);this.draw();}else if(a==="hub"){this.st.phase="hub";this.draw();}else if(a==="pick"){this.st.id=v;this.draw();}else if(a==="dk"){this.st.dk=v;this.draw();}else if(a==="go")this.start();else if(a==="close")this.close();else if(a==="claim")this.claim();else if(a==="again"){this.st.phase="pick";this.st.practice=mgPlayed(G,this.st.mode);this.draw();}};
    if(!this.keyH){this.keyH=e=>{if(!this.st||this.st.phase!=="play")return;const k=e.key.toLowerCase();if(e.repeat)return;
      if(k==="f"||k==="d"||k==="arrowleft"){e.preventDefault();this.hit("L");}else if(k==="j"||k==="k"||k==="arrowright"){e.preventDefault();this.hit("R");}else if(k==="escape")this.close();};
      document.addEventListener("keydown",this.keyH);
      document.addEventListener("visibilitychange",()=>{if(document.hidden&&this.st&&this.st.phase==="play"){this.st.phase="abort";cancelAnimationFrame(this.raf);this.draw();}});}},
  close(){cancelAnimationFrame(this.raf);const el=document.getElementById("minibag");if(el)el.remove();this.st=null;try{AU.startMusic("hub");}catch(e){}if((G.cardPend||[]).length&&!UI.modal)UI.modal={type:"cardnew"};render();},
  draw(){const S=this.st,el=document.getElementById("minibag");if(!S||!el)return;const F=bagFighters(G),f=G.F[S.id];
    const M=MG_MODES[S.mode];
    if(S.phase==="hub"){el.innerHTML=`<div class="mbox px"><h2>🎮 มินิเกม</h2><p class="meta center">แต่ละเกมได้รางวัลสัปดาห์ละครั้ง · เล่นซ้ำเป็นโหมดซ้อมได้ไม่จำกัด</p>
       <div class="mghub">${Object.entries(MG_MODES).map(([k,X])=>{const op=X.open(G),pl=mgPlayed(G,k);return `<button class="mgitem ${pl?"done":""}" data-mb="mode" data-v="${k}" ${op?"":"disabled"}><span class="mi">${X.icon}</span><span><b>${X.title}</b><small>${op?(pl?"รับรางวัลแล้วสัปดาห์นี้ ✓":X.note):"ยังไม่เปิด"}</small></span><span class="chev">▸</span></button>`;}).join("")}</div>
       <div class="mfoot roadbtns"><button class="btn" data-mb="close">กลับค่าย</button></div></div>`;return;}
    if(S.phase==="pick"){const best=((G.mini&&G.mini.best)||{})[S.mode]||{};
      el.innerHTML=`<div class="mbox px"><h2>${M.icon} ${M.title}</h2>
       <p class="meta">กดตามโน้ตตอนที่ลอยมาถึงวงกลม · <b class="mbL">${M.L}</b> = ${M.Ls} (ปุ่มซ้าย / F) · <b class="mbR">${M.R}</b> = ${M.Rs} (ปุ่มขวา / J)</p>
       <div class="mbpick">${F.map(x=>`<button class="mbf ${x.id===S.id?"on":""}" data-mb="pick" data-v="${x.id}"><img src="${faceSrc(x.id,"happy")}" alt=""><small>${esc(x.name)}</small></button>`).join("")}</div>
       <div class="mbdk">${Object.entries(BAG_DIFF).map(([k,d])=>`<button class="btn sm ${k===S.dk?"primary":""}" data-mb="dk" data-v="${k}">${d.name}${best[k]?` · ${best[k]}`:""}</button>`).join("")}</div>
       <p class="meta center">${S.practice?"สัปดาห์นี้เล่นไปแล้ว · รอบนี้เป็นโหมดซ้อม ไม่มีรางวัล":S.mode==="bag"?"รางวัลสัปดาห์ละครั้ง: ค่าเตะ/หมัด · กำลังใจ · เศษดาว ✦ · เกรด S ปลดการ์ด":"รางวัลสัปดาห์ละครั้ง: ค่าจ้างจากป้าแต๋ว · ชื่อเสียง · เศษดาว ✦ · เกรด S ปลดการ์ด"}</p>
       <div class="mfoot roadbtns"><button class="btn" data-mb="hub">◂ กลับ</button><button class="btn primary" data-mb="go">เริ่ม! ▸</button></div></div>`;return;}
    if(S.phase==="play"){el.innerHTML=`<div class="mplay"><div class="mhud"><b>${esc(f.name)}</b><span>คอมโบ <b id="mbc">0</b></span><span>คะแนน <b id="mbs">0</b></span><button class="xbtn" data-mb="close" aria-label="ออก">✕</button></div>
       <canvas id="mbcv" width="360" height="300"></canvas>
       <div class="mbtns"><button class="mbtn L ${S.mode}" id="mbL"><b>${M.L}</b><small>${M.Ls} · F</small></button><button class="mbtn R ${S.mode}" id="mbR"><b>${M.R}</b><small>${M.Rs} · J</small></button></div></div>`;
      const pd=k=>e=>{e.preventDefault();this.hit(k);};document.getElementById("mbL").addEventListener("pointerdown",pd("L"));document.getElementById("mbR").addEventListener("pointerdown",pd("R"));return;}
    if(S.phase==="abort"){el.innerHTML=`<div class="mbox px"><h2>หยุดกลางคัน</h2><p class="meta center">สลับแอปหรือปิดหน้าจอระหว่างเล่น เพลงเลยหยุด · ยังไม่เสียสิทธิ์รางวัลสัปดาห์นี้</p><div class="mfoot roadbtns"><button class="btn" data-mb="close">ปิด</button><button class="btn primary" data-mb="again">เล่นใหม่</button></div></div>`;return;}
    if(S.phase==="result"){const R=S.res;
      el.innerHTML=`<div class="mbox px"><h2>ผลการซ้อม</h2><div class="mgrade g${R.grade}">${R.grade}</div>
       <p class="center"><b>${R.score}</b> คะแนน · คอมโบสูงสุด ${R.maxc} · แม่นยำ ${Math.round(R.acc*100)}%</p>
       <p class="center meta">เพอร์เฟกต์ ${R.c.perfect} · ดี ${R.c.great} · พอได้ ${R.c.ok} · พลาด ${R.c.miss}${R.best?" · <b class=\"goldt\">สถิติใหม่!</b>":""}</p>
       ${S.practice?`<p class="center meta">โหมดซ้อม · ไม่มีรางวัล</p>`:`<p class="center">${R.rw}</p>`}
       <div class="mfoot roadbtns"><button class="btn" data-mb="hub">มินิเกมอื่น</button><button class="btn" data-mb="again">เล่นอีกรอบ</button><button class="btn primary" data-mb="close">กลับค่าย</button></div></div>`;}},
  start(){const S=this.st;AU.resume&&AU.resume();try{AU.stopMusic();}catch(e){}
    G.mini=G.mini||{};G.mini.bagLast=S.id;G.mini.bagDk=S.dk;
    const C=bagChart(G,S.dk,S.mode==="somtam"?5000:0);S.notes=C.notes;S.end=C.end;S.beat=C.beat;S.phase="play";S.score=0;S.combo=0;S.maxc=0;S.c={perfect:0,great:0,ok:0,miss:0};S.fx=[];S.hitT=-9;S.hitK="L";
    this.draw();S.t0=this.clock()+.6;const nb=Math.round(S.end/S.beat);for(let i=0;i<nb;i++)this.ching(S.t0+i*S.beat,i%2===0);
    const cv=document.getElementById("mbcv");S.x=cv.getContext("2d");S.x.imageSmoothingEnabled=false;const loop=()=>{if(!this.st||this.st.phase!=="play")return;this.frame();this.raf=requestAnimationFrame(loop);};this.raf=requestAnimationFrame(loop);},
  now(){return this.clock()-this.st.t0;},
  judge(n,q){const S=this.st;n.j=q;S.c[q]++;if(q==="miss"){S.combo=0;}else{S.combo++;S.maxc=Math.max(S.maxc,S.combo);S.score+=({perfect:100,great:70,ok:40})[q]+Math.min(50,S.combo*2);}
    S.fx.push({q,t:this.now()});const c=document.getElementById("mbc"),s=document.getElementById("mbs");if(c)c.textContent=S.combo;if(s)s.textContent=S.score;},
  hit(k){const S=this.st;if(!S||S.phase!=="play")return;const t=this.now();if(S.mode==="somtam")this.wood(k,this.clock());else this.drum(k,this.clock());S.hitT=t;S.hitK=k;
    const btn=document.getElementById(k==="L"?"mbL":"mbR");if(btn){btn.classList.remove("hit");void btn.offsetWidth;btn.classList.add("hit");}
    let best=null,bd=9;for(const n of S.notes){if(n.j)continue;const d=Math.abs(n.t-t);if(d<bd){bd=d;best=n;}if(n.t-t>BAG_WIN.ok)break;}
    if(!best||bd>BAG_WIN.ok)return;/* stray tap: no penalty */
    if(best.k!==k){this.judge(best,"miss");return;}
    this.judge(best,bd<=BAG_WIN.perfect?"perfect":bd<=BAG_WIN.great?"great":"ok");},
  frame(){const S=this.st,x=S.x,W=360,H=300,t=this.now(),f=G.F[S.id];
    for(const n of S.notes){if(!n.j&&t-n.t>BAG_WIN.ok)this.judge(n,"miss");}
    if(t>S.end+.4){this.finish();return;}
    x.clearRect(0,0,W,H);x.fillStyle="#1b1530";x.fillRect(0,0,W,H);
    // fighter + heavy bag (same drawing as the training drill)
    const dt=(t-S.hitT)*1000,hit=dt>=0&&dt<450;const row=hit?(S.mode==="somtam"?"punch":S.hitK==="L"?"knee":"punch"):(S.mode==="somtam"?"idle":"guard");const fr=hit?Math.min(3,Math.floor(dt/90)):Math.floor(performance.now()/260)%4;
    x.fillStyle="rgba(0,0,0,.35)";x.beginPath();x.ellipse(W*.4,196,40,6,0,0,7);x.fill();
    if(S.mode==="somtam"){/* stall table, clay mortar, wooden pestle */const mx=W*.62;x.fillStyle="#6b4a2b";x.fillRect(W*.42,150,W*.5,10);x.fillStyle="#4a3220";x.fillRect(W*.45,160,6,40);x.fillRect(W*.86,160,6,40);
      x.fillStyle="#2a1a10";x.fillRect(mx-30,112,60,40);x.fillStyle="#b5653a";x.fillRect(mx-28,114,56,36);x.fillStyle="#d07a48";x.fillRect(mx-28,114,10,36);x.fillStyle="#7a3d20";x.fillRect(mx-24,114,48,6);
      x.fillStyle="#9fd36a";for(let i=0;i<5;i++)x.fillRect(mx-20+i*9,108+(i%2)*2,6,6);x.fillStyle="#e84a3a";x.fillRect(mx-8,106,4,4);x.fillRect(mx+10,107,4,4);
      const py=hit&&S.hitK==="L"?Math.min(1,dt/70)*26*Math.max(0,1-(dt-70)/300):0,pr=hit&&S.hitK==="R"?Math.sin(dt/40)*8*Math.max(0,1-dt/400):0;
      x.fillStyle="#2a1a10";x.fillRect(mx-6+pr,56+py,12,58);x.fillStyle="#c89a62";x.fillRect(mx-4+pr,58+py,8,54);x.fillStyle="#e0b67e";x.fillRect(mx-4+pr,58+py,3,54);
      x.fillStyle="#fff";x.font='bold 12px sans-serif';x.textAlign="center";x.fillText("ร้านป้าแต๋ว",mx,176);}
    else{const sw=hit?Math.sin(dt/80)*Math.max(0,1-dt/450)*9:Math.sin(performance.now()/700)*1.2,bx=W*.6+sw,by=34;
    x.fillStyle="#555";x.fillRect(W*.6-1,0,2,by);x.fillStyle="#2b2530";x.fillRect(bx-19,by-2,38,124);x.fillStyle="#c8283c";x.fillRect(bx-17,by,34,120);x.fillStyle="#e23b4e";x.fillRect(bx-17,by,7,120);
    x.fillStyle="#1f1f24";x.fillRect(bx-17,by+20,34,4);x.fillRect(bx-17,by+92,34,4);}
    try{drawFrame(x,sheetFor(f),ROW[row],fr,W*.38,198,180,false);}catch(e){}
    // judgement pop
    const last=S.fx[S.fx.length-1];if(last&&t-last.t<.5){const a=(t-last.t)/.5;x.globalAlpha=1-a;x.font=`bold ${22+a*6}px "Pixelify Sans",sans-serif`;x.textAlign="center";x.lineWidth=4;x.strokeStyle="#000";
      const T={perfect:["PERFECT!","#ffd34a"],great:["GREAT","#8ef0a0"],ok:["OK","#fff"],miss:["MISS","#ff6a6a"]}[last.q];x.strokeText(T[0],W*.6,26-a*10);x.fillStyle=T[1];x.fillText(T[0],W*.6,26-a*10);x.globalAlpha=1;}
    // note lane (taiko style: notes slide in from the right to the drum circle)
    const ly=252,hx=46,sp=210;x.fillStyle="#120e22";x.fillRect(0,ly-30,W,60);x.fillStyle="#2c2448";x.fillRect(0,ly-30,W,3);x.fillRect(0,ly+27,W,3);
    const bt=S.beat;for(let b=Math.ceil((t-.5)/bt)*bt;b<t+1.8;b+=bt){const bx2=hx+(b-t)*sp;if(bx2>0&&bx2<W){x.fillStyle="rgba(255,255,255,.08)";x.fillRect(bx2,ly-26,2,52);}}
    x.lineWidth=3;x.strokeStyle="#ffd34a";x.beginPath();x.arc(hx,ly,22,0,7);x.stroke();x.strokeStyle="rgba(255,211,74,.35)";x.beginPath();x.arc(hx,ly,15,0,7);x.stroke();
    for(let i=S.notes.length-1;i>=0;i--){const n=S.notes[i];if(n.j&&n.j!=="miss")continue;const nx=hx+(n.t-t)*sp;if(nx<-30||nx>W+30)continue;
      const L=n.k==="L",r=L?18:14;x.globalAlpha=n.j==="miss"?.35:1;x.fillStyle="#000";x.beginPath();x.arc(nx,ly,r+3,0,7);x.fill();x.fillStyle=L?"#e2443c":"#3c8be2";x.beginPath();x.arc(nx,ly,r,0,7);x.fill();
      x.fillStyle="rgba(255,255,255,.35)";x.beginPath();x.arc(nx-r*.3,ly-r*.35,r*.35,0,7);x.fill();x.fillStyle="#fff";x.font=`bold ${L?13:11}px sans-serif`;x.textAlign="center";x.fillText(L?MG_MODES[S.mode].L:MG_MODES[S.mode].R,nx,ly+4);x.globalAlpha=1;}
    // count-in
    if(t<4*bt){const n=4-Math.floor(Math.max(0,t)/bt);x.font='bold 40px "Pixelify Sans",sans-serif';x.textAlign="center";x.fillStyle="#fff";x.strokeStyle="#000";x.lineWidth=5;const s=t<0?"พร้อม":String(n);x.strokeText(s,W/2,120);x.fillText(s,W/2,120);}
    // progress
    x.fillStyle="#2c2448";x.fillRect(0,H-4,W,4);x.fillStyle="#ffd34a";x.fillRect(0,H-4,W*Math.min(1,Math.max(0,t/S.end)),4);},
  finish(){const S=this.st;cancelAnimationFrame(this.raf);S.phase="result";const n=S.notes.length,c=S.c;
    const acc=(c.perfect+c.great*.75+c.ok*.4)/Math.max(1,n);const grade=acc>=.92&&c.miss===0?"S":acc>=.78?"A":acc>=.6?"B":"C";
    G.mini=G.mini||{};G.mini.best=G.mini.best||{};if(typeof G.mini.best.easy==="number"){G.mini.best={bag:G.mini.best};}const B=G.mini.best[S.mode]=G.mini.best[S.mode]||{};const isBest=S.score>(B[S.dk]||0);if(isBest)B[S.dk]=S.score;
    S.res={acc,grade,score:S.score,maxc:S.maxc,c,best:isBest,rw:""};
    if(!S.practice)S.res.rw=this.reward(grade,acc);save();this.draw();AU.sfx&&AU.sfx(grade==="S"||grade==="A"?"level":"ui");},
  reward(grade,acc){const S=this.st;G.mini[S.mode+"Wk"]=G.week;G.mini[S.mode+"S"]=G.season||1;return S.mode==="somtam"?this.rewardTam(grade,acc):this.rewardBag(grade,acc);},
  rewardTam(grade,acc){const S=this.st,f=G.F[S.id],D=BAG_DIFF[S.dk],out=[];
    const pay=Math.round({S:1200,A:850,B:550,C:250}[grade]*D.mul/50)*50;G.cash+=pay;out.push(`<b class="goldt">฿${pay.toLocaleString()}</b>`);
    if(grade==="S"||grade==="A"){G.rep=Math.round(((G.rep||0)+(grade==="S"?.3:.15))*100)/100;out.push(`ชื่อเสียง +${grade==="S"?.3:.15}`);}
    f.fatigue=Math.min(100,(f.fatigue||0)+2);f.morale=Math.min(100,(f.morale||0)+3);out.push("กำลังใจ +3");
    const du=Math.max(1,Math.round({S:3,A:2,B:1,C:1}[grade]*D.mul));G.dust=(G.dust||0)+du;out.push(`<b class="goldt">✦ +${du}</b>`);
    out.push(esc(TAM_LINE[grade]));
    if(grade==="S"){G.flags.tamS=(G.flags.tamS||0)+1;}
    if(typeof cardCheck==="function"){const got=cardCheck(G);if(got.length){G.cardPend=(G.cardPend||[]).concat(got);out.push(`🃏 การ์ดใหม่ ×${got.length}`);}}
    return `<span class="rwl">${out.map(x=>`<span class="rwi">${x}</span>`).join("")}</span>`;},
  rewardBag(grade,acc){const S=this.st,f=G.F[S.id],D=BAG_DIFF[S.dk],out=[];
    const g=Math.round(acc*.3*D.mul*100)/100;const up=k=>{const cap=Math.min(20,(f.potential||14)+1.5);const before=f.a[k];f.a[k]=Math.min(cap,Math.round((f.a[k]+g/2)*100)/100);return f.a[k]>before;};
    if(g>0){const a=up("kick"),b=up("punch");if(a||b)out.push(`เตะ/หมัด +${(g/2).toFixed(2)}`);else out.push("ค่าเตะ/หมัดเต็มศักยภาพแล้ว");}
    const mo={S:8,A:5,B:3,C:1}[grade];f.morale=Math.min(100,(f.morale||0)+mo);out.push(`กำลังใจ +${mo}`);
    f.fatigue=Math.min(100,(f.fatigue||0)+4);out.push("ล้า +4");
    const du=Math.max(1,Math.round({S:6,A:4,B:2,C:1}[grade]*D.mul));G.dust=(G.dust||0)+du;out.push(`<b class="goldt">✦ +${du}</b>`);
    if(grade==="S"||grade==="A"){add(G,f.id,"bond",2);out.push(`${esc(f.name)}สนิทขึ้น`);}
    if(grade==="S"){G.flags.bagS=(G.flags.bagS||0)+1;if(S.dk==="hard")G.flags.bagSH=(G.flags.bagSH||0)+1;}
    if(typeof cardCheck==="function"){const got=cardCheck(G);if(got.length){G.cardPend=(G.cardPend||[]).concat(got);out.push(`🃏 การ์ดใหม่ ×${got.length}`);}}
    return `<span class="rwl">${out.map(x=>`<span class="rwi">${x}</span>`).join("")}</span>`;},
  claim(){this.close();}};
Object.assign(ACT,{minibag:()=>BAG.open()});
const TAM_LINE={S:"ป้าแต๋ว: \"มือหนักแต่แม่น! มาช่วยป้าทุกอาทิตย์เลยนะลูก\"",A:"ป้าแต๋ว: \"ใช้ได้ ๆ ลูกค้าชมว่าเส้นไม่เละ\"",B:"ป้าแต๋ว: \"ครกยังอยู่ครบ ถือว่าผ่าน\"",C:"ป้าแต๋ว: \"มะละกอกระเด็นไปครึ่งครก …ไม่เป็นไร ค่อย ๆ ฝึก\""};
Object.assign(CARDS,{
 m_bag:{c:"kati",r:"R",t:"จังหวะเดียวกับปู่",hint:"ได้เกรด S ในมินิเกมเตะกระสอบตามกลองแขก",bg:"camp",need:G=>(G.flags.bagS||0)>=1,steps:[
  {n:"nar",t:"เสียงกลองแขกจากลำโพงเก่าดังไปทั้งค่าย กะทิเตะกระสอบตามจังหวะได้ครบทุกโน้ตไม่พลาดสักครั้ง"},
  {n:"coach",t:"เพลงนี้ปู่ชัยเปิดให้ซ้อมทุกเช้า สมัยครูยังหนุ่ม ครูเตะตามไม่เคยทันสักรอบ"},
  {n:"kati",f:"happy",l:"fight",t:"หนูได้ยินเพลงนี้ตั้งแต่ยังเดินไม่คล่องเลยค่ะ ตุ๊บ ติ๊ง ตุ๊บ ตุ๊บ ติ๊ง …ตัวมันจำได้เอง"},
  {n:"kati",f:"flustered",l:"fight",t:"ผู้จัดการเห็นไหมคะ ครบทุกจังหวะ! …ถ้าปู่อยู่ ปู่คงตีกลองให้เองแล้ว"}]},
 m_tam:{c:"mali",r:"R",t:"ส้มตำครกที่ร้อย",hint:"ได้เกรด S ในมินิเกมตำส้มตำร้านป้าแต๋ว",bg:"market",need:G=>(G.flags.tamS||0)>=1,steps:[
  {n:"nar",t:"เย็นวันศุกร์ ร้านป้าแต๋วคิวยาวถึงหน้าวัด ครกวันนี้ตำไปเกือบร้อยครกแล้ว"},
  {n:"mali",f:"happy",l:"casual",t:"ตำแบบนี้เหมือนแม่เลยค่ะ ตำสามที คลุกหนึ่ง ตำสามที คลุกหนึ่ง …หนูโตมากับเสียงนี้"},
  {n:"nar",t:"ป้าแต๋วยื่นจานพิเศษมาให้ ปูม้าเต็มจาน ไม่มีในเมนู"},
  {n:"mali",f:"flustered",l:"casual",t:"ผู้จัดการกินก่อนเลยค่ะ ครกนี้หนูตำเอง …เผ็ดไหมคะ? หนูใส่พริกแค่เจ็ดเม็ดเองนะ~"}]},
 m_baghard:{c:"rin",r:"SR",t:"สถิติที่ไม่มีช่องว่าง",hint:"ได้เกรด S ในระดับยาก",bg:"camp",need:G=>(G.flags.bagSH||0)>=1,steps:[
  {n:"nar",t:"รินยืนถือคลิปบอร์ดอยู่ข้างกระสอบตลอดรอบ ปากกาสามสีไม่ได้ขยับเลยสักครั้ง"},
  {n:"rin",f:"surprised",l:"casual",t:"…จังหวะร้อยยี่สิบสี่ ทุกโน้ต ไม่มีช่องให้ฉันจดข้อผิดพลาดเลย"},
  {n:"rin",f:"pout",l:"casual",t:"ปกติฉันชอบตารางที่เต็ม แต่วันนี้ตารางว่างทั้งแผ่น แล้วฉันกลับชอบมากกว่า"},
  {n:"rin",f:"flustered",l:"casual",t:"ไม่ต้องยิ้มแบบนั้นค่ะผู้จัดการ …ฉันจะแปะหน้านี้ไว้บนผนังห้อง ไม่ได้แปลว่าภูมิใจนะ แค่… ภูมิใจนิดหน่อย"}]}});
