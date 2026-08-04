import { certificationsData, categoryLabels } from '../data/certifications.js';

function renderCertifications(filter = 'all') {
  const container = document.getElementById('certsGrid');
  if (!container) return;
  let filtered = certificationsData;
  if (filter !== 'all') {
    filtered = certificationsData.filter(cert => cert.categories.includes(filter));
  }
  container.innerHTML = '';
  filtered.forEach((cert) => {
    const card = document.createElement('div');
    card.className = 'cert-card';

    const img = document.createElement('img');
    img.src = cert.imgUrl;
    img.alt = cert.title;
    img.loading = 'lazy';
    img.className = 'cert-img';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'cert-info';
    const tagsHtml = cert.categories.map(cat => `<span class="cert-tag">${categoryLabels[cat] || cat}</span>`).join('');
    infoDiv.innerHTML = `
      <div class="cert-title">${cert.title}</div>
      <div class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</div>
      <div class="cert-tags">${tagsHtml}</div>
    `;

    card.appendChild(img);
    card.appendChild(infoDiv);
    container.appendChild(card);
  });
}

export function initCertifications() {
  renderCertifications('all');
  document.querySelectorAll('#certFilterBar .filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#certFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderCertifications(this.getAttribute('data-filter'));
    });
  });
}
