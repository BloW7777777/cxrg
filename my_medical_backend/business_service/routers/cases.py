from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..database import get_session
from ..models_db import Patient, Report

router = APIRouter(prefix="/api", tags=["cases"])


@router.post("/patients", response_model=Patient)
def create_patient(patient: Patient, session: Session = Depends(get_session)):
    existing = session.get(Patient, patient.patient_id)
    if existing:
        raise HTTPException(status_code=400, detail=f"Patient {patient.patient_id} 已存在")
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient


@router.get("/patients", response_model=list[Patient])
def list_patients(
    name: str | None = Query(None, description="按姓名模糊搜索"),
    session: Session = Depends(get_session),
):
    stmt = select(Patient)
    if name:
        stmt = stmt.where(Patient.name.like(f"%{name}%"))
    stmt = stmt.order_by(Patient.created_at.desc())
    return session.exec(stmt).all()


@router.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: str, session: Session = Depends(get_session)):
    patient = session.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="患者不存在")
    return patient


@router.post("/reports", response_model=Report)
def create_report(report: Report, session: Session = Depends(get_session)):
    patient = session.get(Patient, report.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"患者 {report.patient_id} 不存在")
    session.add(report)
    session.commit()
    session.refresh(report)
    return report


@router.get("/reports", response_model=list[Report])
def list_reports(
    patient_id: str | None = Query(None, description="按患者ID过滤"),
    session: Session = Depends(get_session),
):
    stmt = select(Report)
    if patient_id:
        stmt = stmt.where(Report.patient_id == patient_id)
    stmt = stmt.order_by(Report.created_at.desc())
    return session.exec(stmt).all()


@router.get("/reports/{patient_id}", response_model=list[Report])
def get_reports_by_patient(patient_id: str, session: Session = Depends(get_session)):
    stmt = select(Report).where(Report.patient_id == patient_id).order_by(Report.created_at.desc())
    return session.exec(stmt).all()
