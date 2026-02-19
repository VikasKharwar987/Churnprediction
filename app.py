from flask import Flask, render_template, request
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

model = joblib.load("model/churn_model.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    input_data = request.form.to_dict()
    input_df = pd.DataFrame([input_data])
    numeric_cols = ["SeniorCitizen", "tenure", "MonthlyCharges", "TotalCharges"]

    for col in numeric_cols:
        input_df[col] = pd.to_numeric(input_df[col])

    prob = model.predict_proba(input_df)[:, 1][0]

    prediction = 1 if prob > 0.4 else 0

    result = "Customer Will Churn " if prediction == 1 else "Customer Will Stay "

    return render_template("index.html", prediction_text=result, probability=round(prob, 3))


if __name__ == "__main__":
    app.run(debug=True)
