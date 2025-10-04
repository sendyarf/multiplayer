// Global variables untuk mencegah duplikasi
let currentJWPlayer = null;

// Function untuk membersihkan JW Player yang ada
function cleanupJWPlayer() {
    try {
        // Hapus event listener resize jika ada
        if (window.jwResizeListener) {
            window.removeEventListener('resize', window.jwResizeListener);
            window.jwResizeListener = null;
        }

        // Destroy JW Player instance
        if (currentJWPlayer) {
            try {
                currentJWPlayer.remove();
            } catch (e) {
                console.warn('[jw.js] Error destroying player:', e);
            }
            currentJWPlayer = null;
        }

        // Bersihkan player container
        const playerDiv = document.getElementById('player');
        if (playerDiv) {
            playerDiv.innerHTML = '';
        }

        console.log('[jw.js] Player cleanup completed');
    } catch (error) {
        console.error('[jw.js] Error during cleanup:', error);
    }
}

function loadJWPlayer() {
    // 1. Bersihkan player yang ada sebelumnya
    cleanupJWPlayer();
    
    // 2. Reset UI dan siapkan kontainer utama
    resetUI();
    const playerDiv = document.getElementById('player');
    if (!playerDiv) {
        console.error("[jw.js] FATAL: Kontainer #player tidak ditemukan.");
        return;
    }
    playerDiv.style.display = 'flex';
    
    // 3. Buat kontainer untuk JW Player dengan aspect ratio preservation
    playerDiv.innerHTML = `
        <div class="player-wrapper" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background-color:black;">
            <div id="jw-player-container" style="position:relative; display:flex; justify-content:center; align-items:center; max-width:100vw; max-height:100vh; width:auto; height:auto;">
                <div id="player-error" style="color: white; text-align: center; padding: 20px; display: none;">
                    <h2>Error Memuat Video</h2>
                    <p>Mohon maaf, terjadi kesalahan saat memuat video. Silakan refresh halaman atau coba lagi nanti.</p>
                </div>
            </div>
        </div>
    `;
    
    // 4. Ambil nama channel dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const jwParam = urlParams.get('jw');

    // Gunakan path yang relatif untuk channels.json
    const channelsUrl = window.location.hostname === 'localhost' ? 
        'channels.json' : 
        `https://${window.location.hostname}/channels.json`;

    fetch(channelsUrl, {
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
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

            // Konfigurasi JW Player dengan aspect ratio preservation
            const playerConfig = {
                playlist: [{
                    title: channel.name,
                    sources: sources
                }],
                autostart: true,
                width: '100%',
                height: '100%',
                stretching: "uniform",
                displaytitle: true,
                displaydescription: false,
                controls: true,
                sharing: false,
                cast: {},
                skin: {
                    name: "seven"
                },
                // Tambahkan error handling
                abr: {
                    defaultBandwidthEstimate: 2000000,
                    bandwidthUpSwitchTarget: 0.9,
                    bandwidthDownSwitchTarget: 0.9,
                    minBitrate: { start: 100000 },
                    maxBitrate: { start: 6000000 }
                }
            };

            try {
                // Pastikan JWPlayer sudah dimuat
                if (typeof jwplayer === 'undefined') {
                    throw new Error('JWPlayer library not loaded');
                }

                // Setup JW Player di container khusus
                currentJWPlayer = jwplayer("jw-player-container").setup(playerConfig);
                
                // Event listener untuk ready state
                currentJWPlayer.on('ready', function() {
                    console.log("[jw.js] JW Player ready, setting up aspect ratio handling");
                    adjustJWPlayerSize();
                    
                    // Setup resize listener (hanya jika belum ada)
                    if (!window.jwResizeListener) {
                        window.jwResizeListener = function() {
                            adjustJWPlayerSize();
                        };
                        window.addEventListener('resize', window.jwResizeListener);
                    }
                });

                // Event listener untuk error
                currentJWPlayer.on('error', function(error) {
                    console.error('[jw.js] JW Player error:', error);
                    showError('Error memutar video. Silakan coba lagi.');
                });

                // Event listener untuk buffer
                currentJWPlayer.on('buffer', function() {
                    console.log('[jw.js] Buffering...');
                });

                // Event listener untuk metadata loaded
                currentJWPlayer.on('meta', function(event) {
                    console.log(`[jw.js] Video metadata loaded:`, event);
                    adjustJWPlayerSize();
                });

                // Event listener untuk fullscreen changes
                currentJWPlayer.on('fullscreen', function(event) {
                    setTimeout(() => {
                        adjustJWPlayerSize();
                    }, 100);
                });

                console.log("[jw.js] JW Player berhasil di-setup dengan konfigurasi aspect ratio preservation.");
                
            } catch(e) {
                console.error("[jw.js] FATAL: Gagal membuat JW Player.", e);
                showError('Gagal memuat pemutar video. Pastikan browser Anda mendukung pemutaran video.');
                cleanupJWPlayer();
            }

        } else {
            console.error(`[jw.js] Channel '${jwParam}' tidak ditemukan.`);
            showError(`Channel '${jwParam}' tidak ditemukan.`);
        }
    })
    .catch(error => {
        console.error("[jw.js] Error loading channels:", error);
        showError('Gagal memuat daftar channel. Silakan coba lagi nanti.');
        cleanupJWPlayer();
    });
}

