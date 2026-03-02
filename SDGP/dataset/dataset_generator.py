"""
IT-focused Career Dataset Generator (10 careers)
- Traits match frontend: logic, creativity, technical, empathy, leadership, social,
  discipline, adaptability, focus, risk
- Strong separation: primary traits very high, secondary moderately high, tertiary medium, weak low
- Balanced samples per career
Usage:
    python dataset_generator.py
Outputs:
    dataset/synthetic_dataset.json
"""

import json
import os
import random
from collections import defaultdict

TRAITS = [
    "logic", "creativity", "technical", "empathy",
    "leadership", "social", "discipline", "adaptability",
    "focus", "risk"
]

# 10 IT careers (MVP)
CAREERS = {
    "software_engineer": {
        "primary": ["logic", "technical", "focus"],
        "secondary": ["discipline", "adaptability"],
        "tertiary": ["creativity"],
        "weak": ["empathy", "social", "risk", "leadership"]
    },
    "frontend_developer": {
        "primary": ["creativity", "technical", "focus"],
        "secondary": ["adaptability", "social"],
        "tertiary": ["logic"],
        "weak": ["risk", "leadership"]
    },
    "backend_developer": {
        "primary": ["logic", "technical", "discipline"],
        "secondary": ["focus", "adaptability"],
        "tertiary": ["risk"],
        "weak": ["creativity", "social"]
    },
    "fullstack_developer": {
        "primary": ["technical", "creativity", "focus"],
        "secondary": ["discipline", "adaptability"],
        "tertiary": ["logic"],
        "weak": ["risk", "social"]
    },
    "data_scientist": {
        "primary": ["logic", "technical", "creativity"],
        "secondary": ["focus", "discipline"],
        "tertiary": ["adaptability"],
        "weak": ["social", "leadership", "risk"]
    },
    "ai_ml_engineer": {
        "primary": ["technical", "logic", "creativity"],
        "secondary": ["focus", "discipline"],
        "tertiary": ["adaptability"],
        "weak": ["social", "leadership"]
    },
    "cybersecurity_analyst": {
        "primary": ["technical", "discipline", "focus"],
        "secondary": ["logic", "risk"],
        "tertiary": ["adaptability"],
        "weak": ["creativity", "social", "empathy"]
    },
    "network_engineer": {
        "primary": ["technical", "discipline", "focus"],
        "secondary": ["logic", "adaptability"],
        "tertiary": ["risk"],
        "weak": ["creativity", "social"]
    },
    "devops_engineer": {
        "primary": ["technical", "discipline", "adaptability"],
        "secondary": ["focus", "logic"],
        "tertiary": ["risk"],
        "weak": ["creativity", "social"]
    },
    "ui_ux_designer": {
        "primary": ["creativity", "empathy", "social"],
        "secondary": ["adaptability", "focus"],
        "tertiary": ["technical"],
        "weak": ["logic", "discipline"]
    }
}

# ensure all trait names are valid
for name, prof in list(CAREERS.items()):
    prof["primary"] = [t for t in prof.get("primary", []) if t in TRAITS]
    prof["secondary"] = [t for t in prof.get("secondary", []) if t in TRAITS]
    prof["tertiary"] = [t for t in prof.get("tertiary", []) if t in TRAITS]
    prof["weak"] = [t for t in prof.get("weak", []) if t in TRAITS]

# trait ranges (stronger separation)
def generate_trait_vector(profile, variation_noise=0.02):
    vals = {}
    # primary: very high
    for t in profile.get("primary", []):
        base = random.uniform(0.88, 1.0)
        vals[t] = round(min(0.999, max(0.0, base + random.uniform(-variation_noise, variation_noise))), 3)
    # secondary: moderately high
    for t in profile.get("secondary", []):
        base = random.uniform(0.70, 0.85)
        vals[t] = round(min(0.95, max(0.0, base + random.uniform(-variation_noise*1.5, variation_noise*1.5))), 3)
    # tertiary: medium
    for t in profile.get("tertiary", []):
        base = random.uniform(0.50, 0.65)
        vals[t] = round(min(0.9, max(0.0, base + random.uniform(-variation_noise*2, variation_noise*2))), 3)
    # weak: low
    for t in profile.get("weak", []):
        base = random.uniform(0.02, 0.20)
        vals[t] = round(min(0.35, max(0.0, base + random.uniform(-variation_noise, variation_noise))), 3)
    # fill remaining traits from a narrower filler band so classes stay distinct
    for t in TRAITS:
        if t not in vals:
            vals[t] = round(random.uniform(0.20, 0.50), 3)
    return [vals[t] for t in TRAITS]

def generate_dataset(samples_per_career=900):
    dataset = []
    career_list = list(CAREERS.keys())
    for career in career_list:
        profile = CAREERS[career]
        for _ in range(samples_per_career):
            feats = generate_trait_vector(profile)
            jitter = [round(min(0.99, max(0.01, f + random.uniform(-0.03, 0.03))), 3) for f in feats]
            dataset.append({"features": jitter, "label": career})
    random.shuffle(dataset)
    return dataset

def verify(dataset):
    counts = defaultdict(int)
    for s in dataset:
        counts[s["label"]] += 1
    print("Dataset sizes per career:")
    for k in sorted(counts):
        print(f"  {k}: {counts[k]}")
    print("Total:", len(dataset))

if __name__ == "__main__":
    random.seed(42)
    data = generate_dataset(samples_per_career=900)  # 900 * 10 = 9,000 samples
    verify(data)
    out = os.path.join(os.path.dirname(__file__), "synthetic_dataset.json")
    with open(out, "w") as f:
        json.dump(data, f, indent=2)
    print("Saved:", out)