import joblib
import numpy as np

model = joblib.load("dataset/career_model.pkl")

def predict_career(traits):
    """
    traits = [collaboration, creativity, logic, systems, detail]
    """
    X = np.array([traits])
    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]

    return prediction, probabilities

if __name__ == "__main__":
    test_traits = [0.3, 0.8, 0.4, 0.5, 0.6]
    career, probs = predict_career(test_traits)

    print("Predicted Career:", career)
    print("Confidence Vector:", probs)
