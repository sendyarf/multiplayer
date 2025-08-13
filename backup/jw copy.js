function loadJWPlayer() {
  resetUI(); // Reset UI, ini sudah benar
  
  const playerDiv = document.getElementById('player');
  playerDiv.style.display = 'block'; // Tampilkan kontainer, ini sudah benar
  
  const urlParams = new URLSearchParams(window.location.search);
  const jwParam = urlParams.get('jw');

  fetch('channels.json')
    .then(response => response.json())
    .then(data => {
      const channel = data.channels.dash.find(ch => ch.name.toLowerCase() === jwParam.toLowerCase());
      
      if (channel) {
        console.log(`[jw.js] Channel '${jwParam}' ditemukan. Membuat konfigurasi final.`);

        // Buat objek konfigurasi DRM
        const drmConfig = {};
        
        // Handle multiple clearkeys
        if (channel.clearkeys) {
          Object.entries(channel.clearkeys).forEach(([keyId, key], index) => {
            drmConfig[`clearkey${index > 0 ? index + 1 : ''}`] = { keyId, key };
          });
        } else if (channel.keyId && channel.key) {
          // Support for legacy format (single key)
          drmConfig.clearkey = { keyId: channel.keyId, key: channel.key };
        }

        // Konfigurasi sumber video dengan DRM
        const sources = [{
            "type": "dash",
            "file": channel.url,
            "drm": drmConfig,
            "label": "HD"
        }];

        const playerConfig = {
          playlist: [{
            title: channel.name,
            sources: sources
          }],
          autostart: true,
          width: '100%',
          height: '100%',
          aspectratio: "16:9",
        };

        try {
            jwplayer("player").setup(playerConfig);
            console.log("[jw.js] JW Player berhasil di-setup dengan konfigurasi eksplisit.");
        } catch(e) {
            console.error("[jw.js] FATAL: Gagal membuat JW Player.", e);
        }

      } else {
        console.error(`[jw.js] Channel '${jwParam}' tidak ditemukan.`);
      }
    })
    .catch(error => console.error("[jw.js] FATAL:", error));
}