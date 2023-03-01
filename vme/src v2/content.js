window.addEventListener('message', (e) => {
  // VME
  // Recibir respuesta del DOM y notificar al Background
  if (e.data === "it's me, DIO")
    chrome.runtime.sendMessage({ type: 'OHNOOOOOOOO' });

  // MKR
  // Recibir datos de la cancion actual
  if (e.data === 'MKR-TrackData') chrome.runtime.sendMessage({ type: e.data });
});

// Llamada de VME al DOM cada vez que se cargue una pagina
window.postMessage('larry is that you?');

// Envios MKR
chrome.runtime.onMessage.addListener((e) => {
  window.postMessage(e.type);
});
