import models
from database import SessionLocal, engine
from auth import get_password_hash

def create_admin():
    import models
    from database import engine, Base
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Check if admin already exists
    admin = db.query(models.User).filter(models.User.email == "admin@cycleai.com").first()
    if not admin:
        hashed_password = get_password_hash("admin123")
        db_admin = models.User(
            email="admin@cycleai.com",
            hashed_password=hashed_password,
            is_admin=True,
            name="Admin User",
            age=30,
            bmi=24.5,
            cycle_average=28,
            pcos_history="None"
        )
        db.add(db_admin)
        db.commit()
        print("Admin user created: admin@cycleai.com / admin123")
    else:
        print("Admin user already exists.")
    db.close()

if __name__ == "__main__":
    create_admin()
