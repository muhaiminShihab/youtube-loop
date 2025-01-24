let player;

function onYouTubeIframeAPIReady() {
    document.getElementById('playButton').addEventListener('click', () => {
        // console.log('Play button clicked');
        
        const urlInput = document.getElementById('youtubeUrl').value;
        const videoId = extractVideoId(urlInput);

        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }

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
                    'playlist': videoId // Needed for looping
                },
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo(); // Restart video when it ends
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