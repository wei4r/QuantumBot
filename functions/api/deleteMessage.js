const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {logger} = functions;

exports.deleteMessage = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Received delete request data:", data);

    // Validate required fields
    if (!data.userId || !data.messageId) {
      logger.log("Required fields (userId or messageId) are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (userId or messageId) are missing",
      );
    }

    const {userId, messageId} = data;

    // Delete the message from the user's message subcollection in Firestore
    await admin
        .firestore()
        .collection("chats")
        .doc(userId)
        .collection("messages")
        .doc(messageId)
        .delete();

    logger.log("Message deleted successfully, message ID:", messageId);

    // Return success status
    return {status: "success"};
  } catch (error) {
    logger.error("Error deleting message:", error);
    // Throw a structured error for the client
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while deleting the message",
        error.message,
    );
  }
});
