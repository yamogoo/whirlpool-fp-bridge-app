const lcdDisplayMessage = require("./lcd");

module.exports = function(board, lcd, messageId, chValue) {
    var address = 0x5B; // 0x5B default
    board.i2cRead(address, 2, function(bytes){ 
      // console.log(bytes);
        function touchAdress(index = 0) {
          for (var i = 0; i < 4; i++) {
            // Adress
            var ch = `0x0${Math.pow(2,i)}`;
            if((bytes[index] & ch) == ch) {
              // Print channel
              if (index === 0) {
                chValue = i;
              } else if (index === 1) {
                chValue = 8 + i;
              }
              console.log(`ch${chValue} is touched`)
              lcdDisplayMessage(lcd, messageId, chValue);           
            }
          }
        };
        touchAdress(0);
        touchAdress(1);
      });
      board.i2cWrite(address, 0x5E, 0x0C);
};

// Cannels:

// if((bytes[0] & 0x01) == 0x01) {        //ch0 
//   console.log('ch0 is touched');
// }
// if((bytes[0] & 0x02) == 0x02) {        //ch1 
//     console.log('ch1 is touched');
// }
// if((bytes[0] & 0x04) == 0x04) {        //ch2 
//     console.log('ch2 is touched');
// }
// if((bytes[0] & 0x08) == 0x08) {        //ch3 
//     console.log('ch3 is touched');
// }
// if((bytes[1] & 0x01) == 0x01) {        //ch4 
//   console.log('ch8 is touched');
// }
// if((bytes[1] & 0x02) == 0x02) {        //ch4 
//   console.log('ch9 is touched');
// }
// if((bytes[1] & 0x04) == 0x04) {        //ch4 
//   console.log('ch10 is touched');
// }
// if((bytes[1] & 0x08) == 0x08) {        //ch4 
//   console.log('ch11 is touched');
// }