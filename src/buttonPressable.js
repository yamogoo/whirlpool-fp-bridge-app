const ledController = require("./ledController");

module.exports = function buttonSignal(button, led = false, onTurnOn, onTurnOff) {

    var state = true;
    
    button.on("down", function() {

        state = !state;
        onTurnOff();
        
        if (led == true) {
            ledController(led, state);
        }
    });

    button.on("up", function() {

        state = !state;
        onTurnOn();
        if (led == true) {
            ledController(led, state);
        }
    });
};