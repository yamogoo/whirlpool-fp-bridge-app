module.exports = function recieveMessage(data, messageId, value="any", onMessage) {
    if (data.messageId === messageId && data.value === value || data.messageId === messageId && data.value === "any") {
        onMessage();
    }
};