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

            // 1. Quitar el background-glow
            css = css.replace(/\.background-glow\s*\{[\s\S]*?\}/, '');
            css = css.replace(/@keyframes pulse\s*\{[\s\S]*?\}/, '');

            // 2. Body
            css = css.replace(/background-color:\s*var\(--bg-dark\);/, 'background-color: var(--md-sys-color-background);');
            css = css.replace(/color:\s*var\(--text-main\);/g, 'color: var(--md-sys-color-on-background);');

            // 3. Wrapper (.app-card-wrapper)
            css = css.replace(/background-color:\s*rgba\(30, 41, 59, 0\.7\);/, 'background-color: var(--md-sys-color-surface-container);');
            css = css.replace(/backdrop-filter:\s*blur\(20px\);/g, '');
            css = css.replace(/-webkit-backdrop-filter:\s*blur\(20px\);/g, '');
            css = css.replace(/border:\s*1px solid rgba\(255, 255, 255, 0\.05\);/, 'border: none;');

            // 4. Textos y encabezados
            // Quitar degradado del h1
            css = css.replace(/background:\s*linear-gradient\(to right, #fff, #cbd5e1\);/g, 'color: var(--md-sys-color-on-background);');
            css = css.replace(/-webkit-background-clip:\s*text;/g, '');
            css = css.replace(/background-clip:\s*text;/g, '');
            css = css.replace(/color:\s*transparent;/g, '');

            // Textos muteados
            css = css.replace(/color:\s*var\(--text-muted\);/g, 'color: var(--md-sys-color-on-surface-variant);');

            // 5. Inputs y contenedores
            css = css.replace(/background-color:\s*rgba\(15, 23, 42, 0\.4\);/g, 'background-color: var(--md-sys-color-surface);');
            css = css.replace(/border:\s*1px solid var\(--border-color\);/g, 'border: 1px solid var(--md-sys-color-outline);');
            css = css.replace(/color:\s*#475569;/g, 'color: var(--md-sys-color-on-surface-variant);');
            css = css.replace(/background-color:\s*rgba\(15, 23, 42, 0\.6\);/g, 'background-color: var(--md-sys-color-surface-container-high, var(--md-sys-color-surface-container));');

            // 6. Tarjetas de resultados
            css = css.replace(/background:\s*linear-gradient\(135deg, rgba\(245, 158, 11, 0\.1\), rgba\(217, 119, 6, 0\.05\)\);/g, 'background-color: var(--md-sys-color-surface-container);');
            css = css.replace(/border:\s*1px solid rgba\(245, 158, 11, 0\.2\);/g, 'border: 1px solid var(--md-sys-color-outline);');

            // 7. Asegurar las variables de color (Theme)
            if (!css.includes(':root[data-theme="light"]')) {
                css += `\n/* Variables de Color (Theme) */
:root[data-theme="light"] {
    --md-sys-color-background: #fdfdfd;
    --md-sys-color-on-background: #1c1b1f;
    --md-sys-color-surface: #f3f3f3;
    --md-sys-color-surface-container: #eaeaea;
    --md-sys-color-primary: #6750a4;
    --md-sys-color-on-surface-variant: #49454f;
    --md-sys-color-outline: #cac4d0;
    --md-elevation-1: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
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
}\n`;
            }

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Aplicada estética de menú principal en: ' + file);
        }

        // Quitar <div class="background-glow"> del HTML
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/<div class="background-glow"><\/div>/g, '');
            // Cache busting
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
