function resetUI() {
  console.log("[reset.js] Mereset semua antarmuka player.");

  // 1. Reset kontainer player
  const playerDiv = document.getElementById('player');
  if (playerDiv) {
    playerDiv.style.display = 'none';
    playerDiv.innerHTML = '';
  }

  // 2. Reset kontainer iframe
  const iframePlayer = document.getElementById('video-iframe');
  if (iframePlayer) {
    iframePlayer.style.display = 'none';
    iframePlayer.src = 'about:blank';
  }

  // 3. Reset dropdown Envivo
  const envivoDropdown = document.querySelector('.envivo-dropdown-container');
  if (envivoDropdown) {
    envivoDropdown.remove();
  }

  // 4. WAJIB: Reset kontainer homepage
  const homepageDiv = document.getElementById('homepage-content');
  if (homepageDiv) {
      homepageDiv.style.display = 'none';
  }
}