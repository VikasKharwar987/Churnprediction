import os
import joblib
import pandas as pd
import gdown

MODEL_PATH = "model/churn_model.pkl"
DRIVE_URL = "https://drive.google.com/uc?id=1ky7CkzE0a0eRF-t0Wb4ST8wmFjQRY79V"

# Create model folder if not exists
os.makedirs("model", exist_ok=True)

# Download model if not already present
if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    gdown.download(DRIVE_URL, MODEL_PATH, quiet=False)
    print("Model downloaded successfully!")

# Load model
model = joblib.load(MODEL_PATH)


def predict_churn(customer_dict):
    input_df = pd.DataFrame([customer_dict])

    prob = model.predict_proba(input_df)[:, 1][0]

    if prob >= 0.6:
        risk = "High"
    elif prob >= 0.4:
        risk = "Medium"
    else:
        risk = "Low"

    return prob, risk
