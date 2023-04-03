import { playSelected, songsTable } from './songsList';
// import { getPositionPYT, loadPYT, playPYT, restartSongPYT, stopPYT } from './pseudo-youtube';
import { getPositionYT, loadYT, playYT, restartSongYT, stopYT } from './youtube';
import { getPositionSC, loadSC, playSC, restartSongSC, stopSC } from './soundcloud';
import { getPositionSP, loadSP, playSP, restartSongSP, stopSP } from './spotify';
import { closePlaylist, openPlaylist } from './playlist';
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
const YOUTUBE = 'YOUTUBE';
let currentSource;

// Funciones Principales
export function preloadPlayers() {
  // loadSP();
  // loadPYT();
  loadYT();
  loadSC();

  playerModalGestures();
  playlistModalGestures();
}

export function handleShowPlayer() {
  document.querySelector('body').setAttribute('modal-opened', '');
  document.getElementById('player-modal').setAttribute('show', '');
}

export function handleLockPlayer() {
  document.documentElement.requestFullscreen();
  $('#lock-screen').css('display', 'block');

  setTimeout(() => {
    $('#lock-screen').css('opacity', 1);
  }, 0);
}

export function handleUnlockPlayer() {
  const input = document.querySelector('#lock-screen input');

  if (Number(input.value) === 100) {
    $('#lock-screen').attr('unlock', '');

    setTimeout(() => {
      $('#lock-screen').css('opacity', 0);

      setTimeout(() => {
        $('#lock-screen').css('display', 'none');
        $('#lock-screen').removeAttr('unlock');

        document.exitFullscreen();
        input.value = 0;
      }, 500);
    }, 500);
  } else {
    input.value = 0;
  }
  /*
  document.documentElement.requestFullscreen();
  $('#lock-screen').css('display', 'block');

  setTimeout(() => {
    $('#lock-screen').css('opacity', 1);
  }, 0);
  */
}

export function handleClosePlayer() {
  document.querySelector('body').removeAttribute('modal-opened');
  document.getElementById('player-modal').removeAttribute('show');
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

      case YOUTUBE:
        playYT(e.link);
        break;
    }
  }, 30);
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

      case YOUTUBE:
        currentPosition = getPositionYT();
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

        case YOUTUBE:
          restartSongYT();
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
  }

  // stopSP();
  stopSC();
  stopYT();
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

export function handleSingleAddPlaylist() {
  const { row } = rowOnMenu;
  const tempList = currentPlaylist.list;

  tempList.push(row.getData());
  currentPlaylist.list = tempList;
  currentPlaylist.track = currentPlaylist.track;

  if (currentPlaylist.list.length === 1) {
    currentPlaylist.track = 0;
    handlePlay(row.getData());
  }

  handleShowPlayer();
}

export function handleSelectMode() {
  selectMode.set(true);
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

// Gestos del Player Modal
function playerModalGestures() {
  const html = document.getElementById('player-modal');
  let start;

  html.addEventListener('touchstart', (e) => {
    start = e.changedTouches[0].clientY;
  });

  html.addEventListener('touchend', (e) => {
    const screenSize = window.outerHeight;
    const end = e.changedTouches[0].clientY;

    // Reconocer gesto solo si no esta bloqueada la pantalla
    if ($('#lock-screen').css('display') === 'none') {
      if (end - start > screenSize * 0.2) {
        handleClosePlayer();
      }
    }
  });
}

function playlistModalGestures() {
  const html = document.getElementById('playlist-modal');
  let start;

  html.addEventListener('touchstart', (e) => {
    start = e.changedTouches[0].clientX;
  });

  html.addEventListener('touchend', (e) => {
    const screenSize = window.outerWidth;
    const end = e.changedTouches[0].clientX;

    // Reconocer gesto solo si no esta bloqueada la pantalla
    if ($('#lock-screen').css('display') === 'none') {
      if (end - start > screenSize * 0.4) {
        closePlaylist();
      }
    }
  });
}
