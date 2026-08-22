import os
import sys
import json
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, 'models')

def test_multicrop(image_path):
    crops = ['wheat', 'rice', 'tomato', 'other']
    results = {}

    with Image.open(image_path) as img:
        img_prep = img.convert('RGB').resize((128, 128))
        arr = np.expand_dims(np.array(img_prep, dtype=np.float32) / 255.0, axis=0)

    for crop_key in crops:
        crop_dir = os.path.join(MODELS_DIR, crop_key)
        manifest_path = os.path.join(crop_dir, 'model_manifest.json')
        tflite_path = os.path.join(crop_dir, f"{crop_key}_model.tflite")

        if not os.path.exists(manifest_path) or not os.path.exists(tflite_path):
            continue

        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        classes = manifest['classes']
        interpreter = tf.lite.Interpreter(model_path=tflite_path)
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        interpreter.set_tensor(input_details[0]['index'], arr)
        interpreter.invoke()

        raw_output = interpreter.get_tensor(output_details[0]['index'])[0]
        prob_arr = np.array(raw_output, dtype=np.float64)
        if prob_arr.sum() > 0:
            prob_arr = prob_arr / prob_arr.sum()

        top_idx = int(np.argmax(prob_arr))
        top_prob = float(prob_arr[top_idx])
        top_class = classes[top_idx] if top_idx < len(classes) else 'Unknown'

        results[crop_key] = {
            'top_class': top_class,
            'confidence': round(top_prob, 4)
        }

    print(f"Multi-Crop Model Evaluation for Image: {os.path.basename(image_path)}")
    print(json.dumps(results, indent=2))

img2 = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png"
test_multicrop(img2)
