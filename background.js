chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'startPickColor') {
      const { colorNumber } = message;
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Send message to content.js to initiate color picking
        chrome.tabs.sendMessage(tabs[0].id, { command: 'pickColor', colorNumber });
      });
    }
  });
  