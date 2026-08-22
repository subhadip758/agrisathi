import cv2
import numpy as np
import os

img_path = "c:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main/backend/ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg"

img_bgr = cv2.imread(img_path)
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

print(f"Frontal faces: {len(faces)}")
print(f"Profile faces: {len(profiles)}")
print(f"Upper bodies: {len(upperbodies)}")

hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
green_mask = cv2.inRange(hsv, np.array([35, 40, 40]), np.array([85, 255, 255]))
yellow_mask = cv2.inRange(hsv, np.array([20, 50, 50]), np.array([34, 255, 255]))
brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([18, 255, 220]))

total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])
green_pixels = float(cv2.countNonZero(green_mask))
yellow_pixels = float(cv2.countNonZero(yellow_mask))
brown_pixels = float(cv2.countNonZero(brown_mask))

foliage_ratio = (green_pixels + yellow_pixels + brown_pixels) / total_pixels
print(f"Total pixels: {total_pixels}")
print(f"Green ratio: {green_pixels / total_pixels * 100:.2f}%")
print(f"Yellow ratio: {yellow_pixels / total_pixels * 100:.2f}%")
print(f"Brown ratio: {brown_pixels / total_pixels * 100:.2f}%")
print(f"Combined foliage ratio: {foliage_ratio * 100:.2f}%")
