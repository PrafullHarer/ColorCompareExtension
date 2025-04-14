from flask import Flask, request, jsonify
import cv2
import numpy as np
import pandas as pd
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Load color data
index = ["color", "color_name", "hex", "R", "G", "B"]
csv = pd.read_csv('colors.csv', names=index, header=None)

def getColorName(R, G, B):
    minimum = 10000
    cname = "Unknown"
    for i in range(len(csv)):
        d = abs(R - int(csv.loc[i, "R"])) + abs(G - int(csv.loc[i, "G"])) + abs(B - int(csv.loc[i, "B"]))
        if d <= minimum:
            minimum = d
            cname = csv.loc[i, "color_name"]
    return cname

@app.route('/detect_color', methods=['POST'])
def detect_color():
    file = request.files['image'].read()
    image = Image.open(BytesIO(file)).convert("RGB")
    img_np = np.array(image)
    
    # Sample color detection - select the center pixel
    height, width, _ = img_np.shape
    center_color = img_np[height // 2, width // 2]
    r, g, b = center_color
    color_name = getColorName(r, g, b)

    return jsonify({"color_name": color_name, "R": int(r), "G": int(g), "B": int(b)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
