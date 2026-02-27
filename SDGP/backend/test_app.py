from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import traceback
import numpy as np
import os

# -------------------- PATH FIX --------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dataset"))

MODEL_PATH = os.path.join(DATASET_DIR, "career_model.pkl")
ENCODER_PATH = os.path.join(DATASET_DIR, "career_encoder.pkl")

# -------------------- LOAD MODEL --------------------

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

print("ML Model + Encoder loaded successfully")

# -------------------- DATABASE --------------------

MONGO_URI = "mongodb+srv://sdgp_admin:Vu7rTKuA8nwuMR9K@career-prediction-clust.ohh82ug.mongodb.net/?appName=career-prediction-cluster"

client = MongoClient(MONGO_URI)
db = client["sdgp_db"]
careers_col = db["careers"]
roadmaps_col = db["roadmaps"]

print("MongoDB Atlas connected successfully")

# -------------------- FLASK SETUP --------------------

app = Flask(__name__)
CORS(app)

ml_bp = Blueprint("ml", __name__)
careers_bp = Blueprint("careers", __name__)
roadmaps_bp = Blueprint("roadmaps", __name__)

# -------------------- ML PREDICTION --------------------

@ml_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        traits = data.get("traits")

        if not traits:
            return jsonify({"error": "Missing traits"}), 400

        FEATURE_ORDER = [
            "logic", "creativity", "leadership", "empathy",
            "discipline", "social", "technical", "risk",
            "focus", "adaptability"
        ]

        # Normalize: 0–100 → 0–1
        X = [[traits.get(t, 0) / 100 for t in FEATURE_ORDER]]

        probs = model.predict_proba(X)[0]

        decoded_labels = encoder.inverse_transform(
            np.arange(len(probs))
        )

        predictions = sorted(
            zip(decoded_labels, probs),
            key=lambda x: x[1],
            reverse=True
        )

        top = [
            {"career": c, "score": float(round(p, 4))}
            for c, p in predictions[:5]
        ]

        return jsonify({
            "bestCareer": top[0]["career"],
            "topCareers": top
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500

# -------------------- CAREER API --------------------

@careers_bp.route("/", methods=["GET"])
def get_all_careers():
    careers = list(careers_col.find({}, {"_id": 0}))
    return jsonify(careers), 200

@careers_bp.route("/<career_id>", methods=["GET"])
def get_single_career(career_id):
    career = careers_col.find_one({"careerId": career_id}, {"_id": 0})
    if not career:
        return jsonify({"error": "Career not found"}), 404
    return jsonify(career), 200

# -------------------- ROADMAP API --------------------

@roadmaps_bp.route("/<career_id>", methods=["GET"])
def get_roadmap(career_id):
    roadmap = roadmaps_col.find_one({"careerId": career_id}, {"_id": 0})
    if not roadmap:
        return jsonify({"error": "Roadmap not found"}), 404
    return jsonify(roadmap), 200

# -------------------- REGISTER ROUTES --------------------

app.register_blueprint(ml_bp, url_prefix="/api/ml")
app.register_blueprint(careers_bp, url_prefix="/api/careers")
app.register_blueprint(roadmaps_bp, url_prefix="/api/roadmaps")

# -------------------- RUN SERVER --------------------

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)