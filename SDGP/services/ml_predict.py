import joblib
import numpy as np
import os

FEATURE_ORDER = [
    "logic", "creativity", "leadership", "empathy",
    "discipline", "social", "technical", "risk",
    "focus", "adaptability"
]

MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "dataset", "career_model.pkl")
)

model = joblib.load(MODEL_PATH)


def predict_career(traits: dict):
    feature_vector = []

    for f in FEATURE_ORDER:
        feature_vector.append(float(traits.get(f, 0)))

    X = np.array(feature_vector).reshape(1, -1)

    probs = model.predict_proba(X)[0]
    classes = model.classes_

    top_idx = np.argsort(probs)[::-1][:3]

    return [
        {"career": str(classes[i]), "score": float(probs[i])}
        for i in top_idx
    ]
