import os
import json
import time
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from xgboost import XGBClassifier

# Create output folders
MODELS_DIR = Path("models")
PROCESSED_DIR = Path("data/processed")
MODELS_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

leaderboard_records = []


def record_metrics(module, model_name, y_true, y_pred, y_prob, latency_ms, threshold=0.5, version="v1.0.0"):
    is_binary = len(np.unique(y_true)) == 2
    rec = {
        "module": module,
        "model_name": model_name,
        "split_version": "train_test_split_80_20_stratified",
        "precision": float(round(precision_score(y_true, y_pred, average="binary" if is_binary else "macro", zero_division=0), 4)),
        "recall": float(round(recall_score(y_true, y_pred, average="binary" if is_binary else "macro", zero_division=0), 4)),
        "f1": float(round(f1_score(y_true, y_pred, average="binary" if is_binary else "macro", zero_division=0), 4)),
        "roc_auc": float(round(roc_auc_score(y_true, y_prob) if (is_binary and y_prob is not None) else 0.0, 4)),
        "pr_auc": float(round(average_precision_score(y_true, y_prob) if (is_binary and y_prob is not None) else 0.0, 4)),
        "inference_latency_ms": float(round(latency_ms, 2)),
        "threshold": threshold,
        "model_version": version,
        "evaluation_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
    leaderboard_records.append(rec)
    print(f"[{module}] {model_name} -> F1: {rec['f1']}, ROC-AUC: {rec['roc_auc']}, PR-AUC: {rec['pr_auc']}, Latency: {rec['inference_latency_ms']}ms")
    return rec


# ==============================================================================
# 1. CREDIT RISK PREDICTION
# ==============================================================================
def train_credit_risk():
    print("\n" + "="*50)
    print(">>> 1. Training Credit Risk Models")
    print("="*50)
    df = pd.read_csv("data/raw/credit_risk_dataset.csv")
    
    # Save processed copy
    df.to_csv("data/processed/credit_risk_processed.csv", index=False)
    
    target = "loan_status"
    X = df.drop(columns=[target])
    y = df[target]
    
    numeric_features = ["person_age", "person_income", "person_emp_length", "loan_amnt", "loan_int_rate", "loan_percent_income", "cb_person_cred_hist_length"]
    categorical_features = ["person_home_ownership", "loan_intent", "loan_grade", "cb_person_default_on_file"]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric_features),
            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
            ]), categorical_features)
        ]
    )
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, class_weight="balanced", n_jobs=-1),
        "XGBoost": XGBClassifier(n_estimators=150, max_depth=5, learning_rate=0.08, eval_metric="logloss", random_state=42),
        "ANN (Deep MLP)": MLPClassifier(hidden_layer_sizes=(128, 64), activation="relu", max_iter=40, random_state=42, early_stopping=True)
    }
    
    best_model_name = None
    best_f1 = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training Credit Risk: {name}...")
        model.fit(X_train_proc, y_train)
        
        t0 = time.time()
        preds = model.predict(X_test_proc)
        latency = ((time.time() - t0) / len(X_test)) * 1000
        
        probs = model.predict_proba(X_test_proc)[:, 1] if hasattr(model, "predict_proba") else None
        f1 = f1_score(y_test, preds)
        record_metrics("credit_risk", name, y_test, preds, probs, latency)
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model

    print(f"Selected Best Credit Risk Model: {best_model_name} (F1: {best_f1:.4f})")
    joblib.dump(preprocessor, MODELS_DIR / "credit_risk_preprocessor.joblib")
    joblib.dump(best_model, MODELS_DIR / "credit_risk_model.joblib")
    print("Saved credit_risk_preprocessor.joblib and credit_risk_model.joblib")


