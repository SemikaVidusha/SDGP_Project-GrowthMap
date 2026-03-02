import json
import os
import sys

# allow backend imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from db import careers_col, roadmaps_col

# current folder (backend/scripts)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def migrate_careers():
    path = os.path.join(SCRIPT_DIR, "careers.json")

    if not os.path.exists(path):
        print("careers.json not found — skipping careers migration")
        return

    with open(path, "r", encoding="utf-8") as f:
        careers = json.load(f)

    careers_col.delete_many({})
    careers_col.insert_many(careers)
    print("Migrated careers")


def migrate_roadmaps():
    path = os.path.join(SCRIPT_DIR, "roadmaps.json")
    if not os.path.exists(path):
        print("roadmaps.json not found — skipping roadmaps migration")
        return

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Correct extraction
    if isinstance(data, dict) and "roadmaps" in data:
        roadmaps = data["roadmaps"]
    elif isinstance(data, list):
        roadmaps = data
    else:
        raise ValueError("Invalid roadmaps.json structure")

    roadmaps_col.delete_many({})
    roadmaps_col.insert_many(roadmaps)

    print(f"Migrated {len(roadmaps)} roadmaps successfully")


if __name__ == "__main__":
    migrate_careers()
    migrate_roadmaps()