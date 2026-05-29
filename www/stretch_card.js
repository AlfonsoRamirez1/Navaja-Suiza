const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');
        const htmlPath = path.join(fullPath, 'index.html');

        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');

            // 1. Modificar el wrapper para que ocupe la altura de la pantalla menos 80px (40 arriba y 40 abajo)
            if (!css.includes('min-height: calc(100vh - 80px);')) {
                css = css.replace(/\.app-card-wrapper\s*\{/, `.app-card-wrapper {\n    min-height: calc(100vh - 80px);\n    display: flex;\n    flex-direction: column;`);
            }

            // 2. Modificar el .content para que se estire ocupando el espacio disponible dentro del flex
            if (!css.includes('flex-grow: 1;')) {
                css = css.replace(/\/\* El content ya no necesita ser una tarjeta separada \*\/\n\.content\s*\{/, `/* El content ya no necesita ser una tarjeta separada */\n.content {\n    flex-grow: 1;\n    display: flex;\n    flex-direction: column;`);
            }

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Márgenes y altura ajustados en: ' + file);
        }

        // Cache busting again to ensure they see it
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            const timestamp = Date.now();
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
