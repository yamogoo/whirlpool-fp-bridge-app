module.exports = function recieveMessage(data, messageId, onMessageTrue, onMessageFalse) {
    if (data.messageId == messageId && data.value == true) {
        onMessageTrue();
    } else if (data.messageId == messageId && data.value != false) {
        onMessageFalse();
    }
}