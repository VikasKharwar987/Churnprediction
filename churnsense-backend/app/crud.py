from sqlalchemy.orm import Session
from . import models, schemas
from .ml_model import predict_churn
from sqlalchemy import func


def create_customer(db: Session, customer: schemas.CustomerCreate):
    customer_data = customer.dict()

    # Predict before saving
    prob, risk = predict_churn(customer_data)

    db_customer = models.Customer(
        **customer_data,
        churn_probability=prob,
        risk_category=risk
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer

def get_customers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Customer).offset(skip).limit(limit).all()



def get_high_risk_customers(db: Session):
    return db.query(models.Customer).filter(
        models.Customer.risk_category == "High"
    ).all()


def get_analytics(db: Session):

    total_customers = db.query(models.Customer).count()

    high_risk = db.query(models.Customer).filter(
        models.Customer.risk_category == "High"
    ).count()

    medium_risk = db.query(models.Customer).filter(
        models.Customer.risk_category == "Medium"
    ).count()

    low_risk = db.query(models.Customer).filter(
        models.Customer.risk_category == "Low"
    ).count()

    avg_probability = db.query(
        func.avg(models.Customer.churn_probability)
    ).scalar()

    return {
        "total_customers": total_customers,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk,
        "average_probability": round(avg_probability or 0, 4)
    }

def get_analytics_by_user(db: Session, user_id: int):
    customers = db.query(models.Customer).filter(
        models.Customer.user_id == user_id
    ).all()

    total = len(customers)

    high = len([c for c in customers if c.risk_category == "High"])
    medium = len([c for c in customers if c.risk_category == "Medium"])
    low = len([c for c in customers if c.risk_category == "Low"])

    avg_prob = (
        sum(c.churn_probability for c in customers) / total
        if total > 0 else 0
    )

    return {
        "total_customers": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "average_probability": round(avg_prob, 4)
    }
