import { loadingPlayer, stopped } from './stateStore';
import { handleNext } from './controls';
let controller;
let pause = false;
let currentPosition;

export function loadSP() {
  const callback = (e) => {
    e.iframeElement.id = 'spotify';
    e.iframeElement.className = 'players';

    e.addListener('ready', () => {
      if (!stopped.state) {
        e.play();
        pause = false;
      }

      $('#spotify').css('opacity', '1');
      loadingPlayer.set(false);
      fakePlay();
    });

    e.addListener('playback_update', (e) => {
      const { duration, position } = e.data;
      currentPosition = parseInt(position / 1000, 10);

      if (duration === position) {
        togglePauseSP();
        handleNext();
      }
    });

    controller = e;
  };

  SpotifyIframeApi.createController(document.getElementById('spotify-container'), {}, callback);
}

export function playSP(e) {
  $('#spotify').css('display', 'block');
  $('#spotify').css('opacity', '0');
  controller.loadUri(`spotify:track:${e}`);
}

export function togglePauseSP() {
  controller.togglePlay();
  pause = !pause;
}

export function stopSP() {
  $('#sp-pause-button').remove();
  $('#spotify').css('display', 'none');

  if (!pause) {
    controller.togglePlay();
    pause = true;
  }
}

export function getPositionSP() {
  return currentPosition;
}

export function restartSongSP() {
  controller.seek(-1);
}

function fakePlay() {
  const tempHtml = '<div id="sp-pause-button"></div>';
  $('#player-container').append(tempHtml);

  document.getElementById('sp-pause-button').addEventListener('click', () => {
    controller.togglePlay();
    pause = !pause;
  });
}
