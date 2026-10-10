/**
 * games.utility.forum - Portal Interaction & Theme Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initAudioControls();
  initGameModal();
});

// Day & Night Mode Switcher
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeText = document.getElementById('themeStatusText');
  const themeIcon = document.getElementById('themeStatusIcon');

  // Stored theme or default to dark (night mode)
  const currentTheme = localStorage.getItem('guf_theme') || 'dark';
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = active === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('guf_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeText) themeText.textContent = 'Night';
      if (themeIcon) themeIcon.textContent = '🌙';
      if (toggleBtn) toggleBtn.title = 'Switch to Night Mode';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeText) themeText.textContent = 'Day';
      if (themeIcon) themeIcon.textContent = '☀️';
      if (toggleBtn) toggleBtn.title = 'Switch to Day Mode';
    }
  }
}

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
