import { currentPlaylist, loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;

export function loadYT() {
  controller = new YT.Player('youtube', {
    playerVars: {
      autoplay: 1,
    },
    events: {
      onReady: () => {
        controller.g.className = 'players';
      },
    },
  });

  controller.addEventListener('onStateChange', (e) => {
    // Cargado
    if (e.data === -1) {
      loadingPlayer.set(false);
      $('#youtube').css('display', 'block');
    }

    // Finalizada Reproduccion
    if (e.data === 0) handleNext();
  });
}

export function playYT(e) {
  controller.loadVideoById(e);
  controller.setVolume(currentPlaylist.getTrackData().vol);
}

export function togglePauseYT() {
  if (controller.getPlayerState() === 1) controller.pauseVideo();
  if (controller.getPlayerState() === 2) controller.playVideo();
}

export function stopYT() {
  controller.pauseVideo();
  $('#youtube').css('display', 'none');
}

export function getPositionYT() {
  return controller.getCurrentTime();
}

export function restartSongYT() {
  controller.seekTo(0, true);
}

export function normalizeYT(e) {
  controller.setVolume(e);
}
