import { handleNext, handlePrev, handleTogglePause } from './controls';
import { currentPlaylist } from './stateStore';

window.addEventListener('message', (e) => {
  // Conexion con VME
  if (e.data === 'larry is that you?') window.postMessage("it's me, DIO");

  // Conexiones con MKR
  if (e.data === 'MKR-getTrackData') toMKR(currentPlaylist.getTrackData());

  if (e.data === 'MKR-Prev') handlePrev();
  if (e.data === 'MKR-TogglePause') handleTogglePause();
  if (e.data === 'MKR-Next') handleNext();
});

// Enviar metadata de la cancion actual a MKR
export function toMKR(e) {
  window.postMessage({ msg: 'MKR-TrackData', value: e });
}

setTimeout(() => {
  toMKR({ name: '', artist: '', album: '' });
}, 250);
