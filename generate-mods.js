const fs = require('fs');
const path = require('path');

const modsDir = path.join(__dirname, 'public', 'mods');
const outFile = path.join(__dirname, 'public', 'mods.json');

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function prettyName(filename) {
  return filename
    .replace(/\.jar$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

if (!fs.existsSync(modsDir)) {
  console.error('❌ No public/mods folder found. Create it and add .jar files.');
  process.exit(1);
}

const files = fs.readdirSync(modsDir)
  .filter(f => f.toLowerCase().endsWith('.jar'))
  .sort();

const mods = files.map(file => {
  const fullPath = path.join(modsDir, file);
  const stats = fs.statSync(fullPath);
  return {
    name: prettyName(file),
    file: file,
    size: formatSize(stats.size),
    url: `/mods/${encodeURIComponent(file)}`
  };
});

fs.writeFileSync(outFile, JSON.stringify(mods, null, 2));
console.log(`✅ Generated mods.json with ${mods.length} mods.`);