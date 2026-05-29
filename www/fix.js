const fs = require('fs');
const path = require('path');
const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const indexPath = path.join(fullPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            let html = fs.readFileSync(indexPath, 'utf-8');
            // Reemplazar la barra invertida y n literal (\\n) por un salto de línea real (\n)
            html = html.replace(/\\n/g, '\n');
            fs.writeFileSync(indexPath, html, 'utf-8');
            console.log('Fixed HTML literal slashes: ' + file);
        }
    }
});
