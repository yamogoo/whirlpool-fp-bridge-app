const sendMessage = require("./sendMessage");

module.exports = function sendTouchChanel (sensor, socket, lcd, messageIdDown, messageIdUp, arrOfEvents = ["change", "press", "hold", "release"]) {
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
            if (eventType === "press") {
              getChannel(messageIdDown);
            } else if (eventType === "release") {
              getChannel(messageIdUp);
            }
          }
          sendMessageOfTouchChanel(socket, lcd, messageIdDown, messageIdUp);
        });
    });
  }