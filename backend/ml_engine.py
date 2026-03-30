import time
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from imblearn.over_sampling import SMOTE

class FraudDetectionModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.lr_model = LogisticRegression(max_iter=1000)
        self.rf_model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
        self.metrics = {}

    def generate_synthetic_data(self, n_samples=20000, n_features=10):
        # 0 is not fraud, 1 is fraud
        # weights=[0.95, 0.05] creates class imbalance
        X, y = make_classification(
            n_samples=n_samples, n_features=n_features,
            n_informative=6, n_redundant=2, n_classes=2,
            weights=[0.95, 0.05], random_state=42
        )
        return X, y

    def train_models(self, n_samples=20000):
        X, y = self.generate_synthetic_data(n_samples=n_samples)
        
        # Train Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Handle imbalance with SMOTE
        smote = SMOTE(random_state=42)
        X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)

        # Train Logistic Regression
        start_time = time.time()
        self.lr_model.fit(X_train_resampled, y_train_resampled)
        lr_train_time = time.time() - start_time

        # Train Random Forest
        start_time = time.time()
        self.rf_model.fit(X_train_resampled, y_train_resampled)
        rf_train_time = time.time() - start_time

        # Predict & Evaluate LR
        y_pred_lr = self.lr_model.predict(X_test_scaled)
        self.metrics['logistic_regression'] = {
            'train_time_ms': round(lr_train_time * 1000, 2),
            'accuracy': round(accuracy_score(y_test, y_pred_lr), 4),
            'precision': round(precision_score(y_test, y_pred_lr), 4),
            'recall': round(recall_score(y_test, y_pred_lr), 4),
            'f1': round(f1_score(y_test, y_pred_lr), 4),
            'complexity': 'O(n*d) train, O(d) predict'
        }

        # Predict & Evaluate RF
        y_pred_rf = self.rf_model.predict(X_test_scaled)
        self.metrics['random_forest'] = {
            'train_time_ms': round(rf_train_time * 1000, 2),
            'accuracy': round(accuracy_score(y_test, y_pred_rf), 4),
            'precision': round(precision_score(y_test, y_pred_rf), 4),
            'recall': round(recall_score(y_test, y_pred_rf), 4),
            'f1': round(f1_score(y_test, y_pred_rf), 4),
            'complexity': 'O(n*log(n)*d*k) train, O(k*d) predict'
        }

        return self.metrics

    def predict(self, features, use_rf=True):
        features_scaled = self.scaler.transform([features])
        start_time = time.perf_counter()
        
        if use_rf:
            prediction = self.rf_model.predict(features_scaled)
            probs = self.rf_model.predict_proba(features_scaled)
        else:
            prediction = self.lr_model.predict(features_scaled)
            probs = self.lr_model.predict_proba(features_scaled)
            
        pred_time_ms = (time.perf_counter() - start_time) * 1000
        
        return {
            "prediction": int(prediction[0]),
            "confidence": float(max(probs[0])),
            "prediction_time_ms": round(pred_time_ms, 4)
        }
