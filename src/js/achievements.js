import { achievementData } from '../data/achievements.js';
import { openModal } from './state.js';

export function initAchievements() {
  window.openAchievementModal = function (index) {
    const data = achievementData[index];
    if (!data) return;
    document.getElementById('achievementModalImg').src = data.img;
    document.getElementById('achievementModalTitle').textContent = data.title;
    document.getElementById('achievementModalSub').textContent = data.subtitle;
    document.getElementById('achievementModalVenue').textContent = data.venue;
    document.getElementById('achievementModalDate').textContent = data.date;
    document.getElementById('achievementModalBody').innerHTML = data.body;
    openModal('modal-achievement');
  };
}
