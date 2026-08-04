import { isMobile } from './state.js';

export function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  const loaderStartTime = Date.now();
  const MIN_LOADER_DURATION = isMobile ? 800 : 1500;

  if (loader) {
    loader.style.display = 'flex';
    document.body.classList.add('loading');
  }

  window._loaderHidden = false;
  window._loaderReady = false;

  window.hideLoadingScreen = function () {
    window._loaderReady = true;
    const elapsed = Date.now() - loaderStartTime;
    const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);
    setTimeout(() => {
      if (window._loaderHidden) return;
      window._loaderHidden = true;
      const el = document.getElementById('loading-screen');
      if (!el) return;
      el.classList.add('loader-fade-out');
      document.body.classList.remove('loading');
      setTimeout(() => { if (el) el.style.display = 'none'; }, 500);
    }, remaining);
  };

  const fallbackTimer = setTimeout(() => window.hideLoadingScreen?.(), 5000);
  window.addEventListener('load', () => {
    clearTimeout(fallbackTimer);
    window.hideLoadingScreen?.();
  });
}
