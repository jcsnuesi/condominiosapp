// Restore only an explicit preference. OS dark mode does not select a partial theme.
(() => {
    try {
        if (localStorage.getItem('condapp-color-scheme') !== 'dark') return;
        document.documentElement.classList.add('app-dark');
        document.getElementById('theme-css').setAttribute('href', 'assets/layout/styles/theme/lara-dark-blue/theme.css');
    } catch {
        // Storage may be disabled; the default light theme remains usable.
    }
})();
