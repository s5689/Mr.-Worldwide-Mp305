import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import {
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
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
