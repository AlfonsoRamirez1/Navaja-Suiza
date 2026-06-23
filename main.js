document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

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
        if (theme === 'dark') {
            htmlElement.classList.add('ion-palette-dark');
            htmlElement.classList.remove('ion-palette-light');
            if (themeIcon) themeIcon.name = 'sunny';
        } else {
            htmlElement.classList.add('ion-palette-light');
            htmlElement.classList.remove('ion-palette-dark');
            if (themeIcon) themeIcon.name = 'moon';
        }
    }
});