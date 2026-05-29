const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

const materialTokensAndAppBar = `/* Tokens de Color Material Design 3 (Flet style) */
:root[data-theme="light"] {
    --md-sys-color-background: #fdfdfd;
    --md-sys-color-on-background: #1c1b1f;
    --md-sys-color-surface: #f3f3f3;
    --md-sys-color-surface-container: #eaeaea;
    --md-sys-color-primary: #6750a4;
    --md-sys-color-on-surface-variant: #49454f;
    --md-elevation-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
    --hover-overlay: rgba(0, 0, 0, 0.08);
}

:root[data-theme="dark"] {
    --md-sys-color-background: #141218;
    --md-sys-color-on-background: #e6e1e5;
    --md-sys-color-surface: #201e23;
    --md-sys-color-surface-container: #2b2930;
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-surface-variant: #cac4d0;
    --md-elevation-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.4), 0px 1px 2px 0px rgba(0, 0, 0, 0.4);
    --hover-overlay: rgba(255, 255, 255, 0.08);
}

/* Flet / Material 3 AppBar */
.app-bar {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 16px;
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-background);
    box-shadow: var(--md-elevation-1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.app-bar-leading {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}

.icon-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: inherit;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    transition: background-color 0.2s ease;
}
.icon-button:hover { background-color: var(--hover-overlay); }

.app-bar-title {
    flex-grow: 1;
    font-size: 22px;
    font-weight: 500;
    padding-left: 8px;
    font-family: 'Roboto', sans-serif;
}
`;

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const indexPath = path.join(fullPath, 'index.html');
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(indexPath) && fs.existsSync(stylePath)) {
            console.log('Fase 2 - Procesando HTML y CSS en: ' + file);
            
            // --- ACTUALIZAR HTML ---
            const html = fs.readFileSync(indexPath, 'utf-8');
            const $ = cheerio.load(html);

            $('html').attr('data-theme', 'light');
            if ($('meta[name="theme-color"]').length) {
                $('meta[name="theme-color"]').attr('content', '#fdfdfd').attr('id', 'theme-color-meta');
            }
            $('link[href*="fonts.googleapis.com/css2?family=Inter"]').replaceWith('<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">');
            
            // Quitar el botón viejo
            $('style').remove(); // Contenía .back-home-btn
            $('.back-home-btn').remove();

            // Insertar AppBar en la parte superior del body
            const h1Text = $('header h1').text().trim() || file;
            const appBarHtml = '\n    <header class="app-bar">\n' +
            '        <div class="app-bar-leading">\n' +
            '            <a href="../index.html" class="icon-button"><i class="ph ph-arrow-left"></i></a>\n' +
            '        </div>\n' +
            '        <div class="app-bar-title">' + h1Text + '</div>\n' +
            '        <div class="app-bar-actions">\n' +
            '            <button class="icon-button" id="theme-toggle" aria-label="Cambiar tema">\n' +
            '                <i class="ph ph-moon" id="theme-icon"></i>\n' +
            '            </button>\n' +
            '        </div>\n' +
            '    </header>\n';
            
            $('body').prepend(appBarHtml);

            if ($('script[src="../main.js"]').length === 0) {
                $('body').append('<script src="../main.js"></script>');
            }

            const newHtml = $.html().replace(/&#x20;/g, ' ');
            fs.writeFileSync(indexPath, newHtml, 'utf-8');

            // --- ACTUALIZAR CSS ---
            let css = fs.readFileSync(stylePath, 'utf-8');
            
            // Añadimos los tokens y estilos del AppBar al final del CSS para no romper nada viejo.
            // Para asegurar que data-theme afecte el fondo, añadimos una regla para el body temporal
            const tempBodyOverride = `
body {
    transition: background-color 0.3s ease, color 0.3s ease;
}
:root[data-theme="light"] body {
    background-color: var(--md-sys-color-background);
}
:root[data-theme="dark"] body {
    background-color: var(--md-sys-color-background);
}`;
            
            fs.writeFileSync(stylePath, css + '\\n' + materialTokensAndAppBar + tempBodyOverride, 'utf-8');
        }
    }
});
console.log("Fase 2 completada!");
