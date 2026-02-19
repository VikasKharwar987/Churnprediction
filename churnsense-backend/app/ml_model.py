import joblib
import pandas as pd

# Load model once at startup
model = joblib.load("model/churn_model.pkl")


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
