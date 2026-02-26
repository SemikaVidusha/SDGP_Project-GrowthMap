import joblib
import numpy as np
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Feature order matches the dataset_generator.py order (from questions.json)
# Frontend traits: logic, creativity, technical, empathy, leadership, social, discipline, adaptability, focus, risk
FEATURE_ORDER = [
    "logic", "creativity", "leadership", "empathy",
    "discipline", "social", "technical", "risk",
    "focus", "adaptability"
]

# Direct mapping - frontend trait names already match the order
TRAIT_MAPPING = {
    "logic": 0,
    "creativity": 1,
    "leadership": 2,
    "empathy": 3,
    "discipline": 4,
    "social": 5,
    "technical": 6,
    "risk": 7,
    "focus": 8,
    "adaptability": 9
}

# Load model from the same directory as this script
# Both files are now in the dataset folder
model_path = os.path.join(SCRIPT_DIR, "career_model.pkl")
encoder_path = os.path.join(SCRIPT_DIR, "career_encoder.pkl")

print(f"Loading model from: {model_path}")
model = joblib.load(model_path)
encoder = joblib.load(encoder_path)

def predict_career(traits_dict):
    # Create feature vector using index mapping
    vector = np.zeros(10)
    for trait_name, index in TRAIT_MAPPING.items():
        if trait_name in traits_dict:
            # Ensure the value is a float
            val = float(traits_dict[trait_name])
            # If value > 1, assume it's already a percentage, divide by 100
            if val > 1:
                val = val / 100
            vector[index] = val
    
    vector = vector.reshape(1, -1)
    pred = model.predict(vector)[0]
    probs = model.predict_proba(vector)[0]

    top_indices = np.argsort(probs)[::-1][:3]
    careers = encoder.inverse_transform(top_indices)
    # Convert to percentage (0-100 range)
    percentages = (probs[top_indices] * 100)

    # Return in format expected by frontend: {career, score}
    # score is in percentage form (0-100)
    return [
        {"career": str(careers[i]), "score": float(percentages[i])}
        for i in range(3)
    ]
