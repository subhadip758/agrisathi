from PIL import Image
import numpy as np
import os

img_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787418304558.png"

try:
    with Image.open(img_path) as img:
        img_rgb = img.convert('RGB')
        arr = np.array(img_rgb)
        print("Successfully opened image with PIL!")
        print("Image dimensions:", img.size)
        print("Array shape:", arr.shape)
        
        # Save as JPG so OpenCV can read it
        jpg_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/converted_user_leaf.jpg"
        img_rgb.save(jpg_path, "JPEG")
        print("Saved converted JPG to:", jpg_path)
except Exception as e:
    print("PIL Error:", e)
