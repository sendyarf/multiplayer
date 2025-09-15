// Global variables untuk mencegah duplikasi
let currentShakaPlayer = null;
let currentShakaUI = null;

// Menggunakan async function agar bisa memakai 'await' untuk fetch dan player.load
async function loadShakaPlayer() {
    // 1. Bersihkan player yang ada sebelumnya
    await cleanupShakaPlayer();
    
    // 2. Reset UI dan siapkan kontainer utama
    resetUI();
    const playerDiv = document.getElementById('player');
    if (!playerDiv) {
        console.error("[shaka.js] FATAL: Kontainer #player tidak ditemukan.");
        return;
    }
    playerDiv.style.display = 'flex';

    // 3. Buat kontainer untuk player dengan aspect ratio preservation
    playerDiv.innerHTML = `
        <div class="player-wrapper" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background-color:black;">
            <div id="video-container" style="position:relative; display:flex; justify-content:center; align-items:center; width:100%; height:100%;">
                <video id="shaka-video-element" 
                       autoplay 
                       muted
                       playsinline
                       style="max-width:100vw; max-height:100vh; width:auto; height:auto; object-fit:contain; background-color:black;"></video>
            </div>
        </div>
    `;

    const videoElement = document.getElementById('shaka-video-element');

    // 4. Ambil nama channel dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const shakaParam = urlParams.get('shaka');

    try {
        if (!shaka.Player.isBrowserSupported()) {
            throw new Error("Browser ini tidak mendukung Shaka Player.");
        }

        const response = await fetch('https://besoksenin.pages.dev/channels.json');
        if (!response.ok) throw new Error("Gagal memuat channels.json");
        const data = await response.json();

        const channel = data.channels.dash.find(ch => ch.name.toLowerCase() === shakaParam.toLowerCase());
        if (!channel) {
            throw new Error(`Channel '${shakaParam}' tidak ditemukan di array 'dash'.`);
        }
        
        console.log(`[shaka.js] Channel '${shakaParam}' ditemukan. Memulai Shaka Player.`);

        // Inisialisasi Shaka Player TANPA data-shaka-player attribute untuk mencegah auto-init
        currentShakaPlayer = new shaka.Player(videoElement);
        
        // Aktifkan UI kontrol bawaan Shaka Player
        const videoContainer = document.getElementById('video-container');
        currentShakaUI = new shaka.ui.Overlay(currentShakaPlayer, videoContainer, videoElement);
        
        // Konfigurasi player
        const config = {
            streaming: {
                bufferingGoal: 60,
                rebufferingGoal: 2,
                bufferBehind: 30,
                retryParameters: {
                    maxAttempts: 5,
                    baseDelay: 1000,
                    backoffFactor: 2,
                    fuzzFactor: 0.5
                }
            },
            // Aktifkan kontrol kualitas
            abr: {
                enabled: true
            }
        };

        // Tambahkan konfigurasi clearkeys jika tersedia
        if (channel.clearkeys) {
            config.drm = {
                clearKeys: channel.clearkeys
            };
        } else if (channel.keyId && channel.key) {
            // Support for legacy format (single key)
            config.drm = {
                clearKeys: {
                    [channel.keyId]: channel.key
                }
            };
        }

        currentShakaPlayer.configure(config);

        // Event listener untuk mempertahankan aspect ratio saat video dimuat
        videoElement.addEventListener('loadedmetadata', function() {
            console.log(`[shaka.js] Video dimensions: ${this.videoWidth}x${this.videoHeight}`);
            adjustVideoSize(this);
        });

        // Event listener untuk resize window (hanya jika belum ada)
        if (!window.shakaResizeListener) {
            window.shakaResizeListener = function() {
                const video = document.getElementById('shaka-video-element');
                if (video && video.videoWidth && video.videoHeight) {
                    adjustVideoSize(video);
                }
            };
            window.addEventListener('resize', window.shakaResizeListener);
        }

        // Muat manifest DASH
        try {
            await currentShakaPlayer.load(channel.url);
            console.log('[shaka.js] Stream berhasil dimuat oleh Shaka Player.');
        } catch (error) {
            console.error('[shaka.js] Gagal memuat stream:', error);
            throw error;
        }

    } catch (error) {
        console.error("[shaka.js] Terjadi kesalahan:", error);
        await cleanupShakaPlayer(); // Bersihkan jika terjadi error
        alert("Terjadi kesalahan saat memutar video: " + error.message);
    }
}

