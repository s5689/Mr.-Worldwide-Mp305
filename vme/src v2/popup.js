const input = document.getElementById('volume-control');
const number = document.getElementById('volume-value');
let mute = false;

/*
  Popup

*/
// Cambios sobre el scroll
input.addEventListener('pointermove', (e) => {
  const newValue = e.target.value;
  const oldValue = number.innerHTML;

  if (newValue !== oldValue) {
    number.innerHTML = newValue;
    setVolume(newValue);
    setMute(false);
  }
});

// Aplicar volumen al soltar el scroll
input.addEventListener('mouseup', (e) => {
  number.innerHTML = e.target.value;
  setVolume(e.target.value);
  setMute(false);

  console.log(`applied: ${e.target.value}`);
});

// Click sobre mute
number.addEventListener('click', () => {
  if (mute) setMute(false);
  else setMute(true);

  chrome.runtime.sendMessage({ type: 'setMute', value: mute });
});

// Funciones internas
function setVolume(e) {
  chrome.runtime.sendMessage({ type: 'setVolume', value: e });
}

function setMute(e) {
  if (e) {
    number.className = 'mute';
    mute = true;
  } else {
    number.className = '';
    mute = false;
  }
}

/*
  Preparar Popup

*/
// Obtener control de volumen en el background cada que se abra la extension.
chrome.runtime.sendMessage({ type: 'getController' });

// Obtener el estado del controlador. Si esta establecido, preparar DOM
chrome.runtime.sendMessage({ type: 'getState' }, (resp) => {
  if (!resp) {
    document.getElementById('body').style.width = '250px';
    document.getElementById('error').removeAttribute('hidden');
    input.setAttribute('hidden', '');
    number.setAttribute('hidden', '');
  }
});

// Obtener volumen actual asignado
chrome.runtime.sendMessage({ type: 'getVolume' }, (resp) => {
  number.innerHTML = resp;
  input.value = resp;
});

// Obtener estado del mute
chrome.runtime.sendMessage({ type: 'getMute' }, (resp) => {
  setMute(resp);
});
