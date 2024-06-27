const admin = require("firebase-admin");
admin.initializeApp();

const {addMessage} = require("./api/addMessage");
const {fetchMessages} = require("./api/fetchMessages");
const {deleteMessage} = require("./api/deleteMessage");

exports.addMessage = addMessage;
exports.fetchMessages = fetchMessages;
exports.deleteMessage = deleteMessage;
