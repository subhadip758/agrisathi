"""
FastAPI app entrypoint for ml-services.

Run with:
    uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload

Node's mlService.js should point at http://<ml-service-host>:8000/predict/disease
"""

from fastapi import FastAPI

from .routes.disease_routes import router as disease_router

app = FastAPI(title="AgriSathi ML Services", version="1.0.0")

app.include_router(disease_router)


@app.get("/health")
async def health():
    return {"status": "ok"}