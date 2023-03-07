import { TabulatorFull as Tabulator } from 'tabulator-tables';
import {
  currentPlaylist,
  songsList,
  rowOnMenu,
  selectMode,
  preventClosePlaylist,
  autoComplete,
} from './stateStore';
import { handleDeselectAll, handlePlay } from './controls';
import { openPlaylist, playlistTable } from './playlist';
import { createAutoComplete } from './addSong';
import { getSongs } from './db';

loadSongsTable();

export const songsTable = new Tabulator('#songsTable', {
  data: null,
  placeholder: 'Cargando...',
  height: '100%',
  layout: 'fitColumns',
  autoResize: true,
  columns: [
    {
      title: '#',
      hozAlign: 'center',
      formatter: 'rownum',
      widthGrow: 0.15,
      resizable: false,
      headerSort: false,
    },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: false },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: false },
    { title: 'Album', field: 'album', hozAlign: 'center', resizable: false },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.4, resizable: false },
  ],
});

export async function loadSongsTable() {
  songsList.set(await getData());
  songsTable.replaceData(songsList.get());

  if (currentPlaylist.list.length !== 0) currentPlaylist.track = currentPlaylist.track;
}

/* 
  ///////////
    Eventos
  ///////////
*/
// Click en Play & Aplicar filtro rapido
songsTable.on('cellClick', (e, cell) => {
  const row = cell.getRow();
  const rowHtml = row.getElement();
  const rowIndex = row.getPosition();
  const rowsOrder = songsTable.rowManager.activeRows;
  const tempList = [];

  // Aplicar solo si el click ocurrio en Play & la cancion seleccionada no esta en reproduccion
  if (typeof cell.getField() === 'undefined' && !$(rowHtml).attr('playing')) {
    if (!selectMode.get()) {
      currentPlaylist.wipe();

      rowsOrder.forEach((value) => {
        tempList.push(value.getData());
      });

      currentPlaylist.list = tempList;
      currentPlaylist.track = rowIndex - 1;

      handlePlay(row.getData());

      preventClosePlaylist.trigger();
      openPlaylist();
    } else playSelected();
  }

  // Filtro Rapido
  if (!selectMode.get()) {
    const { artist, album } = row.getData();

    if (cell.getField() === 'artist') toggleFindSong(false, artist);
    if (cell.getField() === 'album') toggleFindSong(false, album);
  }
});

export function playSelected() {
  currentPlaylist.wipe();
  currentPlaylist.list = selectMode.selected;
  currentPlaylist.track = 0;

  handleDeselectAll();
  handlePlay(currentPlaylist.list[0]);

  preventClosePlaylist.trigger();
  openPlaylist();
}

/*

  Menu Contextual

*/
// Click derecho = Mostrar menu contextual
songsTable.on('rowContext', (e, row) => {
  const limit = window.innerWidth - e.clientX - 220;
  let x = e.pageX;
  let y = e.pageY;

  // Limpiar menu
  $(document).trigger('click');

  // Aplicar CCSs
  if (limit > 0) $('#songsList-modal').attr('to-right', '');
  else {
    $('#songsList-modal').attr('to-left', '');
    x = e.clientX - 200;
  }

  $('#songsList-modal').css({
    display: 'block',
    left: `${x}px`,
    top: `${y}px`,
  });

  if (!selectMode.get()) $(row.getElement()).attr('selected', '');

  e.preventDefault();
  rowOnMenu.row = row; // Variable que contiene el Row que abrio el menu.
});

// Limpiar efectos del menu contextual al hacer click
$(document).on('click', () => {
  const { row } = rowOnMenu;

  $('#songsList-modal').css('display', 'none');
  $('#songsList-modal').removeAttr('to-right');
  $('#songsList-modal').removeAttr('to-left');

  // No limpiar si esta en modo seleccion
  if (row !== null && !selectMode.get()) $(row.getElement()).removeAttr('selected');
});

// Limpiar efectos del menu contextual al hacer scroll
$(document).on('scroll', () => $(document).trigger('click'));

/*

  Modo Seleccion

*/
// Preparar o Remover modo seleccion
selectMode.onChange((e) => {
  const rows = songsTable.getRows();

  if (e) {
    // Preparar puntero de la lista
    rows.forEach((value) => {
      const html = value.getElement();
      $(html).attr('selecting', '');
    });

    // Seleccionar el row que inicio el modo seleccion
    $(rowOnMenu.row.getElement()).trigger('click');

    // Eliminar los numeros en la columna #
    songsTable.columnManager.columns[0].updateDefinition({ formatter: null });

    // Mostrar menu contextual del modo seleccion
    $('#songsList-modal if').attr('hidden', '');
    $('#songsList-modal else').removeAttr('hidden');
  } else {
    // Remover puntero de la lista
    rows.forEach((value) => {
      const html = value.getElement();
      $(html).removeAttr('selecting');
    });

    // Agregar de vuelta los numeros en la columna #
    songsTable.columnManager.columns[0].updateDefinition({ formatter: 'rownum' });

    // Mostrar menu contextual normal
    $('#songsList-modal if').removeAttr('hidden');
    $('#songsList-modal else').attr('hidden', '');
  }
});

