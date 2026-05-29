document.addEventListener('DOMContentLoaded', () => {
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
});