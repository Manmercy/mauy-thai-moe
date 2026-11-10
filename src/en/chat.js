// ================= MUAY THAI MOE v1.24 — PIXEL CHAT (one chat per character per week) =================
// each exchange: [their line, [[my reply, score 0-2, their answer], ...]] — score 2 = what she loves to hear, 0 = falls flat (never negative)
const lastFight=(G,id)=>(G.cal||[]).filter(c=>c.a===id).slice(-1)[0];
const recentRes=(G,id,res)=>{const c=lastFight(G,id);return !!(c&&c.res===res&&G.week-c.wk<=2&&TIER[c.tier]&&!TIER[c.tier].off);};
const nearFinal=G=>G.week>=42&&G.week<=49;
const CHAT={
 kati:[
  {id:"k_lost",need:G=>recentRes(G,"kati","L"),x:[
   ["Manager… I can't sleep. I let everyone down in yesterday's fight",[["Nobody's let down. We saw you fight to the last bell",2,"…Really? Then I'll keep that sentence for the hard training days"],["It's just one loss, go to sleep",1,"Okay… but I still keep thinking about that kick"],["You have to win next time",0,"Okay… (sends a bowing-cat sticker)"]]],
   ["If Grandpa were still here, what would he say?",[["Grandpa would say: fall down if you must, but don't stay down long",2,"Hngh… that's his voice exactly, like I can really hear him"],["He'd take you out for chicken rice",1,"Haha, yes, Grandpa always comforted with food"],["I don't know, I never met him",0,"Oh… right, true"]]],
   ["Five a.m. tomorrow, want to run together?",[["Sure, I'll ride a bike behind you and carry the water",2,"It's a promise! Not even a minute late!"],["Five a.m.?… Okay, okay",1,"You sound like you don't want to go at all, haha"],["I'd rather sleep",0,"It's fine, I can run alone"]]]]},
  {id:"k_won",need:G=>recentRes(G,"kati","W"),x:[
   ["Manager!! Did you see my kick in round three! My hands are still shaking!",[["I did. The whole arena stood up",2,"Kyaaa! I'll remember tonight until I'm old!"],["Great job",1,"Just 'great job'~? Add a little more"],["But your guard still drops",0,"…Okay, I'll fix it (but let me be happy for five minutes first)"]]],
   ["I bought grilled pork to celebrate, one skewer left. Want it, Manager?",[["Let's split it",2,"Okay! My half's a little bigger, hehe"],["Eat it, the winner deserves it",1,"Then I won't hold back, nom!"],["No thanks, I'm full",0,"Oh… then it goes to the orange cat"]]],
   ["Grandpa is smiling up there tonight, right?",[["The widest smile ever",2,"…Thank you. Let me be quiet for a moment"],["Probably",1,"Yeah, I think so too"],["Go to sleep, training tomorrow",0,"Okay, good night"]]]]},
  {id:"k_final",need:G=>nearFinal(G),x:[
   ["Only a few weeks until the final… I'm scared. First time I've admitted it",[["It's okay to be scared. I'm scared too, but we'll be scared together",2,"…Together. Hearing that, my hands stopped shaking"],["You've trained a lot, don't be scared",1,"Okay, I'll try to believe that"],["Whoever's scared loses",0,"…Okay"]]],
   ["If I beat Ploy, what would you want, Manager?",[["A photo of you holding the belt in front of the camp sign",2,"Deal! I'll give my prettiest smile"],["You don't need to give me anything",1,"So modest. Then I'll choose myself"],["The prize money",0,"Haha, refreshingly honest"]]],
   ["I wrote your name on my hand wraps, Manager. You don't mind, right?",[["Write Grandpa's name next to it too",2,"…Already did. Since day one"],["I don't mind",1,"Yay, then I'll write it big"],["Why would you write that",0,"Eh… well… it's nothing!"]]]]},
  {id:"k_grandpa",x:[
   ["I found Grandpa's diary in the storeroom. Nothing but messy handwriting",[["Want to read it together?",2,"Let's! The first page says 'Don't forget to feed the cat', haha"],["What's inside?",1,"Training plans and a muay oil recipe. Very strong smell"],["Keep it safe",0,""]]],
   ["Grandpa wrote 'A good fighter isn't one who never loses, but one who never runs.' What do you think?",[["That's you exactly",2,"Me?… Then I really can't run away now"],["Sharp words",1,"Right? I'll stick it on the gym door"],["But losing isn't good either",0,"Haha, that's true"]]],
   ["Manager, do you think I can be a fighter like Grandpa?",[["You'll be a fighter like Kati, one Grandpa's proud of",2,"…Like Kati. I love that phrase most of all"],["Definitely",1,"Thank you! I'll make it happen"],["Grandpa was really good, it'll be hard",0,"…Yes, I know"]]]]},
  {id:"k_food",x:[
   ["Manager! Auntie Taew launched a new 'Kati-level spicy som tam', she used my name!",[["Let's go eat it, see if it's really that spicy",2,"Deal! Whoever cries from the spice first pays!"],["You're famous now",1,"Haha, famous for spiciness?"],["Too spicy is bad for your stomach",0,"You sound just like Coach Daeng"]]],
   ["Do you know how spicy I can handle?",[["The level where even Auntie Taew gives up",2,"Correct! Auntie says I'm not human, haha"],["About ten chilies",1,"Ten chilies is a snack"],["No idea",0,"Then I'll prove it to you"]]],
   ["And can you handle spicy, Manager?",[["Not at all, but I'll try for you",2,"So sweet… I'll order you a non-spicy plate"],["Somewhat",1,"Somewhat like a Northerner or like an Isan person?"],["I don't eat spicy",0,"Oh, then have an omelet"]]]]},
  {id:"k_rest",x:[
   ["Coach Daeng ordered rest today, I can't sit still. What should I do?",[["Go sit by the river. Don't think about Muay Thai for one day",2,"…Not think about Muay Thai, is that even possible? I'll try"],["Watch Ploy's old fights",1,"That's still thinking about Muay Thai! But… it's good"],["Sleep",0,"I've already slept twelve hours"]]],
   ["I'm bad at resting. I feel guilty every time I don't train",[["Rest is a kind of training too",2,"Rest is training… I'll remember that"],["You'll get used to it",1,"Yeah, I hope so"],["Then go train",0,"Coach Daeng will scold you, Manager, haha"]]],
   ["Thanks for messaging me. I'm not lonely today",[["Message me anytime",2,"Then I'll message you a lot. No getting annoyed!"],["It's fine",1,"Okay, good night"],["Mm",0,"…Okay"]]]]}],
 mali:[
  {id:"m_lost",need:G=>recentRes(G,"mali","L"),x:[
   ["Manager~ Mali lost, waaah, but she's not crying! (just a little)",[["Cry it all out, then smile again tomorrow",2,"Waah… okay. Five more minutes of crying, then I'll smile for the whole camp!"],["It's okay",1,"Okay… thank you"],["Didn't you say you weren't crying?",0,"I said just a little!"]]],
   ["Mom called asking about the fight, Mali told her she won… what do I do",[["Tell the truth. Your mom's already proud you fight",2,"…True. Mom always says as long as I'm not hurt she's happy. I'll call back"],["Win the next one and it'll be true",1,"Haha, yes! Turn the lie into truth in advance"],["Lying isn't good",0,"I know…"]]],
   ["Treat Mali to mango sticky rice to cheer her up~?",[["Sure, two plates",2,"Yay! Eighty percent less sad already!"],["One plate is enough",1,"A big plate, deal!"],["Diet first",0,"Meaaan"]]]]},
  {id:"m_won",need:G=>recentRes(G,"mali","W"),x:[
   ["Woooon! Mali kicked her legs till she was limping!",[["The best kicks in the arena that night",2,"Kyaa! Manager praising like that, Mali's floating!"],["Nice, nice",1,"Very nice-ee, you have to say it twice"],["Don't get cocky",0,"Just cocky for one night"]]],
   ["Mali will sing you a celebration song, a luk thung one!",[["Sing, I want to hear",2,"♪ Little girl of the fight camp~ ♪ (sings until the neighbors bang on the wall)"],["Sing quietly",1,"Mali doesn't know how to sing quietly!"],["It's late",0,"Hmph, then tomorrow morning, five a.m.!"]]],
   ["I sent the prize money to Mom, so happy",[["Your mom must be so proud",2,"Mom cried on the phone… and Mali cried too, haha"],["Keep some for yourself",1,"Kept a little for moo kratha"],["Good",0,"Yes!"]]]]},
  {id:"m_home",x:[
   ["I miss home today. The rice fields there must be so green now",[["Tell me about it. What's your home like?",2,"There's a buffalo named Thongkham, really big. Mali rode him to school every day!"],["Go visit when you're free",1,"After the championship! I promised Mom"],["There are rice fields here too",0,"It's not the same…"]]],
   ["Thongkham (the buffalo) is Mali's best friend, you know",[["Who's best friend number two?",2,"…You, Manager! Don't tell Thongkham, he'll sulk"],["A buffalo can be a friend?",1,"Of course! Thongkham listens to Mali complain every day"],["That's funny",0,"It's not funny, it's serious"]]],
   ["When Mali's champion, she'll take you home to eat Mom's larb!",[["Deal, I'll definitely go",2,"It's a promise! Mom will be so happy"],["Is the larb spicy?",1,"Spicy enough to make Kati cry!"],["Let's talk about it later",0,"No, we talk about it now!"]]]]},
  {id:"m_karaoke",x:[
   ["Can you sing, Manager? Mali wants to go to karaoke!",[["I can, let's sing a duet",2,"Yay! Mali's booking the biggest room!"],["I can, but off-key",1,"It's fine, Mali will sing over you"],["I don't sing",0,"Then sit and clap for Mali"]]],
   ["Guess Mali's signature song",[["A sad luk thung song, sung like a party",2,"Correeect! You know Mali best!"],["An English pop song",1,"Wrong! But she can sing those too, badly"],["No idea",0,"Guess!"]]],
   ["The karaoke bar banned fighters from singing after 10 p.m., because of Mali",[["Why not open a karaoke room in camp?",2,"Haha, great idea! The gym at night becomes Mali's stage!"],["You really do sing too loud",1,"But it's fun!"],["Serves you right",0,"Hmmmph"]]]]},
  {id:"m_small",x:[
   ["Someone said Mali is too small to be a fighter…",[["Your kicks don't listen to talk about height",2,"Haha, love that line! Mali will kick even louder!"],["They don't know anything",1,"Right! Don't care!"],["Well, you are small",0,"I knooow"]]],
   ["Mali secretly practices jumping high kicks every night, didn't tell anyone",[["Can I see?",2,"Sure! But don't laugh if Mali falls!"],["Don't train till you get hurt",1,"Yes, yes, Coach Daeng says that too"],["If it's a secret, why tell me?",0,"Because I'm only telling you!"]]],
   ["Thank you for taking Mali into the camp. Nowhere else would",[["We're lucky to have you",2,"…Waah, don't say that late at night, Mali's crying"],["Our camp welcomes everyone",1,"Yes, this camp is the best!"],["Don't forget to pay rent",0,"Haha, way to ruin the mood!"]]]]}],
 rin:[
  {id:"r_lost",need:G=>recentRes(G,"rin","L"),x:[
   ["I miscalculated. 62% chance to win, and we landed in the 38%",[["38% is still a reality that can happen. It's not your fault",2,"…Good reasoning. I accept it, and I feel strangely better"],["Recalculate",1,"Already doing it. Table number 14"],["Numbers don't matter",0,"They matter to me"]]],
   ["Should I rely on data less?",[["Keep using data, but listen to your body too",2,"Data plus body… an equation I've never tried. I'll try"],["No, you're great as you are",1,"Thank you, but I'll keep thinking about it"],["Yes, fighting with heart is better",0,"Heart can't be measured…"]]],
   ["Thank you for not scolding me",[["No reason to scold someone who tries like you",2,"…I've saved that sentence (private file)"],["It's fine",1,""],["I'll scold you later",0,"Noted…"]]]]},
  {id:"r_won",need:G=>recentRes(G,"rin","W"),x:[
   ["We won, matching my 71% calculation. I'm happy… within acceptable limits",[["Smile all the way for once, no need to measure it",2,"…(sends one photo of a huge smile, then deletes it within five seconds)"],["Congratulations",1,"Thank you"],["Only 71%?",0,"71% is high, statistically"]]],
   ["I made a chart of this fight. Want to see?",[["I do, explain it to me",2,"Okay! (sends 9 pages, with 400 words of explanation per page)"],["Send it",1,"Sent. Please read it all"],["It's fine",0,"…Okay. Filed under 'nobody reads this'"]]],
   ["At Golden Tiger nobody ever asked my opinion. It's different here",[["Your opinions really make our camp stronger",2,"…I'll do even better"],["It's small here, so everyone has to pitch in",1,"An advantage I hadn't anticipated"],["Is that so",0,""]]]]},
  {id:"r_glasses",x:[
   ["My glasses broke again. Third time this month",[["Let's go to the optician together, I'll help pick frames",2,"…Deal. But no gold frames, too Golden Tiger"],["Wear contact lenses",1,"I'm afraid of poking my eye. Tried once, 0% success"],["Buy ten spares",0,"Over budget"]]],
   ["People say I look strict with glasses on",[["You look smart, more like",2,"Smart… I like that word better than strict"],["You look strict without them too",1,"Because I can't see, so I squint"],["You do look strict",0,"…Okay"]]],
   ["If you could choose, do you prefer round or square glasses? (asking for statistics)",[["Round, suits you best",2,"Recorded…(answered abnormally fast)"],["Either is fine",1,"That answer skews the statistics"],["You look prettier without glasses",0,"But I'll walk into poles"]]]]},
  {id:"r_numbers",x:[
   ["I calculate our camp has a 34% chance of winning the title this year",[["Then let's make it 100%",2,"…Completely illogical. But I like it"],["Higher than I thought",1,"Yes, up from 3% at the start of the season"],["That's low",0,"According to the data"]]],
   ["The variable I can't calculate is 'Kati's effort'",[["Some things can't be counted, but you can feel them",2,"…I'll create a new unit of measurement, called 'the Kati'"],["Put it in as a constant",1,"Tried. The graph broke out of the screen"],["Forget it",0,"I can't forget it"]]],
   ["You're the most unpredictable variable in this camp, Manager",[["In a good way, right?",2,"…Mostly. No contradicting data found yet"],["Thanks?",1,"That wasn't a compliment, just a fact"],["Then figure me out",0,"I'm working on it"]]]]},
  {id:"r_ploy",x:[
   ["I used to be Ploy's sparring partner. Never won once",[["That means you know Ploy better than anyone in our camp",2,"…True. All the data I collected will be useful in the end"],["Ploy really is good",1,"Yes. And she never looks down on anyone"],["Not surprising",0,"…Okay"]]],
   ["Ploy is actually kind. She just has no time for anyone",[["Want to invite Ploy to train with us someday?",2,"…A crazy idea. But I'll message her and see"],["The boss must pressure her",1,"Yes. Every day"],["A rival is a rival",0,"Yes, I understand"]]],
   ["If Kati meets Ploy in the final, who should I cheer for?",[["Cheer for both, and the winner buys dinner",2,"…An answer I hadn't considered. But the best one"],["Kati, obviously",1,"Of course. I'm with Sirichai now"],["No need to cheer",0,"Hard to stop myself"]]]]}],
 ploy:[
  {id:"p_beaten",need:G=>G.flags&&G.flags.beat_ploy>=1,x:[
   ["Manager, sorry for messaging so late. I can't sleep",[["It's okay, tell me",2,"…Thank you. My first loss in years. I feel strangely light"],["Thinking about the fight?",1,"Yes, every moment of it"],["It's late",0,"Sorry. Another time"]]],
   ["Kati's last kick… I saw it but couldn't dodge in time… strange that I feel happy",[["Happy to have a rival who makes you grow",2,"…Yes. That's exactly the word I searched for all night"],["Because you truly love Muay Thai",1,"I suppose so"],["A loss is a loss",0,"Yes. I won't argue"]]],
   ["Please tell Kati that next time I won't be the same",[["I will, and Kati won't be the same either",2,"Good. See you in the final… I'm truly looking forward to it"],["I'll tell her",1,"Thank you"],["She'll know without being told",0,"Okay, good night"]]]]},
  {id:"p_captain",x:[
   ["A junior in my camp cried today because the boss scolded her. I'm not good at comforting",[["Just sitting beside her is enough",2,"…Just sitting beside her. I tried, and she fell asleep on my shoulder"],["Tell her it'll pass",1,"I did, but it sounded a little cold"],["Make her train more",0,"Not every problem is solved by training"]]],
   ["Being captain is more tiring than fighting",[["You're doing better than you think",2,"…No one has ever told me that"],["Rest sometimes",1,"Yes, I'm trying"],["You chose it yourself",0,"The boss chose it for me"]]],
   ["Talking to a rival like this, aren't you afraid your camp will mind?",[["In the ring we're rivals, outside it we can be friends",2,"…Friends. I'll try using that word with you"],["No one will know",1,"Heh, our secret"],["A little",0,"Then I won't bother you anymore"]]]]},
  {id:"p_talent",x:[
   ["Everyone calls me a prodigy… what do you think, Manager?",[["I think you train harder than anyone sees",2,"…You noticed? Four a.m. every day. No one ever mentions it"],["You really are good",1,"Thank you, but that word makes me a little tired"],["You're a prodigy, though",0,"…Okay"]]],
   ["Sometimes I just want to be an ordinary person who likes Muay Thai",[["On a day off, try going to a temple fair like an ordinary person",2,"A temple fair… I haven't been since I was a child. Can you win plushies at the dart stall?"],["You are ordinary, in your own way",1,"That's a strange sentence. But I like it"],["Prodigy is better",0,"For the audience"]]],
   ["Thank you for talking with Ploy, not 'the Golden Tiger captain'",[["Ploy is far more interesting to talk to",2,"…Heh, I'm smiling. Don't tell anyone"],["My pleasure",1,""],["Same person, isn't it",0,"For most people"]]]]},
  {id:"p_final",need:G=>nearFinal(G),x:[
   ["The final is coming soon",[["May it be the best fight of both your lives",2,"…Yes. Whoever wins, I want it to be that"],["Kati is ready",1,"So am I"],["You're going to lose",0,"Heh. We'll see"]]],
   ["If I lose, the boss will be furious",[["Whatever the result, you're a fighter worth respecting",2,"…I'll carry that sentence into the ring"],["Then don't lose",1,"That's the plan"],["Forget the boss",0,"Easy to say…"]]],
   ["See you in the ring, manager of Sirichai",[["See you, Ploy",2,"…Yes (sends one small curled-up tiger sticker)"],["Don't hold back",1,"I never do"],["Bye",0,""]]]]}],
 fah:[
  {id:"f_beaten",need:G=>G.flags&&G.flags.beat_fah>=1,x:[
   ["Don't think Fah's messaging because she's sad!! Just… can't sleep, that's all",[["If you want to vent, vent. I won't tell anyone",2,"…Fine. Losing stings like hell, but… Mali's really good (don't tell Mali!)"],["I get it",1,"Get what, Fah hasn't said anything yet!"],["Go to sleep",0,"I said I can't sleep!!"]]],
   ["Everyone at camp went silent on Fah. Nobody asked if she's okay",[["Then I'll ask. Are you okay?",2,"…Not okay. But better, because someone asked (no teasing!)"],["They're probably giving you space",1,"They don't have to give that much!"],["Because you win so often, they don't worry",0,"Hmph…"]]],
   ["Next time Fah wins, just watch!",[["I'm watching, but Mali won't just sit and wait either",2,"Good! Otherwise it's no fun! …Thanks for talking (typed quietly)"],["Go go!",1,"Don't cheer for the enemy!"],["Doubt it",0,"You just wait!!"]]]]},
  {id:"f_cat",x:[
   ["Hey! Fah found a stray cat behind the camp, and it likes Fah. Jealous?",[["Jealous. Send me a photo",2,"(sends twelve photos) This one's named Iron Fist! Fah named him!"],["Cats like anyone who feeds them",1,"Not true! He likes Fah because Fah's cool!"],["Not jealous",0,"Hmph, fine, don't be jealous!"]]],
   ["The boss won't allow pets at camp, so Fah's secretly keeping him in the glove room",[["Careful not to get caught, but I won't tell anyone",2,"See! Fah knew you were a good guy (a little)"],["Want to leave him at Sirichai?",1,"No way! Iron Fist belongs to Golden Tiger! …But Fah'll think about it"],["That's against the rules",0,"Who asked you!"]]],
   ["If Fah wins the title, she's buying Iron Fist a cat condo",[["Great dream. I hope Iron Fist gets his condo",2,"…Thanks. But don't tell anyone Fah said that!"],["Buy yourself a house first?",1,"Fah's house is basically the glove room too, ha"],["That's expensive",0,"Nobody asked you to pay!"]]]]},
  {id:"f_grandma",x:[
   ["Grandma called complaining Fah's too skinny, even though Fah eats five meals a day!",[["Your grandma must love you a lot",2,"…Fah knows! Grandma's the only one who watches every one of Fah's fights"],["Five meals?!",1,"Fighters have to eat a lot! You know nothing"],["You are skinny",0,"Not skinny! All muscle!"]]],
   ["Grandma wants to watch Fah fight at the provincial, but nobody can bring her",[["If you don't mind, our camp's songthaew can pick her up",2,"…Really!? Wait… why are you so nice to Fah, don't make Fah tear up"],["Ask your boss",1,"The boss doesn't care"],["She can watch the livestream",0,"Grandma can't use a phone!"]]],
   ["Grandma says thanks for the snacks your camp sent back then",[["Tell her it's always a pleasure",2,"I did. Grandma said 'this one's alright' …Grandma said it, not Fah!"],["It's fine",1,"Mm"],["What snacks?",0,"You don't remember?! Hmph!"]]]]},
  {id:"f_rival",x:[
   ["Why does everyone like Kati and Mali, but nobody likes Fah",[["I like how straightforward you are, Fah",2,"…!! Don't just say stuff like that out of nowhere! (disappears for ten minutes, then sends a red-faced tiger sticker)"],["Lots of people like you, they're just shy",1,"Really… who? Give me names"],["Because you've got a sharp tongue",0,"Sharp tongue, kind heart!"]]],
   ["Ploy wins at everything. Fah's always just 'the other one' at camp",[["You're not the other one. You're Fah, with a style like no one else",2,"…Yeah, right! Fah is Fah! Fah's gonna make the whole province know!"],["Ploy respects you, you know",1,"I know… but sometimes Fah wants to beat Ploy just once"],["That's true",0,"You're no help at all!"]]],
   ["Come practice kicks with Fah sometime? (not inviting, just asking)",[["Sure, but I'll stand far away",2,"Ha! Scared, huh! …Saturday, 3 p.m. No flaking!"],["I can't fight, you know",1,"Then Fah'll teach you, so impatient"],["I'm busy",0,"Wasn't inviting you anyway!!"]]]]}]};
