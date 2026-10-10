/**
 * games.utility.forum - Portal Interaction & UI Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAudioControls();
  initGameFilters();
  initGameModal();
  loadLiveLeaderboard();
});

// Mobile Navigation Toggle
function initNavigation() {
  const toggleBtn = document.querySelector('.btn-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }
}

// Audio HUD Integration
function initAudioControls() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioText = document.getElementById('audioStatusText');

  if (!audioBtn) return;

  function updateUi(state) {
    if (state.isPlaying && !state.isMuted) {
      audioBtn.classList.add('playing');
      if (audioText) audioText.textContent = 'SYNTH ON';
    } else {
      audioBtn.classList.remove('playing');
      if (audioText) audioText.textContent = state.isMuted ? 'MUTED' : 'PLAY BGM';
    }
  }

  // Bind audio engine state changes
  if (window.gufAudio) {
    window.gufAudio.onChange(updateUi);
    audioBtn.addEventListener('click', () => {
      window.gufAudio.toggleMusic();
    });
  }
}

// Filter Games By Tag
function initGameFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gameCards = document.querySelectorAll('.game-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      gameCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Modal Quick-Play System
function initGameModal() {
  const playBtns = document.querySelectorAll('[data-play-game]');
  const modal = document.getElementById('gameModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const iframe = document.getElementById('gameIframe');
  const modalTitle = document.getElementById('modalGameTitle');

  if (!modal || !iframe) return;

  playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const gameUrl = btn.getAttribute('data-play-game');
      const title = btn.getAttribute('data-game-title') || 'Playing Game';

      if (modalTitle) modalTitle.textContent = title;
      iframe.src = gameUrl;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Play click SFX
      if (window.gufAudio) window.gufAudio.playLaser();
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    iframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Load Leaderboard on Home Page
async function loadLiveLeaderboard() {
  const boardEl = document.getElementById('leaderboardList');
  if (!boardEl || !window.gufStorage) return;

  try {
    const scores = await window.gufStorage.getLeaderboard('neon-snake', 5);
    boardEl.innerHTML = scores.map((item, index) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.7rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="font-family:var(--font-mono); color:${index === 0 ? 'var(--amber-neon)' : 'var(--cyan-neon)'}; font-weight:700;">#${index + 1}</span>
          <span style="font-weight:600;">${item.player_name || 'Pilot'}</span>
        </div>
        <span style="font-family:var(--font-mono); color:var(--emerald-neon); font-weight:700;">${item.score.toLocaleString()} PTS</span>
      </div>
    `).join('');
  } catch (e) {
    console.error('Leaderboard render error:', e);
  }
}
