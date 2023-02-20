import { loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;

export function loadSC() {
  controller = SC.Widget('soundcloud');
}

export function playSC(e) {
  controller.load(e, {
    auto_play: false,
    buying: false,
    sharing: false,
    download: false,
    show_playcount: false,
    show_comments: false,
    callback: () => {
      $('#soundcloud').css('display', 'block');
      controller.play();
      loadingPlayer.set(false);
    },
  });

  controller.bind(SC.Widget.Events.FINISH, () => handleNext());
}

export function stopSC() {
  controller.pause();
  $('#soundcloud').css('display', 'none');
}
