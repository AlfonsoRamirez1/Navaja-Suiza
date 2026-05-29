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

            // 1. Reemplazar el primer bloque body
            css = css.replace(/body\s*\{[\s\S]*?\}/, `body {
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-background);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    margin: 0;
    overflow: hidden; /* El scroll ahora estará DENTRO del teléfono */
}`);

            // 2. Reemplazar .app-card-wrapper (El simulador de teléfono físico)
            css = css.replace(/\.app-card-wrapper\s*\{[\s\S]*?\}/, `.app-card-wrapper {
    margin: auto;
    background-color: var(--md-sys-color-background);
    border-radius: 44px; /* Bordes redondeados del teléfono */
    border: 12px solid #111; /* Bisel físico del teléfono */
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.1) inset;
    width: 100%;
    max-width: 390px; /* Ancho estándar móvil */
    height: 844px; /* Alto estándar móvil */
    max-height: calc(100vh - 40px); /* Para que no se corte en laptops pequeñas */
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}`);

            // 3. Reemplazar .content (Para que scrollee por dentro)
            css = css.replace(/\.content\s*\{[\s\S]*?\}/, `.content {
    padding: 0 24px 40px 24px;
    flex-grow: 1;
    overflow-y: auto; /* El contenido hace scroll internamente */
    overflow-x: hidden;
    /* Ocultar scrollbar en navegadores webkit para más realismo */
    scrollbar-width: none;
}
.content::-webkit-scrollbar {
    display: none;
}`);

            // 4. Asegurarnos que en móviles la media query quite todo este bisel falso
            css = css.replace(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?\n\}/g, '');
            css += `\n
@media (max-width: 480px) {
    body {
        padding: 0 !important;
        background-color: var(--md-sys-color-background) !important;
    }
    .app-card-wrapper {
        margin: 0 !important;
        max-width: 100% !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
    }
    .content {
        padding: 0 20px 25px 20px !important;
    }
}\n`;

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Teléfono literal aplicado en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
