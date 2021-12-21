const ledController = require("./ledController");

module.exports = function buttonSignal(button, led, onTurnOn, onTurnOff) {

    var state = true;
    
    button.on("down", function() {

        state = !state;
        onTurnOff();
        ledController(led, state);
    });

    button.on("up", function() {

        state = !state;
        onTurnOn();
        ledController(led, state);
    });
};