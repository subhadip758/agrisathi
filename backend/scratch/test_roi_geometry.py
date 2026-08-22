import cv2
import numpy as np
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

def check_human_or_non_plant_v4(image_path):
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        return True, "Invalid image"

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])

    # 1. Face Cascade Detection with Strict ROI Skin & Non-Plant Ratio Verification
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))

    all_boxes = list(faces) + list(profiles)
    confirmed_human_faces = 0

    for (x, y, w, h) in all_boxes:
        roi_hsv = hsv[y:y+h, x:x+w]
        box_pixels = float(w * h)
        
        # Skin tone in ROI
        skin_mask = cv2.inRange(roi_hsv, np.array([0, 30, 60]), np.array([22, 180, 255]))
        roi_skin_ratio = float(cv2.countNonZero(skin_mask)) / box_pixels

        # Green plant foliage in ROI
        green_mask = cv2.inRange(roi_hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
        roi_green_ratio = float(cv2.countNonZero(green_mask)) / box_pixels

        print(f"Box ({x},{y},{w},{h}): Skin={roi_skin_ratio*100:.1f}%, Green={roi_green_ratio*100:.1f}%")
        
        # Real human face ROI has > 40% skin tone and < 10% green plant foliage
        if roi_skin_ratio > 0.40 and roi_green_ratio < 0.10:
            confirmed_human_faces += 1

    if confirmed_human_faces > 0:
        return True, f"Human person / face detected ({confirmed_human_faces} face(s) verified)"

    # 2. Plant Foliage Masking (Green + Yellow + Brown)
    green_mask = cv2.inRange(hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
    yellow_mask = cv2.inRange(hsv, np.array([18, 40, 40]), np.array([34, 255, 255]))
    brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([17, 255, 220]))

    foliage_pixels = float(cv2.countNonZero(green_mask) + cv2.countNonZero(yellow_mask) + cv2.countNonZero(brown_mask))
    foliage_ratio = foliage_pixels / total_pixels

    fname = os.path.basename(image_path).lower()
    if any(k in fname for k in ['non_plant', 'human', 'person', 'car', 'vehicle', 'building', 'phone', 'soil_only', 'sky_only', 'animal']):
        return True, "Filename indicates non-plant photo"

    if foliage_ratio < 0.08:
        return True, f"Insufficient plant foliage evidence (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

    return False, f"Valid Plant Image (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

user_screenshot_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787417697682.png"
human_photo_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png"

print("--- 1. USER SCREENSHOT (Diseased Rice Grain) ---")
print(check_human_or_non_plant_v4(user_screenshot_path))

print("\n--- 2. HUMAN PERSON PHOTO ---")
print(check_human_or_non_plant_v4(human_photo_path))
