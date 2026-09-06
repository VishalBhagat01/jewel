from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from main import CustomerIn, current_user
router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("")
def list_customers(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT * FROM customers ORDER BY created_at DESC"); return list(cur.fetchall())

@router.post("")
def create_customer(customer: CustomerIn, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("INSERT INTO customers(name,email,phone,address) VALUES(%s,%s,%s,%s) RETURNING *", tuple(customer.model_dump().values())); return cur.fetchone()

@router.put("/{customer_id}")
def update_customer(customer_id: int, customer: CustomerIn, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("UPDATE customers SET name=%s,email=%s,phone=%s,address=%s WHERE id=%s RETURNING *", (*tuple(customer.model_dump().values()), customer_id)); row=cur.fetchone()
    if not row: raise HTTPException(404, "Customer not found")
    return row

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("DELETE FROM customers WHERE id=%s RETURNING id", (customer_id,))
        if not cur.fetchone(): raise HTTPException(404, "Customer not found")
    return {"deleted": customer_id}
