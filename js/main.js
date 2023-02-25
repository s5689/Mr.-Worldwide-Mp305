import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import {
  handleAddPlaylist,
  handleDeselectAll,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleStop,
  preloadPlayers,
} from './controls';
import './songsList';

preloadPlayers();

window.toggleAddSong = toggleAddSong;
window.closeAddSong = closeAddSong;
window.checkAddSong = checkAddSong;
window.saveAddSong = saveAddSong;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;

window.playFromMenu = handlePlayFromMenu;
window.selectMode = handleSelectMode;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;

// Conexion con la extencion
window.addEventListener('message', (e) => {
  if (e.data === 'larry is that you?') window.postMessage("it's me, DIO");
});
