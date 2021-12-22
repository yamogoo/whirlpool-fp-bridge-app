module.exports = function recieveToggleValueOfMessage(data, messageId, onMessageTrue, onMessageFalse) {
    if (data.messageId === messageId && data.value === "true") {
        onMessageTrue();
    } else if (data.messageId === messageId && data.value === "false") {
        onMessageFalse();
    }
};