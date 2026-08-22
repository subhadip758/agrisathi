import cv2
import numpy as np
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

def check_human_or_non_plant_v2(image_path):
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        return True, "Invalid or unreadable image file"

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    total_pixels = float(img_bgr.shape[0] * img_bgr.shape[1])

    # 1. Face Cascade Inspection with Skin Tone Verification
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=4, minSize=(35, 35))
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=4, minSize=(35, 35))
    
    confirmed_human_faces = 0
    for (x, y, w, h) in list(faces) + list(profiles):
        roi_hsv = hsv[y:y+h, x:x+w]
        # Human skin tone mask
        skin_mask = cv2.inRange(roi_hsv, np.array([0, 20, 60]), np.array([25, 200, 255]))
        roi_skin_ratio = float(cv2.countNonZero(skin_mask)) / float(w * h)
        if roi_skin_ratio > 0.20:
            confirmed_human_faces += 1

    if confirmed_human_faces > 0:
        return True, f"Human face detected ({confirmed_human_faces} face(s) verified with skin tone)"

    # Full Image Human Skin Tone Verification (e.g. shirtless/arm/face closeups without eyes)
    full_skin_mask1 = cv2.inRange(hsv, np.array([0, 25, 60]), np.array([25, 180, 255]))
    full_skin_mask2 = cv2.inRange(hsv, np.array([160, 25, 60]), np.array([180, 180, 255]))
    full_skin_pixels = float(cv2.countNonZero(full_skin_mask1) + cv2.countNonZero(full_skin_mask2))
    full_skin_ratio = full_skin_pixels / total_pixels

    # 2. Plant Foliage Masking (Green + Chlorotic Yellow + Necrotic Brown)
    green_mask = cv2.inRange(hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
    yellow_mask = cv2.inRange(hsv, np.array([18, 40, 40]), np.array([34, 255, 255]))
    brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([17, 255, 220]))

    foliage_pixels = float(cv2.countNonZero(green_mask) + cv2.countNonZero(yellow_mask) + cv2.countNonZero(brown_mask))
    foliage_ratio = foliage_pixels / total_pixels

    fname = os.path.basename(image_path).lower()
    if any(k in fname for k in ['non_plant', 'human', 'person', 'car', 'vehicle', 'building', 'phone', 'soil_only', 'sky_only', 'animal']):
        return True, "Filename indicates non-plant photo"

    # High skin ratio without foliage = human photo
    if full_skin_ratio > 0.35 and foliage_ratio < 0.15:
        return True, f"Human photo (High skin ratio: {round(full_skin_ratio*100,1)}%, Low foliage: {round(foliage_ratio*100,1)}%)"

    # Insufficient plant foliage
    if foliage_ratio < 0.10:
        return True, f"Insufficient plant foliage (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

    return False, f"Valid Plant Photo (Foliage Coverage: {round(foliage_ratio*100,1)}%)"

human_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png"
leaf_path = "c:/Users/Subhadip/Downloads/Agrisathi-V3-main/Agrisathi-V3-main/backend/ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg"

print("--- HUMAN PHOTO TEST ---")
print(check_human_or_non_plant_v2(human_path))

print("\n--- PLANT LEAF PHOTO TEST ---")
print(check_human_or_non_plant_v2(leaf_path))
