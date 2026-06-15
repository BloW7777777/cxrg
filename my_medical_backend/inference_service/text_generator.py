import json
from collections.abc import AsyncGenerator


async def generate_report_stream(
    schema_data: dict | None = None,
    prompt_override: str | None = None,
) -> AsyncGenerator[str, None]:
    """
    报告生成流占位实现。
    后续可替换为Qwen2.5等模型的真实流式推理结果。
    """
    chunks = [
        "您好，以下是本次胸部X光检查的影像报告：\n\n",
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
