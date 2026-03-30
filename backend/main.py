import random
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from ml_engine import FraudDetectionModel
from sse_starlette.sse import EventSourceResponse
import asyncio
import json

app = FastAPI(title="Fraud Detection API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Model
ml_model = FraudDetectionModel()
ml_model.train_models() # Pre-train on startup

class TransactionFeatures(BaseModel):
    features: List[float]
    use_rf: bool = True

class TrainRequest(BaseModel):
    n_samples: int = 20000

@app.get("/metrics")
def get_metrics():
    return ml_model.metrics

@app.post("/train")
def train_model(req: TrainRequest):
    metrics = ml_model.train_models(n_samples=req.n_samples)
    return {"status": "success", "metrics": metrics}

@app.post("/predict")
def predict_transaction(tx: TransactionFeatures):
    result = ml_model.predict(tx.features, use_rf=tx.use_rf)
    return result

# Real-time stream simulation
async def transaction_generator():
    """Simulates real-time transactions streaming into the system."""
    tx_id = 0
    while True:
        await asyncio.sleep(random.uniform(0.5, 3.0)) # Random interval between 0.5s and 3s
        
        tx_id += 1
        # Generate random dummy features (10 features)
        features = [random.uniform(-3, 3) for _ in range(10)]
        
        # Occasionally force a "fraudulent-looking" transaction (e.g. extreme values)
        is_suspicious = random.random() < 0.1
        if is_suspicious:
            # Shift features to look anomalous
            features[0] += random.uniform(5, 10)
            features[1] -= random.uniform(5, 10)
            
        # Run prediction via RF by default for stream
        pred_result = ml_model.predict(features, use_rf=True)
        
        data = {
            "tx_id": f"TXN-{tx_id:06d}",
            "amount": round(abs(features[2]) * 1000 + 10, 2), # synthetic amount mapping
            "features": features,
            "prediction": pred_result["prediction"],
            "confidence": pred_result["confidence"],
            "prediction_time_ms": pred_result["prediction_time_ms"],
            "is_suspicious_generated": is_suspicious
        }
        
        yield {
            "event": "transaction",
            "data": json.dumps(data)
        }

@app.get("/stream")
async def stream():
    return EventSourceResponse(transaction_generator())
