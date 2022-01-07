// ---------------------- Program Settings ----------------------- //

const programSettings = {
  manualMode: [
    { name: "Low", speed: 55 },
    { name: "High", speed: 155 },
    { name: "Pulse", speed: 255 }
  ],
  programs: []
}

// --------------------------- Imports --------------------------- //

const sendMessage = require("./src/sendMessage"),
      recieveToggleValueOfMessage = require("./src/recieveToggleValueOfMessage"),
      recieveMessage = require("./src/recieveMessage"),
      knobStepper = require("./src/rotaryEncoder"),
      // buttonLed = require("./src/buttonLed"),
      buttonPressable = require("./src/buttonPressable"),
      time = require("./src/time"),
      capacityTouch = require("./src/capacityTouchMPR121");

const Encoder = require("./src/Encoder/encoder");
      // Motor = require("./src/motor");
// const johnnyFiveRotaryEncoder = require("./src/johnny-five-rotary-encoder");

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

          // Food processor Accessory Button

          fpAccessoryButton = new five.Button({pin: 7, type: "digital"}),

          // Food processor Accessory Button

          paddleButton = new five.Button({pin: 5, type: "digital"}),

          // Paddle Button

          lidButton = new five.Button({pin: "A2", type: "analog"}),

          // Motorof the Machine

          motor = new five.Motor({pin: 3, type: "digital"}),
          // motor = new Motor({board, pin: 3, type: "digital", range: [{min: 30}, {max: 255}], rpm: 9000}),

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

    capacityTouch(capTouchSensorMPR121, socket, helperLcd, 
      [{ch: 11, value: 1}, {ch: 2, value: 2}, {ch: 3, value: 3}, {ch: 10, value: 4}, {ch: 9, value: 5}, {ch: 8, value: 6}],
      ["press", "release"], "@TOUCH_DOWN", "@TOUCH_UP",
    );

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

    // --------------------------- // Recieve mesages from App --------------------------- //

    socket.on('ppMessage', (data) => {
      console.log(`[SOCKETIO] Receive a message from ${data.fromName}`, data);

      // Start Machine Motor

      function startProgram () {
        // Program Start
        for (i = 0; i < programSettings.manualMode.length; i++) {
          recieveMessage(data, "@PROGRAM_STARTED", `${programSettings.manualMode[i].name}`,
            () => {motor.start(programSettings.manualMode[i].speed)}
          );
        };
        // Program Stop
        for (i = 0; i < Object.keys(programSettings.manualMode).length; i++) {
          recieveMessage(data, "@PROGRAM_STOPPED", `${programSettings.manualMode[i].name}`,
            () => {motor.stop()}
          );
        }
      }

      startProgram();
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