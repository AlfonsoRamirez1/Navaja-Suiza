const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];
const timestamp = Date.now();

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const htmlPath = path.join(fullPath, 'index.html');
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(htmlPath) && fs.existsSync(stylePath)) {
            // 1. Modificar HTML para envolver AppBar y Content
            let html = fs.readFileSync(htmlPath, 'utf-8');
            const $ = cheerio.load(html);

            // Si no está ya envuelto
            if (!$('.app-card-wrapper').length) {
                const appBar = $('.app-bar');
                const content = $('.content');
                
                if (appBar.length && content.length) {
                    // Crear wrapper
                    const wrapper = $('<div class="app-card-wrapper"></div>');
                    appBar.before(wrapper);
                    wrapper.append(appBar);
                    wrapper.append(content);
                }
            }

            // Actualizar caché CSS
            html = $.html().replace(/&#x20;/g, ' ');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');

            // 2. Modificar CSS para estilizar el wrapper como la única tarjeta
            let css = fs.readFileSync(stylePath, 'utf-8');

            // Añadir estilos del wrapper si no existen
            if (!css.includes('.app-card-wrapper {')) {
                css += `\n/* Wrapper para contener todo en una sola tarjeta */
.app-card-wrapper {
    max-width: 480px;
    margin: auto;
    margin-top: max(40px, 4vh);
    margin-bottom: 40px;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 16px;
    box-shadow: var(--md-elevation-1);
    overflow: hidden;
    width: 92%;
    position: relative;
}

/* El content ya no necesita ser una tarjeta separada */
.content {
    background-color: transparent !important;
    box-shadow: none !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    border-radius: 0 !important;
    padding-top: 20px;
}

/* El AppBar se adapta dentro de la tarjeta */
.app-bar {
    position: relative !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border-bottom: 1px solid var(--md-sys-color-outline);
}\n`;
            }

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Envuelto en tarjeta única: ' + file);
        }
    }
});
