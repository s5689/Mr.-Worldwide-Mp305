import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { handlePlay, handleStop } from './controls';
import { currentPlaylist, preventClosePlaylist } from './stateStore';

export const playlistTable = new Tabulator('#playlist-table', {
  data: null,
  placeholder: 'Las canciones en cola apareceran aqui.',
  height: '100%',
  layout: 'fitColumns',
  headerVisible: false,
  autoResize: true,
  movableRows: true,
  columns: [
    {
      title: '#',
      hozAlign: 'center',
      formatter: 'rownum',
      widthGrow: 0.25,
      resizable: false,
      headerSort: false,
    },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: false, rowHandle: true },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: false, rowHandle: true },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.35, resizable: false },
  ],
});

export function openPlaylist() {
  $('#playlist-modal').attr('show', '');

  if (currentPlaylist.list.length !== 0) {
    const pos = currentPlaylist.track;
    const currentHtml = $(`#playlist-table .tabulator-table .tabulator-row:nth-child(${pos})`)[0];

    currentHtml.scrollIntoView();
  }
}

export function closePlaylist() {
  if (!preventClosePlaylist.state) $('#playlist-modal').removeAttr('show');
}

/* 
  
  Eventos

*/
// Actualizar tabla al cambiar la playlist
currentPlaylist.onListChange((e) => playlistTable.replaceData(e));

// Click en Play o en Remover
playlistTable.on('cellClick', (e, cell) => {
  const row = cell.getRow();
  const rowData = row.getData();
  const rowHtml = row.getElement();
  const rowIndex = row.getPosition();

  // Reproducir solo si el click ocurrio en Play & la cancion seleccionada no esta en reproduccion
  if (typeof cell.getField() === 'undefined' && !$(rowHtml).attr('playing')) {
    currentPlaylist.track = rowIndex - 1;
    handlePlay(rowData);
  }

  // Remover solo si el click ocurrio en --
  if (cell.getField() === 'time') {
    const filterList = currentPlaylist.list.filter((value) => value.id !== rowData.id);

    // Si la cancion a eliminar no esta en reproduccion, eliminar de forma normal
    if (rowData.id !== currentPlaylist.getTrackData().id) {
      const currentTrack = currentPlaylist.getTrackData().id;
      let tempTrack = null;

      preventClosePlaylist.trigger();
      currentPlaylist.list = filterList;

      // Buscar la nueva posicion de la cancion en reproduccion
      currentPlaylist.list.map((value, k) => {
        if (value.id === currentTrack) tempTrack = k;
      });

      currentPlaylist.track = tempTrack;
    }
    // De lo contrario, eliminar y reproducir la siguiente o anterior
    else {
      const currentIndex = currentPlaylist.track;

      handleStop(false);
      preventClosePlaylist.trigger();

      $("#songsTable [playing='true']").removeAttr('playing');

      currentPlaylist.list = filterList;

      if (currentIndex === 0) currentPlaylist.track = currentIndex;
      else currentPlaylist.track = currentIndex - 1;

      handlePlay(currentPlaylist.getTrackData());
    }
  }
});

// Mover canciones en el array al moverles en la playlist
let prevCell;
playlistTable.on('rowMoving', (row) => {
  prevCell = row.getPosition(true) - 1;
});

let newCell;
playlistTable.on('rowMoved', (row) => {
  newCell = row.getPosition(true) - 1;

  const tempList = [];
  const currentTrack = currentPlaylist.getTrackData().id;
  let tempTrack = null;

  // Cargar la lista temporal con datos sin referencia
  currentPlaylist.list.forEach((value) => tempList.push(value));
  arrayMove(tempList, prevCell, newCell);

  currentPlaylist.list = tempList;

  // Buscar la nueva posicion de la cancion en reproduccion
  currentPlaylist.list.map((value, k) => {
    if (value.id === currentTrack) tempTrack = k;
  });

  currentPlaylist.track = tempTrack;
});

// Cerrar playlist al hacer click derecho e izquierdo
document.addEventListener('contextmenu', (e) => closePlaylist());
document.addEventListener('click', (e) => {
  const html = e.target;
  const { id } = html;
  const inModal = !isUndefined($('#playlist-modal').find(html)[0]);

  if (
    !inModal &&
    id !== 'control-prev' &&
    id !== 'control-next' &&
    id !== 'control-playlist' &&
    id !== 'control-shuffle'
  )
    closePlaylist();
});

// Funciones internas
function isUndefined(e) {
  return typeof e === 'undefined' ? true : false;
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}
