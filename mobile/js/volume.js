import { currentPlaylist, songsList } from './stateStore';
import { normalizeSC } from './soundcloud';
import { normalizeYT } from './youtube';
import { loadSongsTable } from './songsList';

const valueHtml = document.getElementById('volume-value');
const barHtml = document.getElementById('volume-control');
let enabled = false;

export function enableVolume(e) {
  const track = currentPlaylist.getTrackData();
  enabled = true;

  setVolume(track);
}

export function disableVolume() {
  enabled = false;
  setVolume();
}

export function closeVolumeModal() {
  const track = currentPlaylist.getTrackData();

  document.getElementById('volume-modal').removeAttribute('show');

  if (enabled) {
    setVolume(track);
  }
}

export function handleUpdateVolume() {
  if (enabled) {
    const tempTrack = currentPlaylist.getTrackData();
    tempTrack.vol = barHtml.value;

    loadSongsTable(tempTrack);

    setTimeout(() => {
      closeVolumeModal();
    }, 500);
  }
}

/*
  Preparar eventos
*/
// Cambios sobre el scroll
barHtml.addEventListener('pointermove', (e) => {
  setVolume({ vol: e.target.value });
});

// Aplicar volumen al soltar el dedo
barHtml.addEventListener('change', (e) => {
  setVolume({ vol: e.target.value });
});

function setVolume(e) {
  if (enabled) {
    valueHtml.innerHTML = `${e.vol}%`;
    barHtml.value = e.vol;

    switch (currentPlaylist.getTrackData().source) {
      case 'SOUNDCLOUD':
        normalizeSC(e.vol);
        break;

      case 'YOUTUBE':
        normalizeYT(e.vol);
        break;
    }
  } else {
    valueHtml.innerHTML = '¿?';
    barHtml.value = 50;
  }
}
