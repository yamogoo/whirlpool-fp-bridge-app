module.exports = function encoderSignal(encoderUp, encoderDown, onUp, onDown) {

    let waveform = '';
    let waveformTimeout;
  
    encoderUp.on('up', () => {
      waveform += '1';
      handleWaveform();
    });
  
    encoderDown.on('up', () => {
      waveform += '0';
      handleWaveform();
    });

    function handleWaveform() {
        if (waveform.length < 2) {
            waveformTimeout = setTimeout(() => {
              waveform = '';
              
            }, 50);
            return;
          }
      
          if (waveformTimeout) {
            clearTimeout(waveformTimeout);
          }
      
          if (waveform === '01') {
            onUp();
          } else if (waveform === '10') {
            onDown();
          }
          waveform = '';
    }
  }