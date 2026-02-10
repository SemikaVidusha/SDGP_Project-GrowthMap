import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

with open("dataset/synthetic_dataset.json", "r") as f:
    data = json.load(f)

X = np.array([item["features"] for item in data])
y = np.array([item["label"] for item in data])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%\n")
print("Classification Report:\n")
print(classification_report(y_test, predictions))

joblib.dump(model, "dataset/career_model.pkl")

print("\nModel saved as career_model.pkl")
