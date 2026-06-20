const fs = require('fs');

function dumpGLB(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // Magic: 'glTF'
  const magic = buffer.readUInt32LE(0);
  if (magic !== 0x46546C67) {
    console.error("Not a GLB file");
    return;
  }
  
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  // Chunk 0: JSON
  const chunk0Length = buffer.readUInt32LE(12);
  const chunk0Type = buffer.readUInt32LE(16);
  if (chunk0Type !== 0x4E4F534A) {
    console.error("First chunk is not JSON");
    return;
  }
  
  const jsonBuffer = buffer.slice(20, 20 + chunk0Length);
  const jsonStr = jsonBuffer.toString('utf8');
  const gltf = JSON.parse(jsonStr);
  
  console.log(`\n=== ${filePath} ===`);
  console.log("Meshes:");
  if (gltf.meshes) {
    gltf.meshes.forEach((m, i) => {
      console.log(`  Mesh ${i}: ${m.name}`);
      if (m.primitives) {
         m.primitives.forEach((p, j) => {
           let matName = "none";
           if (p.material !== undefined && gltf.materials && gltf.materials[p.material]) {
             matName = gltf.materials[p.material].name;
           }
           console.log(`    Prim ${j}: Material -> ${matName}`);
         });
      }
    });
  }
  
  console.log("Nodes:");
  if (gltf.nodes) {
    gltf.nodes.forEach((n, i) => {
      let meshStr = n.mesh !== undefined ? ` (Mesh ${n.mesh})` : "";
      console.log(`  Node ${i}: ${n.name || 'unnamed'}${meshStr}`);
    });
  }
  
  console.log("Materials:");
  if (gltf.materials) {
    gltf.materials.forEach((m, i) => {
      console.log(`  Material ${i}: ${m.name}`);
    });
  }
}

const dir = 'c:/Users/VICTUS/Documents/Kerjaan/furniture-visualization/src/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.glb'));

files.forEach(f => {
  dumpGLB(`${dir}/${f}`);
});
