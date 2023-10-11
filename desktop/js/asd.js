import { i as At, o as Et, Q as Lt, T as gt, B as Dt, G as It, A as W, K as mt, O as Pt, a as pt } from './tabulator_esm-af4ec1da.js';
const Mt = {
  apiKey: 'AIzaSyAyacVFGoIKMMtkH7znpi1ESh2G0UlSKQI',
  authDomain: 'sound-micron-377214.firebaseapp.com',
  projectId: 'sound-micron-377214',
  storageBucket: 'sound-micron-377214.appspot.com',
  messagingSenderId: '71286093345',
  appId: '1:71286093345:web:127ea171b8d5531e945560',
};
At(Mt);
const M = Et(),
  J = 'songs',
  ht = 'config',
  Ot = async (t) => (await Lt(gt(M, J), t)).id,
  Rt = () => Dt(gt(M, J)),
  Ut = (t) => It(W(M, J, t)),
  Nt = (t, e) => mt(W(M, J, t), e),
  _t = () => Pt(W(M, ht, 'version')),
  wt = (t) => mt(W(M, ht, 'version'), { value: t }),
  L = {
    value: [],
    callback: function (t) {},
    set(t) {
      (this.value = t), this.callback(t);
    },
    get() {
      return this.value;
    },
    onChange: function (t) {
      this.callback = t;
    },
  },
  o = {
    _list: [],
    _track: 0,
    _prevTrack: null,
    get list() {
      return this._list;
    },
    get track() {
      return this._track;
    },
    set list(t) {
      (this._list = t), this.callbackList(t);
    },
    set track(t) {
      (this._prevTrack = this.track),
        (this._track = t),
        this.callbackTrack({ track: this.getTrackData(), prevTrack: this.getPrevTrackData() });
    },
    prevTrack() {
      const t = this._track - 1;
      t >= 0 && rt(t);
    },
    nextTrack() {
      const t = this._track + 1;
      t < this._list.length && rt(t);
    },
    getTrackData() {
      const t = this._list[this._track];
      return typeof t > 'u' ? {} : t;
    },
    getPrevTrackData() {
      const t = this._list[this._prevTrack];
      return typeof t > 'u' ? {} : t;
    },
    wipe() {
      this.callbackWipe(this.getTrackData()), this.callbackList([]), (this._list = []), (this._track = 0);
    },
    onWipe: function (t) {
      this.callbackWipe = t;
    },
    onListChange: function (t) {
      this.callbackList = t;
    },
    onTrackChange: function (t) {
      this.callbackTrack = t;
    },
    callbackWipe: function (t) {},
    callbackList: function (t) {},
    callbackTrack: function (t) {},
  },
  v = {
    value: !1,
    callback: function (t) {},
    set(t) {
      (this.value = t), this.callback(t);
    },
    get() {
      return this.value;
    },
    onChange: function (t) {
      this.callback = t;
    },
  },
  f = {
    value: !1,
    selected: [],
    callback: function (t) {},
    set(t) {
      (this.value = t), this.callback(t);
    },
    get() {
      return this.value;
    },
    selectSize() {
      return this.selected.length;
    },
    onChange: function (t) {
      this.callback = t;
    },
  },
  D = {
    state: !1,
    trigger() {
      (this.state = !0),
        setTimeout(() => {
          this.state = !1;
        }, 1);
    },
  },
  S = {
    artist: [],
    album: [],
    wipe() {
      (this.artist = []), (this.album = []);
    },
  },
  P = { row: null },
  _ = { state: !0 },
  et = { value: null };
function rt(t) {
  o.track = t;
}
let b;
function Bt() {
  b = SC.Widget('soundcloud');
}
function zt(t) {
  b.load(t, {
    auto_play: !1,
    buying: !1,
    sharing: !1,
    download: !1,
    show_playcount: !1,
    show_comments: !1,
    callback: () => {
      $('#soundcloud').css('display', 'block'), b.play(), b.setVolume(60), v.set(!1);
    },
  }),
    b.bind(SC.Widget.Events.FINISH, () => z());
}
function Ft() {
  b.toggle();
}
function xt() {
  b.pause(), $('#soundcloud').css('display', 'none');
}
async function Vt() {
  let t;
  return b.getPosition((n) => (t = parseInt(n / 1e3, 10))), await e(10), t;
  async function e(n) {
    return new Promise((a) => setTimeout(a, n));
  }
}
function Ht() {
  b.seekTo(0);
}
let O,
  T = !1,
  q;