// Function untuk menampilkan pesan error
function showError(message) {
    const errorDiv = document.getElementById('player-error');
    if (errorDiv) {
        errorDiv.style.display = 'block';
        const messageEl = errorDiv.querySelector('p');
        if (messageEl) {
            messageEl.textContent = message;
        }
    }
}

// Function untuk menyesuaikan ukuran JW Player dengan mempertahankan aspect ratio
function adjustJWPlayerSize() {
    try {
        const container = document.getElementById('jw-player-container');
        const jwPlayerElement = container.querySelector('.jwplayer');
        
        if (!container || !jwPlayerElement) {
            console.log('[jw.js] Player elements not found yet, skipping resize');
            return;
        }

        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        // Default video aspect ratio (akan di-override jika tersedia metadata)
        let videoAspectRatio = 16/9;
        
        // Coba dapatkan aspect ratio dari video jika tersedia
        if (currentJWPlayer) {
            try {
                const width = currentJWPlayer.getWidth();
                const height = currentJWPlayer.getHeight();
                if (width && height && width > 0 && height > 0) {
                    videoAspectRatio = width / height;
                }
            } catch (e) {
                // Gunakan default ratio jika gagal mendapatkan metadata
                console.log('[jw.js] Using default aspect ratio');
            }
        }

        let newWidth, newHeight;

        if (videoAspectRatio > containerAspectRatio) {
            // Video lebih lebar dari container, sesuaikan dengan lebar
            newWidth = Math.min(containerWidth * 0.95, containerWidth); // 95% untuk margin
            newHeight = newWidth / videoAspectRatio;
        } else {
            // Video lebih tinggi dari container, sesuaikan dengan tinggi
            newHeight = Math.min(containerHeight * 0.95, containerHeight); // 95% untuk margin
            newWidth = newHeight * videoAspectRatio;
        }

        // Pastikan tidak melebihi viewport
        if (newWidth > containerWidth) {
            newWidth = containerWidth * 0.95;
            newHeight = newWidth / videoAspectRatio;
        }
        if (newHeight > containerHeight) {
            newHeight = containerHeight * 0.95;
            newWidth = newHeight * videoAspectRatio;
        }

        // Apply sizing ke container
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
        
        // Resize JW Player instance
        if (currentJWPlayer) {
            currentJWPlayer.resize(newWidth, newHeight);
        }

        console.log(`[jw.js] Player resized to: ${newWidth}x${newHeight} (aspect ratio: ${videoAspectRatio.toFixed(2)}, container ratio: ${containerAspectRatio.toFixed(2)})`);

    } catch (error) {
        console.error('[jw.js] Error adjusting player size:', error);
    }
}

// Function untuk handle fullscreen
function handleJWFullscreen() {
    document.addEventListener('fullscreenchange', function() {
        setTimeout(() => {
            adjustJWPlayerSize();
        }, 200);
    });
}

// Cleanup ketika page unload
window.addEventListener('beforeunload', function() {
    cleanupJWPlayer();
});

// Initialize fullscreen handler
document.addEventListener('DOMContentLoaded', function() {
    handleJWFullscreen();
});