import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import { toggleFindSong } from './songsList';
import {
  handleAddPlaylist,
  handleDeleteSong,
  handleDeselectAll,
  handleEscape,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShuffle,
  handleSingleAddPlaylist,
  handleStop,
  handleTogglePlaylist,
  handleUpdateSong,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';
import './dummyAudio';
import './VME-MKR';

setTimeout(() => {
  preloadPlayers();
  handleEscape();
}, 100);

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
window.singleAddPlaylist = handleSingleAddPlaylist;
window.selectMode = handleSelectMode;
window.updateSong = handleUpdateSong;
window.deleteSong = handleDeleteSong;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
