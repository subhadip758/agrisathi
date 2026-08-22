import cv2
import numpy as np

img1 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787411985300.png"
img2 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png"

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for name, path in [("Human Photo (Img 1)", img1), ("Wheat Spike (Img 2)", img2)]:
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(25, 25))
    
    confirmed_faces = []
    for (x, y, w, h) in faces:
        roi_bgr = img[y:y+h, x:x+w]
        roi_hsv = cv2.cvtColor(roi_bgr, cv2.COLOR_BGR2HSV)
        skin_mask = cv2.inRange(roi_hsv, np.array([0, 20, 70]), np.array([25, 180, 255]))
        roi_skin_ratio = float(cv2.countNonZero(skin_mask)) / float(w * h)
        
        print(f"{name} -> Box (x={x}, y={y}, w={w}, h={h}) | Skin Ratio in ROI: {roi_skin_ratio:.4f}")
        if roi_skin_ratio > 0.30:
            confirmed_faces.append((x, y, w, h))
            
    print(f" -> CONFIRMED REAL HUMAN FACES: {len(confirmed_faces)}\n")
