// Enviar datos al reproductor
chrome.runtime.onMessage.addListener((e) => {
  // VME
  // Comprobar si el DOM actual corresponde a la aplicacion
  if (e.msg === 'VME-fetchData') {
    window.postMessage('VME-fetchData');
  }

  // Asignar valores al storage del DOM
  if (e.msg === 'VME-setData') {
    window.postMessage({ msg: 'VME-setData', payload: e.payload });
  }

  // MKR
  if (e.msg === 'MKR-actions') {
    window.postMessage(e.payload);
  }
});

// Recibir datos del reproductor
window.addEventListener('message', (e) => {
  // VME
  // Enviar valores actuales al Popup
  if (e.data.msg === 'VME-responseData') {
    chrome.runtime.sendMessage({ msg: 'VME-responseData', payload: e.data.payload });
  }

  //MKR
  // Recibir datos de la cancion actual
  if (e.data.msg === 'MKR-TrackData') {
    chrome.runtime.sendMessage({ msg: 'MKR-TrackData', payload: e.data.payload });
  }
});
