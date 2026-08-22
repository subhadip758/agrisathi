import os
import sys
import json
import numpy as np
from PIL import Image

def analyze_user_image(image_path, selected_crop):
    if not os.path.exists(image_path):
        print(f"File not found: {image_path}")
        return

    with Image.open(image_path) as img:
        img_rgb = img.convert('RGB').resize((128, 128))
        arr = np.array(img_rgb, dtype=np.float32)
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        
        # 1. Green & Chlorotic Plant Foliage
        green_mask = (g > r * 1.05) & (g > b * 1.05) & (g > 40)
        yellow_mask = (r > 100) & (g > 90) & (b < 100) & (r > b * 1.2)
        plant_pixels = np.sum(green_mask) + np.sum(yellow_mask)
        total_pixels = arr.shape[0] * arr.shape[1]
        plant_ratio = float(plant_pixels / total_pixels)
        
        # 2. Human Skin Tone Mask (Face/Hands/Body)
        skin_mask = (r > 95) & (g > 40) & (b > 20) & (r > g) & (r > b) & ((r - g) > 15)
        skin_ratio = float(np.sum(skin_mask) / total_pixels)
        
        # 3. Dark clothing / background
        dark_mask = (r < 60) & (g < 60) & (b < 60)
        dark_ratio = float(np.sum(dark_mask) / total_pixels)
        
        # 4. Spike / Earhead / Cereals structure check (Vertical elongated green/brown spike)
        # Check central vertical band vs side margins for earhead structure
        center_band = arr[:, 48:80, :]
        center_g = center_band[:,:,1]
        center_r = center_band[:,:,0]
        spike_pixels = np.sum((center_g > 30) | (center_r > 30))
        spike_ratio = float(spike_pixels / center_band[:,:,0].size)

        is_valid_plant = (plant_ratio >= 0.10) and (skin_ratio < 0.15)
        
        print(f"Image: {os.path.basename(image_path)}")
        print(f" Selected Crop : {selected_crop}")
        print(f" Plant Ratio   : {plant_ratio:.4f}")
        print(f" Skin Ratio    : {skin_ratio:.4f}")
        print(f" Dark Ratio    : {dark_ratio:.4f}")
        print(f" Spike Ratio   : {spike_ratio:.4f}")
        print(f" Is Valid Plant: {is_valid_plant}")

img1 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787411985300.png"
img2 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png"

print("--- USER UPLOADED IMAGE 1 (HUMAN PHOTO) ---")
analyze_user_image(img1, "rice")

print("\n--- USER UPLOADED IMAGE 2 (WHEAT SPIKE PHOTO WITH TOMATO SELECTED) ---")
analyze_user_image(img2, "tomato")
