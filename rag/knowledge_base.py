import json
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Knowledge Documents
BANKING_DOCUMENTS = [
    {
        "id": "DOC-REG-001",
        "title": "Fair Credit Reporting Act (FCRA) & Adverse Action Notice Guidelines",
        "category": "Regulatory & Compliance",
        "source": "CFPB 12 CFR Part 1002 / Regulation B",
        "content": (
            "Under the Equal Credit Opportunity Act (ECOA) and Regulation B, creditors must provide an Adverse Action Notice "
            "whenever credit is denied or unfavorable terms are granted. The notice must specify the principal reasons for denial, "
            "such as high debt-to-income ratio, insufficient credit history length, or delinquent credit file records. "
            "Automated credit risk models must not utilize prohibited demographic features (race, religion, gender, marital status) "
            "and must provide defensible model explainability (e.g., feature attribution or SHAP scores) supporting the decision."
        )
    },
    {
        "id": "DOC-REG-002",
        "title": "Anti-Money Laundering (AML) & Suspicious Activity Monitoring",
        "category": "Fraud & Security",
        "source": "FinCEN Bank Secrecy Act (BSA) Guidelines",
        "content": (
            "Financial institutions are mandated to monitor transactions for suspicious activities and file Suspicious Activity Reports (SARs). "
            "In transaction fraud detection, extreme class imbalance exists (< 0.2% fraud rates). High-velocity transfers, anomalous amounts, "
            "and rapid geo-displacement require automated rule engines combined with ML classification. For high fraud probability (> 0.80), "
            "the system triggers an immediate freeze and escalates to Level 2 fraud analysts with a 15-minute response SLA."
        )
    },
    {
        "id": "DOC-REG-003",
        "title": "Consumer Financial Protection Bureau (CFPB) Complaint Handling SOP",
        "category": "Customer Operations",
        "source": "CFPB Consumer Response Annual Guidelines",
        "content": (
            "CFPB regulations mandate that regulated financial institutions must provide a timely response to consumer complaints within 15 calendar days. "
            "Complaints categorized as 'Escalated' or 'Critical'—involving unauthorized debiting, identity theft, or predatory debt collection—"
            "must be routed to senior remediation officers with a 24-hour initial contact window. Standard complaints are tracked for resolution "
            "with monetary or non-monetary explanation."
        )
    },
    {
        "id": "DOC-REG-004",
        "title": "Customer Attrition Management & Retention Strategy",
        "category": "Retail Banking Strategy",
        "source": "Global Retail Banking Retention Playbook",
        "content": (
            "Customer churn is predominantly driven by poor digital engagement, uncompetitive savings rates, inactivity across products, "
            "and unaddressed service friction. Predictive churn models score attrition probabilities. Customers in the top 20% risk decile "
            "(churn probability > 0.65) with high balances (> $50,000) are assigned high-touch relationship managers and targeted rate incentives."
        )
    },
    {
        "id": "DOC-CARD-001",
        "title": "Credit Risk Model Card (XGBoost v1.0.0)",
        "category": "Model Governance",
        "source": "Banking Intelligence Model Governance Committee",
        "content": (
            "Credit Risk Scoring Model v1.0.0 is an XGBoost ensemble trained on 32,581 verified loan applications. "
            "Key features: person_age, person_income, loan_amnt, loan_int_rate, loan_percent_income, loan_grade, cb_person_default_on_file. "
            "Performance: ROC-AUC: 0.9443, PR-AUC: 0.8968, Test F1: 0.8222. The model serves as human decision support and does not make "
            "autonomous credit denials without underwriter sign-off."
        )
    },
    {
        "id": "DOC-CARD-002",
        "title": "Fraud Detection Model Card (XGBoost + Anomaly Detection v1.0.0)",
        "category": "Model Governance",
        "source": "Banking Intelligence Model Governance Committee",
        "content": (
            "Fraud Transaction Detection Model v1.0.0 operates on 284,807 transactions with PCA transformed features V1-V28 and transaction Amount. "
            "Performance: ROC-AUC: 0.9754, PR-AUC: 0.8650, F1: 0.8265. Thresholding: transactions scoring >= 0.70 are flagged for manual analyst review; "
            ">= 0.90 trigger instantaneous authorization hold."
        )
    },
    {
        "id": "DOC-CARD-003",
        "title": "Customer Churn Prediction Model Card (Random Forest Ensemble v1.0.0)",
        "category": "Model Governance",
        "source": "Banking Intelligence Model Governance Committee",
        "content": (
            "Customer Churn Model v1.0.0 evaluates retail account holders across Germany, France, and Spain. Features include CreditScore, "
            "Age, Tenure, Balance, NumOfProducts, HasCrCard, and IsActiveMember. Performance: ROC-AUC: 0.8574, PR-AUC: 0.6800, F1: 0.6124. "
            "Primary churn predictors identified: Customer Age (40-60 cohort highest attrition) and NumOfProducts (single-product or 3+ products show elevated attrition)."
        )
    },
    {
        "id": "DOC-CARD-004",
        "title": "Customer Complaint Intelligence Classifier Model Card (TF-IDF + Linear SVM v1.0.0)",
        "category": "Model Governance",
        "source": "Banking Intelligence Model Governance Committee",
        "content": (
            "Complaint Intelligence Model v1.0.0 analyzes CFPB consumer complaint narratives and issue descriptions using TF-IDF n-grams "
            "and Linear Support Vector Classification. Accuracy: 99.9% on standard product classification. Sentiment & Priority engine routes "
            "disputes into Critical, High, and Medium triage tiers."
        )
    }
]


class BankingRAGRetriever:
    def __init__(self, documents=None):
        self.documents = documents or BANKING_DOCUMENTS
        self.vectorizer = TfidfVectorizer(stop_words="english")
        texts = [f"{d['title']} {d['category']} {d['source']} {d['content']}" for d in self.documents]
        self.doc_vectors = self.vectorizer.fit_transform(texts)

    def retrieve(self, query: str, top_k: int = 3):
        if not query.strip():
            return []
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.doc_vectors)[0]
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score > 0.05:  # threshold of relevance
                doc = dict(self.documents[idx])
                doc["relevance_score"] = round(score, 4)
                results.append(doc)
        return results


# Global singleton instance
rag_retriever = BankingRAGRetriever()

if __name__ == "__main__":
    test_q = "What are the rules for adverse action notices in credit risk?"
    matches = rag_retriever.retrieve(test_q, top_k=2)
    print(f"Query: {test_q}")
    for m in matches:
        print(f"[{m['id']}] {m['title']} (Score: {m['relevance_score']})")
        print(f"Source: {m['source']}\n{m['content']}\n")
