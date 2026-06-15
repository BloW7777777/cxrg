from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .schema_extractor import extract_schema
from .text_generator import generate_report_stream

app = FastAPI(
    title="胸部X光报告系统 Inference Service",
    version="0.1.0",
)


class GenerateReportRequest(BaseModel):
    schema_data: dict | None = None
    prompt_override: str | None = None


@app.get("/")
def root():
    return {"message": "inference service running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "inference", "port": 8001}


@app.post("/api/generate-schema")
async def generate_schema(files: list[UploadFile] = File(...)):
    return await extract_schema(files)


@app.post("/api/generate-report")
async def generate_report(request: GenerateReportRequest):
    return StreamingResponse(
        generate_report_stream(request.schema_data, request.prompt_override),
        media_type="text/event-stream",
    )
