import { saveSong } from './db';
import { reloadSongsList } from './songsList';

const SOUNDCLOUD = 'SOUNDCLOUD';
const SPOTIFY = 'SPOTIFY';
let isOpen = false;
let inputs = [];
let source = '';
let spTester;
let link;
let toDB = undefined;

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

  setTimeout(() => {
    $('#addSong-link').removeAttr('readonly');
    $('#addSong-link').removeClass('readonly');
    $('#addSong-error').html('');
    $('#addSong-check').removeAttr('hidden');
    $('#addSong-save').attr('hidden', '');
  }, 250);
}

export function checkAddSong() {
  $('#addSong-error').html('');
  $('#addSong-check').attr('disabled', '');
  $('#addSong-save').removeAttr('disabled');

  getInputs();
  link = inputs[3].value;

  source = validate();
  toDB = undefined;

  switch (source) {
    case SOUNDCLOUD:
      testSC();
      break;

    case SPOTIFY:
      testSP();
      break;

    default:
      handleError('Link Invalido');
      break;
  }
}

export async function saveAddSong() {
  $('#addSong-save').attr('disabled', '');

  toDB.name = inputs[0].value;
  toDB.artist = inputs[1].value;
  toDB.album = inputs[2].value;

  await saveSong(toDB);
  closeAddSong();
  reloadSongsList();
}

// Comprobar formato del link
function validate() {
  const foundSC = link.search('soundcloud');
  const foundSP = link.search('spotify');

  if (foundSC !== -1) return SOUNDCLOUD;
  if (foundSP !== -1) return SPOTIFY;

  return '';
}

// Comprobar link de SoundCloud
function testSC() {
  const iframe = SC.Widget('sc-tester');

  iframe.load(link, {
    callback: () => {
      iframe.getCurrentSound((e) => {
        if (e !== null) handleSuccess(e.duration);
        else handleError('El ID de la cancion es invalido.');
      });
    },
  });
}

// Comprobar link de Spotify
function testSP() {
  generateSpTester();
  link = link.replace('https://open.spotify.com/track/', '');

  setTimeout(() => {
    try {
      spTester.addListener('ready', () => spTester.play());

      spTester.addListener('playback_update', (e) => {
        console.log(e);
        handleSuccess(e.data.duration);
        spTester.destroy();
      });

      spTester.loadUri(`spotify:track:${link}`);
    } catch (error) {
      handleError('El ID de la cancion es invalido.');
      spTester.destroy();
    }
  }, 100);
}

// Guardar Datos en variable de Preparacion
function handleSuccess(e) {
  toDB = {
    link,
    time: getTime(e),
    source,
    fullTime: e,
  };

  $('#addSong-link').addClass('readonly');
  $('#addSong-link').attr('readonly', '');
  $('#addSong-time').attr('value', toDB.time);
  $('#addSong-source').attr(
    'value',
    source.charAt(0).toUpperCase() + source.slice(1).toLowerCase()
  );

  $('#addSong-check').attr('hidden', '');
  $('#addSong-check').removeAttr('disabled');
  $('#addSong-save').removeAttr('hidden');
}

// Mostrar error en la interfaz
function handleError(e) {
  $('#addSong-error').html(e);
  $('#addSong-check').removeAttr('disabled');
}

// Funciones Generales
function getTime(e) {
  const time = parseInt(e / 1000, 10);
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
  inputs[0].value = '';
  inputs[1].value = '';
  inputs[2].value = '';
  inputs[3].value = '';
  $(inputs[4]).attr('value', '');
  $(inputs[5]).attr('value', '');
}

/*
  |                              |
  |  Inicializar Spotify Tester  |
  |                              |
*/

function generateSpTester() {
  $('body').append('<div id="sp-tester-container" class="tester"></div>');

  const callback = (e) => {
    e.iframeElement.id = 'sp-tester';
    e.iframeElement.className = 'tester';
    spTester = e;
  };

  setTimeout(() => {
    SpotifyIframeApi.createController(document.getElementById('sp-tester-container'), {}, callback);
  }, 10);
}
