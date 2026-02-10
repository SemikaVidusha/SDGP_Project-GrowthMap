import json
import random
import os

CAREERS = {
    "software_engineer": ["logic", "technical", "focus", "discipline"],
    "ui_ux_designer": ["creativity", "empathy", "social", "adaptability"],
    "network_technician": ["technical", "logic", "discipline", "focus"],
    "data_scientist": ["logic", "technical", "focus", "creativity"],
    "cybersecurity_analyst": ["technical", "logic", "discipline", "risk"]
}

TRAITS = [
    "logic", "creativity", "leadership", "empathy",
    "discipline", "social", "technical", "risk",
    "focus", "adaptability"
]

def generate_trait_vector(strong_traits):
    traits = {}

    for trait in TRAITS:
        if trait in strong_traits:
            traits[trait] = round(random.uniform(0.65, 1.0), 3)
        else:
            traits[trait] = round(random.uniform(0.1, 0.6), 3)

    return [traits[t] for t in TRAITS]

def generate_dataset(samples=5000):
    dataset = []

    for _ in range(samples):
        career = random.choice(list(CAREERS.keys()))
        strong_traits = CAREERS[career]

        features = generate_trait_vector(strong_traits)

        dataset.append({
            "features": features,
            "label": career
        })

    return dataset

if __name__ == "__main__":
    data = generate_dataset(5000)

    out_path = os.path.join(os.path.dirname(__file__), "synthetic_dataset.json")

    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)

    print("synthetic_dataset.json generated with", len(data), "samples")
    print("Saved to:", out_path)