// extra lines once she trusts you more (bond 40 / 70): one more exchange each
const CHAT_X={
 kati:[["…Manager, if someday I stop fighting, will you still message me?",[["Every day. Nothing to do with Muay Thai",2,"…I'll remember that. Every word"],["No need to think about that yet",1,"Okay, I just wanted to know"],["Why would you quit?",0,"I'm not quitting, just asking"]]],["Talking with you like this is my favorite part of the week",[["Mine too",2,"…(sends three blushing stickers)"],["Glad to hear it",1,""],["Chatting is cheaper than dinner too",0,"Haha, Manager!"]]]],
 mali:[["Psst, a secret: Mali thinks you're the kindest person in the world, after Mom",[["After Mom counts as the top",2,"Right! Number two in the world, be proud!"],["Then where's Thongkham?",1,"Thongkham's number three, don't tell him!"],["Oh, not number one?",0,"Mom's always number one!"]]],["So many stars tonight. Mali secretly named one after you",[["Then I'll name the one next to it Mali",2,"Kyaa! Twin stars! Mali will look every night!"],["Which one?",1,"The one that blinks fast like someone panicking, haha"],["That's a plane",0,"…Eh, oh, it is!"]]]],
 rin:[["Manager, I've found my heart rate rises 12% when I talk with you",[["Mine too",2,"…Matching data. Very interesting. I'd like to collect more samples"],["Do you have a fever?",1,"Checked. No fever, which is even more suspicious"],["Your watch is on the wrong wrist",0,"…Yes. That must be it"]]],["I'm not good with words, but thank you for giving me a place to stand",[["You don't need to be good with words. I understand",2,"…Yes (sends one heart-shaped chart)"],["Always a pleasure",1,""],["So formal",0,"Sorry, it's a habit"]]]],
 ploy:[["If someday I'm no longer at Golden Tiger… would Sirichai take me? (hypothetically)",[["The door is always open",2,"…I'll keep those words somewhere no one can see"],["Have to ask Kati first",1,"Heh, yes, Kati would be shocked"],["Unlikely to happen",0,"Yes, just hypothetically"]]],["I've started waiting for our Sunday chats. Is that strange?",[["Not strange. I wait too",2,"…Then next Sunday, I'll message first"],["Not strange at all",1,"Good, then"],["A little strange",0,"…Okay"]]]],
 fah:[["…Hey, if Fah said she's glad she met you, would you laugh?",[["I wouldn't laugh. I'm glad too",2,"…!! Enough, enough, stop talking, Fah's embarrassed!!"],["Depends on the face you make saying it",1,"A normal face! …probably"],["I'd definitely laugh",0,"Then Fah's not saying it!"]]],["Iron Fist (the cat) slept on the shirt you left behind all night",[["Then give the shirt to Iron Fist",2,"…Not giving it to Iron Fist, Fah's keeping it! Wait, no!"],["Wash it for me",1,"I'm not your maid!"],["Now it's covered in cat hair",0,"Mean!"]]]]};

