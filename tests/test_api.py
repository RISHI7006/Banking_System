import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["models_ready"] is True


def test_credit_risk():
    payload = {
        "person_age": 28,
        "person_income": 75000,
        "person_home_ownership": "RENT",
        "person_emp_length": 5.0,
        "loan_intent": "EDUCATION",
        "loan_grade": "B",
        "loan_amnt": 12000,
        "loan_int_rate": 10.5,
        "loan_percent_income": 0.16,
        "cb_person_default_on_file": "N",
        "cb_person_cred_hist_length": 6
    }
    res = client.post("/api/predict/credit-risk", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "default_probability" in data
    assert "risk_tier" in data
    assert "recommendation" in data


def test_fraud_prediction():
    payload = {
        "Amount": 250.0,
        "V1": -1.2,
        "V2": 0.8,
        "V3": -0.5
    }
    res = client.post("/api/predict/fraud", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "fraud_probability" in data
    assert "anomaly_level" in data


def test_churn_prediction():
    payload = {
        "CreditScore": 650,
        "Geography": "Germany",
        "Gender": "Female",
        "Age": 48,
        "Tenure": 3,
        "Balance": 110000.0,
        "NumOfProducts": 1,
        "HasCrCard": 1,
        "IsActiveMember": 0,
        "EstimatedSalary": 75000.0
    }
    res = client.post("/api/predict/churn", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "churn_probability" in data
    assert "risk_tier" in data


def test_complaint_intelligence():
    payload = {
        "complaint_text": "Unauthorized credit card dispute regarding unexpected foreign transaction fees."
    }
    res = client.post("/api/predict/complaint", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "category" in data
    assert "priority" in data
    assert "sla_hours" in data


def test_agent_chat_and_rag():
    payload = {
        "message": "What is the policy for adverse action notices in credit risk?"
    }
    res = client.post("/api/agent/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["citations"]) > 0


def test_dashboard_and_metrics():
    res_dash = client.get("/api/dashboard/summary")
    assert res_dash.status_code == 200
    assert "kpis" in res_dash.json()

    res_met = client.get("/api/models/metrics")
    assert res_met.status_code == 200
    assert res_met.json()["total_models"] > 0


def test_fraud_batch_csv():
    with open('data/sample_fraud_batch.csv', 'rb') as f:
        res = client.post('/api/predict/fraud/batch-csv', files={'file': ('sample.csv', f, 'text/csv')})
    assert res.status_code == 200
    data = res.json()
    assert data["total_records_processed"] == 150
    assert data["high_risk_flagged"] >= 15
    assert len(data["suspicious_transactions"]) > 0
    assert len(data["hourly_data"]) == 6
    assert len(data["attack_vectors"]) == 4
