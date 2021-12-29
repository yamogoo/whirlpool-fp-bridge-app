const lcdDisplayMessage = require("./lcd");

module.exports = function sendMessage(socket, lcd, messageId, value, showInConsole = true) {
    async function askForMessage() {
        socket.emit('ppMessage', {
            messageId,
            value,
            fromName: 'Arduino'
        });
    }
    if (showInConsole === true) {
        console.log('[SOCKETIO] Send a message to Server', messageId, value);
    }
    if (lcd != false) {
        lcdDisplayMessage(lcd, messageId, value);
    }
    askForMessage();
}