function chatTopic(G,id){const L=CHAT[id]||[];G.chatSeen=G.chatSeen||{};const seen=G.chatSeen[id]||[];
  const ctx=L.filter(t=>t.need&&t.need(G)&&!seen.includes(t.id));if(ctx.length)return ctx[0];
  const gen=L.filter(t=>!t.need&&!seen.includes(t.id));if(gen.length)return gen[(G.week+G.seed)%gen.length];
  const all=L.filter(t=>!t.need);return all[(G.week*7+G.seed)%all.length];}
const chatLen=f=>3+((f.bond||0)>=40?1:0)+((f.bond||0)>=70?1:0);
const canChat=f=>!!(f&&f.met)&&!(G.chatWk&&G.chatWk[f.id]===G.week);
function chatOpen(id){const f=G.F[id];if(!f||!canChat(f))return;G.chatWk=G.chatWk||{};G.chatWk[id]=G.week;const T=chatTopic(G,id);
  G.chatSeen=G.chatSeen||{};G.chatSeen[id]=(G.chatSeen[id]||[]).concat([T.id]).slice(-12);
  const x=[...T.x];const ex=CHAT_X[id]||[];const extra=chatLen(f)-3;for(let i=0;i<extra&&i<ex.length;i++)x.push(ex[(i+G.week)%ex.length]);
  const rng=mulberry32(G.seed+G.week*17+id.length);x.forEach(e=>{e.ord=[0,1,2].sort(()=>rng()-.5);});
  UI.chat={id,x,i:0,log:[{w:"them",t:x[0][0]}],gain:0,typing:false};UI.modal={type:"chat"};save();render();}
