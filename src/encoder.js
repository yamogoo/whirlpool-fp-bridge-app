module.exports = function encoderSignal(encoderUp, encoderDown, onUp, onDown) {

    var countUp = 0;
    var countDown = 0;
    let rotationStepper = 1;
    let waveform = '';
    let waveformTimeout;
  
    encoderUp.on('up', () => {
      countUp += 1;
      if (countUp%rotationStepper == 0) {
        waveform += '1';
        countDown = 0;
        handleWaveform();
      }
    });
  
    encoderDown.on('up', () => {
      countDown += 1;
      if (countDown%rotationStepper == 0) {
        waveform += '0';
        countUp = 0;
        handleWaveform();
      }
    });
    
    function handleWaveform(count) {
          // console.log(count);
        if (waveform.length < 2) {
          waveformTimeout = setTimeout(() => {
            waveform = '';
            
          }, 100);
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