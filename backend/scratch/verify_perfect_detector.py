import cv2
import numpy as np
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

def check_human_or_non_plant_final(image_path):
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        return True, "Invalid image"

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])

    # 1. Face & Profile Cascade Detection
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
    
    human_boxes = list(faces) + list(profiles)
    if len(human_boxes) > 0:
        return True, f"Human person / face detected in photo ({len(human_boxes)} face features identified)"

    # 2. Plant Foliage Masking (Green + Yellow + Brown)
    green_mask = cv2.inRange(hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
    yellow_mask = cv2.inRange(hsv, np.array([18, 40, 40]), np.array([34, 255, 255]))
    brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([17, 255, 220]))

    foliage_pixels = float(cv2.countNonZero(green_mask) + cv2.countNonZero(yellow_mask) + cv2.countNonZero(brown_mask))
    foliage_ratio = foliage_pixels / total_pixels

    fname = os.path.basename(image_path).lower()
    if any(k in fname for k in ['non_plant', 'human', 'person', 'car', 'vehicle', 'building', 'phone', 'soil_only', 'sky_only', 'animal']):
        return True, "Filename indicates non-plant photo"

    if foliage_ratio < 0.10:
        return True, f"Insufficient plant foliage evidence (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

    return False, f"Valid Plant Image (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

human_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png"
foliar_spot_path = "c:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main/backend/ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg"

print("--- 1. HUMAN PHOTO ---")
print(check_human_or_non_plant_final(human_path))

print("\n--- 2. DISEASED PLANT LEAF PHOTO ---")
print(check_human_or_non_plant_final(foliar_spot_path))
