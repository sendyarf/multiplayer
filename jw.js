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
  
          // --- PERUBAHAN KRUSIAL DI SINI ---
          // Kita adopsi persis struktur dari contoh yang berhasil.
          const sources = [{
              "type": "dash", // SECARA EKSPLISIT MENETAPKAN TIPE STREAM
              "file": channel.url,
              "drm": {
                  "clearkey": { "keyId": channel.keyId, "key": channel.key }
              },
              "label": "HD" // Kita bisa tambahkan label kualitas
          }];
  
          const playerConfig = {
            playlist: [{
              title: channel.name, // Gunakan nama channel sebagai judul
              sources: sources
            }],
            autostart: true,
            width: '100%',
            height: '100%',
            aspectratio: "16:9",
          };
          // --- AKHIR PERUBAHAN ---
  
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