module.exports = function ledController(led, state) {

    if (state == true) {
        led.on();
        
    } else {
        led.stop().off();
        
    }
};