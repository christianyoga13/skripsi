const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, 'src', 'assets');

function optimizeModels() {
  const files = fs.readdirSync(ASSETS_DIR);
  const glbFiles = files.filter(f => f.toLowerCase().endsWith('.glb'));
  
  console.log(`Found ${glbFiles.length} GLB files. Starting optimization...`);
  
  for (const file of glbFiles) {
    const inputPath = path.join(ASSETS_DIR, file);
    const tempPath = path.join(ASSETS_DIR, `optimized_${file}`);
    
    console.log(`Optimizing ${file}...`);
    try {
      // Using npx to run gltf-transform. 
      // The 'optimize' command applies draco, webp, and generic optimizations.
      execSync(`npx -y @gltf-transform/cli@4.0.0 optimize "${inputPath}" "${tempPath}" --texture-compress webp --texture-size 1024`, { stdio: 'inherit' });
      
      const origSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
      const newSize = (fs.statSync(tempPath).size / 1024 / 1024).toFixed(2);
      
      console.log(`✓ ${file}: ${origSize}MB -> ${newSize}MB`);
      
      // Replace original with optimized
      fs.renameSync(tempPath, inputPath);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
      // Clean up temp file if it exists and failed
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }
  
  console.log('Model optimization complete!');
}

optimizeModels();
