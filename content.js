chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'pickColor') {
    const colorNumber = message.colorNumber;

    document.addEventListener('click', function handler(event) {
      event.preventDefault();
      event.stopPropagation();

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const color = window.getComputedStyle(element).backgroundColor;
      const hexColor = rgbToHex(color);

      // Send the color back to background.js
      chrome.runtime.sendMessage({ color: hexColor, colorNumber });

      // Remove the event listener after capturing the color
      document.removeEventListener('click', handler);
    }, { capture: true });
  }
});

function rgbToHex(rgb) {
  const rgbValues = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (rgbValues[0] << 16) + (rgbValues[1] << 8) + rgbValues[2]).toString(16).slice(1).toUpperCase()}`;
}
