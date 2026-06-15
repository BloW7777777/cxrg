import os
from pathlib import Path

from sqlmodel import SQLModel, create_engine
from sqlalchemy.orm import Session

# 确保 data 目录存在
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'medical_app.db'}"
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as s:
        yield s
