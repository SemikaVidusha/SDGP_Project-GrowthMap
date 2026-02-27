from pymongo import MongoClient
import json

MONGO_URI = "mongodb+srv://sdgp_admin:Vu7rTKuA8nwuMR9K@career-prediction-clust.ohh82ug.mongodb.net/?appName=career-prediction-cluster"

client = MongoClient(MONGO_URI)
db = client["sdgp_db"]

careers = list(db["careers"].find({}, {"_id": 0}))
roadmaps = list(db["roadmaps"].find({}, {"_id": 0}))

print("\nCAREERS COUNT:", len(careers))
print(json.dumps(careers[:3], indent=2))

print("\nROADMAP COUNT:", len(roadmaps))
print(json.dumps(roadmaps[:2], indent=2))