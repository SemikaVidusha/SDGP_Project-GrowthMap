from flask import Blueprint, jsonify
from db import careers_col  # Removed 'backend.' prefix

careers_bp = Blueprint("careers", __name__)

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