# ==============================================================================
# 2. FRAUD DETECTION
# ==============================================================================
def train_fraud():
    print("\n" + "="*50)
    print(">>> 2. Training Fraud Detection Models")
    print("="*50)
    # Read transactions
    df = pd.read_csv("data/raw/creditcard.csv")
    
    # Save a small sample for fast dashboard demo queries if needed
    df.head(2000).to_csv("data/processed/fraud_sample_processed.csv", index=False)
    
    target = "Class"
    X = df.drop(columns=[target, "Time"])  # Drop time to avoid temporal overfitting
    y = df[target]
    
    # Stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # For training speed on 285k rows and extreme class imbalance:
    models = {
        "Logistic Regression": LogisticRegression(max_iter=500, class_weight="balanced", random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=60, max_depth=10, random_state=42, class_weight="balanced", n_jobs=-1),
        "XGBoost": XGBClassifier(n_estimators=100, max_depth=6, scale_pos_weight=150, learning_rate=0.1, eval_metric="logloss", random_state=42),
        "ANN (Deep MLP)": MLPClassifier(hidden_layer_sizes=(64, 32), activation="relu", max_iter=25, random_state=42, early_stopping=True)
    }
    
    best_model_name = None
    best_pr_auc = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training Fraud: {name}...")
        model.fit(X_train_scaled, y_train)
        
        t0 = time.time()
        preds = model.predict(X_test_scaled)
        latency = ((time.time() - t0) / len(X_test)) * 1000
        
        probs = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, "predict_proba") else None
        rec = record_metrics("fraud", name, y_test, preds, probs, latency)
        
        # In fraud, PR-AUC and F1 are paramount due to class imbalance
        score = rec["pr_auc"]
        if score > best_pr_auc:
            best_pr_auc = score
            best_model_name = name
            best_model = model

    print(f"Selected Best Fraud Model: {best_model_name} (PR-AUC: {best_pr_auc:.4f})")
    joblib.dump(scaler, MODELS_DIR / "fraud_scaler.joblib")
    joblib.dump(best_model, MODELS_DIR / "fraud_model.joblib")
    # Also save feature names
    joblib.dump(list(X.columns), MODELS_DIR / "fraud_features.joblib")
    print("Saved fraud_scaler.joblib, fraud_features.joblib, and fraud_model.joblib")


# ==============================================================================
# 3. CUSTOMER CHURN PREDICTION
# ==============================================================================
def train_churn():
    print("\n" + "="*50)
    print(">>> 3. Training Customer Churn Models")
    print("="*50)
    df = pd.read_csv("data/raw/churn.csv")
    
    # Target leakage & identifiers removal
    # Drop RowNumber, CustomerId, Surname
    leakage_cols = ["RowNumber", "CustomerId", "Surname"]
    X = df.drop(columns=[col for col in leakage_cols if col in df.columns] + ["Exited"])
    y = df["Exited"]
    
    df.to_csv("data/processed/churn_processed.csv", index=False)
    
    numeric_features = ["CreditScore", "Age", "Tenure", "Balance", "NumOfProducts", "EstimatedSalary"]
    categorical_features = ["Geography", "Gender", "HasCrCard", "IsActiveMember"]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric_features),
            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
            ]), categorical_features)
        ]
    )
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=7),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight="balanced", n_jobs=-1),
        "XGBoost": XGBClassifier(n_estimators=120, max_depth=5, learning_rate=0.08, eval_metric="logloss", random_state=42),
        "ANN (Deep MLP)": MLPClassifier(hidden_layer_sizes=(128, 64), activation="relu", max_iter=40, random_state=42, early_stopping=True)
    }
    
    best_model_name = None
    best_f1 = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training Churn: {name}...")
        model.fit(X_train_proc, y_train)
        
        t0 = time.time()
        preds = model.predict(X_test_proc)
        latency = ((time.time() - t0) / len(X_test)) * 1000
        
        probs = model.predict_proba(X_test_proc)[:, 1] if hasattr(model, "predict_proba") else None
        rec = record_metrics("churn", name, y_test, preds, probs, latency)
        
        if rec["f1"] > best_f1:
            best_f1 = rec["f1"]
            best_model_name = name
            best_model = model

    print(f"Selected Best Churn Model: {best_model_name} (F1: {best_f1:.4f})")
    joblib.dump(preprocessor, MODELS_DIR / "churn_preprocessor.joblib")
    joblib.dump(best_model, MODELS_DIR / "churn_model.joblib")
    print("Saved churn_preprocessor.joblib and churn_model.joblib")


