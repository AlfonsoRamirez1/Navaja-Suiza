const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(stylePath)) {
            console.log('Fase 4 - Procesando Inputs y Botones en CSS: ' + file);
            let css = fs.readFileSync(stylePath, 'utf-8');

            // 1. Limpiar .input-group
            css = css.replace(/background-color: rgba\(15, 23, 42, 0\.4\);/g, 'background-color: var(--md-sys-color-surface);');
            css = css.replace(/background-color: rgba\(15, 23, 42, 0\.6\);/g, 'background-color: var(--md-sys-color-surface-container-high, var(--md-sys-color-surface-container));');
            
            // 2. Reemplazar Variables globales de texto y bordes
            css = css.replace(/var\(--text-main\)/g, 'var(--md-sys-color-on-background)');
            css = css.replace(/var\(--text-muted\)/g, 'var(--md-sys-color-on-surface-variant)');
            css = css.replace(/var\(--border-color\)/g, 'var(--md-sys-color-outline)');
            css = css.replace(/var\(--border-focus\)/g, 'var(--primary-color)');

            // 3. Reemplazar radios fijos
            css = css.replace(/var\(--radius-lg\)/g, '16px');
            css = css.replace(/var\(--radius-md\)/g, '12px');
            css = css.replace(/var\(--radius-sm\)/g, '8px');
            
            // 4. Reemplazar transition
            css = css.replace(/var\(--transition\)/g, 'all 0.2s ease');

            // 5. Ajustar focos
            css = css.replace(/box-shadow: 0 0 0 2px rgba\([0-9]+, [0-9]+, [0-9]+, 0\.1\);/g, 'box-shadow: 0 0 0 2px var(--primary-glow);');

            // 6. Limpiar tarjeta de resultados (quitar gradientes fijos que asumen fondo oscuro)
            css = css.replace(/\.results-card\s*\{[\s\S]*?\}/, `.results-card {
    background-color: var(--md-sys-color-surface-container);
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    padding: 25px;
    margin-top: 10px;
}`);

            fs.writeFileSync(stylePath, css, 'utf-8');
        }
    }
});
console.log("Fase 4 completada!");
