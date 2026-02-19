from fastapi import FastAPI
from sqlalchemy import text
from .database import engine
from .models import Base
from .database import SessionLocal
from . import models, schemas, crud
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi import File, UploadFile
import pandas as pd
from .ml_model import predict_churn
from fastapi.middleware.cors import CORSMiddleware
from .auth import hash_password, verify_password, create_access_token
from fastapi import HTTPException
from .auth import get_current_user


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "ChurnSense Backend Running"}


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            return {"status": "Database Connected ✅"}
    except Exception as e:
        return {"status": "Database Connection Failed ", "error": str(e)}

@app.post("/customers", response_model=schemas.CustomerResponse)
def add_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@app.get("/customers")
def get_customers(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Customer)\
        .filter(models.Customer.user_id == current_user.id)\
        .offset(skip)\
        .limit(limit)\
        .all()



@app.get("/customers/high-risk", response_model=list[schemas.CustomerResponse])
def read_high_risk_customers(db: Session = Depends(get_db)):
    return crud.get_high_risk_customers(db)

@app.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    df = pd.read_csv(file.file)

    inserted_count = 0

    for _, row in df.iterrows():
        customer_data = row.to_dict()

        prob, risk = predict_churn(customer_data)

        db_customer = models.Customer(
            user_id=current_user.id,   # 🔥 attach user
            **customer_data,
            churn_probability=prob,
            risk_category=risk
        )

        db.add(db_customer)
        inserted_count += 1

    db.commit()

    return {
        "message": "CSV processed successfully",
        "customers_inserted": inserted_count
    }


@app.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_analytics_by_user(db, current_user.id)


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hash_password(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.username})

    return {"access_token": access_token, "token_type": "bearer"}
