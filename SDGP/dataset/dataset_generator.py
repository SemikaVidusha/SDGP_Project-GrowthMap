import json
import random
import os
import numpy as np

# Define careers with their KEY distinguishing traits
# Each career has primary traits (very high) and secondary traits (moderately high)
CAREERS = {
    "software_engineer": {
        "primary": ["logic", "technical", "focus"],
        "secondary": ["discipline", "problem_solving"],
        "weak": ["empathy", "creativity", "social"]
    },
    "ui_ux_designer": {
        "primary": ["creativity", "empathy", "adaptability"],
        "secondary": ["social", "communication"],
        "weak": ["logic", "technical", "risk"]
    },
    "network_technician": {
        "primary": ["technical", "focus", "discipline"],
        "secondary": ["logic", "problem_solving"],
        "weak": ["creativity", "empathy", "social"]
    },
    "data_scientist": {
        "primary": ["logic", "analytical", "focus"],
        "secondary": ["technical", "creativity", "problem_solving"],
        "weak": ["social", "leadership", "empathy"]
    },
    "cybersecurity_analyst": {
        "primary": ["technical", "logic", "discipline"],
        "secondary": ["risk", "problem_solving", "focus"],
        "weak": ["creativity", "social", "empathy"]
    }
}

TRAITS = [
    "logic", "creativity", "leadership", "empathy",
    "discipline", "social", "technical", "risk",
    "focus", "adaptability"
]

def generate_trait_vector(career_profile):
    """Generate trait vector with clear separation between career types"""
    traits = {}
    
    # Primary traits: very high (0.75 - 1.0)
    for trait in career_profile["primary"]:
        if trait in TRAITS:
            traits[trait] = round(random.uniform(0.75, 1.0), 3)
    
    # Secondary traits: moderately high (0.5 - 0.8)
    for trait in career_profile["secondary"]:
        if trait in TRAITS:
            traits[trait] = round(random.uniform(0.5, 0.8), 3)
    
    # Weak traits: low (0.1 - 0.5)
    for trait in career_profile["weak"]:
        if trait in TRAITS:
            traits[trait] = round(random.uniform(0.1, 0.5), 3)
    
    # Fill any missing traits with random values
    for trait in TRAITS:
        if trait not in traits:
            traits[trait] = round(random.uniform(0.2, 0.6), 3)
    
    return [traits[t] for t in TRAITS]

def generate_dataset(samples_per_career=1000):
    """Generate a balanced dataset with equal samples per career"""
    dataset = []
    
    career_list = list(CAREERS.keys())
    
    for career in career_list:
        for _ in range(samples_per_career):
            career_profile = CAREERS[career]
            features = generate_trait_vector(career_profile)
            
            # Add small random noise for variation
            features = [max(0.05, min(0.99, f + random.uniform(-0.1, 0.1))) for f in features]
            features = [round(f, 3) for f in features]
            
            dataset.append({
                "features": features,
                "label": career
            })
    
    # Shuffle the dataset
    random.shuffle(dataset)
    
    return dataset

def generate_test_samples():
    """Generate some test samples to verify the model"""
    print("\n--- Sample trait profiles for each career ---")
    for career, profile in CAREERS.items():
        traits = generate_trait_vector(profile)
        print(f"{career}: {dict(zip(TRAITS, traits))}")

if __name__ == "__main__":
    data = generate_dataset(1000)  # 1000 samples per career = 5000 total

    out_path = os.path.join(os.path.dirname(__file__), "synthetic_dataset.json")

    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)

    print("synthetic_dataset.json generated with", len(data), "samples")
    print("Saved to:", out_path)
    
    # Show sample profiles
    generate_test_samples()
