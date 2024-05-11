import { dataVersion, songsList } from './stateStore';
import { setConfig, updateSong } from './db';
import { loadSongsTable } from './songsList';

window.resetNormalizer = () => {
  // Volumen a Aplicar
  const NEW_VOLUME = 50;

  // Si se ejecuta antes de cargar la lista
  if (songsList.get().length === 0) {
    return 'Comando Abortado.';
  }

  // Recorrer lista de canciones y aplicar nuevo volumen
  songsList.get().map(async (e, k) => {
    const count = k + 1;

    await updateSong(e.id, { vol: NEW_VOLUME });
    console.log(`${count}/${songsList.get().length} | ${e.artist} - ${e.name} | Vol: ${e.vol}% => ${NEW_VOLUME}%`);

    // Al llegar al ultimo elemento
    if (count === songsList.get().length) {
      await setConfig(dataVersion.value + 1);
      loadSongsTable();
    }
  });

  return 'Ejecutando...';
};

window.validateLinks = () => {
  // Si se ejecuta antes de cargar la lista
  if (songsList.get().length === 0) {
    return 'Comando Abortado.';
  }

  // Inicializar controller
  const controller = new YT.Player('yt-tester', {
    playerVars: {
      autoplay: 1,
    },
    events: {
      onReady: () => {
        const tempList = [];
        const brokenSongs = [];
        let k = 0;

        // Comprobar solo canciones de Youtube
        songsList.get().forEach((e) => {
          if (e.source === 'YOUTUBE') {
            tempList.push(e);
          }
        });

        controller.addEventListener('onStateChange', (e) => {
          if (e.data === 1) {
            console.log(`${k + 1}/${tempList.length} | ${tempList[k].artist} - ${tempList[k].name} | Ok`);

            k++;
            load(k);
          }
        });

        controller.addEventListener('onError', (e) => {
          console.log(`${k + 1}/${tempList.length} | ${tempList[k].artist} - ${tempList[k].name} | Error`);

          brokenSongs.push(tempList[k]);

          k++;
          load(k);
        });

        function load(e) {
          if (k < tempList.length) {
            controller.loadVideoById(tempList[e].link);
          } else {
            console.log('----------------');
            console.log('Finalizado.');
            console.log(brokenSongs);
          }
        }

        load(0);
      },
    },
  });

  return 'Ejecutando...';
};
