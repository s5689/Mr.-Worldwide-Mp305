import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { getSongs } from './db';

let data = await getData();

const songList = new Tabulator('#songsTable', {
  data: data,
  layout: 'fitColumns',
  columns: [
    { title: 'Nombre', field: 'name', hozAlign: 'center' },
    { title: 'Artista', field: 'artist', hozAlign: 'center' },
    { title: 'Album', field: 'album', hozAlign: 'center' },
    { title: 'Duracion', field: 'time', hozAlign: 'center' },
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

export async function reloadSongsList() {
  songList.replaceData(await getData());
}
