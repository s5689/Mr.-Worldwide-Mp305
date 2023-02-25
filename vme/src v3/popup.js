const input = document.getElementById('volume-control');
const number = document.getElementById('volume-value');
let controller = null;
let mute = false;

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  tab = tab[0];

  chrome.tabCapture.getMediaStreamId({}, (resp) => {
    chrome.tabs.sendMessage(tab.id, { type: 'streamId', value: resp });
  });
});
