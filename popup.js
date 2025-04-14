let colors = { color1: null, color2: null };

document.getElementById('pick-color-1').addEventListener('click', () => pickColor('color1', 'color-display-1'));
document.getElementById('pick-color-2').addEventListener('click', () => pickColor('color2', 'color-display-2'));

async function pickColor(colorKey, displayId) {
  if (!window.EyeDropper) {
    alert("Your browser doesn't support the EyeDropper API.");
    return;
  }

  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open();
    colors[colorKey] = result.sRGBHex;
    document.getElementById(displayId).style.backgroundColor = result.sRGBHex;
    checkAndCompareColors();
  } catch (e) {
    console.error("Color picking canceled or failed:", e);
  }
}

function checkAndCompareColors() {
  if (colors.color1 && colors.color2) {
    const distance = calculateColorDistance(colors.color1, colors.color2);
    const rgbRelativeDifference = calculateRgbRelativeDifference(colors.color1, colors.color2);

    document.getElementById('result').innerHTML = `
      <p><strong>Color Distance:</strong> ${distance.toFixed(2)}</p>
      <h4>Color 2 as a Percentage of Color 1:</h4>
      <p>Red: ${rgbRelativeDifference.r}% | Green: ${rgbRelativeDifference.g}% | Blue: ${rgbRelativeDifference.b}%</p>
    `;
  }
}

function calculateColorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  return Math.sqrt(
    (rgb1.r - rgb2.r) ** 2 +
    (rgb1.g - rgb2.g) ** 2 +
    (rgb1.b - rgb2.b) ** 2
  );
}

function calculateRgbRelativeDifference(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  return {
    r: calculateRelativeChannelDifference(rgb1.r, rgb2.r),
    g: calculateRelativeChannelDifference(rgb1.g, rgb2.g),
    b: calculateRelativeChannelDifference(rgb1.b, rgb2.b),
  };
}

function calculateRelativeChannelDifference(value1, value2) {
  if (value1 === 0) return "N/A"; // Avoid division by zero if Color 1 channel is zero
  return ((value2 / value1) * 100).toFixed(1);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}
