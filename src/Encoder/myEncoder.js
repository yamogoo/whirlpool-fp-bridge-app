const five = require("johnny-five");
module.exports = function encoder(settings, onUp, onDown) {
    const
        sigS1 = new five.Pin({
            pin: settings.a,
            freq: 0
        }),
        sigS2 = new five.Pin({
            pin: settings.b,
            freq: 0
        });

    let val = 0, prevVal = 0,
        prevS1 = 0, prevS2 = 0,
        curS1 = 1, curS2 = 1,
        direction = "",
        flag = false;

    sigS1.read((error, value) => {
        if (prevS1 != value) {
            curS1 = value;
        }
    });
    
    sigS2.read((error, value) => {
        if (prevS2 != value) {
            curS2 = value;
        }
        encoderDetectSignal();
            prevS2 = curS2;
    });

    function encoderDetectSignal() {
        // console.log("prevS1: ", prevS1);
        // console.log("SigS1: ", curS1);
        // console.log("SigS2: ", curS2);
        let step = settings.stepper;
        if (curS1 !== prevS1) {
            if ( flag == true ) {
                // Set Value
                if (curS2 === curS1) { 
                    val += 1; direction = "CW";
                } else if (curS2 !== curS1 && curS2 === 1) {
                    val -= 1; direction = "CWW"
                }
                // Start Functions
                if (val%step === 0 && prevVal != val) {
                    if (direction === "CW") {
                        onUp();
                    } else if (direction === "CWW") {
                        onDown();
                    }
                    // console.log("val: ", val);
                    // console.log("direction: ", direction);
                    prevVal = val;
                }
                flag = false;
            } else {
                flag = true;
            }     
        }
        prevS1 = curS1;
    }
}