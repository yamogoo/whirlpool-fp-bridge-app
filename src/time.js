let sendMessage = require("./sendMessage");

module.exports = function getTime(socket, lcd, updateIntervalInSeconds, messageIdOfTime, messageIdOfMinutes, messageIdOfHours, printValue = false) {
    setInterval(() => {
      currentDate = new Date();
      let minutes = `${currentDate.getMinutes()}`;
      if (minutes.length == 1) {
        minutes = `0${currentDate.getMinutes()}`
      }
      let hours = `${currentDate.getHours()}`;
      let time = `${hours}:${minutes}`;
      sendMessage(socket, lcd, messageIdOfTime, time, printValue);
      sendMessage(socket, lcd, messageIdOfMinutes, minutes, printValue);
      sendMessage(socket, lcd, messageIdOfHours, hours, printValue);
    }, updateIntervalInSeconds * 1000);
  }