// Ejemplo ↓
export const songsList = {
  // Variable Interna
  value: [],

  // Respuesta del callback
  callback: function (e) {},

  // Setter
  set(e) {
    this.value = e;
    this.callback(e);
  },

  // Getter
  get() {
    return this.value;
  },

  // Definir el listener
  onChange: function (e) {
    this.callback = e;
  },
};

export const currentPlaylist = {
  _list: [],
  _track: 0,
  _prevTrack: null,

  get list() {
    return this._list;
  },

  get track() {
    return this._track;
  },

  /**
   * @param {} e
   */
  set list(e) {
    this._list = e;
    this.callbackList(e);
  },

  /**
   * @param {} e
   */
  set track(e) {
    this._prevTrack = this.track;
    this._track = e;

    this.callbackTrack({ track: this.getTrackData(), prevTrack: this.getPrevTrackData() });
  },

  // Funciones externas
  prevTrack() {
    const e = this._track - 1;
    if (e >= 0) forceSetTrack(e);
  },

  nextTrack() {
    const e = this._track + 1;
    if (e < this._list.length) forceSetTrack(e);
  },

  getTrackData() {
    const e = this._list[this._track];

    if (typeof e === 'undefined') return {};
    return e;
  },

  getPrevTrackData() {
    const e = this._list[this._prevTrack];

    if (typeof e === 'undefined') return {};
    return e;
  },

  wipe() {
    this.callbackWipe(this.getTrackData());
    this.callbackList([]);

    this._list = [];
    this._track = 0;
  },

  // Callbacks y otras cosas.
  onWipe: function (e) {
    this.callbackWipe = e;
  },

  onListChange: function (e) {
    this.callbackList = e;
  },

  onTrackChange: function (e) {
    this.callbackTrack = e;
  },

  callbackWipe: function (e) {},
  callbackList: function (e) {},
  callbackTrack: function (e) {},
};

export const loadingPlayer = {
  value: false,
  callback: function (e) {},
  set(e) {
    this.value = e;
    this.callback(e);
  },
  get() {
    return this.value;
  },
  onChange: function (e) {
    this.callback = e;
  },
};

export const selectMode = {
  value: false,
  selected: [],
  callback: function (e) {},
  set(e) {
    this.value = e;
    this.callback(e);
  },
  get() {
    return this.value;
  },
  selectSize() {
    return this.selected.length;
  },
  onChange: function (e) {
    this.callback = e;
  },
};

export const preventClosePlaylist = {
  state: false,

  trigger() {
    this.state = true;

    setTimeout(() => {
      this.state = false;
    }, 1);
  },
};

export const autoComplete = {
  artist: [],
  album: [],
  wipe() {
    this.artist = [];
    this.album = [];
  },
};

export const rowOnMenu = { row: null };
export const stopped = { state: true };
export const wakeLock = { state: null };
export const dataVersion = { value: null };

// Funciones Externas porque ajajajavascript.
function forceSetTrack(e) {
  currentPlaylist.track = e;
}
