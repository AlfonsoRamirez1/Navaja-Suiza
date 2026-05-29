const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];
const timestamp = Date.now();

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');
        const htmlPath = path.join(fullPath, 'index.html');

        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');

            // 1. Restaurar el borde exterior original de la tarjeta (fino y translúcido)
            css = css.replace(/border:\s*6px solid var\(--primary-color\);[^\n]*/, 'border: 1px solid rgba(255, 255, 255, 0.05);');
            css = css.replace(/box-shadow:\s*0 0 30px var\(--primary-glow\), 0 30px 60px rgba\(0, 0, 0, 0\.6\);/, 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.02) inset;');

            // 2. Restaurar los bordes internos a su grosor fino original
            css = css.replace(/border:\s*2px solid var\(--primary-color\);/g, 'border: 1px solid var(--md-sys-color-outline);');

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Bordes originales restaurados en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
