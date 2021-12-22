const sendMessage = require("./sendMessage");

module.exports = function sendTouchChanel (sensor, socket, lcd, arrOfEvents = ["change", "press", "hold", "release"], messageIdDown, messageIdUp, messageHold, messageChange) {
    arrOfEvents.forEach(function(eventType) {
      sensor.on(eventType, function(event) {
          function sendMessageOfTouchChanel (socket, lcd, messageIdDown, messageIdUp) {
            function getChannel (messageId) {
              for (i=0; i <= 12; i++) {
                if (event.which == i && i >= 8) {
                  sendMessage(socket, lcd, messageId, i - 4);
                } else if (event.which == i + 1 && i <= 3) {
                  sendMessage(socket, lcd, messageId, i + 1);
                }
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