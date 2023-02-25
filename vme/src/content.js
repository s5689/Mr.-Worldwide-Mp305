// Recibir llamada del DOM y notificar al Background
window.addEventListener('message', (e) => {
  if (e.data === "it's me, DIO")
    chrome.runtime.sendMessage({ type: 'OHNOOOOOOOO' });
});

// Llamar al DOM cada vez que se cargue una pagina
window.postMessage('larry is that you?');
