const controller = {
  init: false,
  val: null,
  set: null,

  unset() {
    this.init = false;
    this.val = null;
    this.set = null;
  },
};
let playerID = 0;
let MKR_ID = 0;
let tempID;

// Escuchar a llamadas de la extension
chrome.runtime.onMessage.addListener((e, idk, resp) => {
  /*
    VME

  */
  // LLamar al DOM para obtener datos almacenados en el storage
  if (e.msg === 'VME-fetchData') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      // Si la pestaña actual es la aplicacion, reescribir el ID y el controller actual
      if (tab.title === 'Mr. Worldwide Mp305') {
        getController(tab.id);
        tempID = tab.id;

        chrome.tabs.sendMessage(tempID, { msg: 'VME-fetchData' });
      }
      // De lo contrario, intentar proceder con el ID almacenado para aplicar cambios fuera de la pestaña
      else {
        chrome.tabs.sendMessage(playerID, { msg: 'VME-fetchData' });
      }
    });
  }

  // Enviar datos obtenidos del DOM al Popup
  if (e.msg === 'VME-responseData') {
    setVolume(e.payload);
    playerID = tempID;
  }

  // Enviar estado actual del MKR al abrir el Popup
  if (e.msg === 'VME-stateMKR') {
    resp(MKR_ID !== 0 ? true : false);
  }

  // Cerrar MKR si se cierra desde la extension
  if (e.msg === 'VME-setMKR' && e.payload.value === false && e.payload.init === false) {
    chrome.tabs.remove(MKR_ID);
    MKR_ID = 0;
  }

  // Enviar valores al storage
  if (e.msg === 'VME-setData') {
    setVolume(e.payload);
    chrome.tabs.sendMessage(playerID, { msg: 'VME-setData', payload: e.payload });
  }

  /*
    MKR

  */
  if (e.msg === 'MKR-getID') {
    resp(playerID);
  }

  if (e.msg === 'MKR-setID') {
    MKR_ID = e.payload;
  }
});

// Obtener y almacenar controller de la pestaña del reproductor
function getController(id) {
  if (id !== playerID) {
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      const audioContext = new AudioContext();
      const streamSource = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();

      streamSource.connect(gainNode);
      gainNode.connect(audioContext.destination);

      controller.set = { audioContext, streamSource, gainNode };

      if (!controller.init) {
        gainNode.gain.value = controller.val;
      }
    });
  }
}

// Asignar volumen
function setVolume({ vol, mute }) {
  controller.val = !mute ? vol / 100 : 0;

  if (controller.set !== null) {
    controller.init = true;
    controller.set.gainNode.gain.value = controller.val * 2;
  }
}

// Desasignar la id del reproductor al cerrar la pestaña.
chrome.tabs.onRemoved.addListener((e) => {
  if (e === playerID) {
    playerID = 0;
    controller.unset();

    if (MKR_ID !== 0) {
      chrome.tabs.remove(MKR_ID);
      MKR_ID = 0;
    }
  }

  if (e === MKR_ID) {
    MKR_ID = 0;
  }
});
