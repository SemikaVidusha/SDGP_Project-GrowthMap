from flask import Blueprint, jsonify
from db import roadmaps_col  # Removed 'backend.' prefix

roadmaps_bp = Blueprint("roadmaps", __name__)

@roadmaps_bp.route("/<career_id>", methods=["GET"])
def get_roadmap(career_id):
    roadmap = roadmaps_col.find_one({"careerId": career_id}, {"_id": 0})

    if not roadmap:
        return jsonify({"error": "Roadmap not found"}), 404

    return jsonify(roadmap), 200