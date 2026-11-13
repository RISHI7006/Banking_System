#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> [1/3] Installing Python Dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ">>> [2/3] Installing Frontend Dependencies..."
cd frontend
npm install

echo ">>> [3/3] Building Production Frontend (Vite)..."
npm run build
cd ..

echo ">>> Build completed successfully! Ready for Render."
