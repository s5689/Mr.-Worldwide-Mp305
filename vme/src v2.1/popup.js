const input = document.getElementById('volume-control');
const number = document.getElementById('volume-value');
const mkrBtn = document.getElementById('mkr');

// Popup Interface
var state = {
  /*
    Volume
  
  */
  onVolChange: () => null,

  get vol() {
    return number.innerHTML;
  },

  set vol(e) {
    input.value = e;
    number.innerHTML = e;

    this.mute = false;
    this.onVolChange(e);
  },

  /*
    Mute
  
  */
  onMuteChange: () => null,

  get mute() {
    return number.getAttribute('mute') !== null ? true : false;
  },

  set mute(e) {
    if (e) {
      number.setAttribute('mute', '');
    } else {
      number.removeAttribute('mute');
    }

    this.onMuteChange(e);
  },

  /*
    MKR Button
  
  */
  onMKRChange: () => null,

  get MKR() {
    return mkrBtn.getAttribute('open') !== null ? true : false;
  },

  set MKR(e) {
    if (e.value) {
      mkrBtn.setAttribute('open', '');

      if (!e.init) window.open('./MKR/index.html');
    } else {
      mkrBtn.removeAttribute('open');
    }

    this.onMKRChange(e);
  },
};

/*
  Input

*/
// Cambios sobre el scroll
input.addEventListener('pointermove', (e) => {
  const newValue = e.target.value;
  const oldValue = number.innerHTML;

  if (newValue !== oldValue) {
    state.vol = newValue;
  }
});

// Aplicar volumen al soltar el click
input.addEventListener('mouseup', (e) => {
  state.vol = e.target.value;
});

// Aplicar volumen al usar la rueda del raton.
input.addEventListener('wheel', (e) => {
  let currentVol = number.innerText;
  let newVol;

  if (e.deltaY < 0) newVol = Number(currentVol) + 2;
  else newVol = Number(currentVol) - 2;

  state.vol = newVol;
});

/*
  Mute

*/
// Click sobre mute
number.addEventListener('click', () => {
  if (state.mute) state.mute = false;
  else state.mute = true;
});

/*
  MKR Button

*/
mkrBtn.addEventListener('click', () => {
  if (state.MKR) state.MKR = { value: false, init: false };
  else state.MKR = { value: true, init: false };
});
