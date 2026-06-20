const fs = require('fs');
const data = fs.readFileSync('src/assets/couch.glb', 'utf8').slice(0, 10000);
const matches = [...data.matchAll(/"name":"([^"]+)"/g)];
console.log(matches.map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i));
