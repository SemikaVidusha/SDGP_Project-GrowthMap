from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["sdgp_db"]

careers_col = db["careers"]
roadmaps_col = db["roadmaps"]
users_col = db["users"]
results_col = db["results"]

print("MongoDB Atlas connected successfully")
