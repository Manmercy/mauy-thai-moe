// build dict + generate English JS variants into ../v13/en/
require('child_process').execSync('node extract.js',{cwd:__dirname,stdio:'inherit',env:process.env});
const fs=require('fs');const SRC=(process.env.SRC||'../../src/');
const old=JSON.parse(fs.readFileSync('segs_old.json'));const C=JSON.parse(fs.readFileSync('chunks.json'));
const D={};C.forEach((ch,i)=>{const e=JSON.parse(fs.readFileSync('en/'+String(i).padStart(2,'0')+'.json'));ch.forEach((k,j)=>D[old[k]]=e[j]);});
Object.assign(D,JSON.parse(fs.readFileSync('extra.json')));
const pos=JSON.parse(fs.readFileSync('pos.json'));fs.mkdirSync(SRC+'en',{recursive:true});
let miss=new Set();
for(const f in pos){let code=fs.readFileSync(SRC+f+'.js','utf8');const L=pos[f].slice().sort((a,b)=>b.s-a.s);
  for(const x of L){if(!(x.v in D)){miss.add(x.v);continue;}let en=D[x.v];let rep;
    if(x.k==='s'){if(x.pre&&/^[A-Za-z0-9(]/.test(en)&&!/^\s/.test(x.v))en=' '+en;if(x.post&&/[A-Za-z,:]$/.test(en)&&!/\s$/.test(x.v))en=en+' ';}
    if(x.k==='t'){const before=code[x.s-1],after=code.slice(x.e,x.e+2);
      if(before==='}'&&/^[A-Za-z0-9(]/.test(en))en=' '+en;
      if(after==='${'&&/[A-Za-z,:]$/.test(en)&&!/(^|[^A-Za-z])[A-Za-z]$/.test(en))en=en+' ';}
    if(x.k==='s')rep=JSON.stringify(en);else rep=en.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
    code=code.slice(0,x.s)+rep+code.slice(x.e);}
  if(f==='pixel')code=code.replace('fillText("Sirichai Muay Thai Camp"','fillText("SIRICHAI GYM"');
  if(f==='ui')code=code.replace('(ใครน่ะ|','(Who|Huh|What[!?]|Eh|Wait|Whoa|Eek|Really\\?|ใครน่ะ|');
  const PO=JSON.parse(fs.readFileSync('post.json'));for(const [a,b] of (PO[f]||[])){if(!code.includes(a))console.log('POST MISS',f,a);code=code.split(a).join(b);}
  fs.writeFileSync(SRC+'en/'+f+'.js',code);
  const left=(code.match(/[฀-๿][^\n]{0,40}/g)||[]);if(left.length)console.log(f,'thai left',left.length,left.slice(0,5));}
console.log('missing',[...miss]);
// dict for save conversion: only strings that could live in saves (short-ish, no html)
const SD={};for(const k in D){if(k.length<=60&&!/[<>$]/.test(k)&&D[k].trim().length>=1)SD[k]=D[k];}
fs.writeFileSync(SRC+'i18n_dict.json',JSON.stringify(SD));console.log('dict',Object.keys(SD).length);
