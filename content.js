// This part checks if the current website is blacklisted but not whitelisted.
// If it is, the user is redirected to a safe page (Google in this case).
chrome.storage.local.get(['blacklist', 'whitelist'], (data) => {
  const currentUrl = window.location.href;
  const blacklist = data.blacklist || [];
  const whitelist = data.whitelist || [];

  const isBlacklisted = blacklist.some(url => currentUrl.includes(url));
  const isWhitelisted = whitelist.some(url => currentUrl.includes(url));

  // If the URL is blacklisted and not whitelisted, block access by redirecting
  if (isBlacklisted && !isWhitelisted) {
    window.location.href = 'https://www.google.com'; // Redirect location
  }
});

// Define patterns considered suspicious within JavaScript code
const suspiciousPatterns = [
  /eval\s*\(/g,               // Usage of eval(), which can execute arbitrary code
  /new\s+Function/g,          // Creating functions from strings dynamically
  /document\.write\s*\(/g     // Directly writing to the document — risky behavior
];

let detected = false;

// Scan all <script> elements on the page
const scripts = document.querySelectorAll('script');

scripts.forEach(script => {
  const code = script.innerText || script.textContent;

  // Check for any of the suspicious patterns in the script
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(code) && !detected) {
      detected = true;

      // Send a message to the background script with details about the threat
      chrome.runtime.sendMessage({
        type: "suspiciousScriptDetected",
        url: window.location.href,
        details: `Suspicious pattern detected: ${pattern}`
      });
    }
  });
});




// Phishing detection using a dummy list for testing

// Extract hostname from current page
const pageHost = window.location.hostname;

// Simulated phishing domain list for testing
const mockPhishingData = [
  { url: "https://www.bbc.co.uk" },
  { url: "https://bbc.co.uk" }
];

// Check if the current hostname matches any mock phishing domain
const isPhishing = mockPhishingData.some(entry => {
  try {
    const phishingHost = new URL(entry.url).hostname;
    return phishingHost === pageHost;
  } catch (err) {
    return false;
  }
});

if (isPhishing) {
  chrome.runtime.sendMessage({
    type: "phishingDetected",
    url: window.location.href,
    details: `Phishing domain detected (mock): ${pageHost}`
  });
}
