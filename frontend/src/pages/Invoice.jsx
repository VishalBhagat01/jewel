import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../services/api";

export default function Invoice() {
  const { id } = useParams(),
    [sale, setSale] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    setError("");
    get(`/sales/${id}`)
      .then(setSale)
      .catch((error) => setError(error.message));
  }, [id]);
  if (error)
    return (
      <section className="panel">
        <h2>Unable to load invoice</h2>
        <p className="muted">{error}</p>
        <Link to="/sales-history">Back to sales history</Link>
      </section>
    );
  if (!sale) return <p>Loading invoice...</p>;
  const items = Array.isArray(sale.items) ? sale.items : [];
  return (
    <section className="invoice panel">
      <button className="primary no-print" onClick={() => print()}>
        Print invoice
      </button>
      <p className="eyebrow">MOHIT JEWELLERS</p>
      <h2>{sale.invoice_number}</h2>
      <p>
        Customer: <b>{sale.customer_name}</b>
        <br />
        {sale.phone} · {sale.email}
        <br />
        {sale.address}
      </p>
      <div className="table">
        {items.map((x) => (
          <div className="tr" key={x.id}>
            <span>
              {x.item_name}
              <small>{x.item_code}</small>
            </span>
            <span>Qty {x.quantity}</span>
            <span>₹{Number(x.line_total).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <p>
        Subtotal: ₹{sale.subtotal}
        <br />
        Making charges: ₹{sale.making_charges}
        <br />
        GST ({sale.gst_rate}%): ₹{sale.gst_amount}
        <br />
        <b>Grand total: ₹{sale.grand_total}</b>
      </p>
    </section>
  );
}
