"""
Career Dataset Generator
=======================
Generates a balanced, diverse dataset for career recommendation.
- 19 career labels
- 11,400+ samples
- Clear statistical separation between careers
- Uses only traits that match frontend questions.json

Traits (matching frontend):
- logic, creativity, technical, empathy, leadership, social, 
- discipline, adaptability, focus, risk
"""

import json
import random
import os
import numpy as np
from collections import defaultdict

# ============================================================================
# TRAITS - Must match frontend questions.json exactly
# ============================================================================
TRAITS = [
    "logic",          # 0: Problem-solving, analytical thinking
    "creativity",     # 1: Innovation, artistic sense
    "technical",      # 2: Tech skills, systems knowledge
    "empathy",        # 3: Understanding others, emotional intelligence
    "leadership",     # 4: Guiding teams, decision making
    "social",         # 5: Communication, collaboration
    "discipline",     # 6: Structure, consistency, follow-through
    "adaptability",   # 7: Flexibility, handling change
    "focus",          # 8: Concentration, attention to detail
    "risk"            # 9: Risk tolerance, uncertainty handling
]

# ============================================================================
# CAREERS - 19 careers with distinct trait profiles
# ============================================================================
CAREERS = {
    # Technology & Engineering
    "software_engineer": {
        "primary": ["logic", "technical", "focus"],
        "secondary": ["discipline", "adaptability"],
        "tertiary": ["creativity"],
        "weak": ["empathy", "social", "leadership"]
    },
    "data_scientist": {
        "primary": ["logic", "technical", "focus"],
        "secondary": ["creativity", "discipline"],
        "tertiary": ["adaptability"],
        "weak": ["social", "leadership", "empathy"]
    },
    "cybersecurity_analyst": {
        "primary": ["technical", "logic", "focus"],
        "secondary": ["discipline", "adaptability"],
        "tertiary": ["risk"],
        "weak": ["creativity", "social", "empathy"]
    },
    "network_technician": {
        "primary": ["technical", "discipline", "focus"],
        "secondary": ["logic", "adaptability"],
        "tertiary": ["social"],
        "weak": ["creativity", "leadership", "empathy"]
    },
    "ui_ux_designer": {
        "primary": ["creativity", "empathy", "focus"],
        "secondary": ["social", "adaptability"],
        "tertiary": ["technical"],
        "weak": ["logic", "risk", "discipline"]
    },
    
    # Business & Management
    "project_manager": {
        "primary": ["leadership", "social", "discipline"],
        "secondary": ["adaptability", "empathy"],
        "tertiary": ["focus", "risk"],
        "weak": ["technical", "creativity"]
    },
    "entrepreneur": {
        "primary": ["risk", "leadership", "adaptability"],
        "secondary": ["creativity", "social"],
        "tertiary": ["logic", "empathy"],
        "weak": ["discipline", "focus", "technical"]
    },
    "marketing_manager": {
        "primary": ["creativity", "social", "leadership"],
        "secondary": ["adaptability", "empathy"],
        "tertiary": ["risk", "logic"],
        "weak": ["technical", "focus", "discipline"]
    },
    "sales_representative": {
        "primary": ["social", "empathy", "leadership"],
        "secondary": ["adaptability", "risk"],
        "tertiary": ["creativity", "logic"],
        "weak": ["technical", "discipline", "focus"]
    },
    "accountant": {
        "primary": ["discipline", "focus", "logic"],
        "secondary": ["technical", "risk"],
        "tertiary": ["adaptability"],
        "weak": ["creativity", "leadership", "social"]
    },
    
    # Healthcare & Science
    "doctor": {
        "primary": ["empathy", "focus", "discipline"],
        "secondary": ["leadership", "adaptability"],
        "tertiary": ["technical", "logic"],
        "weak": ["creativity", "risk", "social"]
    },
    "research_scientist": {
        "primary": ["logic", "focus", "discipline"],
        "secondary": ["creativity", "technical"],
        "tertiary": ["adaptability"],
        "weak": ["social", "leadership", "empathy"]
    },
    "psychologist": {
        "primary": ["empathy", "social", "adaptability"],
        "secondary": ["focus", "discipline"],
        "tertiary": ["leadership", "creativity"],
        "weak": ["technical", "risk"]
    },
    "nurse": {
        "primary": ["empathy", "social", "discipline"],
        "secondary": ["adaptability", "focus"],
        "tertiary": ["technical", "leadership"],
        "weak": ["creativity", "risk"]
    },
    
    # Creative & Media
    "graphic_designer": {
        "primary": ["creativity", "focus", "adaptability"],
        "secondary": ["technical", "social"],
        "tertiary": ["empathy"],
        "weak": ["discipline", "risk", "leadership"]
    },
    "content_creator": {
        "primary": ["creativity", "social", "adaptability"],
        "secondary": ["focus", "empathy"],
        "tertiary": ["technical"],
        "weak": ["discipline", "risk", "logic"]
    },
    "journalist": {
        "primary": ["social", "creativity", "focus"],
        "secondary": ["adaptability", "risk"],
        "tertiary": ["empathy", "logic"],
        "weak": ["technical", "discipline"]
    },
    
    # Human Services
    "human_resources": {
        "primary": ["social", "empathy", "leadership"],
        "secondary": ["adaptability", "discipline"],
        "tertiary": ["focus", "technical"],
        "weak": ["risk", "creativity"]
    },
    "teacher": {
        "primary": ["social", "empathy", "adaptability"],
        "secondary": ["creativity", "discipline"],
        "tertiary": ["focus", "leadership"],
        "weak": ["risk", "technical"]
    }
}


