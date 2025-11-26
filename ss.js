function loadSSPlayer() {
    resetUI();

    const iframePlayer = document.getElementById('video-iframe');
    if (iframePlayer) {
        iframePlayer.style.display = 'block';
    } else {
        console.error("[ss.js] FATAL: Kontainer #video-iframe tidak ditemukan.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const ssParam = urlParams.get('ss');
  
    if (ssParam) {
        let category = 'hd';
        
        // Logika diperbarui: menambahkan pengecekan untuk 'btv'
        if (ssParam.includes('sporttv') || ssParam.includes('eleven') || ssParam.includes('btv')) {
            category = 'pt';
        }
        else if (ssParam.includes('br')) {
            category = 'bra';
        }
        
        // Domain diperbarui ke sportsonline.sn sesuai contoh Anda
        iframePlayer.src = `https://sportsonline.sn/channels/${category}/${ssParam}.php`;
    }
}
