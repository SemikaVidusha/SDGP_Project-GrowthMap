import json
import random

CAREERS = {
    "software_engineer": ["logic", "systems", "detail"],
    "ui_ux_designer": ["creativity", "collaboration"],
    "network_technician": ["systems", "logic"],
    "data_scientist": ["logic", "detail", "creativity"],
    "cybersecurity_analyst": ["systems", "logic", "detail"]
}

TRAITS = ["collaboration", "creativity", "logic", "systems", "detail"]

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

    with open("dataset/synthetic_dataset.json", "w") as f:
        json.dump(data, f, indent=2)

    print("synthetic_dataset.json generated with", len(data), "samples")
