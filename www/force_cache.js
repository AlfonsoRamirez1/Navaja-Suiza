const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const excludeDirs = ['node_modules', 'android', 'apk', 'www', '.git', '.idea'];
const timestamp = Date.now();

// Root
let rootHtml = fs.readFileSync('index.html', 'utf-8');
rootHtml = rootHtml.replace(/href="style\.css(\?v=[0-9]+)?"/, `href="style.css?v=${timestamp}"`);
fs.writeFileSync('index.html', rootHtml);

let rootCss = fs.readFileSync('style.css', 'utf-8');
rootCss = rootCss.replace(/max-width:\s*1200px;/, 'max-width: 1000px;'); // Restore root container
fs.writeFileSync('style.css', rootCss);

fs.readdirSync(baseDir).forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory() && !excludeDirs.includes(file)) {
        const htmlPath = path.join(fullPath, 'index.html');
        const stylePath = path.join(fullPath, 'style.css');

        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf-8');
            html = html.replace(/href="style\.css(\?v=[0-9]+)?"/, `href="style.css?v=${timestamp}"`);
            fs.writeFileSync(htmlPath, html);
        }

        if (fs.existsSync(stylePath)) {
            let css = fs.readFileSync(stylePath, 'utf-8');
            // Force 480px just in case
            css = css.replace(/\.content\s*\{([\s\S]*?)max-width:[^;]+;([\s\S]*?)\}/, '.content {$1max-width: 480px !important;$2}');
            css = css.replace(/\.content\s*\{([\s\S]*?)margin:[^;]+;([\s\S]*?)\}/, '.content {$1margin: 40px auto !important;$2}');
            fs.writeFileSync(stylePath, css);
        }
    }
});
console.log('Cache busting aplicado y diseño original forzado.');
