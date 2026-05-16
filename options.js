// When the options page has fully loaded, run this function
document.addEventListener("DOMContentLoaded", () => {
  // Get a reference to the container where we'll display the logs
  const logContainer = document.getElementById("logs");

  // Retrieve the stored threat logs from Chrome's local storage
  chrome.storage.local.get({ threatLogs: [] }, (data) => {
    const logs = data.threatLogs;

    // If there are no logs, display a simple message to the user
    if (logs.length === 0) {
      logContainer.textContent = "No logs available.";
      return;
    }

    // Clear any existing content in the container (just in case)
    logContainer.innerHTML = "";

    // For each log entry, create a new <div> to display the details
    logs.forEach((log) => {
      const div = document.createElement("div");
      div.className = "log-entry";

      // Insert the log's time, URL, and specific details in HTML format
      div.innerHTML = `
        <strong>Time:</strong> ${log.time}<br />
        <strong>URL:</strong> ${log.url}<br />
        <strong>Details:</strong> ${log.details}
      `;

      // Add the newly created div to the main container on the page
      logContainer.appendChild(div);
    });
  });
});


function renderLists() {
  chrome.storage.local.get({ whitelist: [], blacklist: [] }, (data) => {
    const whitelistContainer = document.getElementById('whitelist-display');
    const blacklistContainer = document.getElementById('blacklist-display');

    whitelistContainer.innerHTML = '';
    blacklistContainer.innerHTML = '';

    data.whitelist.forEach((url, index) => {
      const li = document.createElement('li');
      li.textContent = url;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => removeUrl('whitelist', url);

      li.appendChild(removeBtn);
      whitelistContainer.appendChild(li);
    });

    data.blacklist.forEach((url, index) => {
      const li = document.createElement('li');
      li.textContent = url;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => removeUrl('blacklist', url);

      li.appendChild(removeBtn);
      blacklistContainer.appendChild(li);
    });
  });
}

function removeUrl(type, urlToRemove) {
  chrome.storage.local.get({ [type]: [] }, (data) => {
    const updatedList = data[type].filter(url => url !== urlToRemove);
    chrome.storage.local.set({ [type]: updatedList }, renderLists);
  });
}

document.addEventListener('DOMContentLoaded', renderLists);
