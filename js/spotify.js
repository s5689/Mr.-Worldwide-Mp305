import { loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;

export function loadSP() {
  const callback = (e) => {
    e.iframeElement.id = 'spotify';
    e.iframeElement.className = 'players';

    e.addListener('ready', () => {
      e.play();
      $('#spotify').css('opacity', '1');
      loadingPlayer.set(false);
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
  $('#spotify').css('display', 'none');
  $('#spotify').attr('src', '');
}
