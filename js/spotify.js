import { loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;
let pause = false;

export function loadSP() {
  const callback = (e) => {
    e.iframeElement.id = 'spotify';
    e.iframeElement.className = 'players';

    e.addListener('ready', () => {
      e.play();
      $('#spotify').css('opacity', '1');

      pause = false;
      loadingPlayer.set(false);

      fakePlay();
    });

    e.addListener('playback_update', (e) => {
      const { duration, position } = e.data;
      if (duration === position) handleNext();
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

export function stopSP() {
  $('#sp-pause-button').remove();
  $('#spotify').css('display', 'none');

  if (!pause) {
    controller.togglePlay();
    pause = true;
  }
}

function fakePlay() {
  const tempHtml = '<div id="sp-pause-button"></div>';
  $('#player-container').append(tempHtml);

  document.getElementById('sp-pause-button').addEventListener('click', () => {
    controller.togglePlay();
    pause = !pause;
  });
}
