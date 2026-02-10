# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import os

app = Flask(__name__)
# dev: allow all origins. For production restrict origins.
CORS(app, resources={r"/predict": {"origins": "*"}})

# load model - path should be relative to this file or use an absolute path
MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "dataset", "career_model.pkl")
)
print("Loading model from:", MODEL_PATH)
model = joblib.load(MODEL_PATH)

# Order of features used by model training — must match training exactly.
FEATURE_ORDER = [
    "logic", "creativity", "leadership", "empathy",
    "discipline", "social", "technical", "risk",
    "focus", "adaptability"
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if data is None:
            return jsonify({"error": "Empty JSON body"}), 400

        # Accept either { "traits": { ... } } or directly { "logic":..., ... }
        traits = data.get("traits") if isinstance(data, dict) and "traits" in data else data

        if not isinstance(traits, dict):
            return jsonify({"error": "Invalid payload: 'traits' object expected"}), 400

        # Build feature vector in the fixed order
        feature_vector = []
        for f in FEATURE_ORDER:
            val = traits.get(f, None)
            if val is None:
                # If missing, default to 0.0 — but log this so we can spot dataset mismatch
                val = 0.0
            # try to coerce to float
            try:
                fv = float(val)
            except Exception:
                return jsonify({"error": f"Trait '{f}' must be numeric"}), 400
            feature_vector.append(fv)

        X = np.array(feature_vector).reshape(1, -1)

        # predict and probabilities
        probs = model.predict_proba(X)[0]  # shape = (n_classes,)
        classes = model.classes_           # class labels in same order as probs

        # sort top indices
        top_idx = np.argsort(probs)[::-1][:3]
        topCareers = [{"career": str(classes[i]), "score": float(probs[i])} for i in top_idx]

        result = {
            "bestCareer": topCareers[0]["career"],
            "topCareers": topCareers
        }
        return jsonify(result), 200

    except Exception as e:
        # Print full traceback to server terminal (useful for debugging)
        tb = traceback.format_exc()
        print("ERROR in /predict:", tb)
        # Return safe error message to client
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500

if __name__ == "__main__":
    # Run on 127.0.0.1:5000 for local dev
    app.run(host="127.0.0.1", port=5000, debug=True)
