import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { handlePlay, handleStop } from './controls';
import { currentPlaylist, preventClosePlaylist } from './stateStore';

export const playlistTable = new Tabulator('#playlist-table', {
  data: null,
  placeholder: 'Lista de reproduccion vacia.',
  height: '100%',
  layout: 'fitColumns',
  headerVisible: false,
  autoResize: true,
  movableRows: true,
  columns: [
    {
      field: 'move',
      hozAlign: 'center',
      widthGrow: 0.1,
      resizable: false,
      headerSort: false,
      rowHandle: true,
    },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: false },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: false },
    { field: 'delete', hozAlign: 'center', widthGrow: 0.1, resizable: false },
  ],
});

export function openPlaylist() {
  setTimeout(() => {
    document.getElementById('playlist-modal').setAttribute('show', '');
  }, 0);

  if (currentPlaylist.list.length !== 0) {
    const row = playlistTable.getRowFromPosition(currentPlaylist.track + 1);
    playlistTable.scrollToRow(row, 'center');
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

// Click en Remover
playlistTable.on('cellClick', (e, cell) => {
  const row = cell.getRow();
  const rowData = row.getData();

  // Remover solo si el click ocurrio en --
  if (cell.getField() === 'delete') {
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

// Cerrar playlist al hacer click derecho e izquierdo & Limpiar playlist al hacer click derecho en mostrar playlist
document.addEventListener('contextmenu', (e) => {
  if (e.target.id === 'control-playlist' || e.target.id === 'preview-playlist') {
    const trackId = currentPlaylist.getTrackData().id;

    e.preventDefault();
    const tempList = currentPlaylist.list.filter((value) => value.id === trackId);

    currentPlaylist.list = tempList;
    currentPlaylist.track = 0;

    $('#control-playlist').attr('clean', '');
    $('#preview-playlist').attr('clean', '');

    setTimeout(() => {
      $('#control-playlist').removeAttr('clean');
      $('#preview-playlist').removeAttr('clean');
    }, 400);
  }
});

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
