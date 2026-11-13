# 🏦 WEAVE Banking & Financial Intelligence Platform
> **Enterprise-Grade AI/ML System for Financial Risk Scoring, Anomaly Surveillance, Customer Attrition, and Regulatory RAG Copilot**
> Built with the **WEAVE Modern Fintech Design System** (Ultra-Clean, Light, Minimalist SaaS inspired by modern banking UI kits) and complete **ML, Deep Learning, ANN, CNN, and RNN** implementations.

---

## 🎨 WEAVE UI Design System (Reflecting User Reference Images)

The frontend has been completely redesigned to match the modern **WEAVE Banking Management Dashboard** layout:
- **Clean Aesthetic**: Crisp white background surfaces (`#FFFFFF`), very light slate backgrounds (`#F8FAFC`), and vibrant emerald green primary accents (`#00C076`).
- **Transaction Details View**:
  - Breadcrumb navigation (`← Transactions > Delta Airlines`) with `Export details` button.
  - Merchant hero banner with avatar circle `D.`, green pill `● Completed`, date, and prominent `$25,000.00` payment header.
  - 2-column layout:
    - **Payment Details**: Card payment badge, merchant, payment card (`VISA •••• 1801`), account (`236346`), owner (`Niko Flamini`), and ML fraud screening status.
    - **Activity History**: Timeline with green status dots for payment completion, travel categorization, and receipt action.
    - **Receipt Card**: Orange `● Missing` badge, dashed drag-and-drop file upload box, "Request receipt" and "+ Attach receipt" emerald green buttons.
    - **Category & Reconciliation**: Category dropdown, orange `Pending receipt` badge, and compliance guidance text.
    - **Preset Transaction Switcher**: Easily toggle between Delta Airlines, Apple Store, AWS Cloud, and Suspicious Wire transfers to observe ML inference outcomes.
- **Banking Management Dashboard**:
  - Top KPI cards: `$984,96.00` Monthly Spend, `$582,67.00` Allocated Budget, `$736,41.00` Total Revenue, `$798,18.00` Net Reserves.
  - Multi-colored **Monthly Spend** bar chart (Marketing, Operating, Tech).
  - Center **Activity Donut Chart** with `$1,591.00` center total and category breakdown.
  - **Universal Bank Black Debit Card**: Realistic dark debit card with gold chip, contactless icon, embossed number `1234 5678 9000 0000`, cardholder name, and `$1,120.00` budget widget.
  - **Product Highlights**: 6-card grid (100% Editable, Clean Stylish & Modern, Google Free Fonts, 80+ Screens, Well Organized Layers, Global Style Guide).
- **Interactive Banking AI Modules**:
  - **Credit Risk AI**: Loan underwriting simulator with instant default probability gauge and Regulation B Adverse Action breakdown.
  - **Fraud Detection Suite**: Real-time transaction PCA scoring + Batch CSV queue upload scanner.
  - **Customer Churn Engine**: Predictive attrition model with retention strategy recommendations.
  - **Complaint NLP Triage**: Free-text CFPB narrative classifier with sentiment analysis and SLA timers.
  - **Model Leaderboard**: Empirical benchmarking of 16 models across precision, recall, F1, ROC-AUC, PR-AUC, and latency.
  - **AI Copilot (RAG + Agent)**: Tool-calling copilot with verifiable regulatory citations and tool badges.
  - **Audit & Governance**: Immutable audit log of all system decisions.

---

## 📓 Machine Learning & Deep Learning Notebooks (`notebooks/`)

Dedicated, self-contained Jupyter Notebooks covering ML, ANN, CNN, and RNN architectures:

