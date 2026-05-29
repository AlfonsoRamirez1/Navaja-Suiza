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

            // Hacemos que el borde de la tarjeta principal (.app-card-wrapper) sea visible usando el color "outline" (gris elegante)
            // en lugar del blanco casi transparente que no se ve contra el fondo oscuro plano.
            css = css.replace(/border:\s*1px solid rgba\(255, 255, 255, 0\.05\);/, 'border: 1px solid var(--md-sys-color-outline);');
            
            // Si por alguna razón no lo encontró, lo forzamos:
            if (!css.includes('border: 1px solid var(--md-sys-color-outline);') && css.includes('.app-card-wrapper {')) {
                css = css.replace(/\.app-card-wrapper\s*\{([\s\S]*?)border:[^;]+;/g, '.app-card-wrapper {$1border: 1px solid var(--md-sys-color-outline);');
            }

            // También aumentamos la sombra para que se "despegue" del fondo
            css = css.replace(/box-shadow:\s*0 25px 50px -12px rgba\(0, 0, 0, 0\.5\), 0 0 0 1px rgba\(255,255,255,0\.02\) inset;/, 'box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);');

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Borde visible aplicado a: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
