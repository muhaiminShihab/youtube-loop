let player;

function onYouTubeIframeAPIReady() {
    const playButton = document.getElementById('playButton');
    const urlInput = document.getElementById('youtubeUrl');

    // লোকাল স্টোরেজ থেকে ভিডিও আইডি লোড করুন
    const savedVideoId = localStorage.getItem('videoId');
    if (savedVideoId) {
        urlInput.value = `https://www.youtube.com/watch?v=${savedVideoId}`;
        loadVideo(savedVideoId);
    }

    playButton.addEventListener('click', () => {
        const videoId = extractVideoId(urlInput.value);

        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }

        // লোকাল স্টোরেজে ভিডিও আইডি সংরক্ষণ করুন
        localStorage.setItem('videoId', videoId);
        loadVideo(videoId);
    });
}

function loadVideo(videoId) {
    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('videoContainer', {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'loop': 1,
                'playlist': videoId // লুপিংয়ের জন্য প্রয়োজন
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo(); // ভিডিও শেষ হলে আবার চালু হবে
    }
}

function extractVideoId(url) {
    let videoId = '';
    try {
        if (url.includes('youtube.com')) {
            videoId = new URL(url).searchParams.get("v");
        } else if (url.includes('youtu.be')) {
            videoId = url.split('/').pop().split('?')[0];
        }
    } catch (e) {
        return null;
    }
    return videoId;
}