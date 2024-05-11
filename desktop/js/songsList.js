import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { currentPlaylist, songsList, rowOnMenu, selectMode, preventClosePlaylist, autoComplete, dataVersion } from './stateStore';
import { handleDeselectAll, handlePlay } from './controls';
import { openPlaylist, playlistTable } from './playlist';
import { createAutoComplete } from './addSong';
import { getConfig, getSongs } from './db';

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
    {
      title: 'Nombre',
      field: 'name',
      hozAlign: 'center',
      resizable: false,
    },
    {
      title: 'Artista',
      field: 'artist',
      hozAlign: 'center',
      resizable: false,
      sorter: columnSorter('artist'),
    },
    {
      title: 'Album',
      field: 'album',
      hozAlign: 'center',
      resizable: false,
      sorter: columnSorter('album'),
    },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.4, resizable: false },
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

export async function loadSongsTable(e, updating, del = false) {
  if (!e) {
    songsList.set(await getData());
  } else {
    // Preparar SongList al realizar Updates
    if (typeof updating !== 'undefined') {
      songsList.set(songsList.value.filter((value) => value.id !== updating));
    }

    if (!del) {
      songsList.value.push(e);
    }
  }

  // Preparar CurrentPlaylist al realizar Updates
  if (currentPlaylist.list.length !== 0) {
    currentPlaylist.track = currentPlaylist.track;

    if (typeof updating !== 'undefined') {
      const n = currentPlaylist._list.findIndex((value) => value.id === updating);

      currentPlaylist._list[n] = e;
    }

    if (del) {
      const html = playlistTable.searchRows('id', '=', updating)[0].getElement();

      html.children[3].click();
    }
  }

  buildAutoComplete();
  songsTable.replaceData(songsList.get());
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
  else {
    if (!selectMode.get()) {
      const { artist, album } = row.getData();

      if (cell.getField() === 'artist' || cell.getField() === 'album') {
        if (cell.getField() === 'artist') toggleFindSong(false, artist);
        if (cell.getField() === 'album') toggleFindSong(false, album);

        setTimeout(() => {
          document.getElementById('addSong-findInput').focus();
        }, 250);
      }
    }
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
    }

    // Salir del modo seleccion si se deseleccionaron todos los row.
    setTimeout(() => {
      if (selectMode.selectSize() === 0) selectMode.set(false);
    }, 0);
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
    const { name, number, artist, album, source } = value;

    // Si el album esta vacio y fue seleccionado desde la tabla, mostrar albumes vacios.
    if (singles && e === '') if (album !== '') return false;

    // Codigos Especiales
    // <SP / <SC / <YT: filtrar por fuente.
    if (e.toLowerCase() === '<sp') {
      if (source === 'SPOTIFY') return true;
    }

    if (e.toLowerCase() === '<sc') {
      if (source === 'SOUNDCLOUD') return true;
    }

    if (e.toLowerCase() === '<yt') {
      if (source === 'YOUTUBE') return true;
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

    resp.forEach((value) => {
      temp.push(value);
    });
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

  // Almacenar version actual para usarle en otras areas de la aplicacion.
  dataVersion.value = JSON.parse(localStorage.getItem('version'));

  return temp;
}

function buildAutoComplete() {
  const tempList = songsList.get();

  autoComplete.wipe();

  tempList.forEach((value) => {
    addAutoComplete(value.artist, value.album);
  });

  // Organizar Arrays
  autoComplete.artist = autoComplete.artist.sort((a, b) => {
    if (a > b) return 1;
    else return -1;
  });

  autoComplete.album = autoComplete.album.sort((a, b) => {
    if (a > b) return 1;
    else return -1;
  });

  createAutoComplete(document.getElementById('addSong-artist'), autoComplete.artist);
  createAutoComplete(document.getElementById('addSong-album'), autoComplete.album);
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
