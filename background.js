// background.js

// This listener waits for messages sent from the content script (content.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is about a suspicious script being detected
  if (message.type === "suspiciousScriptDetected") {
    console.log("Suspicious script detected from content.js:", message.details);

    // FR-03: Real-Time Security Alerts
    // Show a notification to the user warning them about a suspicious script
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Security Alert",
      message: `Suspicious JavaScript function detected on ${message.url}`,
      priority: 2
    });

    // FR-06: Threat Logging
    // Store details of the detected threat in local storage for future review
    chrome.storage.local.get({ threatLogs: [] }, (data) => {
      const updatedLogs = data.threatLogs;

      // Add the new incident with timestamp, URL, and the script pattern detected
      updatedLogs.push({
        time: new Date().toLocaleString(),
        url: message.url,
        details: message.details
      });

      // Save the updated list of logs
      chrome.storage.local.set({ threatLogs: updatedLogs });
    });
  } else if(message.type === "phishingDetected"){
      console.log("Phishing alert:", message.details);

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Phishing Warning",
      message: message.details,
      priority: 2
    });

    chrome.storage.local.get({ threatLogs: [] }, (data) => {
      const updatedLogs = data.threatLogs;
      updatedLogs.push({
        time: new Date().toLocaleString(),
        url: message.url,
        details: message.details
      });
      chrome.storage.local.set({ threatLogs: updatedLogs });
  });
  }
});





// Risk Scoring Function
function calculateRiskScore(permissions) {
  const riskWeights = {
    "tabs": 2,
    "webRequest": 3,
    "webRequestBlocking": 3,
    "history": 2,
    "downloads": 2,
    "bookmarks": 1,
    "management": 2,
    "nativeMessaging": 3
  };

  let score = 0;
  let riskyPerms = [];

  permissions.forEach(perm => {
    if (riskWeights[perm]) {
      score += riskWeights[perm];
      riskyPerms.push(perm);
    }
  });

  return { score, riskyPerms };
}

chrome.management.getAll(extensions => {
  extensions.forEach(ext => {
    const { score, riskyPerms } = calculateRiskScore(ext.permissions || []);

    let level = "Low";
    if (score >= 7) level = "High";
    else if (score >= 4) level = "Medium";

    console.log(`Risk score for ${ext.name}: ${score} (${level})`, riskyPerms);

    // Notifications removed
  });
});
