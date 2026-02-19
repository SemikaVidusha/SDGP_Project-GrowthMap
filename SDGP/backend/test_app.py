from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import sys
import os
import traceback

MONGO_URI = "mongodb+srv://sdgp_admin:Vu7rTKuA8nwuMR9K@career-prediction-clust.ohh82ug.mongodb.net/?appName=career-prediction-cluster"
client = MongoClient(MONGO_URI)
db = client["sdgp_db"]
careers_col = db["careers"]
roadmaps_col = db["roadmaps"]

print("MongoDB Atlas connected successfully")

ml_bp = Blueprint("ml", __name__)
careers_bp = Blueprint("careers", __name__)
roadmaps_bp = Blueprint("roadmaps", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if not data or "traits" not in data:
            return jsonify({"error": "Missing traits"}), 400
        
        return jsonify({
            "bestCareer": "software_engineer",
            "topCareers": [
                {"career": "software_engineer", "score": 0.95},
                {"career": "data_scientist", "score": 0.85},
                {"career": "ux_designer", "score": 0.75}
            ]
        }), 200
    except Exception as e:
        print(traceback.format_exc())
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

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(ml_bp, url_prefix="/api/ml")
app.register_blueprint(careers_bp, url_prefix="/api/careers")
app.register_blueprint(roadmaps_bp, url_prefix="/api/roadmaps")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)