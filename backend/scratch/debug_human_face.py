import cv2
import numpy as np

human_path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png"
img_bgr = cv2.imread(human_path)
gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(25, 25))
profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=2, minSize=(25, 25))

print(f"Image shape: {img_bgr.shape}")
print(f"Frontal faces detected: {len(faces)}")
for (x, y, w, h) in faces:
    print(f"  Face Box: x={x}, y={y}, w={w}, h={h}")

print(f"Profile faces detected: {len(profiles)}")
for (x, y, w, h) in profiles:
    print(f"  Profile Box: x={x}, y={y}, w={w}, h={h}")
