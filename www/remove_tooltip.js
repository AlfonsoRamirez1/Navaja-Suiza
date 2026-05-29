const fs = require('fs');
const path = require('path');
const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

// Función para remover el span en un archivo HTML
function removeTooltip(filePath) {
    if (fs.existsSync(filePath)) {
        let html = fs.readFileSync(filePath, 'utf-8');
        html = html.replace(/<span class="tooltip">Cambiar tema<\/span>/g, '');
        fs.writeFileSync(filePath, html, 'utf-8');
    }
}

// 1. Limpiar el archivo principal en la raíz
removeTooltip(path.join(baseDir, 'index.html'));

// 2. Limpiar los archivos dentro de las carpetas de herramientas
fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const indexPath = path.join(fullPath, 'index.html');
        removeTooltip(indexPath);
        console.log('Tooltip removido en: ' + file);
    }
});
