import { toggleFindSong, toggleOrderAlbum, toggleOrderArtist, toggleOrderSong } from './songsList';
import {
  handleAddPlaylist,
  handleClosePlayer,
  handleDeselectAll,
  handleNext,
  handlePlayFromMenu,
  handlePrev,
  handleSelectAll,
  handleSelectMode,
  handleShowPlayer,
  handleShuffle,
  handleSingleAddPlaylist,
  handleStop,
  handleTogglePlaylist,
  preloadPlayers,
} from './controls';
import './songsList';
import './playlist';

mobileLoaded.onChange((e) => {
  if (e === 3) preloadPlayers();
});

if (mobileLoaded.get() === 3) preloadPlayers();

window.toggleFindSong = toggleFindSong;
window.toggleOrderSong = toggleOrderSong;
window.toggleOrderArtist = toggleOrderArtist;
window.toggleOrderAlbum = toggleOrderAlbum;

window.showPlayer = handleShowPlayer;
window.closePlayer = handleClosePlayer;

window.controlPrev = handlePrev;
window.controlStop = handleStop;
window.controlNext = handleNext;
window.togglePlaylist = handleTogglePlaylist;
window.controlShuffle = handleShuffle;

window.playFromMenu = handlePlayFromMenu;
window.singleAddPlaylist = handleSingleAddPlaylist;
window.selectMode = handleSelectMode;
window.addPlaylist = handleAddPlaylist;
window.selectAll = handleSelectAll;
window.deselectAll = handleDeselectAll;

window.auth = () => {
  var client_id = '97f0694166344b95a2a68a177c6fb90e';
  var redirect_uri = 'http://192.168.0.195:5173/mobile/index.html';

  var url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

  window.open(url);
};

window.test = async () => {
  /*
  let song;

  song = await fetch(
    'https://audio-ak-spotify-com.akamaized.net/audio/56f6491aede21688356646eaf18a08ae67dac501?__token__=exp=1679069094~hmac=bad44c141cc76fc3435dd0a9f8e3f7fdd8fe64446fc351d6fe9c8a6b5a9159e8',
    {
      headers: {
        'Accept-Encoding': 'identity',
        'Accept-Language': 'es-ES,es;q=0.9',
        Connection: 'keep-alive',
        Host: 'audio-ak-spotify-com.akamaized.net',
        Origin: 'https://open.spotify.com',
        Range: 'bytes=0-5142441',
        Referer: 'https://open.spotify.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      },
    }
  ).then((resp) => resp.arrayBuffer());

  const part1 = toBase64(song);
  console.log(part1);

  document.getElementById('test').src = `data:audio/mpeg;base64,${part1}`;

  function toBase64(e) {
    return btoa(
      [].reduce.call(
        new Uint8Array(e),
        function (p, c) {
          return p + String.fromCharCode(c);
        },
        ''
      )
    );
  }
  */

  /*
  const audio = document.getElementById('test');
  const mediaSource = new MediaSource();
  audio.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', async (e) => {
    const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

    const resp = await fetch(
      'https://audio-ak-spotify-com.akamaized.net/audio/56f6491aede21688356646eaf18a08ae67dac501?__token__=exp=1679085027~hmac=16c255aa6a8bddb255978640158420ce6bf75a148d204c2680f8665c4475121b',
      {
        headers: {
          Connection: 'keep-alive',
          Host: 'audio-ak-spotify-com.akamaized.net',
          Origin: 'https://open.spotify.com',
          Range: 'bytes=0-164820',
          Referer: 'https://open.spotify.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        },
      }
    ).then((resp) => resp.arrayBuffer());

    sourceBuffer.addEventListener('updateend', (e) => {
      mediaSource.endOfStream();

      audio.play();
    });

    sourceBuffer.appendBuffer(resp);
  });
  */

  /*
  const audio = new AudioContext();

  fetch(
    'https://audio-ak-spotify-com.akamaized.net/audio/56f6491aede21688356646eaf18a08ae67dac501?__token__=exp=1679069094~hmac=bad44c141cc76fc3435dd0a9f8e3f7fdd8fe64446fc351d6fe9c8a6b5a9159e8',
    {
      headers: {
        Connection: 'keep-alive',
        Host: 'audio-ak-spotify-com.akamaized.net',
        Origin: 'https://open.spotify.com',
        Range: 'bytes=0-160000',
        Referer: 'https://open.spotify.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      },
    }
  )
    .then((resp) => resp.arrayBuffer())
    .then((buffer) => audio.decodeAudioData(buffer))
    .then((data) => {
      const source = audio.createBufferSource();
      source.buffer = data;
      source.connect(audio.destination);
      source.start(0);

      setInterval(() => {
        console.log(audio.currentTime);
      }, 100);

      console.log(source);
      console.log(audio);
    });
    */

  const audio = new AudioContext();
  const parts = [];
  const toFetch = ['0-160000', '160001-320000'];
  let k = 0;
  let packet;

  play(await fetching(toFetch[k]));

  setInterval(async () => {
    console.log(audio.currentTime);
    console.log(packet);

    try {
      if (audio.currentTime > packet.duration - 0.1 && k === 0) {
        k++;
        play(await fetching(toFetch[1]));
      }
    } catch (e) {}
  }, 100);

  function play(data) {
    packet = data;

    const source = audio.createBufferSource();
    source.buffer = data;
    source.connect(audio.destination);
    source.start(0);
  }

  async function fetching(e) {
    return await fetch(
      'https://audio-ak-spotify-com.akamaized.net/audio/56f6491aede21688356646eaf18a08ae67dac501?__token__=exp=1679490813~hmac=1db5c8b38e928fb522278c1902f38e7c680ba11173d4f94da6a798b2d6414022',
      {
        headers: {
          Accept: '*/*',
          Connection: 'keep-alive',
          Host: 'audio-ak-spotify-com.akamaized.net',
          Origin: 'https://open.spotify.com',
          Range: `bytes=${e}`,
          Referer: 'https://open.spotify.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        },
      }
    )
      .then((resp) => resp.arrayBuffer())
      .then((buffer) => new AudioContext().decodeAudioData(buffer))
      .catch((e) => console.log(e));
  }
};
