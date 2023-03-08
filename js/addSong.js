import { saveSong, updateSong } from './db';
import { loadSongsTable } from './songsList';
import { songsList } from './stateStore';

const SOUNDCLOUD = 'SOUNDCLOUD';
const SPOTIFY = 'SPOTIFY';
let isUpdate = null;
let isOpen = false;
let inputs = [];
let source = '';
let spTester;
let link;
let toDB = undefined;

export function toggleAddSong(update = false, e) {
  if (!isOpen) {
    $('#addSong-modal').css('transform', 'translateX(-50%) scale(1)');

    getInputs();
    isOpen = true;
    isUpdate = null;

    if (update) {
      const { name, artist, album, link, time, source, id } = e;

      $('#addSong-modal #addSong-name').val(name);
      $('#addSong-modal #addSong-artist').val(artist);
      $('#addSong-modal #addSong-album').val(album);
      $('#addSong-modal #addSong-link').val(link);
      $('#addSong-modal #addSong-time').val(time);
      $('#addSong-modal #addSong-source').val(source);

      $('#addSong-check').attr('hidden', '');
      $('#addSong-save').removeAttr('hidden');
      $('#addSong-save').removeAttr('disabled');

      $('#addSong-modal #addSong-link').on('input', () => {
        $('#addSong-check').removeAttr('hidden', '');
        $('#addSong-save').attr('hidden', '');
      });

      toDB = { name, artist, album };
      isUpdate = id;
    }

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

  if (isUpdate === null) await saveSong(toDB);
  else await updateSong(isUpdate, toDB);

  closeAddSong();
  loadSongsTable();
}

// Autocomplete cosas.
export function createAutoComplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;

  /*execute a function when someone writes in the text field:*/
  inp.addEventListener('input', function (e) {
    let a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }

    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');

    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement('DIV');
        /*make the matching letters bold:*/
        b.innerHTML = arr[i].substr(0, val.length);
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener('click', function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName('input')[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function (e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add('autocomplete-active');
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    let x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener('click', (e) => {
    closeAllLists(e.target);
  });
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

  const foundUrl = link.indexOf('?');
  if (foundUrl !== -1) link = link.substr(0, foundUrl);

  setTimeout(() => {
    try {
      spTester.addListener('ready', () => spTester.play());

      spTester.addListener('playback_update', (e) => {
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
  if (checkRepeat()) {
    toDB = {
      link,
      time: getTime(e),
      source,
      fullTime: e,
    };

    $('#addSong-link').addClass('readonly');
    $('#addSong-link').attr('readonly', '');
    $('#addSong-time').val(toDB.time);
    $('#addSong-source').val(source.charAt(0).toUpperCase() + source.slice(1).toLowerCase());

    $('#addSong-check').attr('hidden', '');
    $('#addSong-check').removeAttr('disabled');
    $('#addSong-save').removeAttr('hidden');
  } else handleError('El link que ha ingresado ya se encuentra registrado.');
}

function checkRepeat() {
  const allSongs = songsList.get();
  const foundSong = allSongs.find((value) => value.link === link);

  if (typeof foundSong === 'undefined') return true;
  return false;
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
  $(inputs[4]).val('');
  $(inputs[5]).val('');
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
