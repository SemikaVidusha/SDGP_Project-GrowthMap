"""
Career Model Training Script
=============================
Trains a career recommendation model with:
- StandardScaler for feature scaling
- sklearn Pipeline (Scaler -> Model)
- RandomForest with CalibratedClassifierCV for probability calibration
- Comprehensive evaluation metrics

This produces production-quality predictions with well-calibrated probabilities.
"""

import json
import joblib
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, 
    classification_report, 
    confusion_matrix,
    top_k_accuracy_score
)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Feature order must match frontend questions.json exactly
# This is the canonical trait order used throughout the system
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

# ============================================================================
# DATA LOADING
# ============================================================================

def load_dataset(json_path):
    """Load and parse the dataset"""
    print("=" * 60)
    print("LOADING DATASET")
    print("=" * 60)
    
    with open(json_path, "r") as f:
        data = json.load(f)
    
    X = np.array([sample["features"] for sample in data])
    y = np.array([sample["label"] for sample in data])
    
    print(f"  Total samples: {len(X)}")
    print(f"  Number of features: {X.shape[1]}")
    print(f"  Number of classes: {len(np.unique(y))}")
    print(f"  Features: {FEATURE_ORDER}")
    
    return X, y


# ============================================================================
# MODEL TRAINING
# ============================================================================

def create_model_pipeline():
    """
    Create a sklearn Pipeline with:
    1. StandardScaler - for feature normalization
    2. RandomForest - base classifier
    3. CalibratedClassifierCV - for probability calibration
    
    Returns the pipeline ready for training.
    """
    # Base RandomForest classifier with optimized parameters
    base_classifier = RandomForestClassifier(
        n_estimators=300,
        max_depth=25,
        min_samples_split=3,
        min_samples_leaf=1,
        max_features='sqrt',
        bootstrap=True,
        class_weight='balanced',  # Handle any class imbalance
        random_state=42,
        n_jobs=-1
    )
    
    # Create pipeline with scaler and calibrated classifier
    # CalibratedClassifierCV wraps the base classifier to improve probability estimates
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', CalibratedClassifierCV(
            estimator=base_classifier,
            method='isotonic',  # Isotonic regression for calibration
            cv=5,               # 5-fold cross-validation for calibration
            n_jobs=-1
        ))
    ])
    
    return pipeline


def train_and_evaluate(X, y, encoder):
    """Train the model and perform comprehensive evaluation"""
    print("\n" + "=" * 60)
    print("TRAINING MODEL")
    print("=" * 60)
    
    # Train/test split with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42,
        stratify=y  # Maintain class distribution
    )
    
    print(f"\n  Training samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")
    
    # Create and train pipeline
    pipeline = create_model_pipeline()
    
    print("\n  Training RandomForest with calibration...")
    print("  (This may take a minute...)")
    
    pipeline.fit(X_train, y_train)
    
    # Save model IMMEDIATELY after training (before evaluation)
    # This ensures we have a saved model even if evaluation crashes
    print("\n  Saving model after training...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "career_model.pkl")
    encoder_path = os.path.join(script_dir, "career_encoder.pkl")
    feature_order_path = os.path.join(script_dir, "feature_order.pkl")
    
    joblib.dump(pipeline, model_path)
    joblib.dump(encoder, encoder_path)
    joblib.dump(FEATURE_ORDER, feature_order_path)
    print(f"  ✓ Model saved to: {model_path}")
    
    # =========================================================================
    # EVALUATION
    # =========================================================================
    print("\n" + "=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)
    
    # Predictions
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)
    
    # Accuracy metrics
    accuracy = accuracy_score(y_test, y_pred)
    top3_accuracy = top_k_accuracy_score(y_test, y_proba, k=3)
    top5_accuracy = top_k_accuracy_score(y_test, y_proba, k=5)
    
    print(f"\n  Accuracy Scores:")
    print(f"    - Top-1 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"    - Top-3 Accuracy: {top3_accuracy:.4f} ({top3_accuracy*100:.2f}%)")
    print(f"    - Top-5 Accuracy: {top5_accuracy:.4f} ({top5_accuracy*100:.2f}%)")
    
    # Cross-validation - skip if resources limited
    try:
        print("\n  Cross-Validation (5-fold):")
        cv_scores = cross_val_score(pipeline, X, y, cv=5, n_jobs=1)
        print(f"    - Mean CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
        print(f"    - Per-fold scores: {[f'{s:.4f}' for s in cv_scores]}")
    except Exception as e:
        print(f"  Cross-validation skipped: {e}")
    
    # Classification Report
    print("\n  Classification Report:")
    print("-" * 60)
    class_names = encoder.classes_
    report = classification_report(y_test, y_pred, target_names=class_names)
    print(report)
    
    # Per-class accuracy
    print("  Per-Class Accuracy:")
    for i, class_name in enumerate(class_names):
        mask = y_test == class_name
        if mask.sum() > 0:
            class_acc = (y_pred[mask] == y_test[mask]).mean()
            print(f"    - {class_name}: {class_acc:.4f}")
    
    # Feature importance - skip if error
    print("\n  Feature Importances (from RandomForest):")
    try:
        rf_classifier = pipeline.named_steps['classifier'].estimator
        importances = rf_classifier.feature_importances_
        for i, (trait, imp) in enumerate(sorted(zip(FEATURE_ORDER, importances), 
                                                key=lambda x: x[1], reverse=True)):
            bar = "█" * int(imp * 50)
            print(f"    - {trait:12s}: {imp:.4f} {bar}")
    except Exception as e:
        print(f"  Feature importance skipped: {e}")
    
    return pipeline, X_test, y_test, y_pred


# ============================================================================
# MODEL SAVING
# ============================================================================

def save_model(pipeline, encoder, output_dir):
    """Save the trained pipeline and label encoder"""
    print("\n" + "=" * 60)
    print("SAVING MODEL")
    print("=" * 60)
    
    # Save pipeline (includes scaler and calibrated classifier)
    model_path = os.path.join(output_dir, "career_model.pkl")
    joblib.dump(pipeline, model_path)
    print(f"  ✓ Model pipeline saved to: {model_path}")
    
    # Save label encoder
    encoder_path = os.path.join(output_dir, "career_encoder.pkl")
    joblib.dump(encoder, encoder_path)
    print(f"  ✓ Label encoder saved to: {encoder_path}")
    
    # Save feature order for consistency
    feature_order_path = os.path.join(output_dir, "feature_order.pkl")
    joblib.dump(FEATURE_ORDER, feature_order_path)
    print(f"  ✓ Feature order saved to: {feature_order_path}")
    
    return model_path, encoder_path


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main training pipeline"""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Paths
    dataset_path = os.path.join(script_dir, "synthetic_dataset.json")
    
    # Load dataset
    X, y = load_dataset(dataset_path)
    
    # Encode labels
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)
    
    print(f"\n  Classes ({len(encoder.classes_)}):")
    for i, cls in enumerate(encoder.classes_):
        print(f"    {i}: {cls}")
    
    # Train and evaluate
    pipeline, X_test, y_test, y_pred = train_and_evaluate(X, y_encoded, encoder)
    
    # Save model
    model_path, encoder_path = save_model(pipeline, encoder, script_dir)
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print("=" * 60)
    print(f"\nTo make predictions, use:")
    print(f"  import joblib")
    print(f"  pipeline = joblib.load('{model_path}')")
    print(f"  encoder = joblib.load('{encoder_path}')")
    print(f"  predictions = pipeline.predict_proba(feature_vector)")


if __name__ == "__main__":
    main()
