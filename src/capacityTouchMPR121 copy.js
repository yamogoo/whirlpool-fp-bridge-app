const sendMessage = require("./sendMessage");

module.exports = function sendTouchChanel (sensor, socket, lcd, arrOfEvents = ["change", "press", "hold", "release"], messageIdDown, messageIdUp, messageHold, messageChange) {
    arrOfEvents.forEach(function(eventType) {
      sensor.on(eventType, function(event) {
          function sendMessageOfTouchChanel (socket, lcd, messageIdDown, messageIdUp) {
            function getChannel (messageId) {
                if (event.which == 11) {
                  sendMessage(socket, lcd, messageId, 1);
                } else if (event.which == 2) {
                  sendMessage(socket, lcd, messageId, 2);
                }
                else if (event.which == 3) {
                  sendMessage(socket, lcd, messageId, 3);
                }
                else if (event.which == 10) {
                  sendMessage(socket, lcd, messageId, 4);
                }
                else if (event.which == 9) {
                  sendMessage(socket, lcd, messageId, 5);
                }
                else if (event.which == 8) {
                  sendMessage(socket, lcd, messageId, 6);
                }
            }
            if (arrOfEvents.length >= 1 && eventType === "press") {
              getChannel(messageIdDown);
            } else if (arrOfEvents.length >= 2 && eventType === "release") {
              getChannel(messageIdUp);
            }
            if (arrOfEvents.length >= 3 && eventType === "hold") {
              getChannel(messageHold);
            }
            if (arrOfEvents.length == 4 && eventType === "change") {
              getChannel(messageChange);
            }
          }
          sendMessageOfTouchChanel(socket, lcd, messageIdDown, messageIdUp);
        });
    });
  }