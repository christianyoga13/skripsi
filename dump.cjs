const fs=require('fs');
const files = fs.readdirSync('src/assets').filter(f => f.endsWith('.glb'));
for (const f of files) {
  const data=fs.readFileSync('src/assets/'+f);
  const str=data.toString('utf8');
  const matches=str.match(/"name":"[^"]+"/g);
  const set=new Set();
  if (matches) matches.forEach(m => set.add(m.split('"')[3]));
  console.log(f, Array.from(set));
}
