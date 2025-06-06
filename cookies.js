// cookies.js
// Banner logic for cookie consent with Accept/Decline and fade-in effect

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    if (!banner || !acceptBtn || !declineBtn) return;

    // Helper to show/hide with fade
    function showBanner() {
        banner.classList.remove('hidden');
        setTimeout(() => banner.classList.add('opacity-100'), 10);
        banner.classList.remove('opacity-0');
    }
    function hideBanner() {
        banner.classList.remove('opacity-100');
        banner.classList.add('opacity-0');
        setTimeout(() => banner.classList.add('hidden'), 500);
    }

    // Check consent
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' || consent === 'declined') {
        hideBanner();
    } else {
        showBanner();
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideBanner();
    });
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        hideBanner();
    });
});
