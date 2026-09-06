-- Safe demo data for presentations. Existing records are preserved.
BEGIN;

INSERT INTO jewellery
  (item_code, name, category, metal, purity, weight, purchase_price,
   selling_price, making_charges, stock)
VALUES
  ('MJ-RING-001', 'Aarohi Solitaire Ring', 'Rings', 'Gold', '18K', 4.250, 32000, 42500, 2500, 8),
  ('MJ-EARRING-001', 'Meera Pearl Jhumka', 'Earrings', 'Gold', '22K', 7.800, 21000, 28500, 1800, 12),
  ('MJ-NECK-001', 'Rajputana Heritage Necklace', 'Necklaces', 'Gold', '22K', 28.500, 92000, 118000, 6500, 4),
  ('MJ-BANGLE-001', 'Kundan Classic Bangle', 'Bangles', 'Gold', '22K', 16.200, 25000, 32000, 2200, 6),
  ('MJ-PEND-001', 'Noor Emerald Pendant', 'Pendants', 'Gold', '18K', 3.100, 14500, 19500, 1200, 9),
  ('MJ-SILVER-001', 'Ziya Silver Anklet', 'Silver', 'Silver', '925', 18.000, 6200, 8500, 700, 15)
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO customers (name, email, phone, address)
SELECT v.name, v.email, v.phone, v.address
FROM (VALUES
  ('Aditi Sharma', 'aditi@example.com', '9876543210', 'Jaipur, Rajasthan'),
  ('Rohan Mehta', 'rohan@example.com', '9876543211', 'Delhi, India'),
  ('Neha Kapoor', 'neha@example.com', '9876543212', 'Mumbai, Maharashtra'),
  ('Vikram Singh', 'vikram@example.com', '9876543213', 'Chandigarh, India')
) AS v(name, email, phone, address)
WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.email = v.email);

DO $$
DECLARE
  sale_id INTEGER;
  customer_id INTEGER;
BEGIN
  SELECT id INTO customer_id FROM customers WHERE email = 'aditi@example.com';
  IF NOT EXISTS (SELECT 1 FROM sales WHERE invoice_number = 'MJ-DEMO-001') THEN
    INSERT INTO sales (customer_id, invoice_number, subtotal, making_charges, gst_rate, gst_amount, grand_total, total)
    VALUES (customer_id, 'MJ-DEMO-001', 75300, 4300, 3, 2259, 77559, 77559)
    RETURNING id INTO sale_id;
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 1, selling_price, making_charges, selling_price + making_charges
    FROM jewellery WHERE item_code = 'MJ-RING-001';
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 1, selling_price, making_charges, selling_price + making_charges
    FROM jewellery WHERE item_code = 'MJ-EARRING-001';
    UPDATE jewellery SET stock = stock - 1 WHERE item_code IN ('MJ-RING-001', 'MJ-EARRING-001');
  END IF;

  SELECT id INTO customer_id FROM customers WHERE email = 'rohan@example.com';
  IF NOT EXISTS (SELECT 1 FROM sales WHERE invoice_number = 'MJ-DEMO-002') THEN
    INSERT INTO sales (customer_id, invoice_number, subtotal, making_charges, gst_rate, gst_amount, grand_total, total)
    VALUES (customer_id, 'MJ-DEMO-002', 192900, 10900, 3, 5787, 198687, 198687)
    RETURNING id INTO sale_id;
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 1, selling_price, making_charges, selling_price + making_charges
    FROM jewellery WHERE item_code = 'MJ-NECK-001';
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 2, selling_price, making_charges, (selling_price + making_charges) * 2
    FROM jewellery WHERE item_code = 'MJ-BANGLE-001';
    UPDATE jewellery SET stock = stock - 1 WHERE item_code = 'MJ-NECK-001';
    UPDATE jewellery SET stock = stock - 2 WHERE item_code = 'MJ-BANGLE-001';
  END IF;

  SELECT id INTO customer_id FROM customers WHERE email = 'neha@example.com';
  IF NOT EXISTS (SELECT 1 FROM sales WHERE invoice_number = 'MJ-DEMO-003') THEN
    INSERT INTO sales (customer_id, invoice_number, subtotal, making_charges, gst_rate, gst_amount, grand_total, total)
    VALUES (customer_id, 'MJ-DEMO-003', 39100, 2600, 3, 1173, 40273, 40273)
    RETURNING id INTO sale_id;
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 2, selling_price, making_charges, (selling_price + making_charges) * 2
    FROM jewellery WHERE item_code = 'MJ-SILVER-001';
    INSERT INTO sale_items (sale_id, jewellery_id, item_code, item_name, quantity, unit_price, making_charges, line_total)
    SELECT sale_id, id, item_code, name, 1, selling_price, making_charges, selling_price + making_charges
    FROM jewellery WHERE item_code = 'MJ-PEND-001';
    UPDATE jewellery SET stock = stock - 2 WHERE item_code = 'MJ-SILVER-001';
    UPDATE jewellery SET stock = stock - 1 WHERE item_code = 'MJ-PEND-001';
  END IF;
END $$;

COMMIT;
