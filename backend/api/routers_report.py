import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["report"])


class GenerateReportRequest(BaseModel):
    schema_data: dict | None = None
    prompt_override: str | None = None


@router.post("/generate-report")
async def generate_report(request: GenerateReportRequest):
    """
    预留接口：接收 Schema Data，通过 SSE 流式返回 AI 生成的自然语言报告。
    目前返回模拟流式数据，后续对接 Qwen2.5。
    """
    # TODO: 替换为真实 Qwen2.5 流式推理
    async def fake_stream():
        chunks = [
            "您好，以下是本次胸部 X 光检查的影像报告：\n\n",
            "【影像所见】\n",
            "双侧肺野纹理清晰，肺野透光度正常。双肺门结构正常，纵隔无增宽。心影形态、大小正常。肋骨及胸廓骨质结构完整。\n\n",
            "【影像诊断】\n",
            "心肺未见明显异常。\n\n",
            "【医嘱建议】\n",
            "定期体检，如有不适请及时就诊。",
        ]
        for chunk in chunks:
            yield f"data: {json.dumps({'token': chunk})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(fake_stream(), media_type="text/event-stream")
