# Browser Security Shield

A lightweight browser extension that detects common browser-based security threats in real time. Built as a final year project at Bournemouth University, Department of Computing and Informatics.

## What It Does

The extension monitors your browser activity and alerts you to three categories of threat:

- **Suspicious JavaScript** — scans inline scripts on every page for high-risk functions (`eval()`, `new Function()`, `document.write()`) commonly used in script injection attacks
- **Phishing domains** — checks the current site against a known phishing domain list and warns you if a match is found
- **High-risk extensions** — scores all installed browser extensions by the permissions they request and flags any that reach a medium or high risk threshold

Additional features:
- Real-time browser notifications when a threat is detected
- Threat log — a timestamped history of every detection, viewable from the options page
- Whitelist / Blacklist — manually mark sites as trusted or blocked; blacklisted sites are automatically redirected

## Installation

The extension is not yet published to the Chrome Web Store or Firefox Add-ons. You can install it manually in developer mode:

### Chrome / Chromium
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `extension` folder

### Firefox
1. Download or clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select any file inside the `extension` folder (e.g. `manifest.json`)

> Firefox requires version 109 or later for Manifest V3 support.

## Project Structure

```
extension/
├── manifest.json       # Extension configuration (permissions, scripts, metadata)
├── background.js       # Service worker: handles notifications, logging, extension scoring
├── content.js          # Injected into every page: JS pattern scan, phishing check, blacklist redirect
├── popup.html/js/css   # Toolbar popup: shows current URL, whitelist/blacklist controls
├── options.html/js/css # Options page: threat log viewer, whitelist/blacklist management
└── icon.png            # Extension icon
```

## How the Detection Works

### Suspicious JavaScript
Every page load, `content.js` queries all `<script>` tags on the page and tests their source code against a set of regex patterns. If any pattern matches, a message is sent to `background.js` which fires a notification and writes an entry to the threat log.

### Phishing Detection
The current hostname is checked against a phishing domain list. In the current build this uses a local list for testing — the architecture is designed to be swapped out for a live feed such as the PhishStats API.

### Extension Risk Scoring
On startup, `background.js` fetches the list of all installed extensions via the `management` API and runs each one through a scoring function. Permissions like `webRequest`, `nativeMessaging`, and `tabs` carry higher weights. Extensions scoring 7+ are flagged as High risk, 4–6 as Medium.

## Built With

- JavaScript (ES Modules)
- Chrome Extensions API (Manifest V3)
- Compatible with Firefox 109+ via `browser_specific_settings`

## Future Work

- Integrate a live phishing feed (e.g. PhishStats API) to replace the local list
- Expand JS pattern detection to cover more obfuscation techniques
- Publish to Chrome Web Store and Firefox Add-ons
- Improve popup UI with live risk status indicators
