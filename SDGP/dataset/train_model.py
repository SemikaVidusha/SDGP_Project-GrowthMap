# dataset/train_model.py
"""
Train script for career recommendation (10 IT careers).
Saves:
 - dataset/career_model.pkl  (pipeline)
 - dataset/career_encoder.pkl (LabelEncoder)
 - dataset/feature_order.pkl  (feature order)
"""

import json
import joblib
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report, top_k_accuracy_score

FEATURE_ORDER = [
    "logic", "creativity", "technical", "empathy",
    "leadership", "social", "discipline", "adaptability",
    "focus", "risk"
]

def load_dataset(json_path):
    with open(json_path, "r") as f:
        data = json.load(f)
    X = np.array([sample["features"] for sample in data])
    y = np.array([sample["label"] for sample in data])
    print(f"Loaded {len(X)} samples, features={X.shape[1]}, classes={len(np.unique(y))}")
    return X, y

def create_pipeline():
    base_clf = RandomForestClassifier(
        n_estimators=250,
        max_depth=18,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features='sqrt',
        bootstrap=True,
        class_weight='balanced_subsample',
        random_state=42,
        n_jobs=-1
    )
    calibrated = CalibratedClassifierCV(estimator=base_clf, method='isotonic', cv=5)
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', calibrated)
    ])
    return pipeline

def train_and_evaluate(pipeline, X, y, encoder):
    # stratified split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training on {len(X_train)} samples, testing on {len(X_test)}")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)
    top3 = top_k_accuracy_score(y_test, y_proba, k=3)
    top5 = top_k_accuracy_score(y_test, y_proba, k=5)

    print(f"Top-1 Accuracy: {acc:.4f}  Top-3: {top3:.4f}  Top-5: {top5:.4f}")

    # classification report (target names in encoder.classes_ order)
    print("\nClassification Report:")
    try:
        class_names = encoder.classes_
        print(classification_report(y_test, y_pred, target_names=class_names))
    except Exception as e:
        print("Skipping detailed classification report:", e)

    # feature importances if available
    try:
        rf = pipeline.named_steps['classifier'].estimator
        importances = rf.feature_importances_
        print("\nFeature importances (trait: importance):")
        for trait, imp in sorted(zip(FEATURE_ORDER, importances), key=lambda x: x[1], reverse=True):
            print(f"  {trait:12s}: {imp:.4f}")
    except Exception as e:
        print("Could not extract feature importances:", e)

    return pipeline

def save_model(pipeline, encoder, out_dir):
    model_path = os.path.join(out_dir, "career_model.pkl")
    encoder_path = os.path.join(out_dir, "career_encoder.pkl")
    feature_order_path = os.path.join(out_dir, "feature_order.pkl")

    joblib.dump(pipeline, model_path)
    joblib.dump(encoder, encoder_path)
    joblib.dump(FEATURE_ORDER, feature_order_path)

    print("Saved model to:", model_path)
    print("Saved encoder to:", encoder_path)
    print("Saved feature order to:", feature_order_path)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, "synthetic_dataset.json")

    X, y = load_dataset(dataset_path)

    encoder = LabelEncoder()
    y_enc = encoder.fit_transform(y)
    print("Classes:", encoder.classes_)

    pipeline = create_pipeline()
    pipeline = train_and_evaluate(pipeline, X, y_enc, encoder)

    save_model(pipeline, encoder, script_dir)
    print("Training complete.")

if __name__ == "__main__":
    main()