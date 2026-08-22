"""
Loads the trained disease detection model and runs inference on a single
image. Used directly by the FastAPI route in api/app.py.
"""

import json
import os

import numpy as np
import tensorflow as tf

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "disease_model.keras")
LABELS_PATH = os.path.join(MODEL_DIR, "class_labels.json")

IMG_SIZE = (224, 224)

_model = None
_class_labels = None


def _load_resources():
    """Lazy-loads the model and labels once, reused across requests."""
    global _model, _class_labels

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"No trained model found at '{MODEL_PATH}'. Run train.py first. "
                f"(If you previously had a disease_model.h5 from before, delete it — "
                f"it was saved in an incompatible format and won't load.)"
            )
        _model = tf.keras.models.load_model(MODEL_PATH)

    if _class_labels is None:
        with open(LABELS_PATH) as f:
            _class_labels = json.load(f)

    return _model, _class_labels


def predict_image(image_path: str) -> dict:
    """
    Args:
        image_path: path to a leaf image file on disk

    Returns:
        {
            "disease": "<class name>",
            "confidence": <float 0-1>,
            "all_predictions": {class_name: probability, ...}
        }
    """
    model, class_labels = _load_resources()

    img = tf.keras.utils.load_img(image_path, target_size=IMG_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # add batch dimension

    predictions = model.predict(img_array, verbose=0)[0]

    top_idx = int(np.argmax(predictions))
    disease_name = class_labels[str(top_idx)]
    confidence = float(predictions[top_idx])

    all_predictions = {
        class_labels[str(i)]: float(prob) for i, prob in enumerate(predictions)
    }

    return {
        "disease": disease_name,
        "confidence": round(confidence, 4),
        "all_predictions": all_predictions,
    }


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python predict.py <path_to_image>")
        sys.exit(1)

    result = predict_image(sys.argv[1])
    print(json.dumps(result, indent=2))