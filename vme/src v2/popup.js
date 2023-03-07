const input = document.getElementById('volume-control');
const number = document.getElementById('volume-value');
const mkr = document.getElementById('mkr');
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

// Aplicar volumen al usar el scroll con la rueda del raton.
input.addEventListener('wheel', (e) => {
  let currentVol = number.innerText;
  let newVol;

  if (e.deltaY < 0) newVol = Number(currentVol) + 2;
  else newVol = Number(currentVol) - 2;

  number.innerHTML = newVol;
  input.value = newVol;
  setVolume(newVol);
  setMute(false);
});

// Click sobre mute
number.addEventListener('click', () => {
  if (mute) setMute(false);
  else setMute(true);

  chrome.runtime.sendMessage({ type: 'setMute', value: mute });
});

// Click sobre MKR
mkr.addEventListener('click', () => {
  const state = mkr.getAttribute('state');

  if (state === 'disabled') {
    mkr.setAttribute('state', 'enabled');
    chrome.runtime.sendMessage({ type: 'setMkrState', value: true });

    window.open('./MKR/index.html');
  } else {
    mkr.setAttribute('state', 'disabled');
    chrome.runtime.sendMessage({ type: 'setMkrState', value: false });
  }
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
    mkr.setAttribute('hidden', '');
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

// Obtener estado de MKR
chrome.runtime.sendMessage({ type: 'getMkrState' }, (resp) => {
  if (resp) mkr.setAttribute('state', 'enabled');
});
