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
