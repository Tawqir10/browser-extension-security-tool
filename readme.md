# Browser Security Shield

A browser extension that detects common browser-based security threats in real time. Built as a final year project at Bournemouth University, Department of Computing and Informatics.

Detects three categories of threat:

- **Suspicious JavaScript** — scans inline scripts for high-risk functions (`eval()`, `new Function()`, `document.write()`)
- **Phishing domains** — checks the current site against a known phishing domain list
- **High-risk extensions** — scores installed extensions by permission weights and flags medium/high risk ones

Also includes a real-time notification system, timestamped threat log, and whitelist/blacklist with automatic redirect for blocked sites.

## How It Works

**JS scanning:** `content.js` tests all `<script>` tags on every page against regex patterns. Matches are sent to `background.js`, which fires a notification and logs the threat.

**Phishing check:** The current hostname is checked against a domain list. Designed to be swapped out for a live feed (e.g. PhishStats API).

**Extension scoring:** On startup, `background.js` scores all installed extensions by permission weights (`webRequest`, `tabs`, etc.). Score 7+ = High, 4–6 = Medium.

## Built With

- JavaScript — Chrome Extensions API (Manifest V3)
- Firefox 109+ compatible via `browser_specific_settings`
