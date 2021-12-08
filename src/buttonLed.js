const ledController = require("./ledController");

module.exports = function buttonSignal(button, led, onTurnOn, onTurnOff) {

    var state = true;
    
    button.on("down", function() {

        state = !state;
        ledController(led, state);

        if (state === true) {
            console.log("on");
            onTurnOn();
        } else {
            console.log("off");
            onTurnOff();
        }
    });
};