// Theme toggle script
(function() {
  const html = document.documentElement;
  const btnId = 'theme-toggle';
  const icons = {
    light: {
      theme: 'icons/dark-button.svg',
      home: 'icons/home-light.svg',
      back: 'icons/back-light.svg'
    },
    dark: {
      theme: 'icons/light-button.svg',
      home: 'icons/home-dark.svg',
      back: 'icons/back-dark.svg'
    }
  };

  function swapIcon(img, src, alt) {
    if (!img) return;
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = src;
      img.alt = alt;
      img.style.opacity = '1';
    }, 150);
  }

  function updateIcons(isLight) {
    const variant = isLight ? 'light' : 'dark';
    swapIcon(
      document.querySelector('#theme-icon'),
      icons[variant].theme,
      isLight ? 'Icon lună' : 'Icon soare'
    );
    swapIcon(document.querySelector('#home-icon'), icons[variant].home, 'Acasă');
    swapIcon(document.querySelector('#back-icon'), icons[variant].back, 'Înapoi');
  }

  function applyInitialTheme() {
    const stored = localStorage.getItem('theme');
    let isLight;
    if (stored) {
      isLight = stored === 'light';
    } else {
      // consider existing class="dark" or "theme-light" on the <html> element
      isLight = html.classList.contains('theme-light') || !html.classList.contains('dark');
    }
    if (isLight) {
      html.classList.add('theme-light');
    } else {
      html.classList.remove('theme-light');
    }
    updateIcons(isLight);
  }

  function toggleTheme() {
    const isLight = html.classList.toggle('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.add('animate-switch');
      setTimeout(() => btn.classList.remove('animate-switch'), 600);
    }
    updateIcons(isLight);
  }

  document.addEventListener('DOMContentLoaded', function() {
    applyInitialTheme();
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });
})();
