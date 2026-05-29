const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

// Tokens Material 3 comunes
const materialTokens = `/* Tokens de Color Material Design 3 (Flet style) */
:root[data-theme="light"] {
    --md-sys-color-background: #fdfdfd;
    --md-sys-color-on-background: #1c1b1f;
    --md-sys-color-surface: #f3f3f3;
    --md-sys-color-surface-container: #eaeaea;
    --md-sys-color-primary: #6750a4;
    --md-sys-color-on-surface-variant: #49454f;
    --md-sys-color-outline: #cac4d0;
    --md-elevation-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
    --hover-overlay: rgba(0, 0, 0, 0.08);
    --border-focus: var(--md-sys-color-primary);
}

:root[data-theme="dark"] {
    --md-sys-color-background: #141218;
    --md-sys-color-on-background: #e6e1e5;
    --md-sys-color-surface: #201e23;
    --md-sys-color-surface-container: #2b2930;
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-surface-variant: #cac4d0;
    --md-sys-color-outline: #938f99;
    --md-elevation-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.4), 0px 1px 2px 0px rgba(0, 0, 0, 0.4);
    --hover-overlay: rgba(255, 255, 255, 0.08);
    --border-focus: var(--md-sys-color-primary);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    -webkit-tap-highlight-color: transparent;
}

body {
    background-color: var(--md-sys-color-background);
    color: var(--md-sys-color-on-background);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
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
}
`;

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const indexPath = path.join(fullPath, 'index.html');
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(indexPath) && fs.existsSync(stylePath)) {
            console.log('Procesando: ' + file);
            
            // --- 1. PROCESAR HTML ---
            const html = fs.readFileSync(indexPath, 'utf-8');
            const $ = cheerio.load(html);

            $('html').attr('data-theme', 'light');
            if ($('meta[name="theme-color"]').length) {
                $('meta[name="theme-color"]').attr('content', '#fdfdfd').attr('id', 'theme-color-meta');
            }
            $('link[href*="fonts.googleapis.com/css2?family=Inter"]').replaceWith('<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">');
            
            $('style').remove();
            $('.back-home-btn').remove();
            $('.background-glow').remove();

            // Renombrar <header> a <div class="tool-header"> para preservarlo
            const oldHeader = $('header');
            let h1Text = file;
            if (oldHeader.length) {
                h1Text = oldHeader.find('h1').text().trim() || file;
                // Renombrar el tag
                const newHeader = $('<div class="tool-header"></div>');
                newHeader.html(oldHeader.html());
                oldHeader.replaceWith(newHeader);
            }
            
            // Omitimos el texto "h1Text" en el AppBar para que no haya títulos duplicados, ya que el title estará dentro de la tarjeta
            const appBarHtml = '\n    <header class="app-bar">\n' +
            '        <div class="app-bar-leading">\n' +
            '            <a href="../index.html" class="icon-button"><i class="ph ph-arrow-left"></i></a>\n' +
            '        </div>\n' +
            '        <div class="app-bar-title"></div>\n' +
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

            // --- 2. PROCESAR CSS ---
            let css = fs.readFileSync(stylePath, 'utf-8');

            css = css.replace(/:root\s*{[\s\S]*?}/, '');
            css = css.replace(/\*\s*{[\s\S]*?}/, '');
            css = css.replace(/html\s*{[\s\S]*?}/, '');
            css = css.replace(/body\s*{[\s\S]*?}/, '');
            css = css.replace(/\.background-glow\s*{[\s\S]*?}/, '');
            css = css.replace(/@keyframes pulse\s*{[\s\S]*?}/, '');
            
            css = css.replace(/\.container\s*{[\s\S]*?}/, `.container {
    padding: 32px;
    max-width: 480px;
    margin: auto;
    margin-top: max(40px, 4vh);
    margin-bottom: 40px;
    width: 100%;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 16px;
    box-shadow: var(--md-elevation-1);
    position: relative;
}`);
            
            // Cuidado con .input-header para no renombrarlo a .input-.tool-header
            css = css.replace(/header\s*{/g, '.tool-header {');
            css = css.replace(/header h1\s*{/g, '.tool-header h1 {');
            css = css.replace(/header p\s*{/g, '.tool-header p {');

            // Quitar estilos de texto transparente del h1 original
            css = css.replace(/background: linear-gradient\(to right, #fff, #cbd5e1\);/g, 'color: var(--md-sys-color-on-background);');
            css = css.replace(/-webkit-background-clip: text;/g, '');
            css = css.replace(/background-clip: text;/g, '');
            css = css.replace(/color: transparent;/g, '');

            // Reemplazos de variables
            css = css.replace(/var\(--text-main\)/g, 'var(--md-sys-color-on-background)');
            css = css.replace(/var\(--text-muted\)/g, 'var(--md-sys-color-on-surface-variant)');
            css = css.replace(/rgba\(15,\s*23,\s*42,\s*0\.4\)/g, 'var(--md-sys-color-surface)'); 
            css = css.replace(/rgba\(30,\s*41,\s*59,\s*0\.6\)/g, 'var(--md-sys-color-surface-container)');
            css = css.replace(/rgba\(30,\s*41,\s*59,\s*0\.7\)/g, 'var(--md-sys-color-surface-container)');
            css = css.replace(/var\(--border-color\)/g, 'var(--md-sys-color-outline)');
            
            css = css.replace(/border-radius:\s*var\(--radius-lg\)/g, 'border-radius: 16px');
            css = css.replace(/border-radius:\s*var\(--radius-md\)/g, 'border-radius: 12px');
            css = css.replace(/border-radius:\s*var\(--radius-sm\)/g, 'border-radius: 8px');
            css = css.replace(/transition:\s*var\(--transition\)/g, 'transition: all 0.2s ease');

            fs.writeFileSync(stylePath, materialTokens + '\n' + css, 'utf-8');
        }
    }
});

console.log('¡Refactorización v3 completa!');
