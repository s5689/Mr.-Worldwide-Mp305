import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { handlePlay } from './controls';
import { getSongs } from './db';

let data = await getData();

const songList = new Tabulator('#songsTable', {
  data: data,
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
      cellClick: play,
    },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: false },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: false },
    { title: 'Album', field: 'album', hozAlign: 'center', resizable: false },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.4, resizable: false },
  ],
});

async function getData() {
  const resp = await getSongs();
  const temp = [];

  resp.forEach((value) => {
    temp.push(value.data());
  });

  return temp;
}

function play(e, data) {
  handlePlay(data.getData());
}

export async function reloadSongsList() {
  songList.replaceData(await getData());
}
