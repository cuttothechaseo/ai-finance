const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories to process
const directories = [
  path.join(__dirname, '../public/assets/icons'),
  path.join(__dirname, '../public/assets/logos'),
  path.join(__dirname, '../public/assets/logos/partners')
];

// Process PNG and JPG files
const processImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return;
  }
  
  console.log(`Processing: ${filePath}`);
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Skip if already optimized (check file size)
    const stats = fs.statSync(filePath);
    if (stats.size < 50 * 1024) { // Skip if less than 50KB
      console.log(`  Skipping (already small): ${filePath}`);
      return;
    }
    
    // Resize if larger than 1000px in any dimension
    let resizeOptions = {};
    if (metadata.width > 1000 || metadata.height > 1000) {
      resizeOptions = {
        width: Math.min(metadata.width, 1000),
        height: Math.min(metadata.height, 1000),
        fit: 'inside',
        withoutEnlargement: true
      };
    }
    
    // Optimize and save
    await image
      .resize(resizeOptions)
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer()
      .then(data => {
        fs.writeFileSync(filePath, data);
        console.log(`  Optimized: ${filePath}`);
      });
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error);
  }
};

// Process all images in directories
const optimizeImages = async () => {
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory does not exist: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        await processImage(filePath);
      }
    }
  }
  
  console.log('Image optimization complete!');
};

// Run the optimization
optimizeImages().catch(console.error); 