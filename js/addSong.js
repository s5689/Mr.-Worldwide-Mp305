import { saveSong } from './db';

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
  const data = {
    name: inputs[0].value,
    artist: inputs[1].value,
    album: inputs[2].value,
    link: inputs[3].value,
  };

  console.log(data);
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
