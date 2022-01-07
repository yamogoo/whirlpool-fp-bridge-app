const five = require("johnny-five");


module.exports = class Motor {

    constructor({board, pin, type = "digital", range = [{min: 30}, {max: 255}], rpm = 9000}) {
        // var percentage = 

        this.motor = new five.Motor({
            pin: pin,
            type: type,
            board
        });

        this.max = range.max;
    }

    getSpeed(speed) {
        console.log(speed / 255 );
    }

    start(speed) {
        // this.min = range.min;
        // this.max = range.max;
        // this.rpm = rpm;
        // var value = speed / range * 100;
        // this.motor.start(this.max);
        console.log(speed / this.max);
        
    }

    stop(delay) {
        timeout(this.motor.stop(), delay);
    }
}

