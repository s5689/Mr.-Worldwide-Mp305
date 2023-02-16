const mrbill = 'https://soundcloud.com/mrbillstunes/thwekz';
const hudson = 'https://soundcloud.com/hudsonlee/sets/flockcall';

const swish = '5thOUCqiHgpstZ0beZvmou';
const midi = '0mZa5qa3VjZGsbm183O1zF';

let controller;

setTimeout(() => {
  const callback = (e) => {
    e.iframeElement.id = 'spotify';
    e.iframeElement.className = 'players';
    controller = e;
  };

  SpotifyIframeApi.createController(document.getElementById('spotify-container'), {}, callback);
}, 2000);

function but(e) {
  if (e === 0) {
    $('#soundcloud').attr(
      'src',
      `https://w.soundcloud.com/player/?url=${mrbill}&auto_play=true&show_comments=false&show_user=true&hide_related=true`
    );
    $('#soundcloud').css('display', 'block');
  }

  if (e === 1) {
    $('#soundcloud').attr(
      'src',
      `https://w.soundcloud.com/player/?url=${hudson}&auto_play=true&show_comments=false&show_user=true&hide_related=true&show_playcount=false&sharing=false`
    );
    $('#soundcloud').css('display', 'block');
  }

  if (e === 2) {
    $('#spotify').attr('src', `https://open.spotify.com/embed/track/${swish}?&theme=0`);
    $('#spotify').css('display', 'block');
  }

  if (e === 3) {
    /*
    $('#spotify').attr('src', `https://open.spotify.com/embed/track/${midi}?&theme=0`);
    */
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
  }
}

function stop(e = 2) {
  if (e === 0) {
    $('#soundcloud').attr('src', '');
    $('#soundcloud').css('display', 'none');
  }

  if (e === 1) {
    $('#spotify').attr('src', '');
    $('#spotify').css('display', 'none');
  }

  if (e === 2) {
    $('#soundcloud').attr('src', '');
    $('#soundcloud').css('display', 'none');
    $('#spotify').attr('src', '');
    $('#spotify').css('display', 'none');
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function test(e) {
  console.log(e);
}

window.but = but;
window.stop = stop;
window.controller = controller;
window.test = test;
