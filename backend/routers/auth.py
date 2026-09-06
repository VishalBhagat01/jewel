import hashlib
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from main import Login, current_user, token_for
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login")
def login(payload: Login):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT id,username,full_name,role FROM users WHERE username=%s AND password_hash=%s", (payload.username, hashlib.sha256(payload.password.encode()).hexdigest()))
        user = cur.fetchone()
    if not user: raise HTTPException(401, "Invalid username or password")
    return {"token": token_for(user["id"]), "user": user}

@router.post("/logout")
def logout(_: dict = Depends(current_user)):
    # Tokens are stateless; removing it from the browser completes logout.
    return {"message": "Logged out successfully"}
