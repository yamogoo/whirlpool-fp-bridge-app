const sendMessage = require("./src/sendMessage"),
      recieveToggleValueOfMessage = require("./src/recieveToggleValueOfMessage"),
      recieveMessage = require("./src/recieveMessage"),
      knobStepper = require("./src/rotaryEncoder"),
      buttonLed = require("./src/buttonLed"),
      buttonPressable = require("./src/buttonPressable"),
      time = require("./src/time"),
      capacityTouch = require("./src/capacityTouchMPR121");

const Encoder = require("./src/Encoder/encoder");
const johnnyFiveRotaryEncoder = require("./src/johnny-five-rotary-encoder");

      // Socket.IO
const // ask = require('./ask'),
      io = require('socket.io-client'),
      ip = 'localhost',
      address = `http://${ip}:9981`,
      socket = io(address, {reconnectionAttempts: 10, timeout: 1000 * 10});

// --------------------------- Setup Board --------------------------- //

const five = require("johnny-five"),
      board = new five.Board({
        // port: "COM*"// fo Windows
        port: "/dev/tty.usbserial-0001" // for OSX
        // port: "/dev/ttyUSB*" // for Linux
      });

      function exit() {
        socket.disconnect();
        process.exit();
      }
      
      process.on('SIGINT', function () {
        exit();
      });

// --------------------------- Board --------------------------- //


board.on("ready", function () {

    // Setup Components
    
    const
          // Helper LCD

          helperLcd = new five.LCD({controller: "JHD1313M1", board}),

          // Knob

          knob = new Encoder({pin: 2, step: 1}),
          // upButton = new five.Button({pin: 13, holdtime: 500}),
          // downButton = new five.Button({pin: 12, holdtime: 500}),
          // pressButton = new five.Button({pin: 11, holdtime: 500}),

          // Food processor Accessory Button

          fpAccessoryButton = new five.Button({pin: 7, type: "digital"}),

          // Food processor Accessory Button

          paddleButton = new five.Button({pin: 5, type: "digital"}),

          // Paddle Button

          lidButton = new five.Button({pin: "A2", type: "analog"}),

          // Motorof the Machine

          machineMotor = new five.Led({pin: 4, type: "digital"}),

          // Capacity Touch

          capTouchSensorMPR121 = new five.Keypad({
            controller: "MPR121", address: 0x5B, length: 12, sensitivity: {press: 0.99, release: 1.0},
          });

    // --------------------------- Components --------------------------- //

    // Knob Controller (Dial)

    function start () {
      sendMessage(socket, false, "@LID_IS_OPENED", true);
      sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", true);
    }

    knobStepper(knob, 
      () => {
        sendMessage(socket, false, "@KNOB_UP", 1)
      },
      () => {
        sendMessage(socket, false, "@KNOB_DOWN", -1)
      }
    );

    // Capacity Touch Sensor (MPR121)

    capacityTouch(capTouchSensorMPR121, socket, helperLcd, ["press", "release"], "@TOUCH_DOWN", "@TOUCH_UP" );

    // Time

    time(socket, false, 60, "@GET_TIME", "@GET_MINUTES", "@GET_HOURS", false);

    // Food processor Accessory Button

    buttonPressable(fpAccessoryButton, false,
      () => {sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", false)},
      () => {sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", true)}
    );

    // Food processor Accessory Lid Button
    //paddleButtonLed
    buttonPressable(paddleButton, false,
      () => {sendMessage(socket, helperLcd, "@PADDLE_IS_PRESSED", false)},
      () => {sendMessage(socket, helperLcd, "@PADDLE_IS_PRESSED", true)}
    );

    // Cap Button

    buttonPressable(lidButton, false,
      () => {sendMessage(socket, helperLcd, "@LID_IS_OPENED", true),
            sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", true)},
      () => {sendMessage(socket, helperLcd, "@LID_IS_OPENED", false)
            sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", false)}
    );

    start();

    // Recieve mesages from Protopie

    socket.on('ppMessage', (data) => {
      console.log(`[SOCKETIO] Receive a message from ${data.fromName}`, data);

      // Start Machine Motor

      recieveToggleValueOfMessage(data, "@MACHINE_STARTED",
        () => {machineMotor.on(); console.log("motor on")},
        () => {machineMotor.stop().off()}
      );
    });
});

// Socket

socket
  .on('connect_error', (err) => {
    console.error('[SOCKETIO] disconnected, error', err.toString());
  })
  .on('connect_timeout', () => {
    console.error('[SOCKETIO] disconnected by timeout');
  })
  .on('reconnect_failed', () => {
    console.error('[SOCKETIO] disconnected by retry_timeout');
  })
  .on('reconnect_attempt', (count) => {
    console.error(
      `[SOCKETIO] Retry to connect #${count}, Please make sure App is running on ${address}`
    );
  })
  .on('connect', async () => {
    console.log('[SOCKETIO] connected to', address);
    // await askForMessage();
  });

socket.on('disconnect', () => {
  console.log('[SOCKETIO] disconnected');
});

// socket.on("blokdots", (data) => {
// 	console.log("Received blokdots:", data.msg, data.val);
// });

// socket.on("disconnect", () => {
// 	console.log(`Disconnected from blokdots`);
// 	if(interval) {
// 		clearInterval(interval);
// 	}
// });