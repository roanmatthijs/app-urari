function initCookies() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    const banner = document.getElementById('cookie-banner');
    const btn = document.getElementById('accept-cookies');
    if (!banner || !btn) return;
    if (localStorage.getItem('cookiesAccepted')) {
        banner.style.display = 'none';
    } else {
        banner.style.display = 'flex';
        btn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', initCookies);
