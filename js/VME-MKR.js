window.addEventListener('message', (e) => {
  // Conexion con VME
  if (e.data === 'larry is that you?') window.postMessage("it's me, DIO");

  // Conexiones con MKR
  if (e.data === 'MKR-Prev') console.log('prev');
  if (e.data === 'MKR-TogglePause') console.log('pause');
  if (e.data === 'MKR-Next') console.log('next');
});
