const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

// Carpetas y archivos a ignorar
const ignoreList = [
  'node_modules',
  '.git',
  '.idea',
  '.vscode',
  'android',
  'ios',
  'www',
  'package.json',
  'package-lock.json',
  'capacitor.config.json',
  'build.js',
  '.gitignore'
];

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    if (ignoreList.includes(file)) continue;

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying files to www...');
copyDirectory(srcDir, destDir);
console.log('Done!');