def generate_trait_vector(career_name, profile, variation=0):
    """Generate trait vector for a career profile."""
    traits = {}
    
    # Primary traits: very high (0.75 - 1.0)
    for trait in profile.get("primary", []):
        if trait in TRAITS:
            base = random.uniform(0.75, 1.0)
            noise = random.uniform(-0.08, 0.08) * (variation + 1)
            traits[trait] = round(max(0.6, min(1.0, base + noise)), 3)
    
    # Secondary traits: moderately high (0.5 - 0.75)
    for trait in profile.get("secondary", []):
        if trait in TRAITS:
            base = random.uniform(0.5, 0.75)
            noise = random.uniform(-0.1, 0.1) * (variation + 1)
            traits[trait] = round(max(0.35, min(0.85, base + noise)), 3)
    
    # Tertiary traits: medium (0.35 - 0.6)
    for trait in profile.get("tertiary", []):
        if trait in TRAITS:
            base = random.uniform(0.35, 0.6)
            noise = random.uniform(-0.1, 0.1) * (variation + 1)
            traits[trait] = round(max(0.2, min(0.7, base + noise)), 3)
    
    # Weak traits: low (0.1 - 0.4)
    for trait in profile.get("weak", []):
        if trait in TRAITS:
            base = random.uniform(0.1, 0.4)
            noise = random.uniform(-0.08, 0.08)
            traits[trait] = round(max(0.05, min(0.45, base + noise)), 3)
    
    # Fill missing traits
    for trait in TRAITS:
        if trait not in traits:
            traits[trait] = round(random.uniform(0.15, 0.5), 3)
    
    return [traits[t] for t in TRAITS]


def generate_dataset(samples_per_career=600, variations_per_career=3):
    """Generate a balanced dataset with equal samples per career."""
    dataset = []
    career_list = list(CAREERS.keys())
    
    samples_per_variation = samples_per_career // variations_per_career
    
    for career in career_list:
        profile = CAREERS[career]
        
        for variation in range(variations_per_career):
            for _ in range(samples_per_variation):
                features = generate_trait_vector(career, profile, variation)
                
                # Add noise
                noise_level = 0.08 if variation == 0 else 0.12
                features = [f + random.uniform(-noise_level, noise_level) for f in features]
                features = [max(0.05, min(0.99, f)) for f in features]
                features = [round(f, 3) for f in features]
                
                dataset.append({
                    "features": features,
                    "label": career
                })
    
    random.shuffle(dataset)
    return dataset


def verify_dataset_balance(dataset):
    """Verify that dataset is balanced across careers"""
    career_counts = defaultdict(int)
    for sample in dataset:
        career_counts[sample["label"]] += 1
    
    print("\n=== Dataset Balance Verification ===")
    for career, count in sorted(career_counts.items()):
        print(f"  {career}: {count} samples")
    
    min_count = min(career_counts.values())
    max_count = max(career_counts.values())
    print(f"\nMin/Max samples per career: {min_count}/{max_count}")
    print(f"Total samples: {len(dataset)}")
    
    return career_counts


if __name__ == "__main__":
    random.seed(42)
    np.random.seed(42)
    
    print("Generating dataset with 19 careers...")
    data = generate_dataset(samples_per_career=600, variations_per_career=3)
    
    verify_dataset_balance(data)
    
    out_path = os.path.join(os.path.dirname(__file__), "synthetic_dataset.json")
    
    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✓ synthetic_dataset.json generated with {len(data)} samples")
    print(f"✓ Saved to: {out_path}")
