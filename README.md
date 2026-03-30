# Real-Time Fraud Detection System

This project is a demonstration of algorithm analysis (DAA) applied to a real-world scenario: financial fraud detection.

## Structure
- `backend/`: FastAPI Python backend containing the Machine Learning engine (Random Forest & Logistic Regression), real-time streaming simulation using Server-Sent Events, and synthetic dataset generation.
- `frontend/`: React + Vite web dashboard featuring a premium UI, real-time transaction ticker, and analytical charts comparing Big O complexity metrics.

## Setup Instructions

### Backend setup
1. Ensure Python 3.9+ is installed
2. Open terminal in the `backend` directory
3. Run `pip install -r requirements.txt`
4. Start the API by running `uvicorn main:app --reload`
*Note: The model trains itself on startup using a generated dataset.*

### Frontend setup
1. Ensure Node.js is installed
2. Open terminal in the `frontend` directory
3. Run `npm install`
4. Start the UI by running `npm run dev`

### Deployment
- **Backend:** Can be easily containerized or hosted on Render/Heroku as a Web Service.
- **Frontend:** Can be deployed to Vercel or Netlify by linking the GitHub repository and selecting Vite.
