window.addEventListener('message', (e) => {
  // VME
  // Recibir respuesta del DOM y notificar al Background
  if (e.data === "it's me, DIO")
    chrome.runtime.sendMessage({ type: 'OHNOOOOOOOO' });

  // MKR
  // Recibir datos de la cancion actual
  if (e.data.msg === 'MKR-TrackData')
    chrome.runtime.sendMessage({ type: 'MKR-TrackData', value: e.data.value });
});

// Llamada de VME al DOM cada vez que se cargue una pagina
window.postMessage('larry is that you?');

// Envios MKR al DOM
chrome.runtime.onMessage.addListener((e) => {
  window.postMessage(e.type);
});
