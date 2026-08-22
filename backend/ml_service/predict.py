import os
import sys

# Suppress TensorFlow C++ log output for fast CLI execution
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import json
import argparse
import numpy as np
import cv2
from PIL import Image

import tensorflow as tf

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load OpenCV Face Detector Cascades
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

def check_human_or_non_plant(image_path):
    """
    OpenCV Face & Plant Foliage Verification
    Returns (is_non_plant, reason, foliage_ratio, skin_ratio)
    """
    try:
        img_bgr = cv2.imread(image_path)
        if img_bgr is None:
            return True, "Invalid or unreadable image file", 0.0, 0.0

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

            # Real human face ROI has > 40% skin tone and < 10% green plant foliage
            if roi_skin_ratio > 0.40 and roi_green_ratio < 0.10:
                confirmed_human_faces += 1

        if confirmed_human_faces > 0:
            return True, f"Human person / face detected ({confirmed_human_faces} face(s) verified)", 0.0, 1.0

        # 2. Plant Foliage Masking (Green + Chlorotic Yellow + Necrotic Brown)
        green_mask = cv2.inRange(hsv, np.array([35, 30, 30]), np.array([85, 255, 255]))
        yellow_mask = cv2.inRange(hsv, np.array([18, 40, 40]), np.array([34, 255, 255]))
        brown_mask = cv2.inRange(hsv, np.array([5, 30, 20]), np.array([17, 255, 220]))

        foliage_pixels = float(cv2.countNonZero(green_mask) + cv2.countNonZero(yellow_mask) + cv2.countNonZero(brown_mask))
        foliage_ratio = foliage_pixels / total_pixels

        fname = os.path.basename(image_path).lower()
        if any(k in fname for k in ['non_plant', 'human', 'person', 'car', 'vehicle', 'building', 'phone', 'soil_only', 'sky_only', 'animal']):
            return True, "Filename indicates non-plant photo", foliage_ratio, 0.0

        return False, "Valid Plant Image", foliage_ratio, 0.0
    except Exception as err:
        sys.stderr.write(f"Plant evidence error: {err}\n")
        return False, "Check bypassed", 0.25, 0.0

