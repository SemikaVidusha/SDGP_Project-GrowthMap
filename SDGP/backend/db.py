from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://sdgp_admin:Vu7rTKuA8nwuMR9K@career-prediction-clust.ohh82ug.mongodb.net/?appName=career-prediction-cluster"

client = MongoClient(MONGO_URI)
db = client["sdgp_db"]

careers_col = db["careers"]
roadmaps_col = db["roadmaps"]
users_col = db["users"]
results_col = db["results"]

print("MongoDB Atlas connected successfully")