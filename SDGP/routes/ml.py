from flask import Blueprint, request, jsonify
from services.ml_predict import predict_career
import traceback

ml_bp = Blueprint("ml", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        if not data or "traits" not in data:
            return jsonify({"error": "Missing traits"}), 400

        results = predict_career(data["traits"])

        return jsonify({
            "bestCareer": results[0]["career"],
            "topCareers": results
        }), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Prediction failed"}), 500