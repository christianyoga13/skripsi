const fs = require('fs');
const path = 'src/data/products.js';
let data = fs.readFileSync(path, 'utf8');
data = data.replace(/badge: "In Stock",/g, 'badge: "3D Ready",');
data = data.replace(/badge: "Made to Order",/g, 'badge: "3D Ready",');
fs.writeFileSync(path, data);
