let controller;

export function loadSC() {
  controller = SC.Widget('soundcloud');
}

export function playSC(e) {
  console.log(controller);

  controller.load(e, {
    auto_play: true,
    buying: false,
    sharing: false,
    download: false,
    show_playcount: false,
    show_comments: false,
    callback: () => {
      $('#soundcloud').css('display', 'block');
    },
  });
}

export function stopSC() {
  controller.pause();
  $('#soundcloud').css('display', 'none');
}
