const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];
const timestamp = Date.now();

const customCSS = `
/* ==========================================================================
   SUPER CONTRAST CARD STYLES
   Asegura que la tarjeta resalte perfectamente contra el fondo, como el ejemplo
   ========================================================================== */

/* Tema Claro */
:root[data-theme="light"] body {
    background-color: #e2e8f0 !important; /* Gris claro para el fondo */
}
:root[data-theme="light"] .app-card-wrapper {
    background-color: #ffffff !important; /* Blanco puro para la tarjeta */
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

/* Tema Oscuro (Por Defecto) */
:root[data-theme="dark"] body, body {
    background-color: #0f172a !important; /* Azul muy oscuro para el fondo */
}
:root[data-theme="dark"] .app-card-wrapper, .app-card-wrapper {
    background-color: #1e293b !important; /* Azul pizarra más claro para la tarjeta */
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8) !important;
}

/* En móviles quitamos el fondo y bordes para que sea a pantalla completa */
@media (max-width: 480px) {
    :root[data-theme="dark"] body, body {
        background-color: #1e293b !important;
    }
    :root[data-theme="light"] body {
        background-color: #ffffff !important;
    }
    .app-card-wrapper {
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
    }
}
`;

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');
        const htmlPath = path.join(fullPath, 'index.html');

        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');

            // Quitar inyecciones anteriores para evitar basura acumulada
            css = css.replace(/\/\* ==+ \*\/\n\/\* SUPER CONTRAST CARD STYLES[\s\S]*?(?=\n\n|\Z)/g, '');
            
            // Añadir al final
            css += '\n' + customCSS;

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Estilos de alto contraste aplicados a: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
