import cv2
import numpy as np
import os

human_img_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png"

img_bgr = cv2.imread(human_img_path)
if img_bgr is None:
    print("Failed to read image")
    exit(1)

gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
upperbody_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_upperbody.xml')

faces = face_cascade.detectMultiScale(gray, scaleFactor=1.03, minNeighbors=2, minSize=(20, 20))
profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.03, minNeighbors=2, minSize=(20, 20))
upperbodies = upperbody_cascade.detectMultiScale(gray, scaleFactor=1.03, minNeighbors=2, minSize=(30, 30))

print(f"Frontal faces detected: {len(faces)}")
print(f"Profile faces detected: {len(profiles)}")
print(f"Upper bodies detected: {len(upperbodies)}")

hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
# Human skin tone in HSV
skin_mask1 = cv2.inRange(hsv, np.array([0, 15, 50]), np.array([25, 255, 255]))
skin_mask2 = cv2.inRange(hsv, np.array([160, 15, 50]), np.array([180, 255, 255]))
full_skin = cv2.bitwise_or(skin_mask1, skin_mask2)

total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])
skin_pixels = float(cv2.countNonZero(full_skin))
skin_ratio = skin_pixels / total_pixels

# Plant green foliage (strict Hue 35 to 85)
green_mask = cv2.inRange(hsv, np.array([35, 40, 40]), np.array([85, 255, 255]))
green_pixels = float(cv2.countNonZero(green_mask))
green_ratio = green_pixels / total_pixels

print(f"Total pixels: {total_pixels}")
print(f"Skin ratio: {skin_ratio * 100:.2f}%")
print(f"Strict green foliage ratio: {green_ratio * 100:.2f}%")
