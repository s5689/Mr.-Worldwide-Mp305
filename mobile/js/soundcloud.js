import { loadSongsTable } from './songsList';
import { currentPlaylist, loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;

export function loadSC() {
  controller = SC.Widget('soundcloud');
  loadSongsTable();
}

export function playSC(e) {
  controller.load(e, {
    auto_play: false,
    buying: false,
    sharing: false,
    download: false,
    show_playcount: false,
    show_comments: false,
    visual: true,
    callback: () => {
      $('#soundcloud').css('display', 'block');
      controller.play();
      controller.setVolume(currentPlaylist.getTrackData().vol * 0.8);
      loadingPlayer.set(false);
    },
  });

  controller.bind(SC.Widget.Events.FINISH, () => handleNext());
}

export function togglePauseSC() {
  controller.toggle();
}

export function stopSC() {
  controller.pause();
  $('#soundcloud').css('display', 'none');
}

export async function getPositionSC() {
  let resp;
  controller.getPosition((e) => (resp = parseInt(e / 1000, 10)));

  await sleep(10);
  return resp;

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function restartSongSC() {
  controller.seekTo(0);
}
