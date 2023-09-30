import { currentPlaylist, loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;
let interval;

export function loadYT() {
  controller = new YT.Player('youtube', {
    playerVars: {
      autoplay: 1,
    },
    events: {
      onReady: () => {
        controller.h.className = 'players';
      },
    },
  });

  controller.addEventListener('onStateChange', (e) => {
    // Cargado
    if (e.data === -1) {
      loadingPlayer.set(false);
      $('#youtube-pseudoplayer').css('display', 'block');
      $('#ytp-time-current').text('0:00');
      $('#ytp-pause').css('opacity', 0);
      $('#ytp-seekbar').val(0);
    }

    // Finalizada Reproduccion
    if (e.data === 0) handleNext();

    // Eventos Play/Pause, respectivamente.
    if (e.data === 1) $('#ytp-pause').css('opacity', 0);
    if (e.data === 2) $('#ytp-pause').css('opacity', 1);
  });

  controller.addEventListener('onError', (e) => {
    if (e.data === 150 || e.data === 101) handleNext();
  });
}

export function playYT(e) {
  controller.loadVideoById(e);
  controller.setVolume(currentPlaylist.getTrackData().vol);

  // Pseudo-player cosas.
  const track = currentPlaylist.getTrackData();
  const seconds = parseInt(track.fullTime / 1000, 10);
  let seeking = false;

  $('#ytp-thumbicon').attr('src', `https://img.youtube.com/vi/${e}/maxresdefault.jpg`);
  $('#ytp-name').text(`${track.name}`);
  $('#ytp-artist-album').text(`${track.artist}${track.album !== '' ? ` - ${track.album}` : ''}`);
  $('#ytp-time-total').text(track.time);
  $('#ytp-seekbar').attr('max', seconds);

  interval = setInterval(() => {
    let time;

    if (controller.getPlayerState() === 1 && !seeking) {
      time = controller.getCurrentTime();
    } else {
      time = $('#ytp-seekbar').val();
    }

    time = Math.round(Number(time));
    const m = Math.floor(time / 60);
    const s = time - m * 60;

    if ($('#ytp-seekbar').val() != time || seeking) {
      $('#ytp-time-current').text(`${m}:${s < 10 ? `0${s}` : s}`);
      $('#ytp-seekbar').val(time);
    }
  }, 200);

  document.getElementById('ytp-seekbar').addEventListener('pointermove', () => (seeking = true));
  document.getElementById('ytp-seekbar').addEventListener('change', (e) => {
    controller.seekTo(e.target.value, true);
    seeking = false;
  });
}

export function togglePauseYT() {
  if (controller.getPlayerState() === 1) controller.pauseVideo();
  if (controller.getPlayerState() === 2) controller.playVideo();
}

export function stopYT() {
  controller.pauseVideo();
  $('#youtube-pseudoplayer').css('display', 'none');

  clearInterval(interval);
}

export function getPositionYT() {
  return controller.getCurrentTime();
}

export function restartSongYT() {
  controller.seekTo(0, true);
}
