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

            // 1. Restaurar el fondo del body a --bg-dark
            css = css.replace(/body\s*\{([\s\S]*?)background-color:\s*[^;]+;/g, 'body {$1background-color: var(--bg-dark);');

            // 2. Restaurar la tarjeta a Glassmorphism exacto
            css = css.replace(/\.app-card-wrapper\s*\{([\s\S]*?)background-color:\s*[^;]+;[\s\S]*?border-radius:[^;]+;[\s\S]*?border:[^;]+;/, `.app-card-wrapper {$1background-color: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.05);`);

            // Y su sombra original
            css = css.replace(/box-shadow:[^;]+;/, 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.02) inset;');

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Efecto Glassmorphism y fondo oscuro original restaurados en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
