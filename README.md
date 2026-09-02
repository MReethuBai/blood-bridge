# BloodBridge AI – Intelligent Blood Donor Matching & Emergency Response

[![BloodBridge AI Banner](https://img.shields.io/badge/BloodBridge-AI-red.svg)](http://localhost:5000)
[![Flask Backend](https://img.shields.io/badge/Backend-Python%20Flask-blue.svg)](http://localhost:5000)
[![React Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-emerald.svg)](http://localhost:5173)
[![Scikit-Learn ML](https://img.shields.io/badge/AI%2FML-Scikit--Learn-orange.svg)](http://localhost:5000)

> **Medical Disclaimer:** BloodBridge AI is an emergency coordination and donor ranking assistance system. Final blood cross-matching, donor eligibility verification, and clinical transfusion procedures must be confirmed by qualified healthcare professionals.

---

## 🌟 Overview & Key Features

BloodBridge AI is a full-stack emergency healthcare application that connects verified emergency hospitals with compatible nearby blood donors using an AI multi-factor ranking algorithm, interactive geocoded Leaflet radar maps, and predictive blood demand analytics.

### 🩸 Core Capabilities
- **Main AI Feature – Transparent Donor Matching Engine**:
  - ABO & Rh blood compatibility matrix (O- universal red cell donor, AB+ universal recipient).
  - Proximity distance calculation using the Haversine formula.
  - Live availability toggle & 56-day donation eligibility rest-period enforcement.
  - Transparent **Suitability Score (0–100)** with detailed explanations ("WHY donor was highly ranked").
- **AI Demand Prediction (Scikit-Learn ML)**:
  - Trained on historical request logs (`demand_history`).
  - Predicts 30-day blood group demand levels by city (O+ HIGH, A+ MEDIUM, B+ HIGH, AB- LOW, O- CRITICAL).
- **Geocoded Proximity Map Radar**:
  - Interactive Leaflet + OpenStreetMap rendering hospital center pin, 5km/15km proximity rings, and compatible donor markers.
- **Role-Based Dashboards**:
  - **Donor**: Profile management, callout availability toggle switch, incoming emergency request alerts, Accept/Decline actions.
  - **Hospital**: Registration with PENDING status. Emergency blood request creation (only for VERIFIED hospitals) with priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), real-time donor matching, and request fulfillment tracking.
  - **Admin**: System metrics, pending hospital application review queue with 1-click Approve/Reject buttons, and synthetic demo dataset re-seeding.

---

## 🚀 Quick Demo Login Credentials

For convenience during evaluation, the application includes pre-seeded demo accounts accessible via **1-Click Buttons** on the Login screen:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Verified Hospital** | `hospital@metro.org` | `Hospital@123` | Metro General Emergency Hospital (Status: VERIFIED) |
| **Pending Hospital** | `hospital@cityheart.org` | `Hospital@123` | City Heart Medical Institute (Status: PENDING) |
| **Active Donor (O+)** | `donor@example.com` | `Donor@123` | Demo Donor D001 (Alex Taylor) |
| **Chief Admin** | `admin@bloodbridge.ai` | `Admin@123` | BloodBridge AI System Admin |

---

## 💻 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React Icons, Leaflet & OpenStreetMap, Recharts.
- **Backend**: Python 3.13 Flask REST API, PyJWT Authentication, Werkzeug Security, Flask-CORS.
- **Database**: MongoDB (PyMongo) with automatic embedded persistent JSON fallback storage engine for zero-friction setup.
- **AI & Data Science**: Python, Pandas, NumPy, Scikit-Learn (`RandomForestRegressor`).

---

## ⚙️ Environment Setup & Installation

### 1. Backend Setup (Flask API)
```bash
cd backend
# Create virtual environment (optional)
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt pymongo pyjwt mongomock python-dotenv

# Run Flask Backend Server
python -m app.main
```
The Flask API will run on `http://localhost:5000`.

### 2. Frontend Setup (React SPA)
```bash
# In the project root directory
npm install
npm run dev
```
The React Frontend will run on `http://localhost:5173`.

---

## 🗄️ Environment Variables (`.env`)

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodbridge
DB_NAME=bloodbridge
JWT_SECRET=bloodbridge_super_secret_jwt_key_2026
```

---

## 📊 Synthetic Demo Dataset

The application automatically generates a synthetic demo dataset upon initial startup:
- **5,000+ Donors**: Distributed across 10 major cities with realistic blood groups, lat/lng coordinates, availability, and response histories.
- **50+ Hospitals**: Verified and pending emergency medical centers.
- **1,000+ Emergency Requests**: Historical demand records for machine learning training.
- **No real personal data is used.** All demo records are tagged with `is_demo: true` and labeled clearly in the UI.
