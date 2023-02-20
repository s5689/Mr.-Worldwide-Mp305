import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { currentPlaylist, songsList } from './stateStore';
import { handlePlay } from './controls';
import { getSongs } from './db';

loadSongsTable();

const songTable = new Tabulator('#songsTable', {
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
      widthGrow: 0.1,
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
  songTable.replaceData(songsList.get());
}

/* 
  Eventos
*/
// Click en Play
songTable.on('cellClick', (e, cell) => {
  const row = cell.getRow();
  const rowHtml = row.getElement();
  const rowIndex = row.getPosition();
  const rowsOrder = songTable.rowManager.activeRows;
  const tempList = [];

  // Aplicar solo si el click ocurrio en Play & la cancion seleccionada no esta en reproduccion
  if (typeof cell.getField() === 'undefined' && !$(rowHtml).attr('playing')) {
    currentPlaylist.wipe();

    rowsOrder.forEach((value) => {
      tempList.push(value.getData());
    });

    currentPlaylist.list = tempList;
    currentPlaylist.track = rowIndex - 1;

    handlePlay(row.getData());
  }
});

// Cambios en la lista al Reproducir/Detener
currentPlaylist.onWipe((e) => {
  const { id } = e;
  if (id) $(getRowHtml(id)).removeAttr('playing');
});

currentPlaylist.onTrackChange(({ track, prevTrack }) => {
  $(getRowHtml(prevTrack.id)).removeAttr('playing');
  $(getRowHtml(track.id)).attr('playing', 'true');
});

/* Funciones internas */
async function getData() {
  const resp = await getSongs();
  const temp = [];

  resp.forEach((value) => {
    const currentValue = value.data();
    currentValue.id = value.id;
    currentValue.selected = false;

    temp.push(currentValue);
  });

  return temp;
}

function getRowHtml(id) {
  const foundRow = songTable.searchRows('id', '=', id)[0];
  const foundHtml = foundRow.getElement();

  return foundHtml;
}
