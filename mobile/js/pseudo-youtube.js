import { currentPlaylist, loadingPlayer } from './stateStore';
import { handleNext } from './controls';
let controller;
let interval;

export function loadPYT() {
  controller = document.getElementById('youtube');

  controller.addEventListener('canplay', () => {
    controller.play();
  });

  controller.addEventListener('play', () => {
    $('#ytp-pause').css('opacity', 0);
  });

  controller.addEventListener('pause', () => {
    $('#ytp-pause').css('opacity', 1);
  });

  controller.addEventListener('ended', () => {
    handleNext();
  });
}

export function playPYT(e) {
  fetch(`https://api.vevioz.com/api/button/mp3/${e}`)
    .then((resp) => resp.text())
    .then((data) => {
      const links = [];
      let start;
      let end = 0;

      for (let k = 0; k < 5; k++) {
        start = data.indexOf('<a href="', end) + 9;
        end = data.indexOf('"', start);
        links.push(data.slice(start, end));
      }

      console.log(links);
      controller.src = links[3];
      loadingPlayer.set(false);

      $('#youtube-pseudoplayer').css('display', 'block');
      $('#ytp-time-current').text('0:00');
      $('#ytp-seekbar').val(0);
    });

  // Pseudo-player cosas.
  const track = currentPlaylist.getTrackData();
  const seconds = parseInt(track.fullTime / 1000, 10);

  $('#ytp-thumbicon').attr('src', `https://img.youtube.com/vi/${e}/maxresdefault.jpg`);
  $('#ytp-name').text(`${track.name}`);
  $('#ytp-artist-album').text(`${track.artist}${track.album !== '' ? ` - ${track.album}` : ''}`);
  $('#ytp-time-total').text(track.time);
  $('#ytp-seekbar').attr('max', seconds);

  interval = setInterval(() => {
    const time = Math.round(controller.currentTime);
    const m = Math.floor(time / 60);
    const s = time - m * 60;

    if ($('#ytp-seekbar').val() != time) {
      $('#ytp-time-current').text(`${m}:${s < 10 ? `0${s}` : s}`);
      $('#ytp-seekbar').val(time);
    }
  }, 200);

  // Cambios sobre los metadatos del navegador.
  const { name, artist, album } = track;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: name,
    artist,
    album,
  });
}

export function togglePausePYT() {
  if (!controller.paused) controller.pause();
  else controller.play();
}

export function stopPYT() {
  controller.src = '';
  $('#youtube-pseudoplayer').css('display', 'none');
  $('#ytp-pause').css('opacity', 0);

  clearInterval(interval);
}

export function getPositionPYT() {
  return controller.currentTime;
}

export function restartSongPYT() {
  controller.currentTime = 0;
}
