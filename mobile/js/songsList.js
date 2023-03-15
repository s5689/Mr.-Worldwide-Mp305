import { TabulatorFull as Tabulator } from 'tabulator-tables';
import {
  currentPlaylist,
  songsList,
  rowOnMenu,
  selectMode,
  preventClosePlaylist,
} from './stateStore';
import { handleDeselectAll, handlePlay } from './controls';
import { openPlaylist, playlistTable } from './playlist';
import { getConfig, getSongs } from './db';

export const songsTable = new Tabulator('#songsTable', {
  data: null,
  placeholder: 'Cargando...',
  height: '100%',
  layout: 'fitColumns',
  autoResize: true,
  headerVisible: false,
  columns: [
    {
      field: 'play',
      hozAlign: 'center',
      formatter: 'rownum',
      resizable: false,
      widthGrow: 0.1,
    },
    {
      field: 'name',
      hozAlign: 'left',
      resizable: false,
      width: '45%',
    },
    {
      field: 'artist',
      hozAlign: 'left',
      resizable: false,
      width: '44%',
      sorter: columnSorter('artist'),
    },
    {
      field: 'album',
      resizable: false,
      visible: false,
      sorter: columnSorter('album'),
    },
    {
      field: 'options',
      hozAlign: 'center',
      resizable: false,
      widthGrow: 0.1,
    },
  ],
});

// Organizacion personalizada de columnas.
function columnSorter(e) {
  switch (e) {
    case 'artist':
      return (_, __, a, b, ___, dir) => {
        const aData = a.getData();
        const aName = aData.name.toLowerCase();
        const aArtist = aData.artist.toLowerCase();

        const bData = b.getData();
        const bName = bData.name.toLowerCase();
        const bArtist = bData.artist.toLowerCase();

        if (dir === 'asc') {
          const aRes = `${aArtist} - ${aName}}`;
          const bRes = `${bArtist} - ${bName}}`;

          if (aRes > bRes) return 1;
          return -1;
        }

        if (dir === 'desc') {
          if (aArtist !== bArtist) {
            if (aArtist > bArtist) return 1;
            return -1;
          }

          if (aName > bName) return -1;
          return 1;
        }
      };

    case 'album':
      return (_, __, a, b, ___, dir) => {
        const aData = a.getData();
        const aAlbum = aData.album.toLowerCase();
        const aNumber = aData.number < 10 ? `0${aData.number}` : aData.number;

        const bData = b.getData();
        const bAlbum = bData.album.toLowerCase();
        const bNumber = bData.number < 10 ? `0${bData.number}` : bData.number;

        if (dir === 'asc') {
          const aRes = `${aAlbum} - ${aNumber}}`;
          const bRes = `${bAlbum} - ${bNumber}}`;

          if (aRes > bRes) return 1;
          return -1;
        }

        if (dir === 'desc') {
          if (aAlbum !== bAlbum) {
            if (aAlbum > bAlbum) return 1;
            return -1;
          }

          if (aNumber > bNumber) return -1;
          return 1;
        }
      };
  }
}

export async function loadSongsTable() {
  songsList.set(await getData());
  songsTable.replaceData(songsList.get());
  toggleOrderSong();

  if (currentPlaylist.list.length !== 0) currentPlaylist.track = currentPlaylist.track;
}

