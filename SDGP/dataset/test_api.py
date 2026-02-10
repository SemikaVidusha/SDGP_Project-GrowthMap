import requests

url = "http://127.0.0.1:5000/predict"
payload = {
  "traits": {
    "logic": 0.85,
    "creativity": 0.3,
    "leadership": 0.2,
    "empathy": 0.1,
    "discipline": 0.6,
    "social": 0.2,
    "technical": 0.8,
    "risk": 0.1,
    "focus": 0.7,
    "adaptability": 0.5
  }
}

r = requests.post(url, json=payload)
print("status:", r.status_code)
print(r.json())
