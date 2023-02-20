import { toggleAddSong, closeAddSong, checkAddSong, saveAddSong } from './addSong';
import { handleNext, handlePrev, handleStop, preloadPlayers } from './controls';
import './songsList';

preloadPlayers();

window.toggleAddSong = toggleAddSong;
window.closeAddSong = closeAddSong;
window.checkAddSong = checkAddSong;
window.saveAddSong = saveAddSong;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;