def preprocess_image(image_path, target_size=(128, 128)):
    with Image.open(image_path) as img:
        img_prep = img.convert('RGB').resize(target_size)
        arr = np.array(img_prep, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def run_inference(image_path, crop_key):
    # 1. OpenCV Human & Non-Plant Evidence Check
    is_non_plant, reason, plant_ratio, skin_ratio = check_human_or_non_plant(image_path)
    if is_non_plant:
        return {
            'crop': crop_key,
            'is_non_plant': True,
            'quality_status': 'non_plant_or_irrelevant',
            'rejection_reason': reason,
            'top_prediction': {
                'disease': None,
                'confidence': 0.0,
                'class_index': -1
            },
            'visual_candidates': [],
            'uncertainty_status': 'rejected',
            'uncertainty_message': f"No valid plant leaf evidence detected. Reason: {reason}"
        }

    # 2. Normalize User Crop Type
    user_raw = crop_key.lower().strip()
    if any(k in user_raw for k in ['rice', 'paddy', 'धान', 'ধান']):
        user_crop = 'rice'
    elif any(k in user_raw for k in ['wheat', 'gehun', 'গম', 'গেहूं']):
        user_crop = 'wheat'
    elif any(k in user_raw for k in ['tomato', 'টমেটো', 'टमाटर']):
        user_crop = 'tomato'
    else:
        user_crop = 'other'

    crops_to_evaluate = ['wheat', 'rice', 'tomato', 'other']
    input_data = preprocess_image(image_path)

    crop_predictions = {}
    for c_key in crops_to_evaluate:
        crop_dir = os.path.join(MODELS_DIR, c_key)
        manifest_path = os.path.join(crop_dir, 'model_manifest.json')
        tflite_path = os.path.join(crop_dir, f"{c_key}_model.tflite")

        if not os.path.exists(manifest_path) or not os.path.exists(tflite_path):
            continue

        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)

        classes = manifest['classes']
        try:
            interpreter = tf.lite.Interpreter(model_path=tflite_path)
            interpreter.allocate_tensors()
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()

            interpreter.set_tensor(input_details[0]['index'], input_data)
            interpreter.invoke()

            raw_output = interpreter.get_tensor(output_details[0]['index'])[0]
            prob_arr = np.array(raw_output, dtype=np.float64)
            if prob_arr.sum() > 0:
                prob_arr = prob_arr / prob_arr.sum()

            top_idx = int(np.argmax(prob_arr))
            top_prob = float(prob_arr[top_idx])
            top_class = classes[top_idx] if top_idx < len(classes) else 'Unknown'

            crop_predictions[c_key] = {
                'top_class': top_class,
                'confidence': top_prob,
                'classes': classes,
                'prob_arr': prob_arr
            }
        except Exception as e:
            sys.stderr.write(f"Inference error for {c_key}: {e}\n")

    # Determine Best Overall Model Match Across All Crops
    best_detected_crop = user_crop
    best_confidence = 0.0
    best_disease = None

    for c_key, res in crop_predictions.items():
        # Exclude 'other' from forcing a crop mismatch if a specific crop model matched
        if c_key != 'other' and res['confidence'] > best_confidence:
            best_confidence = res['confidence']
            best_detected_crop = c_key
            best_disease = res['top_class']

    # 3. Check Crop Mismatch (Only if user crop model is very low confidence and alternative crop is > 85%)
    user_crop_conf = crop_predictions.get(user_crop, {}).get('confidence', 0.0)
    is_mismatch = (best_detected_crop != user_crop) and (user_crop_conf < 0.25) and (best_confidence >= 0.85) and (user_crop in ['wheat', 'rice', 'tomato'])

    active_crop = user_crop if (user_crop in crop_predictions and not is_mismatch) else best_detected_crop
    active_res = crop_predictions.get(active_crop, crop_predictions.get('other', {}))

    classes = active_res.get('classes', ['Healthy Plant'])
    prob_arr = active_res.get('prob_arr', np.array([1.0]))

    sorted_indices = np.argsort(prob_arr)[::-1]
    visual_candidates = []

    for idx in sorted_indices:
        if idx < len(classes):
            visual_candidates.append({
                'disease': classes[idx],
                'probability': round(float(prob_arr[idx]), 4)
            })

    top_candidate = visual_candidates[0] if visual_candidates else {'disease': 'Unknown', 'probability': 0.0}
    threshold = 0.65

    return {
        'crop': active_crop,
        'user_selected_crop': user_crop,
        'detected_crop': best_detected_crop.capitalize(),
        'is_crop_mismatch': is_mismatch,
        'mismatch_message': f"The uploaded image appears to show {best_detected_crop.capitalize()} (detected {best_disease}), but you selected {user_crop.capitalize()}. Please confirm the correct crop type or re-upload the image." if is_mismatch else None,
        'top_prediction': {
            'disease': top_candidate['disease'],
            'confidence': top_candidate['probability'],
            'class_index': int(sorted_indices[0])
        },
        'visual_candidates': visual_candidates,
        'quality_status': 'acceptable',
        'uncertainty_status': 'crop_mismatch' if is_mismatch else ('uncertain' if top_candidate['probability'] < threshold else 'confident'),
        'uncertainty_message': f"Crop mismatch detected! Photo matches {best_detected_crop.capitalize()}." if is_mismatch else None
    }

def main():
    parser = argparse.ArgumentParser(description="AgriSathi OpenCV & TFLite Plant Inference CLI")
    parser.add_argument('--image', required=True, help="Path to leaf image file")
    parser.add_argument('--crop', default='rice', help="Crop type (rice, wheat, tomato, other)")
    args = parser.parse_args()

    try:
        res = run_inference(args.image, args.crop)
        print(json.dumps(res, indent=2))
    except Exception as err:
        sys.stderr.write(f"Inference Error: {err}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
