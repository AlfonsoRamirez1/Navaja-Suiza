const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const indexPath = path.join(fullPath, 'index.html');
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(indexPath) && fs.existsSync(stylePath)) {
            console.log('Fase 3 - Procesando HTML y CSS en: ' + file);
            
            // --- ACTUALIZAR HTML ---
            const html = fs.readFileSync(indexPath, 'utf-8');
            const $ = cheerio.load(html);

            // Quitar glow de fondo
            $('.background-glow').remove();

            // Actualizar la tarjeta y el header interno
            const container = $('.container');
            if (container.length) {
                container.removeClass('container').addClass('content');
                // IMPORTANTE: asegurar que el body NO sea .container ni se rompa.
                
                // Cambiar el viejo <header> a <div class="tool-header">
                const oldHeader = container.find('header');
                if (oldHeader.length) {
                    const newHeader = $('<div class="tool-header"></div>');
                    newHeader.html(oldHeader.html());
                    oldHeader.replaceWith(newHeader);
                }
            }

            const newHtml = $.html().replace(/&#x20;/g, ' ');
            fs.writeFileSync(indexPath, newHtml, 'utf-8');

            // --- ACTUALIZAR CSS ---
            let css = fs.readFileSync(stylePath, 'utf-8');
            
            // 1. Quitar .background-glow y pulse
            css = css.replace(/\.background-glow\s*\{[\s\S]*?\}/, '');
            css = css.replace(/@keyframes pulse\s*\{[\s\S]*?\}/, '');
            
            // 2. Reemplazar .container por .content con estilos Material planos
            css = css.replace(/\.container\s*\{[\s\S]*?\}/, `.content {
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

            // 3. Renombrar header a .tool-header CON CUIDADO (usando \b para no agarrar .input-header)
            // ^header { o header {
            css = css.replace(/^( *)header\s*\{/gm, '$1.tool-header {');
            css = css.replace(/^( *)header h1\s*\{/gm, '$1.tool-header h1 {');
            css = css.replace(/^( *)header p\s*\{/gm, '$1.tool-header p {');

            // Quitar estilos de degradado de texto (glassmorphism) en .tool-header h1
            css = css.replace(/background: linear-gradient\(to right, #fff, #cbd5e1\);/g, 'color: var(--md-sys-color-on-background);');
            css = css.replace(/-webkit-background-clip: text;/g, '');
            css = css.replace(/background-clip: text;/g, '');
            css = css.replace(/color: transparent;/g, '');

            fs.writeFileSync(stylePath, css, 'utf-8');
        }
    }
});
console.log("Fase 3 completada!");
