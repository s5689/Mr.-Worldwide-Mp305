import { loadSC, playSC, stopSC } from './soundcloud';
import { loadSP, playSP, stopSP } from './spotify';
import { currentPlaylist, loadingPlayer } from './stateStore';

const SOUNDCLOUD = 'SOUNDCLOUD';
const SPOTIFY = 'SPOTIFY';
let currentSource;

// Funciones Principales
export function preloadPlayers() {
  loadSP();
  loadSC();
}

export function handlePlay(e) {
  handleStop(false);
  currentSource = e.source;

  loadingPlayer.set(true);
  switch (currentSource) {
    case SOUNDCLOUD:
      stopSP();
      playSC(e.link);
      break;

    case SPOTIFY:
      stopSC();
      playSP(e.link);
      break;
  }
}

export function handlePrev() {
  if (!loadingPlayer.get()) {
    const prev = currentPlaylist.track;
    currentPlaylist.prevTrack();
    const current = currentPlaylist.track;

    if (prev !== current) handlePlay(currentPlaylist.getTrackData());
  }
}

export function handleStop(hard = true) {
  if (hard) currentPlaylist.wipe();

  stopSP();
  stopSC();
  loadingPlayer.set(false);
}

export function handleNext() {
  if (!loadingPlayer.get()) {
    const prev = currentPlaylist.track;
    currentPlaylist.nextTrack();
    const current = currentPlaylist.track;

    if (prev !== current && !loadingPlayer.get()) handlePlay(currentPlaylist.getTrackData());
  }
}

// Funciones Internas
