import json,sys,glob
c=json.load(open('chunks.json'))
for f in sorted(glob.glob('en/*.json')):
  i=int(f[3:5]);e=json.load(open(f));print(f,len(c[i]),len(e),'OK' if len(c[i])==len(e) else 'MISMATCH')
