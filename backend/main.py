from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers_cases import router as cases_router
from api.routers_schema import router as schema_router
from api.routers_report import router as report_router
from database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="胸部X光报告系统 API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS：允许本地前端开发服务器跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(cases_router)
app.include_router(schema_router)
app.include_router(report_router)


@app.get("/")
def root():
    return {"message": "胸部X光报告系统后端服务", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
