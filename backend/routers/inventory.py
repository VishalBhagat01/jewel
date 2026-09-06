from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from main import JewelleryIn, current_user
router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.get("")
def list_inventory(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM jewellery ORDER BY created_at DESC")
        return list(cur.fetchall())

@router.get("/{item_id}")
def get_inventory_item(item_id: int, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM jewellery WHERE id=%s", (item_id,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(404, "Jewellery not found")
    return row

@router.post("")
def create_inventory(item: JewelleryIn, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("""INSERT INTO jewellery(item_code,name,category,metal,purity,weight,purchase_price,selling_price,making_charges,stock,image_url)
          VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *""", tuple(item.model_dump().values()))
        return cur.fetchone()

@router.put("/{item_id}")
def update_inventory(item_id: int, item: JewelleryIn, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        values = tuple(item.model_dump().values())
        cur.execute("""UPDATE jewellery SET item_code=%s,name=%s,category=%s,metal=%s,purity=%s,weight=%s,purchase_price=%s,selling_price=%s,making_charges=%s,stock=%s,image_url=%s,updated_at=now()
          WHERE id=%s RETURNING *""", values + (item_id,))
        row = cur.fetchone()
    if not row: raise HTTPException(404, "Jewellery not found")
    return row

@router.delete("/{item_id}")
def delete_inventory(item_id: int, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("DELETE FROM jewellery WHERE id=%s RETURNING id", (item_id,))
        if not cur.fetchone(): raise HTTPException(404, "Jewellery not found")
    return {"deleted": item_id}
