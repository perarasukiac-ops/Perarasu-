import { PythonFile } from './types';

export const PYTHON_PROJECT_FILES: PythonFile[] = [
  {
    name: 'README.md',
    language: 'markdown',
    content: `# Phishing Detection System Using Python

## Overview
This project is a Machine Learning-based Phishing URL Detection System. It extracts features from URLs (like length, special characters, token presence) and uses a Random Forest Classifier to predict if a URL is legitimate or phishing.

## Structure
- \`dataset.csv\`: Contains legitimate and phishing URLs.
- \`feature_extraction.py\`: Logic to convert URL strings into numerical feature vectors.
- \`train_model.py\`: Trains the ML model and saves it.
- \`app.py\`: A simple CLI or Flask app to use the model.

## Installation
\`\`\`bash
pip install pandas scikit-learn numpy tldextract
\`\`\`

## Usage
1. Train the model: \`python train_model.py\`
2. Run prediction: \`python app.py\`
`
  },
  {
    name: 'feature_extraction.py',
    language: 'python',
    content: `import re
from urllib.parse import urlparse
import tldextract

def get_url_length(url):
    return len(url)

def has_ip_address(url):
    # Regex to check for IP address in URL
    match = re.search(
        r'(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\/)|'  # IPv4
        r'((0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\/)'  # Hexadecimal
        r'(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}', url)  # IPv6
    return 1 if match else 0

def has_at_symbol(url):
    return 1 if "@" in url else 0

def get_domain_length(url):
    domain = tldextract.extract(url).domain
    return len(domain)

def count_subdomains(url):
    subdomain = tldextract.extract(url).subdomain
    if subdomain:
        return len(subdomain.split('.'))
    return 0

def extract_features(url):
    """
    Extracts numerical features from a URL string.
    Returns a list: [url_length, has_ip, has_at, domain_len, subdomains]
    """
    features = [
        get_url_length(url),
        has_ip_address(url),
        has_at_symbol(url),
        get_domain_length(url),
        count_subdomains(url)
    ]
    return features
`
  },
  {
    name: 'train_model.py',
    language: 'python',
    content: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
from feature_extraction import extract_features

# 1. Load Dataset
# Assuming dataset.csv has 'url' and 'label' (0 for legit, 1 for phishing)
print("Loading dataset...")
# df = pd.read_csv('dataset.csv') 
# For demo, creating dummy data
data = {
    'url': ['http://google.com', 'http://secure-login-bank.com', 'https://youtube.com', 'http://192.168.1.1/login'],
    'label': [0, 1, 0, 1] 
}
df = pd.DataFrame(data)

# 2. Feature Extraction
print("Extracting features...")
X = []
for url in df['url']:
    X.append(extract_features(url))
y = df['label']

# 3. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train Model
print("Training Random Forest Classifier...")
rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
rf.fit(X_train, y_train)

# 5. Evaluate
y_pred = rf.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print(classification_report(y_test, y_pred))

# 6. Save Model
with open('phishing_model.pkl', 'wb') as f:
    pickle.dump(rf, f)
print("Model saved to phishing_model.pkl")
`
  },
  {
    name: 'app.py',
    language: 'python',
    content: `import pickle
from feature_extraction import extract_features
import sys

def load_model():
    try:
        with open('phishing_model.pkl', 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("Model file not found. Please run train_model.py first.")
        return None

def predict_url(url, model):
    features = extract_features(url)
    # Reshape for single sample prediction
    prediction = model.predict([features])[0]
    probability = model.predict_proba([features])[0][1]
    
    return prediction, probability

if __name__ == "__main__":
    model = load_model()
    
    if model:
        print("--- Phishing Detection System ---")
        while True:
            url = input("\nEnter URL to scan (or 'q' to quit): ")
            if url.lower() == 'q':
                break
            
            is_phishing, confidence = predict_url(url, model)
            
            if is_phishing == 1:
                print(f"⚠️  PHISHING DETECTED! (Confidence: {confidence*100:.2f}%)")
            else:
                print(f"✅  Legitimate URL. (Safety Score: {(1-confidence)*100:.2f}%)")
`
  },
  {
    name: 'requirements.txt',
    language: 'text',
    content: `pandas==2.0.0
numpy==1.24.0
scikit-learn==1.2.0
tldextract==3.4.0`
  }
];
