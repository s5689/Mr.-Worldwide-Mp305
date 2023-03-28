import { toggleFindSong, toggleOrderAlbum, toggleOrderArtist, toggleOrderSong } from './songsList';
import {
  handleAddPlaylist,
  handleClosePlayer,
  handleDeselectAll,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShowPlayer,
  handleShuffle,
  handleSingleAddPlaylist,
  handleStop,
  handleTogglePlaylist,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';

mobileLoaded.onChange((e) => {
  if (e === 3) preloadPlayers();
});

if (mobileLoaded.get() === 3) preloadPlayers();

window.toggleFindSong = toggleFindSong;
window.toggleOrderSong = toggleOrderSong;
window.toggleOrderArtist = toggleOrderArtist;
window.toggleOrderAlbum = toggleOrderAlbum;

window.showPlayer = handleShowPlayer;
window.closePlayer = handleClosePlayer;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;
window.togglePlaylist = handleTogglePlaylist;
window.controlShuffle = handleShuffle;

window.playFromMenu = handlePlayFromMenu;
window.singleAddPlaylist = handleSingleAddPlaylist;
window.selectMode = handleSelectMode;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
