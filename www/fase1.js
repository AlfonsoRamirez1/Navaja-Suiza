const fs = require('fs');

// --- 1. CREAR main.js ---
const mainJsContent = `document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;
    const themeMeta = document.getElementById('theme-color-meta');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'ph ph-moon' : 'ph ph-sun';
        }
        if (themeMeta) {
            themeMeta.setAttribute('content', theme === 'light' ? '#fdfdfd' : '#141218');
        }
    }
});`;
fs.writeFileSync('main.js', mainJsContent);

// --- 2. ACTUALIZAR index.html ---
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace('<html lang="es">', '<html lang="es" data-theme="light">');
html = html.replace('<meta name="theme-color" content="#0f172a">', '<meta name="theme-color" content="#fdfdfd" id="theme-color-meta">');
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]*" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">');
html = html.replace('<div class="background-glow"></div>', '');

const themeButtonHtml = `
            <button id="theme-toggle" class="theme-btn" aria-label="Cambiar tema">
                <i class="ph ph-moon" id="theme-icon"></i>
            </button>`;
html = html.replace('<header>', '<header>' + themeButtonHtml);

if (!html.includes('main.js')) {
    html = html.replace('</body>', '    <script src="main.js"></script>\n</body>');
}
fs.writeFileSync('index.html', html);

// --- 3. ACTUALIZAR style.css ---
let css = fs.readFileSync('style.css', 'utf-8');

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
}`;

css = css.replace(/:root\s*\{[\s\S]*?\}/, materialTokens);
css = css.replace(/font-family: 'Inter'/g, "font-family: 'Roboto'");
css = css.replace(/var\(--bg-dark\)/g, 'var(--md-sys-color-background)');
css = css.replace(/var\(--text-main\)/g, 'var(--md-sys-color-on-background)');
css = css.replace(/var\(--text-muted\)/g, 'var(--md-sys-color-on-surface-variant)');
css = css.replace(/var\(--border-color\)/g, 'var(--md-sys-color-outline)');
css = css.replace(/var\(--border-focus\)/g, 'var(--md-sys-color-primary)');
css = css.replace(/var\(--radius-lg\)/g, '16px');
css = css.replace(/var\(--radius-md\)/g, '12px');
css = css.replace(/var\(--radius-sm\)/g, '8px');

// Quitar glassmorphism de container
css = css.replace(/background-color: rgba\(30, 41, 59, 0\.7\);/g, 'background-color: var(--md-sys-color-surface-container);');
css = css.replace(/backdrop-filter: blur\(20px\);/g, '');
css = css.replace(/-webkit-backdrop-filter: blur\(20px\);/g, '');
css = css.replace(/border: 1px solid rgba\(255, 255, 255, 0\.05\);/g, '');
css = css.replace(/box-shadow: 0 25px 50px -12px rgba\(0, 0, 0, 0\.5\),\s*0 0 0 1px rgba\(255,255,255,0\.02\) inset;/g, 'box-shadow: var(--md-elevation-1);');

// Limpiar background-glow y text gradient del h1
css = css.replace(/\.background-glow\s*\{[\s\S]*?\}/, '');
css = css.replace(/@keyframes pulse\s*\{[\s\S]*?\}/, '');
css = css.replace(/background: linear-gradient\(to right, #fff, #cbd5e1\);/g, 'color: var(--md-sys-color-on-background);');
css = css.replace(/-webkit-background-clip: text;/g, '');
css = css.replace(/background-clip: text;/g, '');
css = css.replace(/color: transparent;/g, '');

// Tarjetas de aplicaciones
css = css.replace(/background-color: rgba\(15, 23, 42, 0\.4\);/g, 'background-color: var(--md-sys-color-surface);');
css = css.replace(/background-color: rgba\(30, 41, 59, 0\.8\);/g, 'background-color: var(--md-sys-color-surface-container);');
css = css.replace(/background-color: rgba\(30, 41, 59, 0\.5\);/g, 'background-color: var(--md-sys-color-surface-container);');

// Botón de tema
const themeBtnCss = `

.theme-btn {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--md-sys-color-on-background);
    font-size: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease;
}
.theme-btn:hover {
    background-color: var(--hover-overlay);
}
header {
    position: relative;
}`;

css += themeBtnCss;
fs.writeFileSync('style.css', css);
console.log("Fase 1 completada!");
