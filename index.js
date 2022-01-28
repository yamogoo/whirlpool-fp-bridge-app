// ---------------------- Program Settings ----------------------- //

// Speed value in percent
const programSettings = {
  foodProcessor: [
    { name: "LOW", speed: 25 },
    { name: "HIGH", speed: 50 },
    { name: "PULSE", speed: 100 },
    { name: "CHOP", speed: 100 },
    { name: "SHRED", speed: 75 },
    { name: "SLICE", speed: 65 },
    { name: "DICE", speed: 55 }
  ],
  blender: [
    { name: "BLEND-1", speed: 12.5 },
    { name: "BLEND-2", speed: 25 },
    { name: "BLEND-3", speed: 37.5 },
    { name: "BLEND-4", speed: 50 },
    { name: "BLEND-5", speed: 62.5 },
    { name: "BLEND-6", speed: 75 },
    { name: "BLEND-7", speed: 87.5 },
    { name: "BLEND-8", speed: 100 },
  ]
}

// --------------------------- Imports --------------------------- //

const sendMessage = require("./src/sendMessage"),
      recieveToggleValueOfMessage = require("./src/recieveToggleValueOfMessage"),
      recieveMessage = require("./src/recieveMessage"),
      buttonPressable = require("./src/buttonPressable"),
      time = require("./src/time"),
      capacityTouch = require("./src/capacityTouchMPR121");

const knob = require("./src/Encoder/myEncoder");

      // Socket.IO
const
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

          // false = new five.LCD({controller: "JHD1313M1", board}),

          // Food processor Accessory Button

          fpAccessoryButton = new five.Button({pin: 7, type: "digital"}),
          hbjAccessoryButton = new five.Button({pin: 2, type: "digital"}),

          // Food processor Accessory Button

          paddleButton = new five.Button({pin: 4, type: "digital"}),

          // Paddle Button

          lidButton = new five.Button({pin: "A2", type: "analog"}),
          lidButtonPin = new five.Pin({pin: "A2", type: "analog"})

          // Motorof the Machine

          motor = new five.Motor({pin: 3, type: "digital"}),

          // Capacity Touch

          capTouchSensorMPR121 = new five.Keypad({
            controller: "MPR121", address: 0x5B, length: 12, sensitivity: {press: 0.91, release: 0.91},
          });

    // --------------------------- Components --------------------------- //

    // Start

    function mounted () {
      lidButtonPin.query(function(state) {
        if (state.value == 1023) { 
          sendMessage(socket, false, "@WARNING_IS_ENABLED", false);
         } else { 
          sendMessage(socket, false, "@WARNING_IS_ENABLED", true);
          }
      });
    };
    
    mounted();

    // Knob Controller (Dial)

    knob({a: 5, b: 6, stepper: 2},
      () => {
        sendMessage(socket, false, "@KNOB_UP", 1)
      },
      () => {
        sendMessage(socket, false, "@KNOB_DOWN", -1)
      }
    );

    // Capacity Touch Sensor (MPR121)

    capacityTouch(capTouchSensorMPR121, socket, false, 
      [{ch: 11, value: 1}, {ch: 2, value: 2}, {ch: 3, value: 3}, {ch: 10, value: 4}, {ch: 9, value: 5}, {ch: 8, value: 6}],
      ["press", "release"], "@TOUCH_DOWN", "@TOUCH_UP",
    );

    // Time

    time(socket, false, 1, "@GET_TIME", "@GET_MINUTES", "@GET_HOURS", false);

    // Food processor Accessory Button

    buttonPressable(fpAccessoryButton, false,
      () => {sendMessage(socket, false, "@FP_ACCESSORY_IS_INSTALLED", false)},
      () => {sendMessage(socket, false, "@FP_ACCESSORY_IS_INSTALLED", true)}
    );

    buttonPressable(hbjAccessoryButton, false,
      () => {sendMessage(socket, false, "@HBJ_ACCESSORY_IS_INSTALLED", false)},
      () => {sendMessage(socket, false, "@HBJ_ACCESSORY_IS_INSTALLED", true)}
    );

    // Accessory Lid Button
    //paddleButtonLed
    buttonPressable(paddleButton, false,
      () => {sendMessage(socket, false, "@PADDLE_IS_PRESSED", false)},
      () => {sendMessage(socket, false, "@PADDLE_IS_PRESSED", true)}
    );

    // Cap Button

    buttonPressable(lidButton, false,
      () => {
        // sendMessage(socket, false, "@LID_IS_OPENED", true),
            sendMessage(socket, false, "@WARNING_IS_ENABLED", true)},
      () => {
        // sendMessage(socket, false, "@LID_IS_OPENED", false)
            sendMessage(socket, false, "@WARNING_IS_ENABLED", false)}
    );

    // --------------------------- // Recieve mesages from App --------------------------- //

    socket.on('ppMessage', (data) => {
      console.log(`[SOCKETIO] Receive a message from ${data.fromName}`, data);

      // Start Machine Motor

      function startProgram () {
        for (const [accessories, value] of Object.entries(programSettings)) {
          // Program Start
          // console.log(value);
          let speedFactor = 2.55;
          for (i = 0; i < value.length; i++) {
            recieveMessage(data, "@PROGRAM_STARTED", `${value[i].name}`,
              () => {motor.start(Math.floor(value[i].speed * speedFactor)),
                console.log("Program: ", value[i].name, Math.floor(value[i].speed * speedFactor));
              }
            );
          };
          // Program Stop
          for (i = 0; i < value.length; i++) {
            recieveMessage(data, "@PROGRAM_STOPPED", `${value[i].name}`,
              () => {motor.stop(),
                console.log("Program: ", value[i].name, 0);}
            );
          }
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
  });

socket.on('disconnect', () => {
  console.log('[SOCKETIO] disconnected');
});