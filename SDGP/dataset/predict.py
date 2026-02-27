"""
Career Prediction Script
========================
Loads the trained model pipeline and makes predictions.
- Accepts trait dictionary input
- Outputs sorted probabilities
- Shows top 5 career recommendations
"""

import joblib
import numpy as np
import os
import sys

# ============================================================================
# CONFIGURATION
# ============================================================================

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Feature order must match training exactly
# This matches frontend questions.json and train_model.py
FEATURE_ORDER = [
    "logic",          # 0
    "creativity",     # 1
    "technical",      # 2
    "empathy",        # 3
    "leadership",     # 4
    "social",         # 5
    "discipline",     # 6
    "adaptability",   # 7
    "focus",          # 8
    "risk"            # 9
]

# Direct index mapping for traits
TRAIT_MAPPING = {trait: i for i, trait in enumerate(FEATURE_ORDER)}

# ============================================================================
# MODEL LOADING
# ============================================================================

def load_model():
    """Load the trained pipeline and encoder"""
    model_path = os.path.join(SCRIPT_DIR, "career_model.pkl")
    encoder_path = os.path.join(SCRIPT_DIR, "career_encoder.pkl")
    feature_order_path = os.path.join(SCRIPT_DIR, "feature_order.pkl")
    
    print(f"Loading model from: {model_path}")
    print(f"Loading encoder from: {encoder_path}")
    
    pipeline = joblib.load(model_path)
    encoder = joblib.load(encoder_path)
    
    # Load feature order for verification
    if os.path.exists(feature_order_path):
        saved_order = joblib.load(feature_order_path)
        print(f"Loaded feature order: {saved_order}")
    
    return pipeline, encoder


# ============================================================================
# PREDICTION FUNCTIONS
# ============================================================================

def create_feature_vector(traits_dict):
    """
    Create a feature vector from a trait dictionary.
    
    Args:
        traits_dict: Dictionary with trait names as keys and values (0-1 or 0-100)
    
    Returns:
        numpy array of shape (1, 10)
    """
    vector = np.zeros(10)
    
    for trait_name, value in traits_dict.items():
        if trait_name in TRAIT_MAPPING:
            index = TRAIT_MAPPING[trait_name]
            
            # Convert to float
            val = float(value)
            
            # Handle different input ranges
            # If value > 1, assume it's a percentage (0-100), divide by 100
            if val > 1:
                val = val / 100
            
            # Ensure valid range
            val = max(0.0, min(1.0, val))
            vector[index] = val
        else:
            print(f"Warning: Unknown trait '{trait_name}' - ignoring")
    
    return vector.reshape(1, -1)


def predict_career(pipeline, encoder, traits_dict):
    """
    Make career predictions based on trait vector.
    
    Args:
        pipeline: Trained sklearn pipeline (includes scaler + calibrated classifier)
        encoder: LabelEncoder for career labels
        traits_dict: Dictionary of trait values
    
    Returns:
        List of dictionaries with career and score for top predictions
    """
    # Create feature vector
    X = create_feature_vector(traits_dict)
    
    # Get predictions and probabilities
    # The pipeline handles scaling automatically!
    pred_class = pipeline.predict(X)[0]
    proba = pipeline.predict_proba(X)[0]
    
    # Get class labels
    class_labels = encoder.classes_
    
    # Sort by probability (descending)
    sorted_indices = np.argsort(proba)[::-1]
    
    # Create results
    results = []
    for idx in sorted_indices:
        results.append({
            "career": str(class_labels[idx]),
            "score": float(proba[idx] * 100)  # Convert to percentage
        })
    
    return results


def predict_top_n(pipeline, encoder, traits_dict, n=5):
    """
    Get top N career predictions.
    
    Args:
        pipeline: Trained sklearn pipeline
        encoder: LabelEncoder
        traits_dict: Trait dictionary
        n: Number of top predictions to return
    
    Returns:
        List of top N predictions
    """
    all_results = predict_career(pipeline, encoder, traits_dict)
    return all_results[:n]


