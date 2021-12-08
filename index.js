const sendMessage = require("./src/sendMessage");
const encoder = require("./src/encoder");
const buttonLed = require("./src/buttonLed");

// --------------------------- Setup Board --------------------------- //

const five = require("johnny-five");
const board = new five.Board();

// Socket.IO
const io = require('socket.io-client');
const ask = require('./ask');

const address = 'http://localhost:9981';
const socket = io(address, {reconnectionAttempts: 5, timeout: 1000 * 10});

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
          machineMotorLed = new five.Led({pin: 4, type: "digital"});

    // --------------------------- Components --------------------------- //

    // Knob Controller (Dial)
    function knobOnUp() {
      sendMessage(socket, helperLcd, "@KNOB_UP", 1);
    };

    function knobOnDown() {
      sendMessage(socket, helperLcd, "@KNOB_DOWN", -1);
    };

    encoder(knobUp, knobDown, knobOnUp, knobOnDown);

    // Food processor Accessory Button

    function fpAccessoryButtonOnTurnOn() {
      sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", true);
    };
    function fpAccessoryButtonOnTurnOff() {
      sendMessage(socket, helperLcd, "@FP_ACCESSORY_IS_INSTALLED", false);
    };

    buttonLed(fpAccessoryButton, fpAccessoryButtonLed, fpAccessoryButtonOnTurnOn, fpAccessoryButtonOnTurnOff);

    // Food processor Accessory Lid Button

    function fpAccessoryLidButtonOnTurnOn() {
      sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", true);
      
    };
    function fpAccessoryLidButtonOnTurnOff() {
      sendMessage(socket, helperLcd, "@WARNING_IS_ENABLED", false);
    };

    buttonLed(fpAccessoryLidButton, fpAccessoryLidButtonLed, fpAccessoryLidButtonOnTurnOn, fpAccessoryLidButtonOnTurnOff);

    // Recieve mesages from Protopie
    socket.on('ppMessage', (data) => {
      console.log('[SOCKETIO] Receive a message from Protopie Connect', data);

      // Start Machine Motor
      if (data.messageId == "@MACHINE_STARTED" && data.value == "true") {
        machineMotorLed.on();
      } else if (data.messageId == "@MACHINE_STARTED" && data.value == "false") {
        machineMotorLed.stop().off();
      }

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
