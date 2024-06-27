const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {logger} = functions;

exports.fetchMessages = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Received fetch request data:", data);

    // Validate required field
    if (!data.userId) {
      logger.log("Required field (userId) is missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required field (userId) is missing",
      );
    }

    const {userId} = data;

    // Fetch messages from the user's message subcollection in Firestore
    const messagesSnapshot = await admin
        .firestore()
        .collection("chats")
        .doc(userId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .get();

    // Map the documents to an array of message objects
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    logger.log("Messages fetched successfully:", messages);

    // Return the fetched messages
    return {status: "success", messages};
  } catch (error) {
    logger.error("Error fetching messages:", error);
    // Throw a structured error for the client
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while fetching the messages",
        error.message,
    );
  }
});
