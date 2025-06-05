// Theme toggle script
(function() {
  const html = document.documentElement;
  const btnId = 'theme-toggle';
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m0-13.414l1.414 1.414M17.95 17.95l1.414 1.414"/></svg>`;
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;

  function applyInitialTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      html.classList.add('theme-light');
    }
    const btn = document.getElementById(btnId);
    if (btn) btn.innerHTML = html.classList.contains('theme-light') ? sunIcon : moonIcon;
  }

  function toggleTheme() {
    const isLight = html.classList.toggle('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.innerHTML = isLight ? sunIcon : moonIcon;
      btn.classList.add('animate-switch');
      setTimeout(() => btn.classList.remove('animate-switch'), 600);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    applyInitialTheme();
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });
})();
