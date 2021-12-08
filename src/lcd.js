module.exports = function lcdPrintMessage(lcd, messageId, value) {

    function lcdDisplayMessage(lcd, messageId, value) {
        var stringToPrint = messageId;
          if (value !== undefined) {
            stringToPrint = (messageId + ": " + value).replace("{{value}}")
          }
          
          // print the value
          lcd.clear().print(stringToPrint);
          if (stringToPrint.length > 16) {
            var secondLine = stringToPrint.substring(16);
            lcd.cursor(1, 0).print(secondLine)
          }
      }

      lcdDisplayMessage(lcd, messageId, value);
}