# ==============================================================================
# 4. CUSTOMER COMPLAINT INTELLIGENCE
# ==============================================================================
def train_complaints():
    print("\n" + "="*50)
    print(">>> 4. Training Customer Complaint Intelligence Models")
    print("="*50)
    df = pd.read_csv("data/raw/complaints.csv", nrows=30000)
    
    # Formulate defensible ground-truth labels based on issue and resolution
    # Construct combined text
    text_series = (
        df["Issue"].fillna("General") + " " +
        df["Sub-issue"].fillna("") + " " +
        df["Product"].fillna("")
    ).str.strip()
    
    # Defensible Sentiment labeling:
    # High distress keywords / monetary disputes / untimely -> Negative / Escalated
    urgent_keywords = ["fraud", "unauthorized", "threatened", "harass", "identity theft", "stolen", "scam", "wrongful"]
    relief_keywords = ["monetary relief", "refund", "reimburse", "settled"]
    
    def derive_sentiment_and_priority(row):
        txt = str(row["Issue"]).lower() + " " + str(row["Sub-issue"]).lower() + " " + str(row["Company response to consumer"]).lower()
        if any(w in txt for w in urgent_keywords):
            return "Escalated", "Critical"
        elif "monetary relief" in txt or "explanation" in txt:
            return "Negative", "Medium"
        elif "non-monetary relief" in txt:
            return "Neutral", "Low"
        return "Negative", "Medium"

    labels_data = [derive_sentiment_and_priority(r) for _, r in df.iterrows()]
    df["sentiment"] = [l[0] for l in labels_data]
    df["priority"] = [l[1] for l in labels_data]
    df["text"] = text_series
    
    df.head(5000).to_csv("data/processed/complaints_processed.csv", index=False)
    
    # We will train 2 models:
    # Model A: Categorization (Product category prediction from complaint text)
    # Model B: Sentiment & Priority prediction
    top_categories = df["Product"].value_counts().head(6).index.tolist()
    filtered_df = df[df["Product"].isin(top_categories)].copy()
    
    X_text = filtered_df["text"]
    y_cat = filtered_df["Product"]
    y_sent = filtered_df["sentiment"]
    
    vectorizer = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1, 2))
    X_vec = vectorizer.fit_transform(X_text)
    
    # Train Category Classifier
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y_cat, test_size=0.20, random_state=42, stratify=y_cat
    )
    
    models = {
        "TF-IDF + Logistic Regression": LogisticRegression(max_iter=500),
        "TF-IDF + Linear SVM": LinearSVC(max_iter=1000, random_state=42),
        "Deep Text MLP (ANN)": MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=30, random_state=42, early_stopping=True)
    }
    
    best_model_name = None
    best_acc = -1
    best_model = None
    
    for name, model in models.items():
        print(f"Training Complaint Classifier: {name}...")
        model.fit(X_train, y_train)
        
        t0 = time.time()
        preds = model.predict(X_test)
        latency = ((time.time() - t0) / X_test.shape[0]) * 1000
        
        acc = accuracy_score(y_test, preds)
        rec = record_metrics("complaint", name, y_test, preds, None, latency)
        
        if acc > best_acc:
            best_acc = acc
            best_model_name = name
            best_model = model

    print(f"Selected Best Complaint Model: {best_model_name} (Accuracy: {best_acc:.4f})")
    
    # Train a fast sentiment classifier on top of the same vectorizer
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(
        X_vec, y_sent, test_size=0.20, random_state=42, stratify=y_sent
    )
    sentiment_model = LogisticRegression(max_iter=500, class_weight="balanced")
    sentiment_model.fit(X_train_s, y_train_s)
    
    joblib.dump(vectorizer, MODELS_DIR / "complaint_vectorizer.joblib")
    joblib.dump(best_model, MODELS_DIR / "complaint_model.joblib")
    joblib.dump(sentiment_model, MODELS_DIR / "complaint_sentiment_model.joblib")
    joblib.dump(list(best_model.classes_), MODELS_DIR / "complaint_categories.joblib")
    print("Saved complaint_vectorizer.joblib, complaint_model.joblib, and complaint_sentiment_model.joblib")


# ==============================================================================
# MAIN EXECUTION & MANIFEST GENERATION
# ==============================================================================
def main():
    print("Starting ML / Deep Learning Pipeline for Banking Platform...")
    train_credit_risk()
    train_fraud()
    train_churn()
    train_complaints()
    
    # Save Model Leaderboard CSV (Section 7.3)
    lb_df = pd.DataFrame(leaderboard_records)
    lb_path = MODELS_DIR / "model_leaderboard.csv"
    lb_df.to_csv(lb_path, index=False)
    print(f"\nSuccessfully generated and saved Model Leaderboard: {lb_path}")
    print(lb_df.to_string())
    
    # Create model manifest (Section 10)
    manifest = {
        "platform": "Banking & Financial Intelligence Platform",
        "timestamp": datetime.utcnow().isoformat(),
        "modules": {
            "credit_risk": {
                "model_artifact": "credit_risk_model.joblib",
                "preprocessor_artifact": "credit_risk_preprocessor.joblib",
                "target": "loan_status",
                "classes": [0, 1]
            },
            "fraud": {
                "model_artifact": "fraud_model.joblib",
                "preprocessor_artifact": "fraud_scaler.joblib",
                "target": "Class",
                "classes": [0, 1]
            },
            "churn": {
                "model_artifact": "churn_model.joblib",
                "preprocessor_artifact": "churn_preprocessor.joblib",
                "target": "Exited",
                "classes": [0, 1]
            },
            "complaint": {
                "model_artifact": "complaint_model.joblib",
                "sentiment_artifact": "complaint_sentiment_model.joblib",
                "preprocessor_artifact": "complaint_vectorizer.joblib",
                "target": "Product & Sentiment"
            }
        }
    }
    with open(MODELS_DIR / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    print("Successfully generated models/manifest.json")


if __name__ == "__main__":
    main()
