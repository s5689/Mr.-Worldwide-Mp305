import { saveSong } from './db';

const SOUNDCLOUD = 'SOUNDCLOUD';
const SPOTIFY = 'SPOTIFY';
let isOpen = false;
let inputs = [];

export function toggleAddSong() {
  if (!isOpen) {
    $('#addSong-modal').css('transform', 'translateX(-50%) scale(1)');
    isOpen = true;

    return;
  }

  closeAddSong();
}

export function closeAddSong() {
  wipeInputs();

  $('#addSong-modal').css('transform', 'translateX(-50%) scale(0)');
  isOpen = false;
}

export function saveAddSong() {
  getInputs();
  const link = inputs[3].value;

  switch (validate(link)) {
    case SOUNDCLOUD:
      testSC(link);
      break;

    case SPOTIFY:
      testSP(link);
      break;

    default:
      handleError();
      break;
  }
}

// Comprobar formato del link
function validate(link) {
  const foundSC = link.search('soundcloud');
  const foundSP = link.search('spotify');

  if (foundSC !== -1) return SOUNDCLOUD;
  if (foundSP !== -1) return SPOTIFY;

  return;
}

// Guardar Datos en Firebase
function sendToDB(e) {
  const inputData = {
    name: inputs[0].value,
    artist: inputs[1].value,
    album: inputs[2].value,
    link: inputs[3].value,
    time: getTime(e),
    fullTime: e.full_duration,
  };

  console.log(inputData);

  $('#sc-tester').attr('src', '');
}

// Comprobar link de SoundCloud
function testSC(link) {
  let success = false;

  // Intentar reproducir link
  $('#sc-tester').attr('src', `https://w.soundcloud.com/player/?url=${link}`);
  const iframe = SC.Widget(document.getElementById('sc-tester'));

  // Si el link es correcto, enviar los datos
  iframe.bind(SC.Widget.Events.READY, () => {
    iframe.getCurrentSound((e) => {
      if (!success) {
        success = true;
        sendToDB(e);
      }

      iframe.unbind(SC.Widget.Events.READY);
    });
  });

  // Si demora mas de 5 minutos, enviar un error
  setTimeout(() => {
    if (!success) handleError();
  }, 5000);
}

// Comprobar link de Spotify
function testSP(link) {
  console.log('sp');
}

function handleError() {
  console.log('a');
}

function handleSuccess() {}

function getTime(e) {
  const time = parseInt(e.full_duration / 1000, 10);
  const m = Math.floor(time / 60);
  const s = time - m * 60;

  return `${m}:${s < 10 ? `0${s}` : s}`;
}

function getInputs() {
  const temp = $('#addSong-modal input');
  inputs = [];

  for (let k = 0; k < temp.length; k++) {
    inputs.push(temp[k]);
  }
}

function wipeInputs() {
  getInputs();
  inputs.forEach((value) => (value.value = ''));
}
