const EventEmitter = require("events");
const five = require("johnny-five");

module.exports = class Encoder extends EventEmitter {

  constructor({ pin1, pin2, board, initialValue = 0, step = 1}) {

    super();
    this.value = initialValue;
    this.step = step;

    this.waveform = "";
    this.waveformTimeout;
    this.lastValue = 0;

    this.upButton = new five.Button({
        pin: pin1,
        holdtime: 500,
        board,
      });
      this.downButton = new five.Button({
        pin: pin2,
        holdtime: 500,
        board,
      });
  
      this.upButton.on("up", () => {
        this.waveform += "1";
        this.handleWaveform();
        // console.log(this.waveform);
      });
  
      this.downButton.on("up", () => {
        this.waveform += "0";
        this.handleWaveform();
        // console.log(this.waveform);
      });
  }

  handleWaveform() {
    if (this.waveform.length < 2) {
        this.waveformTimeout = setTimeout(() => {
            this.waveform = "";
            this.lastValue = 0;
        }, 100);
        return;
    }

    if (this.waveformTimeout) {
        clearTimeout(this.waveformTimeout);
    }

    if (this.waveform === "01") {
        this.value = this.value + 1;
        if (this.value != this.lastValue) {
            this.lastValue = this.value;
            this.emit("change", this.value);
            this.emit("up", this.value);
            // console.log(this.value);
            // console.log("lastValue: ", this.lastValue);
        }
    } else if (this.waveform === "10") {
        this.value = this.value - 1;
        if (this.value != this.lastValue) {
            this.lastValue = this.value;
            this.emit("change", this.value);
            this.emit("down", this.value);
            // console.log(this.value );
            // console.log("lastValue: ", this.lastValue);
        }
    }

    this.waveform = "";
  }
}