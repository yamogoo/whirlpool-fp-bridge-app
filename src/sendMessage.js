const lcdDisplayMessage = require("./lcd");

module.exports = function sendMessage(socket, lcd, messageId, value) {
    function sendMessage(socket, lcd, messageId, value) {
        async function askForMessage() {
            socket.emit('ppMessage', {
                messageId,
                value,
                fromName: 'Node'
            });
        }
        console.log('[SOCKETIO] Send a message to Protopie', messageId, value);
        lcdDisplayMessage(lcd, messageId, value);
        askForMessage();
    }

    sendMessage(socket, lcd, messageId, value);
}