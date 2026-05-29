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

            // 1. Forzar que el body tenga el color del "Surface Container" (más oscuro/gris) para que la tarjeta contraste
            css = css.replace(/:root\[data-theme="light"\]\s*body\s*\{\s*background-color:\s*var\(--md-sys-color-background\);\s*\}/g, ':root[data-theme="light"] body { background-color: var(--md-sys-color-surface-container); }');
            css = css.replace(/:root\[data-theme="dark"\]\s*body\s*\{\s*background-color:\s*var\(--md-sys-color-background\);\s*\}/g, ':root[data-theme="dark"] body { background-color: var(--md-sys-color-surface-container); }');

            // Si el body base también tiene background, lo actualizamos
            css = css.replace(/body\s*\{([\s\S]*?)background-color:\s*var\(--md-sys-color-background\);([\s\S]*?)\}/, 'body {$1background-color: var(--md-sys-color-surface-container);$2}');

            // 2. Modificar .app-card-wrapper para que luzca exactamente como un simulador de teléfono (Tarjeta central)
            css = css.replace(/\.app-card-wrapper\s*\{[\s\S]*?z-index:\s*1;\n\}/, `.app-card-wrapper {
    margin: 40px auto;
    background-color: var(--md-sys-color-background);
    border-radius: 32px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--md-sys-color-outline) inset;
    width: 100%;
    max-width: 414px; /* Ancho típico de un teléfono grande */
    min-height: 850px; /* Alto típico de un teléfono */
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}`);

            // 3. Modificar .content para que llene el espacio vertical sin estirar los elementos
            // Si ya existe .content, lo reemplazamos
            css = css.replace(/\.content\s*\{\s*padding:\s*0 40px 40px 40px;\s*\}/, `.content {
    padding: 0 30px 40px 30px;
    flex-grow: 1; /* Permite que el fondo de la tarjeta llegue hasta abajo */
}`);

            // 4. Medias Queries para Móviles Reales (eliminar tarjeta, ocupar 100% de la pantalla)
            // Borrar medias queries antiguas de max-width: 480px si existen
            css = css.replace(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]*?\n\}/g, '');

            // Insertar nueva media query al final
            css += `\n
@media (max-width: 480px) {
    body {
        padding: 0 !important;
    }
    .app-card-wrapper {
        margin: 0 !important;
        max-width: 100% !important;
        min-height: 100dvh !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
    }
    .content {
        padding: 0 20px 25px 20px !important;
    }
}\n`;

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Tarjeta de teléfono aplicada en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
