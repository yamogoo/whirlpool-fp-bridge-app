const ledController = require("./ledController");

module.exports = function buttonSignal(button, led, onTurnOn, onTurnOff) {

    let state = true;
    
    button.on("down", function() {

        state = !state;
        onTurnOff();
        
        if (led != false) {
            ledController(led, state);
        }
    });

    button.on("up", function() {

        state = !state;
        onTurnOn();
        if (led != false) {
            ledController(led, state);
        }
    });
};