const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');

            // 1. Restaurar max-width a 480px para que parezca una tarjeta móvil centrada
            css = css.replace(/max-width:\s*650px;/, 'max-width: 480px;');
            css = css.replace(/max-width:\s*1000px;/, 'max-width: 480px;'); // por si quedó en Descuentos

            // 2. Eliminar el layout de 2 columnas (si existe)
            const duplicatePattern = /\/\* Desktop 2-Column Layout \*\/[\s\S]*?}\n}/;
            css = css.replace(duplicatePattern, '');

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Centrado original restaurado en: ' + file);
        }
    }
});
