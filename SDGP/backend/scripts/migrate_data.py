import json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from db import careers_col, roadmaps_col


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")

def migrate_careers():
    path = os.path.join(DATA_DIR, "careers.json")
    with open(path, "r", encoding="utf-8") as f:
        careers = json.load(f)

    careers_col.delete_many({})
    careers_col.insert_many(careers)
    print("Migrated careers")


def migrate_roadmaps():
    path = os.path.join(DATA_DIR, "roadmaps.json")
    with open(path, "r", encoding="utf-8") as f:
        roadmaps = json.load(f)

    roadmaps_col.delete_many({})
    roadmaps_col.insert_many(roadmaps)
    print("Migrated roadmaps")


if __name__ == "__main__":
    migrate_careers()
    migrate_roadmaps()
