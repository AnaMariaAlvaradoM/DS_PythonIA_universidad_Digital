import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# ---------------------------------------------------------------------------
# Load environment variables from .env
# ---------------------------------------------------------------------------
load_dotenv()

DB_HOST: str = os.getenv("DB_HOST", "localhost")
DB_PORT: str = os.getenv("DB_PORT", "5432")
DB_USER: str = os.getenv("DB_USER", "postgres")
DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
DB_NAME: str = os.getenv("DB_NAME", "app_db")

# ---------------------------------------------------------------------------
# Connection URL
# ---------------------------------------------------------------------------
DATABASE_URL: str = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db():
    db = SessionLocal
    try:
        yield db
    finally:
        db.close()

