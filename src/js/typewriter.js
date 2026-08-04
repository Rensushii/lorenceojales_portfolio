import { isMobile } from './state.js';

export function initTypewriter() {
  const roleSwitcherText = document.getElementById('roleSwitcherText');
  if (!roleSwitcherText) return;

  const roles = ['Computer Engineer', 'Embedded Systems Developer', 'IoT & Robotics Enthusiast', 'Full-Stack Developer'];
  let roleIndex = 0, currentText = '';
  const typingSpeed = isMobile ? 120 : 80;
  const deletingSpeed = isMobile ? 60 : 40;
  const pauseBeforeDelete = isMobile ? 1500 : 2000;
  const pauseBeforeNext = isMobile ? 400 : 500;

  function typeChar() {
    const full = roles[roleIndex];
    if (currentText.length < full.length) {
      currentText += full.charAt(currentText.length);
      roleSwitcherText.textContent = currentText;
      setTimeout(typeChar, typingSpeed);
    } else {
      setTimeout(deleteChar, pauseBeforeDelete);
    }
  }

  function deleteChar() {
    if (currentText.length > 0) {
      currentText = currentText.slice(0, -1);
      roleSwitcherText.textContent = currentText;
      setTimeout(deleteChar, deletingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeChar, pauseBeforeNext);
    }
  }

  typeChar();
}
