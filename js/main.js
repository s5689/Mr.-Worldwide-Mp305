import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import { handleStop, preloadPlayers } from './controls';
import './songsList';

preloadPlayers();

window.toggleAddSong = toggleAddSong;
window.closeAddSong = closeAddSong;
window.checkAddSong = checkAddSong;
window.saveAddSong = saveAddSong;

window.controlStop = handleStop;
