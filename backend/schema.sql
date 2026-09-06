CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, full_name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS jewellery (id SERIAL PRIMARY KEY, item_code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, metal TEXT NOT NULL, purity TEXT NOT NULL, weight NUMERIC(10,3) NOT NULL CHECK(weight>=0), purchase_price NUMERIC(12,2) NOT NULL CHECK(purchase_price>=0), selling_price NUMERIC(12,2) NOT NULL CHECK(selling_price>=0), making_charges NUMERIC(12,2) NOT NULL DEFAULT 0, stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0), image_url TEXT DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS customers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, address TEXT DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sales (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), invoice_number TEXT UNIQUE NOT NULL, subtotal NUMERIC(12,2) NOT NULL, making_charges NUMERIC(12,2) NOT NULL DEFAULT 0, gst_rate NUMERIC(5,2) NOT NULL DEFAULT 3, gst_amount NUMERIC(12,2) NOT NULL DEFAULT 0, grand_total NUMERIC(12,2) NOT NULL, total NUMERIC(12,2) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sale_items (id SERIAL PRIMARY KEY, sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE, jewellery_id INTEGER NOT NULL REFERENCES jewellery(id), item_code TEXT NOT NULL, item_name TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity>0), unit_price NUMERIC(12,2) NOT NULL, making_charges NUMERIC(12,2) NOT NULL DEFAULT 0, line_total NUMERIC(12,2) NOT NULL);
CREATE INDEX IF NOT EXISTS jewellery_stock_idx ON jewellery(stock);

-- Demo administrator for local training. The password is stored as a SHA-256 hash.
-- Re-running this statement is safe because username is unique.
INSERT INTO users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Mohit Jewellers Admin',
  'admin'
)
ON CONFLICT (username) DO NOTHING;
