import base64, hashlib, hmac, os, time
from decimal import Decimal
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
SECRET = os.getenv("SECRET_KEY")
if not SECRET:
    raise RuntimeError("SECRET_KEY environment variable must be set")

app = FastAPI(title="Mohit Jewellers Management API")
configured_origin = os.getenv("FRONTEND_URL", "")
allowed_origins = list(dict.fromkeys([
    *(origin.strip() for origin in configured_origin.split(",") if origin.strip()),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]))
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class Login(BaseModel):
    username: str
    password: str
class JewelleryIn(BaseModel):
    item_code: str = Field(min_length=1, max_length=40)
    name: str = Field(min_length=2, max_length=150)
    category: str
    metal: str
    purity: str
    weight: Decimal = Field(ge=0)
    purchase_price: Decimal = Field(ge=0)
    selling_price: Decimal = Field(ge=0)
    making_charges: Decimal = Field(default=Decimal("0"), ge=0)
    stock: int = Field(ge=0)
    image_url: str = ""
class CustomerIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)
    address: str = ""
class SaleItemIn(BaseModel):
    jewellery_id: int
    quantity: int = Field(gt=0)
class SaleIn(BaseModel):
    customer_id: int | None = None
    walk_in_name: str | None = None
    walk_in_phone: str | None = None
    items: list[SaleItemIn] = Field(min_length=1)
    gst_rate: Decimal = Field(default=Decimal("3"), ge=0, le=100)

def token_for(user_id: int) -> str:
    raw = f"{user_id}:{int(time.time())}".encode()
    return base64.urlsafe_b64encode(raw).decode().rstrip("=") + "." + hmac.new(SECRET.encode(), raw, hashlib.sha256).hexdigest()

def current_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authentication required")
    try:
        encoded, signature = authorization[7:].split(".", 1)
        raw = base64.urlsafe_b64decode(encoded + "==")
        expected = hmac.new(SECRET.encode(), raw, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected): raise ValueError()
        user_id = int(raw.decode().split(":", 1)[0])
        from database import get_db
        with get_db() as conn, conn.cursor() as cur:
            cur.execute("SELECT id,username,full_name,role FROM users WHERE id=%s", (user_id,))
            user = cur.fetchone()
        if not user: raise ValueError()
        return user
    except Exception as exc:
        raise HTTPException(401, "Invalid token") from exc

@app.get("/health")
def health(): return {"status": "ok"}

from routers.auth import router as auth
from routers.inventory import router as inventory
from routers.customers import router as customers
from routers.sales import router as sales
from routers.reports import router as reports
for router in (auth, inventory, customers, sales, reports):
    app.include_router(router)
