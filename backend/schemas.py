from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserBase(BaseModel):
    name: str
    age: int
    bmi: float
    cycle_average: int
    pcos_history: str

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    email: str
    is_admin: bool
    
    class Config:
        from_attributes = True

class CycleLogBase(BaseModel):
    month: str
    flow: str
    mood: str
    stress: int
    weight: float
    symptoms: List[str]

class CycleLogCreate(CycleLogBase):
    pass

class CycleLogResponse(CycleLogBase):
    id: int
    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    age: int
    bmi: float
    cycle_length: int
    weight_gain: int
    hair_growth: int
    skin_darkening: int
    hair_loss: int
    pimples: int

class PredictionResponse(BaseModel):
    risk_probability: float
    risk_level: str
    confidence: int
