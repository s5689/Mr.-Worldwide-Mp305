import { playSelected, songsTable } from './songsList';
import { loadSC, playSC, stopSC } from './soundcloud';
import { loadSP, playSP, stopSP } from './spotify';
import { currentPlaylist, loadingPlayer, rowOnMenu, selectMode } from './stateStore';

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

export function handlePlayFromMenu(isClick = true) {
  const { row } = rowOnMenu;
  const playCell = row.getCells()[0].getElement();

  if (isClick) $(playCell).trigger('click');
  else playSelected();
}

export function handleSelectMode() {
  selectMode.set(true);
}

export function handleAddPlaylist() {
  // Si ya existe una lista en la cola, agregar canciones no repetidas al final de la misma
  if (currentPlaylist.list.length !== 0) {
    currentPlaylist.list.forEach((value) => {
      // limpiar la seleccion repetida del css.
      const foundSelect = selectMode.selected.find((valua) => valua.id === value.id);

      if (foundSelect) {
        const foundRow = songsTable.searchRows('id', '=', foundSelect.id)[0];
        $(foundRow.getElement()).trigger('click');
      }

      // Limpiar de la seleccion repetida de las canciones seleccionadas
      const filterSelect = selectMode.selected.filter((valua) => valua.id !== value.id);
      selectMode.selected = filterSelect;
    });

    // Enviar al final de la lista actual las canciones restantes
    selectMode.selected.forEach((value) => currentPlaylist.list.push(value));
    handleDeselectAll();
  } else playSelected(); // Si no existe, reproducir seleccion de forma normal
}

export function handleSelectAll() {
  songsTable.getRows().forEach((value) => {
    const data = value.getData();
    const foundSelect = selectMode.selected.find((valua) => valua.id === data.id);

    if (typeof foundSelect === 'undefined') $(value.getElement()).trigger('click');
  });
}

export function handleDeselectAll() {
  selectMode.selected.forEach((value) => {
    const foundRow = songsTable.searchRows('id', '=', value.id)[0];

    $(foundRow.getElement()).trigger('click');
  });
}

// Funciones Internas
