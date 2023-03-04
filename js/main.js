import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import { toggleFindSong } from './songsList';
import {
  handleAddPlaylist,
  handleDeselectAll,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShuffle,
  handleStop,
  handleTogglePlaylist,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';
import './dummyAudio';
import './VME-MKR';

preloadPlayers();

window.toggleAddSong = toggleAddSong;
window.toggleFindSong = toggleFindSong;
window.closeAddSong = closeAddSong;
window.checkAddSong = checkAddSong;
window.saveAddSong = saveAddSong;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;
window.togglePlaylist = handleTogglePlaylist;
window.controlShuffle = handleShuffle;

window.playFromMenu = handlePlayFromMenu;
window.selectMode = handleSelectMode;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
