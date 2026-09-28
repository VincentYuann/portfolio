import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Automated Asset Pipeline:
 * 1. Reads raw source images from raw-assets/{background,decorators,images}
 *    (or any images dropped into public/)
 * 2. Compresses them into high-efficiency WebP files
 * 3. Places the WebP files cleanly into public/{background,decorators,images}
 * 4. Ensures raw uncompressed files stay in raw-assets/, keeping public/ 100% WebP!
 */

const FOLDERS = ['background', 'decorators', 'images'];

async function processFolder(folder) {
  const rawDir = path.join('raw-assets', folder);
  const pubDir = path.join('public', folder);

  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

  // 1. Move any raw files accidentally placed in public/ over to raw-assets/
  const pubFiles = fs.readdirSync(pubDir);
  for (const f of pubFiles) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const pubPath = path.join(pubDir, f);
      const rawPath = path.join(rawDir, f);
      fs.renameSync(pubPath, rawPath);
      console.log(`📦 Moved raw file from public/ to raw-assets/: ${folder}/${f}`);
    }
  }

  // 2. Process all raw assets and output optimized WebP to public/
  const rawFiles = fs.readdirSync(rawDir);
  for (const file of rawFiles) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue;

    const inputPath = path.join(rawDir, file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(pubDir, `${baseName}.webp`);

    const stat = fs.statSync(inputPath);
    if (!stat.isFile()) continue;

    try {
      const info = await sharp(inputPath)
        .webp({ quality: 82, effort: 5 })
        .toFile(outputPath);

      const savedPercent = Math.round((1 - info.size / stat.size) * 100);
      const originalKb = Math.round(stat.size / 1024);
      const newKb = Math.round(info.size / 1024);

      console.log(`✓ ${folder}/${file}: ${originalKb} KB → public/${folder}/${baseName}.webp: ${newKb} KB (${savedPercent}% saved)`);
    } catch (err) {
      console.warn(`✗ Skipped ${file}:`, err.message);
    }
  }
}

async function main() {
  console.log('🖼️  Running Automated Image Pipeline (raw-assets/ → public/)... \n');
  for (const folder of FOLDERS) {
    console.log(`📁 Processing ${folder}...`);
    await processFolder(folder);
  }
  console.log('\n✨ All images in public/ are 100% WebP! Raw source files preserved in raw-assets/.');
}

main();
