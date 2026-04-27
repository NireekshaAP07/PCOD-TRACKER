# Backend entry point
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import joblib
import os
import pandas as pd
from email_utils import send_signup_notification, send_risk_alert

from database import engine, Base, get_db
import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CycleAI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml', 'pcos_model.joblib')
try:
    ml_model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print("Warning: ML model not found. Please run backend/ml/train_model.py")
    ml_model = None

from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta

@app.post("/api/auth/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict.pop("password")
    
    db_user = models.User(**user_dict, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send welcome email via Resend
    send_signup_notification(db_user.email, db_user.name)
    
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_user_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/api/logs", response_model=schemas.CycleLogResponse)
def create_log(log: schemas.CycleLogCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_log = models.CycleLog(
        user_id=current_user.id,
        month=log.month,
        flow=log.flow,
        mood=log.mood,
        stress=log.stress,
        weight=log.weight,
        symptoms=",".join(log.symptoms)
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    response_dict = db_log.__dict__
    response_dict["symptoms"] = response_dict["symptoms"].split(",") if response_dict["symptoms"] else []
    return response_dict

@app.get("/api/logs", response_model=list[schemas.CycleLogResponse])
def get_logs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    logs = db.query(models.CycleLog).filter(models.CycleLog.user_id == current_user.id).all()
    results = []
    for log in logs:
        log_dict = log.__dict__
        log_dict["symptoms"] = log_dict["symptoms"].split(",") if log_dict["symptoms"] else []
        results.append(log_dict)
    return results

@app.get("/api/admin/users", response_model=list[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    users = db.query(models.User).all()
    return users

@app.post("/api/predict", response_model=schemas.PredictionResponse)
def predict_risk(req: schemas.PredictionRequest):
    if ml_model is None:
        raise HTTPException(status_code=500, detail="ML model not loaded.")
    
    features = pd.DataFrame([{
        'Age (yrs)': req.age,
        'BMI': req.bmi,
        'Cycle length(days)': req.cycle_length,
        'Weight gain(Y/N)': req.weight_gain,
        'hair growth(Y/N)': req.hair_growth,
        'Skin darkening (Y/N)': req.skin_darkening,
        'Hair loss(Y/N)': req.hair_loss,
        'Pimples(Y/N)': req.pimples
    }])
    
    # Predict probability of class 1 (PCOS Risk)
    risk_prob = ml_model.predict_proba(features)[0][1] * 100
    
    level = 'Low'
    if risk_prob >= 65:
        level = 'High'
    elif risk_prob >= 40:
        level = 'Moderate'
        
    symptom_count = req.weight_gain + req.hair_growth + req.skin_darkening + req.hair_loss + req.pimples
    confidence = min(98, 70 + int(symptom_count * 5))
    
    # Send alert email if risk is High
    if level == "High":
        send_risk_alert(current_user.email, current_user.name, level)
    
    return {
        "risk_probability": round(risk_prob, 1),
        "risk_level": level,
        "confidence": confidence
    }
