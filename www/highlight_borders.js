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

            // 1. Resaltar el borde exterior (el marco del simulador .app-card-wrapper)
            // Cambia el borde de 12px solid #111 a 6px solid var(--primary-color)
            css = css.replace(/border:\s*12px solid #111;/, 'border: 6px solid var(--primary-color);');
            
            // Y para que brille un poco, cambiamos el box-shadow:
            css = css.replace(/box-shadow:\s*0 30px 60px rgba\(0, 0, 0, 0\.6\), 0 0 0 1px rgba\(255,255,255,0\.1\) inset;/, 'box-shadow: 0 0 30px var(--primary-glow), 0 30px 60px rgba(0, 0, 0, 0.6);');

            // 2. Resaltar los bordes internos (input-group, results-card, discount-item, etc)
            // Reemplazamos todos los bordes de "outline" por bordes de color primario más gruesos
            css = css.replace(/border:\s*1px solid var\(--md-sys-color-outline\);/g, 'border: 2px solid var(--primary-color);');

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Bordes resaltados en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
