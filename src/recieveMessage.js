module.exports = function recieveMessage(data, messageId, value, onMessage) {
    if (data.messageId == messageId && data.value == value) {
        onMessage();
    }
};

// export default function recieveMessage(data, messageId, value, onMessage) {
//     if (data.messageId == messageId && data.value == value) {
//         onMessage();
//     }
// };