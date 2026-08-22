import cv2

img1 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787411985300.png"
img2 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png"

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for name, path in [("Human Photo (Img 1)", img1), ("Wheat Spike (Img 2)", img2)]:
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(25, 25))
    print(f"{name}: {len(faces)} faces detected")
    for (x,y,w,h) in faces:
        print(f"   -> Box (x={x}, y={y}, w={w}, h={h})")
