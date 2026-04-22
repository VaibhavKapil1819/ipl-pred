const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

// 1. MANUAL NOTIFICATION (Triggered by Admin Button)
exports.sendManualNotification = onCall(async (request) => {
  // Check if caller is Admin (optional but recommended)
  // For now, we'll assume the client-side check is sufficient or implement auth check here
  
  const title = request.data.title || "Match Reminder! 🏏";
  const body = request.data.body || "A match is starting soon. Don't forget to log your prediction!";

  const tokensSnap = await admin.database().ref("users").once("value");
  const users = tokensSnap.val() || {};
  
  const tokens = [];
  for (const uid in users) {
    if (users[uid].fcmToken) {
      tokens.push(users[uid].fcmToken);
    }
  }

  if (tokens.length === 0) {
    return { success: false, message: "No registered tokens found." };
  }

  const message = {
    notification: { title, body },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return { success: true, sentCount: response.successCount };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new HttpsError("internal", "Failed to send notifications.");
  }
});

// 2. AUTOMATIC REMINDER (Scheduled every hour)
exports.scheduledMatchReminder = onSchedule("every 1 hours", async (event) => {
  const now = Date.now();
  const thirtyMins = 30 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;

  const matchesSnap = await admin.database().ref("matches").once("value");
  const matches = matchesSnap.val() || {};

  let upcomingMatch = null;

  for (const id in matches) {
    const match = matches[id];
    if (match.cutoffTime && !match.winner) {
      const startTime = new Date(match.cutoffTime).getTime();
      const diff = startTime - now;

      // If match starts in 30-90 minutes
      if (diff > 0 && diff < oneHour + thirtyMins) {
        upcomingMatch = match;
        break;
      }
    }
  }

  if (!upcomingMatch) return null;

  // Send to everyone
  const tokensSnap = await admin.database().ref("users").once("value");
  const users = tokensSnap.val() || {};
  const tokens = [];
  for (const uid in users) {
    if (users[uid].fcmToken) tokens.push(users[uid].fcmToken);
  }

  if (tokens.length === 0) return null;

  const message = {
    notification: {
      title: "Prediction Deadline! ⏳",
      body: `Match ${upcomingMatch.team1} vs ${upcomingMatch.team2} starts soon. Log your win pick now!`,
    },
    tokens: tokens,
  };

  return admin.messaging().sendEachForMulticast(message);
});
