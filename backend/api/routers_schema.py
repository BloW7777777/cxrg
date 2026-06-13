from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(prefix="/api", tags=["schema"])


@router.post("/generate-schema")
async def generate_schema(files: list[UploadFile] = File(...)):
    """
    预留接口：接收胸部 X 光图片，返回轻量级模型提取的结构化 Schema Data。
    目前返回模拟数据，后续对接真实模型。
    """
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="请上传至少一张图片")

    # TODO: 替换为真实模型推理
    return {
        "status": "simulated",
        "schema_data": {
            "anatomy": "chest",
            "observation": [],
            "attributes": {},
            "state": "normal",
        },
        "message": "Schema 模型接口预留，尚未接入真实 AI 模型",
    }
