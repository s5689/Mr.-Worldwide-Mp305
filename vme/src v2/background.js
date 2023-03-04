let controller = null;
let volume = 50;
let mute = false;
let id = null;

let mkrState = false;
let mkrId = null;

// Get & Sets de variables
chrome.runtime.onMessage.addListener((e, idk, resp) => {
  if (e.type === 'OHNOOOOOOOO' && id === null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      tab = tab[0];
      id = tab.id;
    });
  }

  if (e.type === 'getController' && controller === null && id !== null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      tab = tab[0];

      if (id === tab.id) {
        chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
          const audioContext = new AudioContext();
          const streamSource = audioContext.createMediaStreamSource(stream);
          const gainNode = audioContext.createGain();

          streamSource.connect(gainNode);
          gainNode.connect(audioContext.destination);

          controller = { audioContext, streamSource, gainNode };

          if (!mute) controller.gainNode.gain.value = volume / 100;
          else controller.gainNode.gain.value = 0;
        });
      }
    });
  }

  if (e.type === 'getState') {
    if (id !== null) resp(true);
    else resp(false);
  }

  if (e.type === 'getVolume') resp(volume);
  if (e.type === 'setVolume') {
    controller.gainNode.gain.value = e.value / 100;
    volume = e.value;
    mute = false;
  }

  if (e.type === 'getMute') resp(mute);
  if (e.type === 'setMute') {
    if (e.value) {
      controller.gainNode.gain.value = 0;
      mute = true;
    } else {
      controller.gainNode.gain.value = volume / 100;
      mute = false;
    }
  }

  if (e.type === 'getMkrState') resp(mkrState);
  if (e.type === 'setMkrState') {
    mkrState = e.value;

    if (!mkrState) {
      chrome.tabs.remove(mkrId);
      mkrId = null;
    }
  }

  if (e.type === 'setMkrID') mkrId = e.value;
  if (e.type === 'getVmeID') resp(id);

  console.log(id, controller);
});

// Desasignar la id del reproductor al cerrar la pestaña.
chrome.tabs.onRemoved.addListener((e) => {
  if (e === id) {
    id = null;
    controller = null;

    if (mkrState) chrome.tabs.remove(mkrId);
  }

  if (e === mkrId) {
    mkrId = null;
    mkrState = false;
  }
});
