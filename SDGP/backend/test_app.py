from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import traceback
import numpy as np
import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dataset"))

MODEL_PATH = os.path.join(DATASET_DIR, "career_model.pkl")
ENCODER_PATH = os.path.join(DATASET_DIR, "career_encoder.pkl")

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

print("ML Model + Encoder loaded successfully")

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["sdgp_db"]
careers_col = db["careers"]
roadmaps_col = db["roadmaps"]
print("MongoDB Atlas connected successfully")

app = Flask(__name__)
CORS(app)

ml_bp = Blueprint("ml", __name__)
careers_bp = Blueprint("careers", __name__)
roadmaps_bp = Blueprint("roadmaps", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        traits = data.get("traits")

        if not traits:
            return jsonify({"error": "Missing traits"}), 400

        FEATURE_ORDER = [
            "logic", "creativity", "technical", "empathy",
            "leadership", "social", "discipline", "adaptability",
            "focus", "risk"
        ]

        # ------------------ ML PREDICTION ------------------

        X = np.array([[traits.get(t, 0) for t in FEATURE_ORDER]])
        ml_probs = model.predict_proba(X)[0]

        labels = encoder.inverse_transform(np.arange(len(ml_probs)))

        ml_results = dict(zip(labels, ml_probs))

        # ------------------ DATABASE CAREER LOGIC ------------------

        careers = list(careers_col.find({}, {"_id": 0}))

        trait_map = {
            "logic": ["logic", "systems"],
            "technical": ["systems"],
            "focus": ["detail"],
            "discipline": ["detail"],
            "creativity": ["creativity"],
            "social": ["collaboration"],
            "empathy": ["collaboration"],
            "leadership": ["leadership"],
            "adaptability": ["adaptability"],
            "risk": ["risk"]
        }

        def compute_logic_score(user_traits, career_traits):
            score = 0
            max_score = 0

            for trait, value in user_traits.items():
                mapped = trait_map.get(trait, [])
                for m in mapped:
                    max_score += 1
                    if m in career_traits:
                        score += value

            return score / max_score if max_score > 0 else 0

        logic_scores = {}

        for career in careers:
            cid = career["id"]
            focus = career.get("focusTraits", [])
            logic_scores[cid] = compute_logic_score(traits, focus)

        # ------------------ HYBRID SCORING ------------------

        final_scores = {}

        for career_id in ml_results:
            ml_score = ml_results.get(career_id, 0)
            logic_score = logic_scores.get(career_id, 0)

            final_scores[career_id] = (
                0.65 * ml_score +
                0.35 * logic_score
            )

        ranked = sorted(
            final_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        top = [
            {"career": c, "score": round(float(s * 100), 2)}
            for c, s in ranked[:5]
        ]

        return jsonify({
            "bestCareer": top[0]["career"],
            "topCareers": top
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Prediction failed"}), 500

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

@roadmaps_bp.route("/<career_id>", methods=["GET"])
def get_roadmap(career_id):
    roadmap = roadmaps_col.find_one({"careerId": career_id}, {"_id": 0})
    if not roadmap:
        return jsonify({"error": "Roadmap not found"}), 404
    return jsonify(roadmap), 200

app.register_blueprint(ml_bp, url_prefix="/api/ml")
app.register_blueprint(careers_bp, url_prefix="/api/careers")
app.register_blueprint(roadmaps_bp, url_prefix="/api/roadmaps")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)