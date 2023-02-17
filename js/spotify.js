let controller;

export function loadSP() {
  setTimeout(() => {
    const callback = (e) => {
      e.iframeElement.id = 'spotify';
      e.iframeElement.className = 'players';

      e.addListener('ready', () => {
        e.play();
      });

      e.addListener('playback_update', (e) => console.log(e));

      controller = e;
    };

    SpotifyIframeApi.createController(document.getElementById('spotify-container'), {}, callback);
  }, 2000);
}

export function playSP(e) {
  console.log(controller);

  $('#spotify').css('display', 'block');
  controller.loadUri(`spotify:track:${e}`);
}

export function stopSP() {
  $('#spotify').css('display', 'none');
  $('#spotify').attr('src', '');
}

/*
$('#spotify').css('display', 'block');

controller.loadUri(`spotify:track:${swish}`);
controller.play();

controller.addListener('playback_update', (e) => {
  const { duration, position } = e.data;
  console.log(duration, position);
  console.log(e);
  if (duration === position) {
    console.log('done');
    controller.removeListener('playback_update');
  }
});
console.log(controller);
*/
