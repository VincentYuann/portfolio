import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Script to scan public directories and convert PNG/JPG images to WebP.
 * Run anytime with: npm run optimize-images
 */
const DIRS_TO_SCAN = [
  path.join('public', 'decorators'),
  path.join('public', 'images'),
  path.join('public', 'background'),
];

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue;

    const inputPath = path.join(dir, file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(dir, `${baseName}.webp`);

    // Check if input is a file (not directory)
    const stat = fs.statSync(inputPath);
    if (!stat.isFile()) continue;

    try {
      const info = await sharp(inputPath)
        .webp({ quality: 82, effort: 5 })
        .toFile(outputPath);

      const savedPercent = Math.round((1 - info.size / stat.size) * 100);
      const originalKb = Math.round(stat.size / 1024);
      const newKb = Math.round(info.size / 1024);

      console.log(`✓ ${file}: ${originalKb} KB → ${newKb} KB (${savedPercent}% saved) → ${baseName}.webp`);
    } catch (err) {
      console.warn(`✗ Skipped ${file}:`, err.message);
    }
  }
}

async function main() {
  console.log('🖼️  Optimizing images to WebP format...\n');
  for (const dir of DIRS_TO_SCAN) {
    console.log(`📁 Scanning ${dir}...`);
    await optimizeDirectory(dir);
  }
  console.log('\n✨ Image optimization complete! All assets are ready in modern WebP format.');
}

main();
