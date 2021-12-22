var sendMessage = require("./sendMessage");

module.exports = function getTime(socket, lcd, updateIntervalInSeconds, messageIdOfTime, messageIdOfMinutes, messageIdOfHours, printValue = false) {
    setInterval(() => {
      currentDate = new Date();
      var minutes = `${currentDate.getMinutes()}`;
      if (minutes.length == 1) {
        minutes = `0${currentDate.getMinutes()}`
      }
      var hours = `${currentDate.getHours()}`;
      var time = `${hours}:${minutes}`;
      sendMessage(socket, lcd, messageIdOfTime, time, printValue);
      sendMessage(socket, lcd, messageIdOfMinutes, minutes, printValue);
      sendMessage(socket, lcd, messageIdOfHours, hours, printValue);
    }, updateIntervalInSeconds * 1000);
  }