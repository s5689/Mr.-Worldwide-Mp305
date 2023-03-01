let vmeId = null;

chrome.runtime.sendMessage({ type: 'getVmeID' }, (resp) => {
  vmeId = resp;
});

/* 

  Enviar

*/
// Envir ID de la pestaña al background
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  let tab = tabs[0];
  let id = tab.id;

  chrome.runtime.sendMessage({ type: 'setMkrID', value: id });
});

// MediaKey Eventos
navigator.mediaSession.setActionHandler('previoustrack', () => {
  chrome.tabs.sendMessage(vmeId, { type: 'MKR-Prev' });
});

navigator.mediaSession.setActionHandler('pause', () => {
  chrome.tabs.sendMessage(vmeId, { type: 'MKR-TogglePause' });
});

navigator.mediaSession.setActionHandler('nexttrack', () => {
  chrome.tabs.sendMessage(vmeId, { type: 'MKR-Next' });
});

/* 

  Recibir

*/
chrome.runtime.onMessage.addListener((e, idk, resp) => {
  console.log(e);

  /*
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'mimami',
    artist: 'yo',
    album: 'los 4 castillos',
  });
  */
});
