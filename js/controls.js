import { loadSongsTable, playSelected, songsTable, toggleFindSong } from './songsList';
import { getPositionSC, loadSC, playSC, restartSongSC, stopSC, togglePauseSC } from './soundcloud';
import { getPositionSP, loadSP, playSP, restartSongSP, stopSP, togglePauseSP } from './spotify';
import { closePlaylist, openPlaylist } from './playlist';
import { toggleAddSong } from './addSong';
import { dummyStart } from './dummyAudio';
import { deleteSong } from './db';
import { toMKR } from './VME-MKR';
import {
  currentPlaylist,
  loadingPlayer,
  preventClosePlaylist,
  rowOnMenu,
  selectMode,
  stopped,
} from './stateStore';

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

  setTimeout(() => {
    switch (currentSource) {
      case SOUNDCLOUD:
        playSC(e.link);
        break;

      case SPOTIFY:
        stopped.state = false;
        playSP(e.link);
        break;
    }
  }, 30);

  dummyStart();
  toMKR(currentPlaylist.getTrackData());
}

export function handleTogglePause() {
  if (currentPlaylist.list.length !== 0) {
    switch (currentSource) {
      case SOUNDCLOUD:
        togglePauseSC();
        break;

      case SPOTIFY:
        togglePauseSP();
        break;
    }
  }
}

export async function handlePrev() {
  if (!loadingPlayer.get()) {
    let currentPosition;

    switch (currentSource) {
      case SOUNDCLOUD:
        currentPosition = await getPositionSC();
        break;

      case SPOTIFY:
        currentPosition = getPositionSP();
        break;
    }

    if (currentPosition > 5) {
      switch (currentSource) {
        case SOUNDCLOUD:
          restartSongSC();
          break;

        case SPOTIFY:
          restartSongSP();
          break;
      }
    } else {
      const prev = currentPlaylist.track;
      currentPlaylist.prevTrack();
      const current = currentPlaylist.track;

      if (prev !== current) handlePlay(currentPlaylist.getTrackData());
    }
  }
}

export function handleStop(hard = true) {
  if (hard) {
    closePlaylist();
    stopped.state = true;
    currentPlaylist.wipe();
    toMKR({ name: '', artist: '', album: '' });
  }

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

export function handleTogglePlaylist() {
  if (typeof $('#playlist-modal').attr('show') === 'undefined') openPlaylist();
  else closePlaylist();
}

export function handleShuffle() {
  const currentSong = currentPlaylist.getTrackData();
  const tempList = [];

  // Si existen canciones en la playlist, Mezclarles
  if (currentPlaylist.list.length !== 0) {
    // Cargar la lista temporal con datos sin referencia
    currentPlaylist.list.forEach((value) => tempList.push(value));

    // Mezclar lista completa
    const shuffleList = shuffleMaker();

    // Eliminar la cancion actual de la lista mezclada
    const filterList = shuffleList.filter((value) => value.id !== currentSong.id);

    // Añadir cancion actual al comienzo
    filterList.unshift(currentSong);

    currentPlaylist.list = filterList;
    currentPlaylist.track = 0;
  }
  // De lo contrario, generar una playlist con las canciones visibles
  else {
    // Obtener todas las canciones visibles
    const rowsOrder = songsTable.rowManager.activeRows;

    // Guardar sin referencia
    rowsOrder.forEach((value) => {
      tempList.push(value.getData());
    });

    // Mezclar
    const shuffleList = shuffleMaker();

    currentPlaylist.list = shuffleList;
    currentPlaylist.track = 0;

    handlePlay(currentPlaylist.getTrackData());
  }

  openPlaylist();

  function shuffleMaker() {
    let a = tempList;

    for (let k = 0; k < 20; k++) {
      a = a.sort(() => {
        return Math.random() - 0.5;
      });
    }

    return a;
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

export function handleUpdateSong() {
  const { row } = rowOnMenu;
  toggleAddSong(true, row.getData());
}

export async function handleDeleteSong() {
  const { row } = rowOnMenu;
  const data = row.getData();

  if (confirm('¿Realmente desea eliminar este elemento?')) {
    deleteSong(data.id);
    loadSongsTable();
  }
}

export function handleAddPlaylist() {
  // Si ya existe una lista en la cola, agregar canciones no repetidas al final de la misma
  if (currentPlaylist.list.length !== 0) {
    const tempList = [];

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
    currentPlaylist.list.forEach((value) => tempList.push(value));
    selectMode.selected.forEach((value) => tempList.push(value));

    currentPlaylist.list = tempList;
    currentPlaylist.track = currentPlaylist.track;
    handleDeselectAll();

    preventClosePlaylist.trigger();
    openPlaylist();
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

export function handleEscape() {
  let inFocus = null;

  // Detectar donde fue realizado el click
  document.addEventListener('click', (e) => {
    switch (document.activeElement.id) {
      case 'addSong-findButton':
        inFocus = 'findInput';
        break;

      case 'addSong-findInput':
        inFocus = 'findInput';
        break;

      case 'addSong-button':
        inFocus = 'addSong';
        break;

      case 'updateSong-button':
        inFocus = 'addSong';
        break;

      default:
        inFocus = null;
        break;
    }

    if (e.target.id === 'addSong-modal' || $('#addSong-modal').find(e.target).length !== 0)
      inFocus = 'addSong';
  });

  // Cerrar el modal de agregar canciones o la barra de busqueda al presionar escape.
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.id === 'addSong-findInput') inFocus = 'findInput';

    if (e.key === 'Escape') {
      if (inFocus === 'findInput') toggleFindSong();
      if (inFocus === 'addSong') closeAddSong();

      setTimeout(() => {
        inFocus = null;
      }, 50);
    }
  });
}
