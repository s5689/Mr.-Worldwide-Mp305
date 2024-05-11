import { handleNext, handlePrev, handleTogglePause } from './controls';
import { currentPlaylist } from './stateStore';

window.addEventListener('message', (e) => {
  // Conexion con VME
  if (e.data === 'VME-fetchData') {
    let response = localStorage.getItem('VME');

    if (response === null) {
      localStorage.setItem('VME', JSON.stringify({ vol: 50, mute: false }));
      response = localStorage.getItem('VME');
    }

    window.postMessage({ msg: 'VME-responseData', payload: JSON.parse(response) });
  }

  if (e.data.msg === 'VME-setData') {
    localStorage.setItem('VME', JSON.stringify(e.data.payload));
  }

  // Conexiones con MKR
  if (e.data === 'MKR-getTrackData') toMKR(currentPlaylist.getTrackData());

  if (e.data === 'MKR-Prev') handlePrev();
  if (e.data === 'MKR-TogglePause') handleTogglePause();
  if (e.data === 'MKR-Next') handleNext();
});

// Enviar metadata de la cancion actual a MKR
export function toMKR(e) {
  window.postMessage({ msg: 'MKR-TrackData', payload: e });
}

setTimeout(() => {
  toMKR({ name: '', artist: '', album: '' });
}, 250);
