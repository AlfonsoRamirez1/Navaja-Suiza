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

            // 1. Fondo de la pantalla (body): lo hacemos el más oscuro (Background)
            css = css.replace(/body\s*\{([\s\S]*?)background-color:\s*[^;]+;/g, 'body {$1background-color: var(--md-sys-color-background);');
            
            // 2. Fondo de la tarjeta (.app-card-wrapper): lo hacemos más claro (Surface Container) para que destaque
            // y le damos un borde blanco translúcido fuerte para que imite el diseño original.
            css = css.replace(/\.app-card-wrapper\s*\{([\s\S]*?)background-color:\s*[^;]+;[\s\S]*?border:[^;]+;/, `.app-card-wrapper {$1background-color: var(--md-sys-color-surface-container);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.15);`);

            // 3. Por si acaso, asegurarse de que el borde se aplique si la expresión regular falló en atraparlo:
            if (!css.includes('border: 1px solid rgba(255, 255, 255, 0.15);') && css.includes('.app-card-wrapper {')) {
                css = css.replace(/\.app-card-wrapper\s*\{([\s\S]*?)border:[^;]+;/g, '.app-card-wrapper {$1border: 1px solid rgba(255, 255, 255, 0.15);');
            }

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Contraste y borde aplicados en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
