const lcdDisplayMessage = require("./lcd");

module.exports = function sendMessage(socket, lcd, messageId, value, showInConsole = true) {
    async function askForMessage() {
        socket.emit('ppMessage', {
            messageId,
            value,
            fromName: 'Node'
        });
    }
    if (showInConsole === true) {
        console.log('[SOCKETIO] Send a message to Protopie', messageId, value);
    }
    if (lcd != false) {
        lcdDisplayMessage(lcd, messageId, value);
    }
    askForMessage();
}