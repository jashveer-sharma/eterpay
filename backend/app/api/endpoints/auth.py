from datetime import datetime, timedelta
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.db.session import get_db, hash_password
from app.db.models import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse

router = APIRouter()

def create_jwt_token(user: User) -> str:
    payload = {
        "sub": user.id,
        "email": user.email,
        "name": f"{user.first_name} {user.last_name}",
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticates credentials against the SQLite database and issues a signed JWT."""
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or user.hashed_password != hash_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Verify your email and password."
        )

    token = create_jwt_token(user)
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """Decodes JWT Bearer token and returns the authenticated user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Expired or invalid JWT session token")

    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    return UserResponse.model_validate(user)
