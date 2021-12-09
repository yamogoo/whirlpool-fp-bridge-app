const sendMessage = require("./src/sendMessage"),
      recieveMessage = require("./src/recieveMessage"),
      encoder = require("./src/encoder"),
      buttonLed = require("./src/buttonLed");

      // Socket.IO
const io = require('socket.io-client'),
      ask = require('./ask'),
      address = 'http://localhost:9981',
      socket = io(address, {reconnectionAttempts: 5, timeout: 1000 * 10});

// --------------------------- Setup Board --------------------------- //

const five = require("johnny-five"),
      board = new five.Board();

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
          helperLcd = new five.LCD({controller: "JHD1313M1", board});
          // Knob
          knobUp = new five.Button({pin: 2, type: "digital", holdtime: 10}),
          knobDown = new five.Button({pin: 3, type: "digital", holdtime: 10}),
          // Food processor Accessory Button
          fpAccessoryButton = new five.Button({pin: 8, type: "digital"}),
          fpAccessoryButtonLed = new five.Led({pin: 7, type: "digital"}),
          // Food processor Accessory Button
          fpAccessoryLidButton = new five.Button({pin: 6, type: "digital"}),
          fpAccessoryLidButtonLed = new five.Led({pin: 5, type: "digital"}),
          // Motorof the Machine
          machineMotor= new five.Led({pin: 4, type: "digital"});

    // --------------------------- Components --------------------------- //

    // Knob Controller (Dial)

    encoder(knobUp, knobDown,
      () => {sendMessage(socket, helperLcd, "@KNOB_UP", 1)},
      () => {sendMessage(socket, helperLcd, "@KNOB_DOWN", -1)}
      );

    // Food processor Accessory Button

    buttonLed(fpAccessoryButton, fpAccessoryButtonLed,
      () => {sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", true)},
      () => {sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", false)}
      );

    // Food processor Accessory Lid Button

    buttonLed(fpAccessoryLidButton, fpAccessoryLidButtonLed,
      () => {sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", true)},
      () => {sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", false);}
      );

    // Recieve mesages from Protopie

    socket.on('ppMessage', (data) => {
      console.log('[SOCKETIO] Receive a message from Protopie Pie Connect', data);

      // Start Machine Motor

      recieveMessage(data, "@MACHINE_STARTED",
      () => {machineMotor.on()},
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
      `[SOCKETIO] Retry to connect #${count}, Please make sure ProtoPie Connect is running on ${address}`
    );
  })
  .on('connect', async () => {
    console.log('[SOCKETIO] connected to', address);
    // await askForMessage();
  });

socket.on('disconnect', () => {
  console.log('[SOCKETIO] disconnected');
});

socket.on("blokdots", (data) => {
	console.log("Received blokdots:", data.msg, data.val);
});

socket.on("disconnect", () => {
	console.log(`Disconnected from blokdots`);
	if(interval) {
		clearInterval(interval);
	}
});
