import { loadSongsTable, toggleFindSong } from './songsList';
import {
  handleAddPlaylist,
  handleDeleteSong,
  handleDeselectAll,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShuffle,
  handleSingleAddPlaylist,
  handleStop,
  handleTogglePlaylist,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';

loaded.onChange((e) => {
  if (e === 3) apiReady();
});

if (loaded.get() === 3) apiReady();

function apiReady() {
  preloadPlayers();
  loadSongsTable();
}

window.toggleFindSong = toggleFindSong;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;
window.togglePlaylist = handleTogglePlaylist;
window.controlShuffle = handleShuffle;

window.playFromMenu = handlePlayFromMenu;
window.singleAddPlaylist = handleSingleAddPlaylist;
window.selectMode = handleSelectMode;
window.deleteSong = handleDeleteSong;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
