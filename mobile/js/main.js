import { toggleFindSong, toggleOrderAlbum, toggleOrderArtist, toggleOrderSong } from './songsList';
import { handleUpdateVolume } from './volume';
import { togglePauseYT } from './youtube';
import {
  handleAddPlaylist,
  handleClosePlayer,
  handleDeselectAll,
  handleLockPlayer,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShowPlayer,
  handleShuffle,
  handleSingleAddPlaylist,
  handleStop,
  handleToggleDevTools,
  handleTogglePlaylist,
  handleToggleVolume,
  handleUnlockPlayer,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';
import './volume';
import './devTools';

mobileLoaded.onChange((e) => {
  if (e === 3) preloadPlayers();
});

if (mobileLoaded.get() === 3) preloadPlayers();

window.toggleFindSong = toggleFindSong;
window.toggleOrderSong = toggleOrderSong;
window.toggleOrderArtist = toggleOrderArtist;
window.toggleOrderAlbum = toggleOrderAlbum;

window.showPlayer = handleShowPlayer;
window.toggleDevTools = handleToggleDevTools;
window.lockPlayer = handleLockPlayer;
window.unlockPlayer = handleUnlockPlayer;
window.closePlayer = handleClosePlayer;

window.controlPrev = handlePrev;
window.togglePauseYT = togglePauseYT;
window.controlStop = handleStop;
window.controlNext = handleNext;
window.toggleVolume = handleToggleVolume;
window.updateVolume = handleUpdateVolume;
window.togglePlaylist = handleTogglePlaylist;
window.controlShuffle = handleShuffle;

window.playFromMenu = handlePlayFromMenu;
window.singleAddPlaylist = handleSingleAddPlaylist;
window.selectMode = handleSelectMode;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;
