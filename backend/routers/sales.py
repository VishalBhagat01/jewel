from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from main import SaleIn, current_user
router = APIRouter(prefix="/api/sales", tags=["sales"])

@router.post("", status_code=201)
def create_sale(sale: SaleIn, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        customer_id = sale.customer_id
        if not customer_id:
            if not sale.walk_in_name: raise HTTPException(400, "Walk-in name is required")
            cur.execute("INSERT INTO customers(name,email,phone,address) VALUES(%s,%s,%s,%s) RETURNING id", (sale.walk_in_name, "walkin@local", sale.walk_in_phone or "N/A", "Walk-in customer"))
            customer_id = cur.fetchone()["id"]
        else:
            cur.execute("SELECT id FROM customers WHERE id=%s", (customer_id,))
            if not cur.fetchone(): raise HTTPException(404, "Customer not found")
        subtotal = Decimal("0"); locked = []
        for item in sale.items:
            cur.execute("SELECT id,item_code,name,selling_price,making_charges,stock FROM jewellery WHERE id=%s FOR UPDATE", (item.jewellery_id,))
            row = cur.fetchone()
            if not row: raise HTTPException(404, "Jewellery not found")
            if row["stock"] < item.quantity: raise HTTPException(409, f"Insufficient stock for {row['name']}")
            line = (row["selling_price"] + row["making_charges"]) * item.quantity
            subtotal += line; locked.append((item, row, line))
        gst = (subtotal * sale.gst_rate / Decimal("100")).quantize(Decimal("0.01"))
        grand_total = subtotal + gst
        cur.execute("INSERT INTO sales(customer_id,invoice_number,subtotal,making_charges,gst_rate,gst_amount,grand_total,total) VALUES(%s,concat('MJ-',to_char(now(),'YYYYMMDDHH24MISSMS')), %s,%s,%s,%s,%s,%s) RETURNING *", (customer_id, subtotal, sum(r["making_charges"]*i.quantity for i,r,_ in locked), sale.gst_rate, gst, grand_total, grand_total))
        result = cur.fetchone()
        for item,row,line in locked:
            cur.execute("INSERT INTO sale_items(sale_id,jewellery_id,item_code,item_name,quantity,unit_price,making_charges,line_total) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)", (result["id"],row["id"],row["item_code"],row["name"],item.quantity,row["selling_price"],row["making_charges"],line))
            cur.execute("UPDATE jewellery SET stock=stock-%s,updated_at=now() WHERE id=%s", (item.quantity,row["id"]))
        return result

@router.get("")
def list_sales(_: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT s.*,c.name AS customer_name,c.phone FROM sales s JOIN customers c ON c.id=s.customer_id ORDER BY s.created_at DESC"); return list(cur.fetchall())

@router.get("/{sale_id}")
def invoice(sale_id: int, _: dict = Depends(current_user)):
    with get_db() as conn, conn.cursor() as cur:
        cur.execute("SELECT s.*,c.name AS customer_name,c.email,c.phone,c.address FROM sales s JOIN customers c ON c.id=s.customer_id WHERE s.id=%s",(sale_id,)); sale=cur.fetchone()
        if not sale: raise HTTPException(404,"Invoice not found")
        cur.execute("SELECT * FROM sale_items WHERE sale_id=%s",(sale_id,)); sale["items"]=list(cur.fetchall())
        return sale
