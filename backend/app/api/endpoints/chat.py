from fastapi import APIRouter
from app.core.ai_agent import ai_orchestrator
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat_with_copilot(payload: ChatRequest):
    """
    Conversational Copilot Endpoint:
    Dispatches prompts to the multi-tier AI engine and returns structured action proposals.
    """
    history_dicts = [{"role": m.role, "content": m.content} for m in (payload.history or [])]
    return await ai_orchestrator.process_message(payload.message, history=history_dicts)
