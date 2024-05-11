import { currentPlaylist } from './stateStore';
import { playSC } from './soundcloud';
import { playYT } from './youtube';

export const state = {
  ytName: { html: document.querySelector('#devTools-modal #yt-name') },
  ytState: { html: document.querySelector('#devTools-modal #yt-state') },
  ytQuality: { html: document.querySelector('#devTools-modal #yt-quality') },
};

export function SetDevState(e, v) {
  state[e].value = v;
  state[e].html.innerHTML = v;
}

// Onclicks
document.querySelector('#devTools-modal #yt-stop').addEventListener('click', () => {
  playYT('');
});

document.querySelector('#devTools-modal #yt-restart').addEventListener('click', () => {
  playYT('');
  playYT(currentPlaylist.getTrackData().link);
});

document.querySelector('#devTools-modal #yt-hide').addEventListener('click', () => {
  $('#youtube-pseudoplayer').css('display', 'none');
});

document.querySelector('#devTools-modal #yt-show').addEventListener('click', () => {
  $('#youtube-pseudoplayer').css('display', 'block');
});

document.querySelector('#devTools-modal #sc-stop').addEventListener('click', () => {
  document.getElementById('soundcloud').src = 'https://w.soundcloud.com/player/?url=';
});

document.querySelector('#devTools-modal #sc-restart').addEventListener('click', () => {
  document.getElementById('soundcloud').src = 'https://w.soundcloud.com/player/?url=';
  playSC(currentPlaylist.getTrackData().link);
});

document.querySelector('#devTools-modal #sc-hide').addEventListener('click', () => {
  $('#soundcloud').css('display', 'none');
});

document.querySelector('#devTools-modal #sc-show').addEventListener('click', () => {
  $('#soundcloud').css('display', 'block');
});
