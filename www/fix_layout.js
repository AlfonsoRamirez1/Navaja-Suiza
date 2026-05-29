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
            
            // Reemplazar la regla ancha de .content por una regla de tarjeta estrecha similar al original
            const oldContent = `.content {
    flex-grow: 1;
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}`;
            const newContent = `.content {
    flex-grow: 1;
    padding: 32px;
    max-width: 480px;
    margin: 40px auto;
    width: 100%;
    background-color: var(--md-sys-color-surface);
    border-radius: 16px;
    box-shadow: var(--md-elevation-1);
    display: flex;
    flex-direction: column;
}`;
            
            css = css.replace(oldContent, newContent);
            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Fixed layout in: ' + file);
        }
    }
});
