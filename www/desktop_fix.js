const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

// 1. Root style.css
let rootCss = fs.readFileSync('style.css', 'utf-8');

// Quitar padding de body (buscando padding genérico de 40px 20px u otros)
rootCss = rootCss.replace(/body\s*\{([\s\S]*?)padding:\s*[^\n]*;([\s\S]*?)\}/, 'body {$1padding: 0;$2}');

// Ajustar max-width y width del container raíz
rootCss = rootCss.replace(/max-width:\s*1000px;/, 'max-width: 1200px;\n    width: 95%;');

fs.writeFileSync('style.css', rootCss);
console.log('Root style.css ajustado.');

// 2. Herramientas
fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(stylePath)) {
            console.log('Desktop Fix: ' + file);
            let css = fs.readFileSync(stylePath, 'utf-8');

            // Quitar padding del body
            css = css.replace(/body\s*\{([\s\S]*?)padding:\s*[^\n]*;([\s\S]*?)\}/, 'body {$1padding: 0;$2}');
            
            // Ajustar .content para pantallas anchas y mantener márgenes en móvil
            css = css.replace(/max-width:\s*480px;/, 'max-width: 650px;');
            css = css.replace(/width:\s*100%;/, 'width: 92%;');

            fs.writeFileSync(stylePath, css, 'utf-8');
        }
    }
});
console.log("Ajustes responsivos aplicados!");
