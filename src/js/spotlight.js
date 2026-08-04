import { isMobile, isTouchDevice } from './state.js';

export function initSpotlight() {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight || isTouchDevice || isMobile) return;

  let mouseX = -500, mouseY = -500, targetX = mouseX, targetY = mouseY;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    spotlight.classList.add('active');
  });
  document.addEventListener('mouseleave', () => spotlight.classList.remove('active'));

  function animateSpotlight() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;
    spotlight.style.left = mouseX + 'px';
    spotlight.style.top = mouseY + 'px';
    requestAnimationFrame(animateSpotlight);
  }
  animateSpotlight();
}

export function initMagnetic() {
  if (isTouchDevice || isMobile) return;
  const magneticWraps = document.querySelectorAll('.magnetic-wrap[data-magnetic]');
  magneticWraps.forEach(wrap => {
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      wrap.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    wrap.addEventListener('mouseleave', () => { wrap.style.transform = 'translate(0px, 0px)'; });
  });
}
