from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    
    name = Column(String)
    age = Column(Integer)
    bmi = Column(Float)
    cycle_average = Column(Integer)
    pcos_history = Column(String)

    logs = relationship("CycleLog", back_populates="owner")

class CycleLog(Base):
    __tablename__ = "cycle_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    month = Column(String)
    flow = Column(String)
    mood = Column(String)
    stress = Column(Integer)
    weight = Column(Float)
    symptoms = Column(String) # Stored as comma-separated string
    
    owner = relationship("User", back_populates="logs")
