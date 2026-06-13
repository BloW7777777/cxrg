from datetime import datetime
from typing import Optional

from sqlmodel import Field, JSON, SQLModel


class Patient(SQLModel, table=True):
    __tablename__ = "patients"

    patient_id: str = Field(primary_key=True, max_length=50)
    name: str = Field(max_length=100)
    gender: str = Field(max_length=10)
    age: int = Field(ge=0)
    created_at: datetime = Field(default_factory=datetime.now)


class Report(SQLModel, table=True):
    __tablename__ = "reports"

    report_id: str = Field(primary_key=True, max_length=50)
    patient_id: str = Field(max_length=50, foreign_key="patients.patient_id")
    image_paths: Optional[dict] = Field(default=None, sa_type=JSON)
    schema_data: Optional[dict] = Field(default=None, sa_type=JSON)
    findings: Optional[str] = Field(default=None)
    impression: Optional[str] = Field(default=None)
    ai_advice: Optional[str] = Field(default=None)
    attention_map_paths: Optional[dict] = Field(default=None, sa_type=JSON)
    chat_history: Optional[dict] = Field(default=None, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.now)


class ShortcutTemplate(SQLModel, table=True):
    __tablename__ = "shortcut_templates"

    id: Optional[int] = Field(default=None, primary_key=True)
    trigger_code: str = Field(max_length=50, unique=True)
    content: str = Field()
