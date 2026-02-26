import json
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load dataset
with open("dataset/synthetic_dataset.json", "r") as f:
    data = json.load(f)

X = []
y = []

# Feature order must match frontend trait order (from questions.json)
# Frontend traits: logic, creativity, technical, empathy, leadership, social, discipline, adaptability, focus, risk
# These correspond to the order used in dataset_generator.py
FEATURE_ORDER = [
    "logic",          # 0
    "creativity",     # 1
    "leadership",     # 2
    "empathy",        # 3
    "discipline",     # 4
    "social",         # 5
    "technical",      # 6
    "risk",           # 7
    "focus",          # 8
    "adaptability"    # 9
]

# Build training data
for sample in data:
    # Use "features" (array) and "label" as per the dataset structure
    X.append(sample["features"])
    y.append(sample["label"])

X = np.array(X)
y = np.array(y)

# Encode career labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Train model with optimized parameters
model = RandomForestClassifier(
    n_estimators=500,
    max_depth=20,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features='sqrt',
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
train_accuracy = model.score(X_train, y_train)
test_accuracy = model.score(X_test, y_test)

print(f"Dataset size: {len(X)} samples")
print(f"Number of features: {X.shape[1]}")
print(f"Classes: {np.unique(y)}")
print(f"Training Accuracy: {train_accuracy:.4f}")
print(f"Test Accuracy: {test_accuracy:.4f}")

# Feature importance
print("\nFeature Importances:")
for i, importance in enumerate(model.feature_importances_):
    print(f"  {FEATURE_ORDER[i]}: {importance:.4f}")

# Save model + encoder in dataset folder
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "career_model.pkl")
encoder_path = os.path.join(script_dir, "career_encoder.pkl")

joblib.dump(model, model_path)
joblib.dump(encoder, encoder_path)

print(f"\nModel saved to: {model_path}")
print(f"Encoder saved to: {encoder_path}")
print("\nModel trained and saved successfully!")
