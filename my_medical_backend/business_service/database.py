from pathlib import Path

from sqlmodel import SQLModel, create_engine
from sqlalchemy.orm import Session

# 数据库文件统一放在 my_medical_backend/data 下
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'medical_app.db'}"
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def create_db_and_tables():
    # 确保表定义已导入，避免 metadata 为空
    from . import models_db  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session