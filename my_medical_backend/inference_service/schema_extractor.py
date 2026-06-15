from fastapi import HTTPException, UploadFile


async def extract_schema(files: list[UploadFile]) -> dict:
    """
    轻量级Schema提取接口占位实现。
    后续可在此接入真实的PyTorch视觉模型。
    """
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="请上传至少一张图片")

    return {
        "status": "simulated",
        "schema_data": {
            "anatomy": "chest",
            "observation": [],
            "attributes": {},
            "state": "normal",
        },
        "message": "Schema模型接口预留，尚未接入真实AI模型",
    }
