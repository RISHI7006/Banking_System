# 🚀 Render Deployment Guide — Modern Banking Management System

This repository is **100% Render-Ready** to deploy both the **Python FastAPI Backend** and the **React Vite Frontend** at the same time.

---

## ⚡ Method 1: Render Blueprint (Deploy Both at Same Time via `render.yaml`)

This repository includes a pre-configured `render.yaml` file. When you use Render Blueprints, Render automatically detects both services and launches them simultaneously.

### Step 1: Push your code to GitHub
Make sure your project is pushed to a GitHub repository:
```bash
git init
git add .
git commit -m "Deploy Modern Banking Management System to Render"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
*(Note: Large raw dataset files like `complaints.csv` and `creditcard.csv` are already ignored by `.gitignore` so your push will be fast and stay well below GitHub's 100MB limit).*

---

### Step 2: Deploy on Render
1. Go to [https://dashboard.render.com/](https://dashboard.render.com/) and sign in.
2. In the top-right corner, click **New +** and select **Blueprint**.
3. Connect your GitHub repository (`<your-repo-name>`).
4. Render will parse `render.yaml` and show **2 services to be created**:
   - **`modern-banking-api`** (Web Service: Python 3.11 FastAPI)
   - **`modern-banking-ui`** (Static Site: React Vite Frontend)
5. Click **Apply**.
6. Render will build and deploy both services at the same time:
   - Backend will be live at: `https://modern-banking-api.onrender.com`
   - Frontend will be live at: `https://modern-banking-ui.onrender.com`

> **Note:** The frontend automatically receives the backend URL via Render's `fromService` environment variable.

---

## 🌟 Method 2: Single Unified Web Service (Full-Stack 1-Service Deployment)

If you prefer to deploy everything onto **one single Render URL** (no CORS, 1 service, 24/7 on free tier):

1. On Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name:** `modern-banking-app`
   - **Language / Runtime:** `Python 3`
   - **Build Command:** `./build.sh`
   - **Start Command:** `python run_backend.py` (or `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`)
   - **Plan:** Free
4. Click **Create Web Service**.

FastAPI will automatically serve the React frontend at `/` and all API endpoints at `/api/...`.

---

## 🛠️ Verification & Health Check

Once deployed, you can verify your deployment:
- **Frontend UI:** Open your frontend Render URL in the browser.
- **Backend Health Check:** `https://<your-backend-url>/api/health`
- **Interactive Swagger Docs:** `https://<your-backend-url>/docs`