async function Yt() {
  const t = (e) => {
    (e.iframeElement.id = 'spotify'),
      (e.iframeElement.className = 'players'),
      e.addListener('ready', () => {
        _.state || (e.play(), (T = !1)), $('#spotify').css('opacity', '1'), v.set(!1), Qt();
      }),
      e.addListener('playback_update', (n) => {
        const { duration: a, position: s } = n.data;
        (q = parseInt(s / 1e3, 10)), _debug && console.log(q, s, a), s === a && ((_.state = !0), (T = !0), z());
      }),
      (O = e);
  };
  setTimeout(() => {
    SpotifyIframeApi.createController(document.getElementById('spotify-container'), {}, t);
  }, 500);
}
function Kt(t) {
  $('#spotify').css('display', 'block'), $('#spotify').css('opacity', '0'), O.loadUri(`spotify:track:${t}`);
}
function Gt() {
  O.togglePlay(), (T = !T);
}
function Wt() {
  $('#sp-pause-button').remove(), $('#spotify').css('display', 'none'), T || (O.togglePlay(), (T = !0)), (_.state = !0);
}
function Jt() {
  return q;
}
function Xt() {
  O.seek(-1);
}
function Qt() {
  const t = '<div id="sp-pause-button"></div>';
  $('#player-container').append(t),
    document.getElementById('sp-pause-button').addEventListener('click', () => {
      O.togglePlay(), (T = !T);
    });
}
let y;
function jt() {
  (y = new YT.Player('youtube', {
    playerVars: { autoplay: 1 },
    events: {
      onReady: () => {
        y.g.className = 'players';
      },
    },
  })),
    y.addEventListener('onStateChange', (t) => {
      t.data === -1 && (v.set(!1), $('#youtube').css('display', 'block')), t.data === 0 && z();
    });
}
function qt(t) {
  y.loadVideoById(t);
}
function Zt() {
  y.getPlayerState() === 1 && y.pauseVideo(), y.getPlayerState() === 2 && y.playVideo();
}
function te() {
  y.pauseVideo(), $('#youtube').css('display', 'none');
}
function ee() {
  return y.getCurrentTime();
}
function ne() {
  y.seekTo(0, !0);
}
const I = new pt('#playlist-table', {
  data: null,
  placeholder: 'Las canciones en cola apareceran aqui.',
  height: '100%',
  layout: 'fitColumns',
  headerVisible: !1,
  autoResize: !0,
  movableRows: !0,
  columns: [
    { title: '#', hozAlign: 'center', formatter: 'rownum', widthGrow: 0.25, resizable: !1, headerSort: !1 },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: !1, rowHandle: !0 },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: !1, rowHandle: !0 },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.35, resizable: !1 },
  ],
});
function R() {
  if (($('#playlist-modal').attr('show', ''), o.list.length !== 0)) {
    const t = I.getRowFromPosition(o.track + 1);
    I.scrollToRow(t, 'center');
  }
}
function X() {
  D.state || $('#playlist-modal').removeAttr('show');
}
o.onListChange((t) => I.replaceData(t));
I.on('cellClick', (t, e) => {
  const n = e.getRow(),
    a = n.getData(),
    s = n.getElement(),
    r = n.getPosition();
  if ((typeof e.getField() > 'u' && !$(s).attr('playing') && ((o.track = r - 1), C(a)), e.getField() === 'time')) {
    const l = o.list.filter((i) => i.id !== a.id);
    if (a.id !== o.getTrackData().id) {
      const i = o.getTrackData().id;
      let c = null;
      D.trigger(),
        (o.list = l),
        o.list.map((u, d) => {
          u.id === i && (c = d);
        }),
        (o.track = c);
    } else {
      const i = o.track;
      nt(!1),
        D.trigger(),
        $("#songsTable [playing='true']").removeAttr('playing'),
        (o.list = l),
        i === 0 ? (o.track = i) : (o.track = i - 1),
        C(o.getTrackData());
    }
  }
});
let kt;
I.on('rowMoving', (t) => {
  kt = t.getPosition(!0) - 1;
});
let ct;
I.on('rowMoved', (t) => {
  ct = t.getPosition(!0) - 1;
  const e = [],
    n = o.getTrackData().id;
  let a = null;
  o.list.forEach((s) => e.push(s)),
    oe(e, kt, ct),
    (o.list = e),
    o.list.map((s, r) => {
      s.id === n && (a = r);
    }),
    (o.track = a);
});
document.addEventListener('contextmenu', (t) => {
  if (t.target.id === 'control-playlist') {
    const e = o.getTrackData().id;
    t.preventDefault();
    const n = o.list.filter((a) => a.id === e);
    (o.list = n),
      (o.track = 0),
      $('#control-playlist').attr('clean', ''),
      setTimeout(() => {
        $('#control-playlist').removeAttr('clean');
      }, 400);
  } else X();
});
document.addEventListener('click', (t) => {
  const e = t.target,
    { id: n } = e;
  !!ae($('#playlist-modal').find(e)[0]) &&
    n !== 'control-prev' &&
    n !== 'control-next' &&
    n !== 'control-playlist' &&
    n !== 'control-shuffle' &&
    X();
});
function ae(t) {
  return typeof t > 'u';
}
function oe(t, e, n) {
  if (n >= t.length) for (var a = n - t.length + 1; a--; ) t.push(void 0);
  return t.splice(n, 0, t.splice(e, 1)[0]), t;
}
window.addEventListener('message', (t) => {
  if (t.data === 'VME-fetchData') {
    let e = localStorage.getItem('VME');
    e === null && (localStorage.setItem('VME', JSON.stringify({ vol: 50, mute: !1 })), (e = localStorage.getItem('VME'))),
      window.postMessage({ msg: 'VME-responseData', payload: JSON.parse(e) });
  }
  t.data.msg === 'VME-setData' && localStorage.setItem('VME', JSON.stringify(t.data.payload)),
    t.data === 'MKR-getTrackData' && Q(o.getTrackData()),
    t.data === 'MKR-Prev' && St(),
    t.data === 'MKR-TogglePause' && ie(),
    t.data === 'MKR-Next' && z();
});
function Q(t) {
  window.postMessage({ msg: 'MKR-TrackData', payload: t });
}
setTimeout(() => {
  Q({ name: '', artist: '', album: '' });
}, 250);
const V = 'SOUNDCLOUD',
  H = 'SPOTIFY',
  Y = 'YOUTUBE';
