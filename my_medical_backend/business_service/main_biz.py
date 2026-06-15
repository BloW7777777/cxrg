"""
智能胸部X光报告系统 - 业务后端服务入口
运行在8000端口，负责业务逻辑、数据库CRUD操作和前端静态文件托管
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 导入数据库初始化
from .database import engine, init_db
# 导入路由模块（后续在routers目录中实现）
# from .routers import patients, reports, chat, settings

app = FastAPI(
    title="智能胸部X光报告系统 - 业务服务",
    description="医疗影像报告生成与管理的业务后端API",
    version="1.0.0"
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应配置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 启动时初始化数据库
@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化操作"""
    init_db()
    print("✅ 数据库初始化完成")
    print("🚀 业务服务已启动在端口 8000")

# 根路径API健康检查
@app.get("/")
async def root():
    """API健康检查端点"""
    return {"message": "智能胸部X光报告系统业务服务运行正常", "service": "business_service"}

@app.get("/health")
async def health_check():
    """系统健康状态检查"""
    return {
        "status": "healthy",
        "service": "business_service",
        "port": 8000,
        "database": "connected"
    }

# TODO: 注册API路由
# app.include_router(patients.router, prefix="/api/patients", tags=["患者管理"])
# app.include_router(reports.router, prefix="/api/reports", tags=["报告管理"])
# app.include_router(chat.router, prefix="/api/chat", tags=["AI助手"])
# app.include_router(settings.router, prefix="/api/settings", tags=["系统设置"])

# 挂载前端静态文件（生产环境中使用）
# 注意：前端打包后的dist目录应该在 ../my_medical_frontend/dist/
# app.mount("/", StaticFiles(directory="../my_medical_frontend/dist", html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run(
        "main_biz:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 开发模式，生产环境设置为False
        log_level="info"
    )