// Function untuk membersihkan player yang ada
async function cleanupShakaPlayer() {
    try {
        // Hapus event listener resize jika ada
        if (window.shakaResizeListener) {
            window.removeEventListener('resize', window.shakaResizeListener);
            window.shakaResizeListener = null;
        }

        // Destroy UI terlebih dahulu
        if (currentShakaUI) {
            try {
                currentShakaUI.destroy();
            } catch (e) {
                console.warn('[shaka.js] Error destroying UI:', e);
            }
            currentShakaUI = null;
        }

        // Destroy player
        if (currentShakaPlayer) {
            try {
                await currentShakaPlayer.destroy();
            } catch (e) {
                console.warn('[shaka.js] Error destroying player:', e);
            }
            currentShakaPlayer = null;
        }

        // Bersihkan video element
        const videoElement = document.getElementById('shaka-video-element');
        if (videoElement) {
            videoElement.pause();
            videoElement.src = '';
            videoElement.load();
        }

        console.log('[shaka.js] Player cleanup completed');
    } catch (error) {
        console.error('[shaka.js] Error during cleanup:', error);
    }
}

// Function untuk menyesuaikan ukuran video dengan mempertahankan aspect ratio
function adjustVideoSize(videoElement) {
    if (!videoElement.videoWidth || !videoElement.videoHeight) return;

    const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let newWidth, newHeight;

    if (videoAspectRatio > containerAspectRatio) {
        // Video lebih lebar dari container, sesuaikan dengan lebar
        newWidth = Math.min(containerWidth, containerWidth);
        newHeight = newWidth / videoAspectRatio;
    } else {
        // Video lebih tinggi dari container, sesuaikan dengan tinggi
        newHeight = Math.min(containerHeight, containerHeight);
        newWidth = newHeight * videoAspectRatio;
    }

    // Pastikan video tidak melebihi ukuran viewport
    if (newWidth > containerWidth) {
        newWidth = containerWidth;
        newHeight = newWidth / videoAspectRatio;
    }
    if (newHeight > containerHeight) {
        newHeight = containerHeight;
        newWidth = newHeight * videoAspectRatio;
    }

    // Apply size dengan mempertahankan centering
    videoElement.style.width = newWidth + 'px';
    videoElement.style.height = newHeight + 'px';
    
    // Pastikan video terlihat setelah resize
    videoElement.style.visibility = 'visible';
    videoElement.style.opacity = '1';
    videoElement.style.display = 'block';
    
    // Reset CSS yang bisa mempengaruhi brightness/contrast
    videoElement.style.filter = 'none';
    videoElement.style.transform = 'none';
    
    console.log(`[shaka.js] Video resized to: ${newWidth}x${newHeight} (original: ${videoElement.videoWidth}x${videoElement.videoHeight})`);
    console.log(`[shaka.js] Video aspect ratio: ${videoAspectRatio.toFixed(2)}, Container aspect ratio: ${containerAspectRatio.toFixed(2)}`);
}

// Function tambahan untuk handle fullscreen
function handleFullscreen() {
    document.addEventListener('fullscreenchange', function() {
        setTimeout(() => {
            const videoElement = document.getElementById('shaka-video-element');
            if (videoElement && videoElement.videoWidth && videoElement.videoHeight) {
                adjustVideoSize(videoElement);
            }
        }, 100);
    });
}

// Cleanup ketika page unload
window.addEventListener('beforeunload', function() {
    cleanupShakaPlayer();
});

// Initialize fullscreen handler
document.addEventListener('DOMContentLoaded', function() {
    handleFullscreen();
});