/* 
  ///////////
    Eventos
  ///////////
*/
// Reproducir al seleccionar & gestionar selecciones.
songsTable.on('rowClick', (e, rawRow) => {
  console.log();
  const rowHtml = rawRow.getElement();
  const rowData = rawRow.getData();

  // Reproducir al seleccionar algun row si no esta en modo seleccion.
  if (!selectMode.get()) {
    // Aplicar solo si la cancion seleccionada no esta en reproduccion
    if (!$(rowHtml).attr('playing')) {
      const rowIndex = rawRow.getPosition();
      const rowsOrder = songsTable.rowManager.activeRows;
      const tempList = [];

      currentPlaylist.wipe();

      rowsOrder.forEach((value) => {
        tempList.push(value.getData());
      });

      currentPlaylist.list = tempList;
      currentPlaylist.track = rowIndex - 1;

      handlePlay(rawRow.getData());

      preventClosePlaylist.trigger();
      openPlaylist();
    }
  }
  // Seleccionar o deseleccionar el Row en el que se hizo click.
  else {
    // Seleccionar el row, o deseleccionar el row si ya estaba seleccionado.
    if (!$(rowHtml).attr('selected') || selectMode.selectSize() === 0) {
      $(rowHtml).attr('selected', '');
      selectMode.selected.push(rowData);
    } else {
      const filterSelect = selectMode.selected.filter((value) => value.id !== rowData.id);
      selectMode.selected = filterSelect;

      $(rowHtml).removeAttr('selected');
    }

    // Salir del modo seleccion si se deseleccionaron todos los row.
    setTimeout(() => {
      if (selectMode.selectSize() === 0) selectMode.set(false);
    }, 0);
  }
});

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

    // Mostrar menu contextual del modo seleccion
    $('#songsList-modal if').attr('hidden', '');
    $('#songsList-modal else').removeAttr('hidden');
  } else {
    // Remover puntero de la lista
    rows.forEach((value) => {
      const html = value.getElement();
      $(html).removeAttr('selecting');
    });

    // Mostrar menu contextual normal
    $('#songsList-modal if').removeAttr('hidden');
    $('#songsList-modal else').attr('hidden', '');
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
  const btnHtml = document.getElementById('songsList-findButton');
  const inputHtml = document.getElementById('songsList-findInput');

  // Preparar filtros de forma normal si es desde la opcion de busqueda
  if (isClick) {
    if (btnHtml.getAttribute('show') === null) {
      setShow(true);
      inputHtml.value = '';
      $('#songsList-findInput').on('input', (e) => filterSongs(e.target.value));

      setTimeout(() => {
        inputHtml.focus();
      }, 250);
    } else {
      setShow(false);
      filterSongs('');
      $('#songsList-findInput').unbind('input');
    }
  }
  // De lo contrario, filtrar por el campo seleccionado
  else {
    setShow(true);
    inputHtml.value = arg;
    filterSongs(arg, true);

    $('#songsList-findInput').on('input', (e) => filterSongs(e.target.value));
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

// Orden de las canciones.
let songDir = 'asc';
export function toggleOrderSong() {
  // Asignar Direccion y CSS al boton
  songsTable.setSort('name', songDir);
  document.getElementById('songsList-orderSong').setAttribute('using', '');

  // Cambiar direccion si se presiona nuevamente
  if (songDir === 'asc') songDir = 'desc';
  else songDir = 'asc';

  // Reiniciar estados de los otros botones
  artistDir = 'asc';
  albumDir = 'asc';

  document.getElementById('songsList-orderArtist').removeAttribute('using');
  document.getElementById('songsList-orderAlbum').removeAttribute('using');
}

let artistDir = 'asc';
export function toggleOrderArtist() {
  // Asignar Direccion y CSS al boton
  songsTable.setSort('artist', artistDir);
  document.getElementById('songsList-orderArtist').setAttribute('using', '');

  // Cambiar direccion si se presiona nuevamente
  if (artistDir === 'asc') artistDir = 'desc';
  else artistDir = 'asc';

  // Reiniciar estados de los otros botones
  songDir = 'asc';
  albumDir = 'asc';

  document.getElementById('songsList-orderSong').removeAttribute('using');
  document.getElementById('songsList-orderAlbum').removeAttribute('using');
}

let albumDir = 'asc';
export function toggleOrderAlbum() {
  // Asignar Direccion y CSS al boton
  songsTable.setSort('album', albumDir);
  document.getElementById('songsList-orderAlbum').setAttribute('using', '');

  // Cambiar direccion si se presiona nuevamente
  if (albumDir === 'asc') albumDir = 'desc';
  else albumDir = 'asc';

  // Reiniciar estados de los otros botones
  songDir = 'asc';
  artistDir = 'asc';

  document.getElementById('songsList-orderSong').removeAttribute('using');
  document.getElementById('songsList-orderArtist').removeAttribute('using');
}

// Filtrar canciones desde la busqueda.
function filterSongs(e, singles = false) {
  songsTable.setFilter((value) => {
    const { name, number, artist, album, source } = value;

    // Si el album esta vacio y fue seleccionado desde la tabla, mostrar albumes vacios.
    if (singles && e === '') if (album !== '') return false;

    // Codigos Especiales
    // <SP / <SC: filtrar por fuente.
    if (e.toLowerCase() === '<sp') {
      if (source === 'SPOTIFY') return true;
    }

    if (e.toLowerCase() === '<sc') {
      if (source === 'SOUNDCLOUD') return true;
    }

    // <NN: filtrar canciones sin numero de pista
    if (e.toLowerCase() === '<nn') {
      if (typeof number === 'undefined') return true;
    }

    // <WN: filtrar canciones con numero de pista
    if (e.toLowerCase() === '<wn') {
      if (typeof number !== 'undefined') return true;
    }

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
  const version = await getConfig().then((resp) => resp.data());
  const currentVersion = Number(localStorage.getItem('version'));
  const temp = [];

  console.log(version.value, currentVersion);
  // Comprobar si la version de los datos es la misma que la del usuario.
  if (version.value === currentVersion) {
    // De ser el caso, usar los datos locales.
    const resp = JSON.parse(localStorage.getItem('songsList'));

    resp.forEach((value) => temp.push(value));
  } else {
    // De lo contrario, llamar a la base de datos nuevamente y actualizarles.
    const resp = await getSongs();

    resp.forEach((value) => {
      const currentValue = value.data();
      currentValue.id = value.id;

      temp.push(currentValue);
    });

    localStorage.setItem('songsList', JSON.stringify(temp));
    localStorage.setItem('version', version.value);
  }

  return temp;
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
