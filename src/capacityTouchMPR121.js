const sendMessage = require("./sendMessage");

module.exports = function sendTouchChanel (sensor, socket, lcd, channels, arrOfEvents = ["change", "press", "hold", "release"], messageIdDown, messageIdUp, messageHold, messageChange) {
    arrOfEvents.forEach(function(eventType) {
      sensor.on(eventType, function(event) {
          function sendMessageOfTouchChanel (socket, lcd, messageIdDown, messageIdUp) {
            function getChannel (messageId) {
              for (i = 0; i < channels.length; i++) {
                if (event.which == channels[i].ch) {
                  sendMessage(socket, lcd, messageId, channels[i].value);
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