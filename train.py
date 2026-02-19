import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
import joblib

df = pd.read_csv("./data/Dataset.csv")

df = df.drop("customerID", axis=1)

df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors='coerce')

df.dropna(inplace=True)


df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})


X = df.drop("Churn", axis=1)
y = df["Churn"]

categorical_col = X.select_dtypes(include=["object"]).columns
numerical_col = X.select_dtypes(include=["int64", "float64"]).columns


preprocessor = ColumnTransformer(
    transformers = [
        ("num", StandardScaler(), numerical_col),
        ("cat", OneHotEncoder(drop="first"), categorical_col)
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

log_model = Pipeline(              # XGBoost
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=4,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric="logloss"
        ))
    ]
)

log_model.fit(X_train, y_train)

y_prob_train = log_model.predict_proba(X_train)[:, 1]
y_prob = log_model.predict_proba(X_test)[:, 1]

y_pred_custom = (y_prob > 0.4).astype(int)
y_pred_custom_train = (y_prob_train > 0.4).astype(int)

print("Accuracy(train) :- ", accuracy_score(y_train, y_pred_custom_train))
print("Accuracy(test) :- ", accuracy_score(y_test, y_pred_custom))

print("cl :- ",classification_report(y_test, y_pred_custom))

joblib.dump(log_model, "model/churn_model.pkl")
print("Model saved successfully!")