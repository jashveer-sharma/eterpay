from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = "default-session"
    history: Optional[List[ChatMessage]] = []

class ActionProposal(BaseModel):
    type: str  # e.g. "PAYPAL_CHECKOUT", "GRID_FILTER", "RATE_ALERT"
    title: str
    description: str
    amount: Optional[float] = None
    currency: Optional[str] = None
    merchant: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None
    requires_approval: bool = True

class ChatResponse(BaseModel):
    reply: str
    tool_executed: Optional[str] = None
    action_proposal: Optional[ActionProposal] = None
    grid_filter: Optional[Dict[str, Any]] = None
