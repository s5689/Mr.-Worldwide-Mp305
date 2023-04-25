/*
  Eventos

*/

state.onVolChange = (e) => setVol({ vol: e, mute: false });
state.onMuteChange = (e) => setVol({ vol: state.vol, mute: e });
state.onMKRChange = (e) => setMKR(e);

//  Inicializar Popup
document.addEventListener('DOMContentLoaded', () => {
  // Escuchar por los datos recibidos desde el background tras el fetch inicial.
  chrome.runtime.onMessage.addListener((e) => {
    if (e.msg === 'VME-responseData') {
      // Si existen, aplicar valores al VME
      if (e !== null) {
        // Preguntar por el estado actual del MKR
        chrome.runtime.sendMessage({ msg: 'VME-stateMKR' }, (e) => {
          state.MKR = { value: e, init: true };
        });

        state.vol = e.payload.vol;
        state.mute = e.payload.mute;

        // Remover pantalla de error
        document.getElementById('body').style.width = '40px';
        document.getElementById('error').setAttribute('hidden', '');
        input.removeAttribute('hidden', '');
        number.removeAttribute('hidden', '');
        mkr.removeAttribute('hidden', '');
      }
    }
  });

  // LLamar al background para realizar una peticion de los datos guardados en el localStorage
  chrome.runtime.sendMessage({ msg: 'VME-fetchData' });
});

// Guardar cambios en el storage de la aplicacion
function setVol(e) {
  chrome.runtime.sendMessage({ msg: 'VME-setData', payload: e });
}

function setMKR(e) {
  chrome.runtime.sendMessage({ msg: 'VME-setMKR', payload: e });
}
