import cv2
import numpy as np
import os

img_path = "C:/Users/Subhadip/.gemini/antigravity/brain/tempmediaStorage/media_1787418304558.png"

if not os.path.exists(img_path):
    print("File not found at tempmediaStorage, checking user_uploaded...")
    img_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787418304558.png"

print("Target Image Path:", img_path)
print("Exists:", os.path.exists(img_path))

if os.path.exists(img_path):
    img_bgr = cv2.imread(img_path)
    print("Image Shape:", img_bgr.shape if img_bgr is not None else "None")

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))
    all_boxes = list(faces) + list(profiles)

    print(f"Total candidate boxes detected: {len(all_boxes)}")
    for (x, y, w, h) in all_boxes:
        roi_hsv = hsv[y:y+h, x:x+w]
        box_pixels = float(w * h)
        skin_mask = cv2.inRange(roi_hsv, np.array([0, 30, 60]), np.array([22, 180, 255]))
        roi_skin_ratio = float(cv2.countNonZero(skin_mask)) / box_pixels
        green_mask = cv2.inRange(roi_hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
        roi_green_ratio = float(cv2.countNonZero(green_mask)) / box_pixels
        print(f"  Box ({x},{y},{w},{h}): Skin={roi_skin_ratio*100:.1f}%, Green={roi_green_ratio*100:.1f}%")

    green_mask = cv2.inRange(hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
    yellow_mask = cv2.inRange(hsv, np.array([18, 40, 40]), np.array([34, 255, 255]))
    brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([17, 255, 220]))

    green_pixels = float(cv2.countNonZero(green_mask))
    yellow_pixels = float(cv2.countNonZero(yellow_mask))
    brown_pixels = float(cv2.countNonZero(brown_mask))

    foliage_ratio = (green_pixels + yellow_pixels + brown_pixels) / total_pixels
    print(f"Green: {green_pixels/total_pixels*100:.1f}%")
    print(f"Yellow: {yellow_pixels/total_pixels*100:.1f}%")
    print(f"Brown: {brown_pixels/total_pixels*100:.1f}%")
    print(f"Total Foliage Coverage Ratio: {foliage_ratio*100:.1f}%")