let B;
function se() {
  Yt(), Bt(), jt();
}
function C(t) {
  nt(!1),
    (B = t.source),
    v.set(!0),
    setTimeout(() => {
      switch (B) {
        case V:
          zt(t.link);
          break;
        case H:
          (_.state = !1), Kt(t.link);
          break;
        case Y:
          qt(t.link);
          break;
      }
    }, 30),
    Q(o.getTrackData());
}
function ie() {
  if (o.list.length !== 0)
    switch (B) {
      case V:
        Ft();
        break;
      case H:
        Gt();
        break;
      case Y:
        Zt();
        break;
    }
}
async function St() {
  if (!v.get()) {
    let t;
    switch (B) {
      case V:
        t = await Vt();
        break;
      case H:
        t = Jt();
        break;
      case Y:
        t = ee();
        break;
    }
    if (t > 5)
      switch (B) {
        case V:
          Ht();
          break;
        case H:
          Xt();
          break;
        case Y:
          ne();
          break;
      }
    else {
      const e = o.track;
      o.prevTrack();
      const n = o.track;
      e !== n && C(o.getTrackData());
    }
  }
}
function nt(t = !0) {
  t && (X(), (_.state = !0), o.wipe(), Q({ name: '', artist: '', album: '' })), Wt(), xt(), te(), v.set(!1);
}
function z() {
  if (!v.get()) {
    const t = o.track;
    o.nextTrack();
    const e = o.track;
    t !== e && !v.get() && C(o.getTrackData());
  }
}
function le() {
  typeof $('#playlist-modal').attr('show') > 'u' ? R() : X();
}
function re() {
  const t = o.getTrackData(),
    e = [];
  if (o.list.length !== 0) {
    o.list.forEach((r) => e.push(r));
    const s = n().filter((r) => r.id !== t.id);
    s.unshift(t), (o.list = s), (o.track = 0);
  } else {
    k.rowManager.activeRows.forEach((r) => {
      e.push(r.getData());
    });
    const s = n();
    (o.list = s), (o.track = 0), C(o.getTrackData());
  }
  R();
  function n() {
    let a = e;
    for (let s = 0; s < 20; s++) a = a.sort(() => Math.random() - 0.5);
    return a;
  }
}
function ce(t = !0) {
  const { row: e } = P,
    n = e.getCells()[0].getElement();
  t ? $(n).trigger('click') : st();
}
function de() {
  const { row: t } = P,
    e = o.list;
  e.push(t.getData()), (o.list = e), (o.track = o.track), o.list.length === 1 && ((o.track = 0), C(t.getData())), D.trigger(), R();
}
function ue() {
  f.set(!0);
}
function fe() {
  const { row: t } = P;
  $t(!0, t.getData());
}
async function ge() {
  const { row: t } = P,
    e = t.getData();
  confirm('¿Realmente desea eliminar este elemento?') && (Ut(e.id), ot(e, e.id, !0), wt(et.value + 1));
}
function me() {
  if (o.list.length !== 0) {
    const t = [];
    o.list.forEach((e) => {
      const n = f.selected.find((s) => s.id === e.id);
      if (n) {
        const s = k.searchRows('id', '=', n.id)[0];
        $(s.getElement()).trigger('click');
      }
      const a = f.selected.filter((s) => s.id !== e.id);
      f.selected = a;
    }),
      o.list.forEach((e) => t.push(e)),
      f.selected.forEach((e) => t.push(e)),
      (o.list = t),
      (o.track = o.track),
      at(),
      D.trigger(),
      R();
  } else st();
}
function pe() {
  k.getRows().forEach((t) => {
    const e = t.getData();
    typeof f.selected.find((a) => a.id === e.id) > 'u' && $(t.getElement()).trigger('click');
  });
}
function at() {
  f.selected.forEach((t) => {
    const e = k.searchRows('id', '=', t.id)[0];
    $(e.getElement()).trigger('click');
  });
}
function he() {
  let t = null;
  document.addEventListener('click', (e) => {
    switch (document.activeElement.id) {
      case 'addSong-findButton':
        t = 'findInput';
        break;
      case 'addSong-findInput':
        t = 'findInput';
        break;
      case 'addSong-button':
        t = 'addSong';
        break;
      case 'updateSong-button':
        t = 'addSong';
        break;
      default:
        t = null;
        break;
    }
    (e.target.id === 'addSong-modal' || $('#addSong-modal').find(e.target).length !== 0) && (t = 'addSong');
  }),
    document.addEventListener('keydown', (e) => {
      document.activeElement.id === 'addSong-findInput' && (t = 'findInput'),
        e.key === 'Escape' &&
          (t === 'addSong' && closeAddSong(),
          t === 'findInput' && document.getElementById('addSong-findInput').getAttribute('show') !== null && K(),
          setTimeout(() => {
            t = null;
          }, 5));
    });
}
const k = new pt('#songsTable', {
  data: null,
  placeholder: 'Cargando...',
  height: '100%',
  layout: 'fitColumns',
  autoResize: !0,
  columns: [
    { title: '#', hozAlign: 'center', formatter: 'rownum', widthGrow: 0.15, resizable: !1, headerSort: !1 },
    { title: 'Nombre', field: 'name', hozAlign: 'center', resizable: !1 },
    { title: 'Artista', field: 'artist', hozAlign: 'center', resizable: !1, sorter: dt('artist') },
    { title: 'Album', field: 'album', hozAlign: 'center', resizable: !1, sorter: dt('album') },
    { title: 'Duracion', field: 'time', hozAlign: 'center', widthGrow: 0.4, resizable: !1 },
  ],
});
function dt(t) {
  switch (t) {
    case 'artist':
      return (e, n, a, s, r, l) => {
        const i = a.getData(),
          c = i.name.toLowerCase(),
          u = i.artist.toLowerCase(),
          d = s.getData(),
          h = d.name.toLowerCase(),
          m = d.artist.toLowerCase();
        if (l === 'asc') {
          const A = `${u} - ${c}}`,
            j = `${m} - ${h}}`;
          return A > j ? 1 : -1;
        }
        if (l === 'desc') return u !== m ? (u > m ? 1 : -1) : c > h ? -1 : 1;
      };
    case 'album':
      return (e, n, a, s, r, l) => {
        const i = a.getData(),
          c = i.album.toLowerCase(),
          u = i.number < 10 ? `0${i.number}` : i.number,
          d = s.getData(),
          h = d.album.toLowerCase(),
          m = d.number < 10 ? `0${d.number}` : d.number;
        if (l === 'asc') {
          const A = `${c} - ${u}}`,
            j = `${h} - ${m}}`;
          return A > j ? 1 : -1;
        }
        if (l === 'desc') return c !== h ? (c > h ? 1 : -1) : u > m ? -1 : 1;
      };
  }
}
async function ot(t, e, n = !1) {
  t ? (typeof e < 'u' && L.set(L.value.filter((a) => a.id !== e)), n || L.value.push(t)) : L.set(await we()),
    ke(),
    k.replaceData(L.get()),
    o.list.length !== 0 && (o.track = o.track);
}
k.on('cellClick', (t, e) => {
  const n = e.getRow(),
    a = n.getElement(),
    s = n.getPosition(),
    r = k.rowManager.activeRows,
    l = [];
  if (typeof e.getField() > 'u' && !$(a).attr('playing'))
    f.get()
      ? st()
      : (o.wipe(),
        r.forEach((i) => {
          l.push(i.getData());
        }),
        (o.list = l),
        (o.track = s - 1),
        C(n.getData()),
        D.trigger(),
        R());
  else if (!f.get()) {
    const { artist: i, album: c } = n.getData();
    (e.getField() === 'artist' || e.getField() === 'album') &&
      (e.getField() === 'artist' && K(!1, i),
      e.getField() === 'album' && K(!1, c),
      setTimeout(() => {
        document.getElementById('addSong-findInput').focus();
      }, 250));
  }
});
function st() {
  o.wipe(), (o.list = f.selected), (o.track = 0), at(), C(o.list[0]), D.trigger(), R();
}
k.on('rowContext', (t, e) => {
  const n = window.innerWidth - t.clientX - 220;
  let a = t.pageX,
    s = t.pageY;
  $(document).trigger('click'),
    n > 0 ? $('#songsList-modal').attr('to-right', '') : ($('#songsList-modal').attr('to-left', ''), (a = t.clientX - 200)),
    $('#songsList-modal').css({ display: 'block', left: `${a}px`, top: `${s}px` }),
    f.get() || $(e.getElement()).attr('selected', ''),
    t.preventDefault(),
    (P.row = e);
});
$(document).on('click', () => {
  const { row: t } = P;
  $('#songsList-modal').css('display', 'none'),
    $('#songsList-modal').removeAttr('to-right'),
    $('#songsList-modal').removeAttr('to-left'),
    t !== null && !f.get() && $(t.getElement()).removeAttr('selected');
});
$(document).on('scroll', () => $(document).trigger('click'));
f.onChange((t) => {
  const e = k.getRows();
  t
    ? (e.forEach((n) => {
        const a = n.getElement();
        $(a).attr('selecting', '');
      }),
      $(P.row.getElement()).trigger('click'),
      $('#songsList-modal if').attr('hidden', ''),
      $('#songsList-modal else').removeAttr('hidden'))
    : (e.forEach((n) => {
        const a = n.getElement();
        $(a).removeAttr('selecting');
      }),
      $('#songsList-modal if').removeAttr('hidden'),
      $('#songsList-modal else').attr('hidden', ''));
});
k.on('rowClick', (t, e) => {
  const n = e.getElement(),
    a = e.getData();
  if (f.get() && n.children[0] !== t.target) {
    if (!$(n).attr('selected') || f.selectSize() === 0) $(n).attr('selected', ''), f.selected.push(a);
    else {
      const s = f.selected.filter((r) => r.id !== a.id);
      (f.selected = s), $(n).removeAttr('selected');
    }
    setTimeout(() => {
      f.selectSize() === 0 && f.set(!1);
    }, 0);
  }
});
o.onTrackChange(({ track: t, prevTrack: e }) => {
  $(Z(e.id)).removeAttr('playing'),
    $(Z(t.id)).attr('playing', 'true'),
    $(ut(e.id)).removeAttr('playing'),
    $(ut(t.id)).attr('playing', 'true');
});
o.onWipe((t) => {
  const { id: e } = t;
  e && $(Z(e)).removeAttr('playing');
});
function K(t = !0, e) {
  const n = document.getElementById('addSong-findButton'),
    a = document.getElementById('addSong-findInput');
  t
    ? n.getAttribute('show') === null
      ? (s(!0),
        (a.value = ''),
        $('#addSong-findInput').on('input', (r) => x(r.target.value)),
        setTimeout(() => {
          a.focus();
        }, 250))
      : (s(!1), x(''), $('#addSong-findInput').unbind('input'))
    : (s(!0), (a.value = e), x(e, !0), $('#addSong-findInput').on('input', (r) => x(r.target.value)));
  function s(r) {
    r ? (n.setAttribute('show', ''), a.setAttribute('show', '')) : (n.removeAttribute('show', ''), a.removeAttribute('show', ''));
  }
}
function x(t, e = !1) {
  k.setFilter((n) => {
    const { name: a, number: s, artist: r, album: l, source: i } = n;
    return e && t === '' && l !== ''
      ? !1
      : !!(
          (t.toLowerCase() === '<sp' && i === 'SPOTIFY') ||
          (t.toLowerCase() === '<sc' && i === 'SOUNDCLOUD') ||
          (t.toLowerCase() === '<yt' && i === 'YOUTUBE') ||
          (t.toLowerCase() === '<nn' && typeof s > 'u') ||
          (t.toLowerCase() === '<wn' && typeof s < 'u') ||
          a.toLowerCase().includes(t.toLowerCase()) ||
          r.toLowerCase().includes(t.toLowerCase()) ||
          l.toLowerCase().includes(t.toLowerCase())
        );
  }),
    $('#songsTable .tabulator-placeholder-contents').text('No se han encontrado coincidencias.');
}
async function we() {
  const t = await _t().then((a) => a.data()),
    e = Number(localStorage.getItem('version')),
    n = [];
  return (
    console.log(t.value, e),
    t.value === e
      ? JSON.parse(localStorage.getItem('songsList')).forEach((s) => n.push(s))
      : ((await Rt()).forEach((s) => {
          const r = s.data();
          (r.id = s.id), n.push(r);
        }),
        localStorage.setItem('songsList', JSON.stringify(n)),
        localStorage.setItem('version', t.value)),
    (et.value = JSON.parse(localStorage.getItem('version'))),
    n
  );
}
function ke() {
  const t = L.get();
  S.wipe(),
    t.forEach((e) => {
      Se(e.artist, e.album);
    }),
    (S.artist = S.artist.sort((e, n) => (e > n ? 1 : -1))),
    (S.album = S.album.sort((e, n) => (e > n ? 1 : -1))),
    ft(document.getElementById('addSong-artist'), S.artist),
    ft(document.getElementById('addSong-album'), S.album);
}
function Se(t, e) {
  const n = S.artist.find((s) => s === t),
    a = S.album.find((s) => s === e);
  typeof n > 'u' && S.artist.push(t), typeof a > 'u' && e !== '' && S.album.push(e);
}
function Z(t) {
  return typeof t < 'u' ? k.searchRows('id', '=', t)[0].getElement() : '';
}
function ut(t) {
  return typeof t < 'u' ? I.searchRows('id', '=', t)[0].getElement() : '';
}
const yt = 'SOUNDCLOUD',
  bt = 'SPOTIFY',
  vt = 'YOUTUBE';