// Seleccionar o deseleccionar el Row en el que se hizo click.
// Aplicar cambios tanto de forma visible en el CSS como en el array de seleccion.
songsTable.on('rowClick', (e, rawRow) => {
  const rowHtml = rawRow.getElement();
  const rowData = rawRow.getData();

  // Aplicar solo si esta en modo seleccion & el click no es sobre play.
  if (selectMode.get() && rowHtml.children[0] !== e.target) {
    // Seleccionar el row, o deseleccionar el row si ya estaba seleccionado.
    if (!$(rowHtml).attr('selected') || selectMode.selectSize() === 0) {
      $(rowHtml).attr('selected', '');
      selectMode.selected.push(rowData);
    } else {
      const filterSelect = selectMode.selected.filter((value) => value.id !== rowData.id);
      selectMode.selected = filterSelect;

      $(rowHtml).removeAttr('selected');
      $(rowHtml.children[0]).text('');
    }

    // Enumerar & organizar el orden de los row segun su posicion en el array.
    setTimeout(() => {
      selectMode.selected.map((value, k) => {
        const foundRow = songsTable.searchRows((valua) => value.id === valua.id)[0];
        const foundHtml = $(foundRow.getElement())[0];
        $(foundHtml.children[0]).text(k + 1);
      });
    }, 5);

    // Salir del modo seleccion si se deseleccionaron todos los row.
    if (selectMode.selectSize() === 0) selectMode.set(false);
  }
});

/*

  Otros

*/
// Cambios en la lista al Reproducir/Detener
currentPlaylist.onTrackChange(({ track, prevTrack }) => {
  $(getRowHtml(prevTrack.id)).removeAttr('playing');
  $(getRowHtml(track.id)).attr('playing', 'true');

  $(getPlaylistRowHtml(prevTrack.id)).removeAttr('playing');
  $(getPlaylistRowHtml(track.id)).attr('playing', 'true');
});

currentPlaylist.onWipe((e) => {
  const { id } = e;
  if (id) $(getRowHtml(id)).removeAttr('playing');
});

// Mostrar busqueda de canciones.
export function toggleFindSong(isClick = true, arg) {
  const btnHtml = document.getElementById('addSong-findButton');
  const inputHtml = document.getElementById('addSong-findInput');

  // Preparar filtros de forma normal si es desde la opcion de busqueda
  if (isClick) {
    if (btnHtml.getAttribute('show') === null) {
      setShow(true);
      inputHtml.value = '';
      $('#addSong-findInput').on('input', (e) => filterSongs(e.target.value));

      setTimeout(() => {
        inputHtml.focus();
      }, 250);
    } else {
      setShow(false);
      filterSongs('');
      $('#addSong-findInput').unbind('input');
    }
  }
  // De lo contrario, filtrar por el campo seleccionado
  else {
    setShow(true);
    inputHtml.value = arg;
    filterSongs(arg, true);

    $('#addSong-findInput').on('input', (e) => filterSongs(e.target.value));
  }

  function setShow(e) {
    if (e) {
      btnHtml.setAttribute('show', '');
      inputHtml.setAttribute('show', '');
    } else {
      btnHtml.removeAttribute('show', '');
      inputHtml.removeAttribute('show', '');
    }
  }
}

// Filtrar canciones desde la busqueda.
function filterSongs(e, singles = false) {
  songsTable.setFilter((value) => {
    const { name, artist, album } = value;

    // Si el album esta vacio y fue seleccionado desde la tabla, mostrar albumes vacios.
    if (singles && e === '') if (album !== '') return false;

    // Filtros normales
    if (name.toLowerCase().includes(e.toLowerCase())) return true;
    if (artist.toLowerCase().includes(e.toLowerCase())) return true;
    if (album.toLowerCase().includes(e.toLowerCase())) return true;

    return false;
  });

  $('#songsTable .tabulator-placeholder-contents').text('No se han encontrado coincidencias.');
}

/* Funciones internas */
async function getData() {
  const resp = await getSongs();
  const temp = [];

  autoComplete.wipe();

  resp.forEach((value) => {
    const currentValue = value.data();
    currentValue.id = value.id;

    addAutoComplete(currentValue.artist, currentValue.album);
    temp.push(currentValue);
  });

  createAutoComplete(document.getElementById('addSong-artist'), autoComplete.artist);
  createAutoComplete(document.getElementById('addSong-album'), autoComplete.album);

  return temp;
}

function addAutoComplete(art, alb) {
  const foundArtist = autoComplete.artist.find((value) => value === art);
  const foundAlbum = autoComplete.album.find((value) => value === alb);

  if (typeof foundArtist === 'undefined') autoComplete.artist.push(art);
  if (typeof foundAlbum === 'undefined' && alb !== '') autoComplete.album.push(alb);
}

function getRowHtml(id) {
  if (typeof id !== 'undefined') {
    const foundRow = songsTable.searchRows('id', '=', id)[0];
    const foundHtml = foundRow.getElement();

    return foundHtml;
  }

  return '';
}

function getPlaylistRowHtml(id) {
  if (typeof id !== 'undefined') {
    const foundRow = playlistTable.searchRows('id', '=', id)[0];
    const foundHtml = foundRow.getElement();

    return foundHtml;
  }

  return '';
}