function chatPick(k){const C=UI.chat;if(!C||C.typing||C.i>=C.x.length)return;const e=C.x[C.i],o=e[1][k];if(!o)return;
  C.log.push({w:"me",t:o[0]});C.typing=true;AU.sfx("tick");render();
  setTimeout(()=>{if(UI.chat!==C)return;C.typing=false;C.log.push({w:"them",t:o[2],s:o[1]});if(o[1]>0){add(G,C.id,"bond",o[1]);C.gain+=o[1];}if(o[1]===2)AU.sfx("level");
    C.i++;if(C.i<C.x.length){C.typing=true;render();setTimeout(()=>{if(UI.chat!==C)return;C.typing=false;C.log.push({w:"them",t:C.x[C.i][0]});render();},700);}
    else{C.done=true;G.chatLog=G.chatLog||{};G.chatLog[C.id]=(G.chatLog[C.id]||0)+1;save();}render();},800);}
const CHAT_PX=pxIcon(["kkkkkkkkk.","kwwwwwwwk.","kwkwkwkwk.","kwwwwwwwk.","kkkwkkkkk.","..kk......"],{k:"#1b1230",w:"#f4f1ea"});
const HEART_PX=pxIcon([".kk.kk.","krrkrrk","krwrrrk","krrrrrk",".krrrk.","..krk..","...k..."],{k:"#4a1020",r:"#ff4d6d",w:"#ffd0da"});
function chatHTML(){const C=UI.chat;if(!C)return {body:"",foot:true};const f=G.F[C.id];
  const msgs=C.log.map(m=>`<div class="cmsg ${m.w}">${m.w==="them"?`<img class="cav" src="${faceSrc(f.id,"happy","casual")}" alt="">`:""}<p>${esc(m.t)}${m.s===2?`<i class="chrt">${HEART_PX}</i>`:""}</p></div>`).join("");
  const e=!C.done&&!C.typing&&C.x[C.i];
  return {foot:false,body:`<div class="chatw px"><div class="chead"><img src="${faceSrc(f.id,"happy","casual")}" alt=""><span><b>${esc(f.name)}</b><small>${C.typing?"typing…":"online"}</small></span><span class="cbond">${HEART_PX}<b class="num">${Math.round(f.bond||0)}</b></span></div>
   <div class="cbody pxscroll" data-sk="chat">${msgs}${C.typing?`<div class="cmsg them typing"><img class="cav" src="${faceSrc(f.id,"happy","casual")}" alt=""><p><i></i><i></i><i></i></p></div>`:""}</div>
   <div class="cfoot2">${e?`<small class="meta">Choose a message to send (${C.i+1}/${C.x.length})</small>${e.ord.map(k=>`<button class="copt" data-act="chatpick" data-v="${k}">${esc(e[1][k][0])}</button>`).join("")}`
     :C.done?`<p class="cend">${C.gain?`Great conversation · bond increased`:"A short chat today. Talk again next week"}</p><button class="btn primary" data-act="closeModal">Close chat</button>`:`<small class="meta">…</small>`}</div></div>`};}
XMODAL.chat=()=>chatHTML();
Object.assign(ACT,{chat:d=>chatOpen(d.id),chatpick:d=>chatPick(+d.v)});
