// Recibir llamada del DOM y notificar al Background
window.addEventListener('message', (e) => {
  if (e.data === "it's me, DIO")
    chrome.runtime.sendMessage({ type: 'OHNOOOOOOOO' });
});

// Llamar al DOM cada vez que se cargue una pagina
window.postMessage('larry is that you?');

chrome.runtime.onMessage.addListener(async (e, a, b) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSourceId: e.value,
        chromeMediaSource: 'tab',
      },
    },
  });
  console.log(stream);

  const audioContext = new AudioContext();
  const streamSource = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();

  streamSource.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const controller = { audioContext, streamSource, gainNode };

  controller.gainNode.gain.value = 0.1;
});
