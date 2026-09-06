import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../services/api";

export default function SalesHistory() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    get("/sales")
      .then(setRows)
      .catch(() => {});
  }, []);

  const filtered = rows.filter((sale) =>
    `${sale.invoice_number} ${sale.customer_name}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <p className="eyebrow">RECORDS</p>
      <h2>Sales history</h2>
      <input
        className="history-search"
        placeholder="Search invoice or customer"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="table">
        {filtered.map((sale) => (
          <div className="tr" key={sale.id}>
            <span>
              <b>{sale.invoice_number}</b>
              <small>{new Date(sale.created_at).toLocaleString()}</small>
            </span>
            <span>{sale.customer_name}</span>
            <strong>
              INR {Number(sale.grand_total).toLocaleString("en-IN")}
            </strong>
            <Link to={`/invoice/${sale.id}`}>View invoice</Link>
          </div>
        ))}
      </div>
    </>
  );
}