let U = null,
  tt = !1,
  p = [],
  N = '',
  E,
  g,
  w;
function $t(t = !1, e) {
  if (!tt) {
    if (
      ($('.addSong-title').html('Agregar a la Lista'),
      $('#addSong-modal').css('transform', 'translateX(-50%) scale(1)'),
      Tt(),
      (tt = !0),
      (U = null),
      t)
    ) {
      const { name: n, number: a, artist: s, album: r, link: l, time: i, source: c, id: u } = e;
      $('.addSong-title').html('Modificar Cancion'),
        $('#addSong-modal #addSong-name').val(n),
        $('#addSong-modal #addSong-number').val(a),
        $('#addSong-modal #addSong-artist').val(s),
        $('#addSong-modal #addSong-album').val(r),
        $('#addSong-modal #addSong-link').val(l),
        $('#addSong-modal #addSong-time').val(i),
        $('#addSong-modal #addSong-source').val(c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()),
        $('#addSong-check').attr('hidden', ''),
        $('#addSong-save').removeAttr('hidden'),
        $('#addSong-save').removeAttr('disabled'),
        $('#addSong-modal #addSong-link').on('input', () => {
          $('#addSong-check').removeAttr('hidden', ''), $('#addSong-save').attr('hidden', '');
        }),
        (w = { name: n, number: a, artist: s, album: r, link: l, time: i, source: c, id: u }),
        (U = u);
    }
    return;
  }
  it();
}
function it() {
  Le(),
    $('#addSong-modal').css('transform', 'translateX(-50%) scale(0)'),
    (tt = !1),
    setTimeout(() => {
      $('#addSong-link').removeAttr('readonly'),
        $('#addSong-link').removeClass('readonly'),
        $('#addSong-error').html(''),
        $('#addSong-check').removeAttr('hidden'),
        $('#addSong-save').attr('hidden', '');
    }, 250);
}
function ye() {
  switch (
    ($('#addSong-error').html(''),
    $('#addSong-check').attr('disabled', ''),
    $('#addSong-save').removeAttr('disabled'),
    (g = p[4].value),
    (N = ve()),
    (w = void 0),
    N)
  ) {
    case yt:
      $e();
      break;
    case bt:
      Te();
      break;
    case vt:
      Ce();
      break;
    default:
      F('Link Invalido');
      break;
  }
}
async function be() {
  $('#addSong-save').attr('disabled', ''),
    (w.name = p[0].value),
    (w.number = p[1].value),
    (w.artist = p[2].value),
    (w.album = p[3].value),
    U === null ? (w.id = await Ot(w)) : await Nt(U, w),
    wt(et.value + 1),
    it(),
    ot(w, U);
}
function ft(t, e) {
  let n;
  t.addEventListener('input', function (l) {
    let i,
      c,
      u,
      d = this.value;
    if ((r(), !d)) return !1;
    for (
      n = -1,
        i = document.createElement('DIV'),
        i.setAttribute('id', this.id + 'autocomplete-list'),
        i.setAttribute('class', 'autocomplete-items'),
        this.parentNode.appendChild(i),
        u = 0;
      u < e.length;
      u++
    )
      e[u].substr(0, d.length).toUpperCase() == d.toUpperCase() &&
        ((c = document.createElement('DIV')),
        (c.innerHTML = e[u].substr(0, d.length)),
        (c.innerHTML += e[u].substr(d.length)),
        (c.innerHTML += "<input type='hidden' value='" + e[u] + "'>"),
        c.addEventListener('click', function (h) {
          (t.value = this.getElementsByTagName('input')[0].value), r();
        }),
        i.appendChild(c));
  }),
    t.addEventListener('keydown', function (l) {
      let i = document.getElementById(this.id + 'autocomplete-list');
      i && (i = i.getElementsByTagName('div')),
        l.keyCode == 40
          ? (n++, a(i))
          : l.keyCode == 38
          ? (n--, a(i))
          : l.keyCode == 13 && (l.preventDefault(), n > -1 && i && i[n].click());
    });
  function a(l) {
    if (!l) return !1;
    s(l), n >= l.length && (n = 0), n < 0 && (n = l.length - 1), l[n].classList.add('autocomplete-active');
  }
  function s(l) {
    for (let i = 0; i < l.length; i++) l[i].classList.remove('autocomplete-active');
  }
  function r(l) {
    let i = document.getElementsByClassName('autocomplete-items');
    for (let c = 0; c < i.length; c++) l != i[c] && l != t && i[c].parentNode.removeChild(i[c]);
  }
  document.addEventListener('click', (l) => {
    r(l.target);
  });
}
function ve() {
  const t = g.search('soundcloud'),
    e = g.search('spotify'),
    n = g.search('youtube');
  return t !== -1 ? yt : e !== -1 ? bt : n !== -1 ? vt : '';
}
function $e() {
  const t = SC.Widget('sc-tester');
  t.load(g, {
    callback: () => {
      t.getCurrentSound((e) => {
        e !== null ? lt(e.duration) : F('El ID de la cancion es invalido.');
      });
    },
  });
}
function Te() {
  De(), (g = g.replace('https://open.spotify.com/track/', ''));
  const t = g.indexOf('?');
  t !== -1 && (g = g.substr(0, t)),
    setTimeout(() => {
      try {
        E.addListener('ready', () => E.play()),
          E.addListener('playback_update', (e) => {
            lt(e.data.duration), E.destroy();
          }),
          E.loadUri(`spotify:track:${g}`);
      } catch {
        F('El ID de la cancion es invalido.'), E.destroy();
      }
    }, 100);
}
function Ce() {
  const t = 'AIzaSyAyacVFGoIKMMtkH7znpi1ESh2G0UlSKQI';
  (g = g.replace('https://music.youtube.com/watch?v=', '')),
    (g = g.replace('https://www.youtube.com/watch?v=', '')),
    (g = g.slice(0, 11)),
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${g}&key=${t}`)
      .then((e) => e.json())
      .then((e) => {
        if (e.items.length !== 0) {
          const n = e.items[0].contentDetails.duration,
            a = Number(n.slice(2, n.indexOf('M'))) * 60,
            s = Number(n.slice(n.indexOf('M') + 1, n.length - 1));
          lt((a + s) * 1e3);
        } else F('El ID de la cancion es invalido.');
      });
}
function lt(t) {
  Ae()
    ? ((w = { link: g, time: Ee(t), source: N, fullTime: t }),
      $('#addSong-link').addClass('readonly'),
      $('#addSong-link').attr('readonly', ''),
      $('#addSong-time').val(w.time),
      $('#addSong-source').val(N.charAt(0).toUpperCase() + N.slice(1).toLowerCase()),
      $('#addSong-check').attr('hidden', ''),
      $('#addSong-check').removeAttr('disabled'),
      $('#addSong-save').removeAttr('hidden'))
    : F('El link que ha ingresado ya se encuentra registrado.');
}
function Ae() {
  return typeof L.get().find((n) => n.link === g) > 'u';
}
function F(t) {
  $('#addSong-error').html(t), $('#addSong-check').removeAttr('disabled');
}
function Ee(t) {
  const e = parseInt(t / 1e3, 10),
    n = Math.floor(e / 60),
    a = e - n * 60;
  return `${n}:${a < 10 ? `0${a}` : a}`;
}
function Tt() {
  const t = $('#addSong-modal input');
  p = [];
  for (let e = 0; e < t.length; e++) p.push(t[e]);
}
function Le() {
  Tt(), (p[0].value = ''), (p[1].value = ''), (p[2].value = ''), (p[3].value = ''), (p[4].value = ''), $(p[5]).val(''), $(p[6]).val('');
}
function De() {
  $('body').append('<div id="sp-tester-container" class="tester"></div>');
  const t = (e) => {
    (e.iframeElement.id = 'sp-tester'), (e.iframeElement.className = 'tester'), (E = e);
  };
  setTimeout(() => {
    SpotifyIframeApi.createController(document.getElementById('sp-tester-container'), {}, t);
  }, 10);
}
const G = document.getElementById('dummy-audio');
G.src = Ie(60);
G.loop = !0;
G.addEventListener('pause', () => {
  G.play();
});
function Ie(t, e = 44100) {
  const n = t * e,
    a = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  a || console.log('No Audio Context');
  const r = new a().createBuffer(1, n, e);
  return URL.createObjectURL(Pe(r, n));
}
function Pe(t, e) {
  let n = t.numberOfChannels,
    a = e * n * 2 + 44,
    s = new ArrayBuffer(a),
    r = new DataView(s),
    l = [],
    i,
    c,
    u = 0,
    d = 0;
  for (
    m(1179011410),
      m(a - 8),
      m(1163280727),
      m(544501094),
      m(16),
      h(1),
      h(n),
      m(t.sampleRate),
      m(t.sampleRate * 2 * n),
      h(n * 2),
      h(16),
      m(1635017060),
      m(a - d - 4),
      i = 0;
    i < t.numberOfChannels;
    i++
  )
    l.push(t.getChannelData(i));
  for (; d < a; ) {
    for (i = 0; i < n; i++)
      (c = Math.max(-1, Math.min(1, l[i][u]))), (c = (0.5 + c < 0 ? c * 32768 : c * 32767) | 0), r.setInt16(d, c, !0), (d += 2);
    u++;
  }
  return new Blob([s], { type: 'audio/wav' });
  function h(A) {
    r.setUint16(d, A, !0), (d += 2);
  }
  function m(A) {
    r.setUint32(d, A, !0), (d += 4);
  }
}
desktopLoaded.onChange((t) => {
  t === 4 && Ct();
});
desktopLoaded.get() === 4 && Ct();
function Ct() {
  se(), he();
}
window.toggleAddSong = $t;
window.toggleFindSong = K;
window.closeAddSong = it;
window.checkAddSong = ye;
window.saveAddSong = be;
window.controlPrev = St;
window.controlStop = nt;
window.controlNext = z;
window.togglePlaylist = le;
window.controlShuffle = re;
window.playFromMenu = ce;
window.singleAddPlaylist = de;
window.selectMode = ue;
window.updateSong = fe;
window.deleteSong = ge;
window.addPlaylist = me;
window.selectAll = pe;
window.deselectAll = at;