def print_predictions(results, traits_dict=None):
    """Pretty print prediction results"""
    print("\n" + "=" * 60)
    print("CAREER PREDICTIONS")
    print("=" * 60)
    
    if traits_dict:
        print("\nInput Traits:")
        for trait, value in sorted(traits_dict.items()):
            bar = "█" * int(value * 20)
            print(f"  {trait:12s}: {value:.2f} {bar}")
    
    print("\nTop 5 Career Recommendations:")
    print("-" * 40)
    
    for i, result in enumerate(results[:5], 1):
        career = result["career"]
        score = result["score"]
        bar = "█" * int(score / 5)  # Scale bar to 20 chars
        print(f"  {i}. {career:25s} {score:5.2f}% {bar}")
    
    # Show probability distribution
    print("\nProbability Distribution (all careers):")
    print("-" * 40)
    
    # Group by probability range
    high_conf = [r for r in results if r["score"] >= 20]
    med_conf = [r for r in results if 5 <= r["score"] < 20]
    low_conf = [r for r in results if r["score"] < 5]
    
    if high_conf:
        print("  High confidence (>20%):")
        for r in high_conf:
            print(f"    - {r['career']}: {r['score']:.2f}%")
    
    if med_conf:
        print("  Medium confidence (5-20%):")
        for r in med_conf[:5]:  # Show top 5
            print(f"    - {r['career']}: {r['score']:.2f}%")
    
    if low_conf:
        print("  Low confidence (<5%):")
        print(f"    ... {len(low_conf)} more careers below 5%")


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_with_sample_profiles(pipeline, encoder):
    """Test the model with various sample trait profiles"""
    
    test_profiles = {
        "Technical Problem Solver": {
            "logic": 0.9,
            "technical": 0.85,
            "focus": 0.8,
            "discipline": 0.7,
            "creativity": 0.3,
            "social": 0.3,
            "empathy": 0.2,
            "leadership": 0.4,
            "adaptability": 0.5,
            "risk": 0.3
        },
        "Creative Designer": {
            "creativity": 0.95,
            "empathy": 0.8,
            "adaptability": 0.75,
            "social": 0.7,
            "technical": 0.4,
            "focus": 0.5,
            "discipline": 0.3,
            "leadership": 0.3,
            "logic": 0.4,
            "risk": 0.5
        },
        "People Person": {
            "social": 0.9,
            "empathy": 0.85,
            "leadership": 0.75,
            "communication": 0.8,
            "adaptability": 0.7,
            "creativity": 0.4,
            "technical": 0.2,
            "focus": 0.5,
            "discipline": 0.5,
            "risk": 0.3
        },
        "Business Leader": {
            "leadership": 0.9,
            "risk": 0.8,
            "social": 0.75,
            "discipline": 0.7,
            "adaptability": 0.65,
            "logic": 0.6,
            "focus": 0.6,
            "creativity": 0.4,
            "empathy": 0.5,
            "technical": 0.3
        },
        "Research Scientist": {
            "logic": 0.95,
            "focus": 0.9,
            "discipline": 0.85,
            "technical": 0.75,
            "creativity": 0.5,
            "adaptability": 0.5,
            "empathy": 0.3,
            "social": 0.2,
            "leadership": 0.3,
            "risk": 0.2
        }
    }
    
    print("\n" + "=" * 60)
    print("TESTING WITH SAMPLE PROFILES")
    print("=" * 60)
    
    for profile_name, traits in test_profiles.items():
        print(f"\n\n{'='*60}")
        print(f"Profile: {profile_name}")
        results = predict_top_n(pipeline, encoder, traits, n=5)
        print_predictions(results, traits)


def test_different_inputs(pipeline, encoder):
    """Test that different inputs produce different predictions"""
    
    print("\n" + "=" * 60)
    print("VERIFYING PREDICTION VARIETY")
    print("=" * 60)
    
    # Two very different profiles
    profile_a = {
        "logic": 0.9, "technical": 0.9, "focus": 0.8,
        "discipline": 0.7, "creativity": 0.2, "social": 0.2,
        "empathy": 0.2, "leadership": 0.3, "adaptability": 0.3, "risk": 0.2
    }
    
    profile_b = {
        "logic": 0.3, "technical": 0.2, "focus": 0.3,
        "discipline": 0.3, "creativity": 0.9, "social": 0.8,
        "empathy": 0.9, "leadership": 0.5, "adaptability": 0.8, "risk": 0.7
    }
    
    results_a = predict_top_n(pipeline, encoder, profile_a, n=3)
    results_b = predict_top_n(pipeline, encoder, profile_b, n=3)
    
    print("\nProfile A (Technical):")
    for r in results_a:
        print(f"  {r['career']}: {r['score']:.2f}%")
    
    print("\nProfile B (Creative/Social):")
    for r in results_b:
        print(f"  {r['career']}: {r['score']:.2f}%")
    
    # Check that top predictions are different
    if results_a[0]['career'] != results_b[0]['career']:
        print("\n✓ SUCCESS: Different inputs produce different top predictions!")
    else:
        print("\n⚠ WARNING: Both profiles got same top prediction")
        print("  This might indicate the model needs more training data or tuning")


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Main prediction interface"""
    print("=" * 60)
    print("CAREER RECOMMENDATION PREDICTOR")
    print("=" * 60)
    
    # Load model
    pipeline, encoder = load_model()
    
    print(f"\nAvailable careers: {list(encoder.classes_)}")
    
    # If command line arguments provided, use them
    if len(sys.argv) > 1:
        # Parse command line arguments as trait values
        # Format: python predict.py trait1=value1 trait2=value2 ...
        traits = {}
        for arg in sys.argv[1:]:
            if '=' in arg:
                key, value = arg.split('=', 1)
                try:
                    traits[key] = float(value)
                except ValueError:
                    print(f"Invalid value for {key}: {value}")
        
        if traits:
            results = predict_top_n(pipeline, encoder, traits, n=5)
            print_predictions(results, traits)
            return
    
    # Otherwise run tests
    print("\n" + "=" * 60)
    print("RUNNING TEST SCENARIOS")
    print("=" * 60)
    
    # Test that model produces varied predictions
    test_different_inputs(pipeline, encoder)
    
    # Test with sample profiles
    test_with_sample_profiles(pipeline, encoder)
    
    print("\n" + "=" * 60)
    print("USAGE INSTRUCTIONS")
    print("=" * 60)
    print("""
To use in your code:

    from predict import load_model, predict_top_n
    
    # Load model (do this once at startup)
    pipeline, encoder = load_model()
    
    # Make predictions
    traits = {
        "logic": 0.8,
        "creativity": 0.6,
        "technical": 0.7,
        ...
    }
    
    results = predict_top_n(pipeline, encoder, traits, n=5)
    
    for r in results:
        print(f"{r['career']}: {r['score']:.2f}%")

Or from command line:
    python predict.py logic=0.8 creativity=0.6 technical=0.7
""")


if __name__ == "__main__":
    main()
