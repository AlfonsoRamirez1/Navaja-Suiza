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

            // 1. Rename .container to .app-card-wrapper
            css = css.replace(/\.container\s*\{([\s\S]*?)\}/, '.app-card-wrapper {$1}');

            // 2. Remove padding from .app-card-wrapper so AppBar sits flush
            css = css.replace(/(\.app-card-wrapper\s*\{[\s\S]*?)padding:\s*40px;([\s\S]*?\})/, '$1padding: 0;$2');
            
            // Fix responsive query
            css = css.replace(/@media \(max-width: 480px\) \{[\s\S]*?\.container\s*\{[\s\S]*?padding:\s*25px 20px;/, `@media (max-width: 480px) {
    .app-card-wrapper {
        margin: auto;
        margin-top: max(80px, 4vh);
        margin-bottom: 40px;
        padding: 0;`);

            // 3. Rename header to .tool-header
            css = css.replace(/^( *)header\s*\{/gm, '$1.tool-header {');
            css = css.replace(/^( *)header h1\s*\{/gm, '$1.tool-header h1 {');
            css = css.replace(/^( *)header p\s*\{/gm, '$1.tool-header p {');

            // 4. Add styling for .content and .app-bar at the bottom
            css += `\n/* Flet / Material 3 AppBar & Content Padding */
.content {
    padding: 0 40px 40px 40px;
}

@media (max-width: 480px) {
    .content {
        padding: 0 20px 25px 20px;
    }
}

.app-bar {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 16px;
    color: var(--text-main);
    z-index: 100;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
.icon-button:hover { background-color: rgba(255, 255, 255, 0.1); }

.app-bar-title {
    flex-grow: 1;
    font-size: 20px;
    font-weight: 500;
    padding-left: 8px;
    font-family: 'Roboto', sans-serif;
}\n`;

            fs.writeFileSync(stylePath, css, 'utf-8');
            console.log('Restaurado y adaptado CSS en: ' + file);
        }

        // Cache busting
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css\?v=[0-9]+"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html, 'utf-8');
        }
    }
});
