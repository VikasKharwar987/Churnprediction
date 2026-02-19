from sqlalchemy import Column, Integer, String, Float
from .database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    gender = Column(String(50))
    SeniorCitizen = Column(Integer)
    Partner = Column(String(50))
    Dependents = Column(String(50))
    tenure = Column(Integer)
    PhoneService = Column(String(50))
    MultipleLines = Column(String(50))
    InternetService = Column(String(50))
    OnlineSecurity = Column(String(50))
    OnlineBackup = Column(String(50))
    DeviceProtection = Column(String(50))
    TechSupport = Column(String(50))
    StreamingTV = Column(String(50))
    StreamingMovies = Column(String(50))
    Contract = Column(String(50))
    PaperlessBilling = Column(String(50))
    PaymentMethod = Column(String(50))
    MonthlyCharges = Column(Float)
    TotalCharges = Column(Float)

    churn_probability = Column(Float)
    risk_category = Column(String(50))


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
