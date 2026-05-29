const fs = require('fs');
const path = require('path');
const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const stylePath = path.join(fullPath, 'style.css');
        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');
            
            // Reemplazar la regla de .content
            // Buscamos eliminar flex-grow, display: flex y flex-direction: column que estiraban la tarjeta
            css = css.replace(/\.content\s*\{[\s\S]*?\}/, `.content {
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
            
            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Fixed .content in: ' + file);
        }
    }
});
