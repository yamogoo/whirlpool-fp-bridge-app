module.exports = function encoderSignal(encoder, onUp, onDown) {

  encoder.on("up", () => {
    onUp();
  });
  encoder.on("down", () => {
    onDown();
  });
};