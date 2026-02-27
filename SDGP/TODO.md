# Analysis: Backend Prediction Response → Frontend UI Display

## Issues Found

### 1. CRITICAL: Backend Route Mismatch
- **backend/app.py** exposes: `/predict` (direct route)
- **backend/test_app.py** exposes: `/api/ml/predict` (blueprint with prefix)
- **Frontend Quiz.jsx** calls: `http://127.0.0.1:5000/api/ml/predict`

The frontend is calling `/api/ml/predict` which only exists in **test_app.py**.

### 2. CRITICAL: Feature Order Mismatch
Training (train_model.py - SOURCE OF TRUTH):
```
logic, creativity, technical, empathy, leadership, social, discipline, adaptability, focus, risk
```

test_app.py prediction:
```
logic, creativity, leadership, empathy, discipline, social, technical, risk, focus, adaptability
```

The **test_app.py** has WRONG feature order! This causes incorrect predictions.

### 3. Input Normalization Issue
- **test_app.py**: Divides input by 100 (expects 0-100, converts to 0-1)
- **app.py**: Uses raw values directly (expects 0-1)
- **Quiz.jsx**: Normalizes to 0-1 range

Quiz.jsx normalizes to 0-1, so test_app.py dividing by 100 produces incorrect (too small) values.

### 4. Score Format Issue
- **app.py**: Returns score as percentage (0-100): `probs[i] * 100`
- **test_app.py**: Returns score as probability (0-1): raw `p`

The UI expects percentage (0-100). Results.jsx uses `Math.round(tc.score)`.

---

## Fix Plan

### Fix 1: Update test_app.py Feature Order
Change FEATURE_ORDER in test_app.py to match train_model.py:
```
python
FEATURE_ORDER = [
    "logic", "creativity", "technical", "empathy",
    "leadership", "social", "discipline", "adaptability",
    "focus", "risk"
]
```

### Fix 2: Remove Incorrect Normalization in test_app.py
The input is already normalized (0-1) from Quiz.jsx, so remove `/ 100`:
```
python
# Change from:
X = [[traits.get(t, 0) / 100 for t in FEATURE_ORDER]]
# To:
X = [[traits.get(t, 0) for t in FEATURE_ORDER]]
```

### Fix 3: Convert Score to Percentage in test_app.py
Match app.py behavior for consistent frontend parsing:
```
python
# Change from:
{"career": c, "score": float(round(p, 4))}
# To:
{"career": c, "score": float(p * 100)}
```

---

## Status

- [ ] Fix test_app.py feature order
- [ ] Fix test_app.py input normalization  
- [ ] Fix test_app.py score format (percentage)
- [ ] Verify backend is running test_app.py
- [ ] Test end-to-end prediction flow
