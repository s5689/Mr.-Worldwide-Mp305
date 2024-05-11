const infoModal = document.getElementById('info-modal');
const infoModalOk = document.getElementById('info-modal-ok');
const infoButton = document.getElementById('info-button');

const controlPrev = document.getElementById('control-prev');
const controlTogglePause = document.getElementById('control-togglePause');
const controlNext = document.getElementById('control-next');

const tagName = document.getElementById('name');
const tagArtistAlbum = document.getElementById('artist-album');

// Eventos DOM MKR
infoButton.addEventListener('click', () => {
  showInfoModal(infoModal.getAttribute('open') === null);
});

infoModalOk.addEventListener('click', () => {
  showInfoModal(false);
});

controlPrev.addEventListener('click', () => {
  handlePrev();
});

controlTogglePause.addEventListener('click', () => {
  handleTogglePause();
});

controlNext.addEventListener('click', () => {
  handleNext();
});

// Recibir ID del VME
let playerID = 0;

chrome.runtime.sendMessage({ msg: 'MKR-getID' }, (resp) => {
  playerID = resp;

  // Preguntar por la cancion actual al abrir MKR
  chrome.tabs.sendMessage(resp, { msg: 'MKR-actions', payload: 'MKR-getTrackData' });
});

/* 
  Enviar

*/
// Enviar ID de la pestaña al background
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.runtime.sendMessage({ msg: 'MKR-setID', payload: tabs[0].id });
});

// MediaKey Eventos
navigator.mediaSession.setActionHandler('previoustrack', () => {
  handlePrev();
});

navigator.mediaSession.setActionHandler('pause', () => {
  handleTogglePause();
});

navigator.mediaSession.setActionHandler('nexttrack', () => {
  handleNext();
});

/* 
  Recibir

*/
chrome.runtime.onMessage.addListener((e) => {
  if (e.msg === 'MKR-TrackData') {
    const { name, artist, album } = e.payload;
    let _n = 'Mr. Worldwide Mp305';
    let _aa = 'MediaKey Reader';

    navigator.mediaSession.metadata = new MediaMetadata({
      title: name,
      artist,
      album,
    });

    if (name !== '' && typeof name !== 'undefined') {
      _n = name;

      if (album !== '') _aa = `${artist} - ${album}`;
      else _aa = `${artist}`;
    }

    tagName.innerHTML = _n;
    tagArtistAlbum.innerHTML = _aa;
  }
});

/* 
  Funciones

*/
function showInfoModal(e) {
  if (e) infoModal.setAttribute('open', '');
  else infoModal.removeAttribute('open');
}

function handlePrev() {
  chrome.tabs.sendMessage(playerID, { msg: 'MKR-actions', payload: 'MKR-Prev' });
}

function handleTogglePause() {
  chrome.tabs.sendMessage(playerID, { msg: 'MKR-actions', payload: 'MKR-TogglePause' });
}

function handleNext() {
  chrome.tabs.sendMessage(playerID, { msg: 'MKR-actions', payload: 'MKR-Next' });
}