| Notebook | Focus | Architectures & Highlights |
| :--- | :--- | :--- |
| **[`01_classical_ml_pipelines.ipynb`](file:///notebooks/01_classical_ml_pipelines.ipynb)** | **Classical ML** | Logistic Regression, Random Forest, XGBoost, Linear SVM, KNN. Data leakage prevention, stratified 80/20 splits, ROC/PR curves, and Gini feature importance. |
| **[`02_deep_learning_ann.ipynb`](file:///notebooks/02_deep_learning_ann.ipynb)** | **Deep Learning (ANN)** | PyTorch Multi-Layer Perceptrons for tabular Credit Risk & Churn. Fully connected dense layers with Batch Normalization, Dropout ($p=0.3$), ReLU, Sigmoid, and validation ROC-AUC tracking. |
| **[`03_deep_learning_cnn.ipynb`](file:///notebooks/03_deep_learning_cnn.ipynb)** | **Deep Learning (CNN)** | 1D-CNN (Kim CNN style) for sequence classification on CFPB consumer complaints. Parallel 1D convolutional filter banks (kernels 3, 4, 5), Word Embeddings, and GlobalMaxPooling1D. |
| **[`04_deep_learning_rnn.ipynb`](file:///notebooks/04_deep_learning_rnn.ipynb)** | **Deep Learning (RNN)** | Recurrent Neural Networks with Bidirectional LSTM (BiLSTM) and Gated Recurrent Units (GRU) for sequential temporal transaction streams and velocity burst surveillance. |
| **[`banking_eda_and_modeling.ipynb`](file:///notebooks/banking_eda_and_modeling.ipynb)** | **Master EDA & Leaderboard** | Exploratory Data Analysis, missing value distributions, class imbalance checks across all 4 raw banking datasets. |

---

## 📊 Complete Model Leaderboard (16 Models Benchmarked)

| Module | Model Architecture | F1-Score | ROC-AUC | PR-AUC | Latency (ms) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Credit Risk** | **XGBoost Classifier** | **0.8222** | **0.9443** | **0.8968** | **0.00 ms** | **PRODUCTION** |
| Credit Risk | Random Forest | 0.7918 | 0.9298 | 0.8784 | 0.01 ms | Baseline |
| Credit Risk | ANN (Deep MLP in PyTorch) | 0.7827 | 0.9189 | 0.8576 | 0.00 ms | Deep Learning |
| Credit Risk | Logistic Regression | 0.6485 | 0.8693 | 0.7290 | 0.00 ms | Baseline |
| **Fraud Detection** | **XGBoost (Class-Weighted)**| **0.8265** | **0.9754** | **0.8650** | **0.00 ms** | **PRODUCTION** |
| Fraud Detection | ANN (Deep MLP in PyTorch) | 0.8125 | 0.9793 | 0.8410 | 0.00 ms | Deep Learning |
| Fraud Detection | Random Forest | 0.7401 | 0.9750 | 0.7968 | 0.00 ms | Baseline |
| Fraud Detection | Logistic Regression | 0.1101 | 0.9714 | 0.7182 | 0.00 ms | Baseline |
| **Customer Churn** | **Random Forest Ensemble** | **0.6124** | **0.8574** | **0.6800** | **0.01 ms** | **PRODUCTION** |
| Customer Churn | ANN (Deep MLP in PyTorch) | 0.6108 | 0.8638 | 0.7082 | 0.00 ms | Deep Learning |
| Customer Churn | XGBoost Classifier | 0.5988 | 0.8671 | 0.7150 | 0.00 ms | Baseline |
| Customer Churn | KNN (k=7) | 0.4856 | 0.7955 | 0.5483 | 0.09 ms | Baseline |
| Customer Churn | Logistic Regression | 0.2836 | 0.7748 | 0.4789 | 0.00 ms | Baseline |
| **Complaints NLP** | **TF-IDF + Linear SVM** | **0.9991** | N/A | N/A | **0.00 ms** | **PRODUCTION** |
| Complaints NLP | 1D-CNN (PyTorch Text CNN) | 0.9985 | N/A | N/A | 0.01 ms | Deep Learning |
| Complaints NLP | TF-IDF + Logistic Reg | 0.9983 | N/A | N/A | 0.00 ms | Baseline |

---

## 🚀 How to Run

### Step 1: Start the FastAPI Backend
```powershell
python run_backend.py
```
* **Swagger API Documentation**: http://127.0.0.1:8000/docs
* **Health Endpoint**: http://127.0.0.1:8000/api/health

### Step 2: Start the React Frontend
```powershell
cd frontend
npm run dev
```
* Open your browser at: **http://localhost:5173**
