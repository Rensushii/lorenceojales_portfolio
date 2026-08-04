// EmailJS is loaded globally via CDN script in main.js (see loadEmailJS()).
// Public keys used here (service id / template id / public key) are safe to
// expose client-side by design — EmailJS scopes sending through its own
// dashboard-configured rules, not through a secret.
const EMAILJS_PUBLIC_KEY = 'jJ0ZadOUacvrkPfPT';
const EMAILJS_SERVICE_ID = 'service_76iix6u';
const EMAILJS_TEMPLATE_ID = 'template_zdd5ea4';

export function initContactForm() {
  if (window.emailjs) {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!window.emailjs) {
      console.error('EmailJS did not load.');
      return;
    }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
      .then(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
        submitBtn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}
