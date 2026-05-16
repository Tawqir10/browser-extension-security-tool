document.addEventListener("DOMContentLoaded", () => {
  const logContainer = document.getElementById("logs");

  chrome.storage.local.get({ threatLogs: [] }, (data) => {
    const logs = data.threatLogs;

    if (logs.length === 0) {
      logContainer.textContent = "No logs available.";
      return;
    }

    logContainer.innerHTML = "";

    logs.forEach((log) => {
      const div = document.createElement("div");
      div.className = "log-entry";

      const logTime = document.createElement("strong");
      logTime.textContent = "Time: ";
      div.appendChild(logTime);
      div.appendChild(document.createTextNode(log.time));
      div.appendChild(document.createElement("br"));

      const logUrl = document.createElement("strong");
      logUrl.textContent = "Url: ";
      div.appendChild(logUrl);
      div.appendChild(document.createTextNode(log.url));
      div.appendChild(document.createElement("br"));

      const logDetails = document.createElement("strong");
      logDetails.textContent = "Details: ";
      div.appendChild(logDetails);
      div.appendChild(document.createTextNode(log.details));
      div.appendChild(document.createElement("br"));

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
