const ledController = require("./ledController");

module.exports = function buttonSignal(button, led, onTurnOn, onTurnOff) {

    let state = true;
    
    button.on("down", function() {

        state = !state;
        ledController(led, state);

        if (state == true) {
            onTurnOn();
        } else {
            onTurnOff();
        }
    });
};