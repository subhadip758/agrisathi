"""
FastAPI route exposing disease detection over HTTP.

Node's mlService.js calls POST /predict/disease with a multipart image
upload and gets back {disease, confidence, all_predictions}.
"""

import os
import shutil
import sys
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile

# Allow importing predict.py from models/disease_detection/
sys.path.append(
    os.path.join(os.path.dirname(__file__), "..", "..", "models", "disease_detection")
)
from predict import predict_image  # noqa: E402

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/predict/disease")
async def predict_disease(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        result = predict_image(tmp_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
    finally:
        os.remove(tmp_path)

    return result