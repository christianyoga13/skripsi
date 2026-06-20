const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'src', 'assets', 'product-image');

async function optimizeImages() {
  const files = fs.readdirSync(ASSETS_DIR);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} PNG files. Optimizing to WebP...`);
  
  for (const file of pngFiles) {
    const inputPath = path.join(ASSETS_DIR, file);
    const outputPath = path.join(ASSETS_DIR, file.replace(/\.png$/i, '.webp'));
    
    try {
      const info = await sharp(inputPath)
        .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const origSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
      const newSize = (info.size / 1024 / 1024).toFixed(2);
      console.log(`✓ ${file}: ${origSize}MB -> ${newSize}MB`);
      
      // Delete the original PNG to save space and clean up
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }
  
  console.log('Optimization complete!');
}

optimizeImages();
