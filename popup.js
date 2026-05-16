// This script handles the logic for the extension's popup interface

document.addEventListener('DOMContentLoaded', () => {
  const currentUrlDisplay = document.getElementById('current-url-display');
  const whitelistButton = document.getElementById('add-whitelist');
  const blacklistButton = document.getElementById('add-blacklist');
  const viewLogsButton = document.getElementById('view-logs');
  const customUrlInput = document.getElementById('custom-url');

  let currentUrl = '';

  // Get the URL of the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      currentUrl = tabs[0].url;
      currentUrlDisplay.textContent = `URL: ${currentUrl}`;
    } else {
      currentUrlDisplay.textContent = `URL: Unavailable`;
    }
  });

  // Improved list updater to prevent conflicts between whitelist and blacklist
  function updateList(type, url) {
    chrome.storage.local.get({ whitelist: [], blacklist: [] }, (data) => {
      const currentList = data[type] || [];
      const otherList = data[type === 'whitelist' ? 'blacklist' : 'whitelist'] || [];

      if (currentList.includes(url)) {
        alert(`This URL is already in the ${type}.`);
        return;
      }

      if (otherList.includes(url)) {
        alert(`This URL is already in the ${type === 'whitelist' ? 'blacklist' : 'whitelist'}. Please remove it first.`);
        return;
      }

      currentList.push(url);
      chrome.storage.local.set({ [type]: currentList }, () => {
        alert(`Added to ${type}.`);
      });
    });
  }

  // Add to whitelist
  whitelistButton.addEventListener('click', () => {
    const urlToAdd = customUrlInput.value.trim() || currentUrl;
    if (urlToAdd) updateList('whitelist', urlToAdd);
  });

  // Add to blacklist
  blacklistButton.addEventListener('click', () => {
    const urlToAdd = customUrlInput.value.trim() || currentUrl;
    if (urlToAdd) updateList('blacklist', urlToAdd);
  });

  // View threat logs
  viewLogsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
