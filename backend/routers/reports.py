import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from main import current_user
router = APIRouter(prefix="/api/reports", tags=["reports"])

def _goldapi_quote(symbol: str) -> dict:
    token = os.getenv("GOLD_API_KEY")
    if not token:
        raise HTTPException(503, "GoldAPI key is not configured")
    request = Request(
        f"https://www.goldapi.io/api/{symbol}/INR",
        headers={"x-access-token": token, "Accept": "application/json"},
    )
    try:
        with urlopen(request, timeout=10) as response:
            quote = json.load(response)
    except HTTPError as exc:
        if exc.code in (401, 403):
            raise HTTPException(502, "GoldAPI rejected the API key") from exc
        raise HTTPException(502, "Unable to fetch live metal prices from GoldAPI") from exc
    except (URLError, TimeoutError) as exc:
        raise HTTPException(502, "Unable to fetch live metal prices from GoldAPI") from exc
    if quote.get("price") is None:
        raise HTTPException(502, f"GoldAPI returned no price for {symbol}")
    return {
        "price": quote["price"],
        "change": quote.get("ch"),
        "percent_change": quote.get("chp"),
        "timestamp": quote.get("timestamp"),
    }

@router.get("/dashboard")
def dashboard(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT count(*) AS inventory FROM jewellery"); inventory=cur.fetchone()["inventory"]
        cur.execute("SELECT count(*) AS customers FROM customers"); customers=cur.fetchone()["customers"]
        cur.execute("SELECT coalesce(sum(grand_total),0) AS today_sales FROM sales WHERE created_at::date=current_date"); today=cur.fetchone()["today_sales"]
        cur.execute("SELECT coalesce(sum(grand_total),0) AS month_sales FROM sales WHERE date_trunc('month',created_at)=date_trunc('month',current_date)"); month=cur.fetchone()["month_sales"]
    return {"inventory":inventory,"customers":customers,"today_sales":today,"month_sales":month}

@router.get("/metal-prices")
def metal_prices(_: dict = Depends(current_user)):
    return {
        "gold": _goldapi_quote("XAU"),
        "silver": _goldapi_quote("XAG"),
        "currency": "INR",
        "unit": "troy ounce",
    }

@router.get("/category-sales")
def category_sales(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT j.category,sum(si.line_total) AS total FROM sale_items si JOIN jewellery j ON j.id=si.jewellery_id GROUP BY j.category ORDER BY total DESC"); return list(cur.fetchall())

@router.get("/top-items")
def top_items(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT item_name,sum(quantity) AS quantity,sum(line_total) AS total FROM sale_items GROUP BY item_name ORDER BY quantity DESC LIMIT 10"); return list(cur.fetchall())

@router.get("/low-stock")
def low_stock(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM jewellery WHERE stock<=5 ORDER BY stock"); return list(cur.fetchall())
