import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, send } from "../services/api";
export default function Inventory() {
  const [rows, setRows] = useState([]);
  const load = () =>
    get("/inventory")
      .then(setRows)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <div className="page-title">
        <div>
          <p className="eyebrow">CATALOGUE</p>
          <h2>Inventory</h2>
        </div>
        <Link className="primary" to="/inventory/add">
          Add jewellery
        </Link>
      </div>
      <div className="table">
        <div className="tr th">
          <span>Item</span>
          <span>Category</span>
          <span>Selling price</span>
          <span>Stock</span>
        </div>
        {rows.map((x) => (
          <div className="tr" key={x.id}>
            <span>
              <b>
                {x.item_code} · {x.name}
              </b>
              <small>
                {x.metal} · {x.purity} · {x.weight}g
              </small>
            </span>
            <span>{x.category}</span>
            <span>₹{Number(x.selling_price).toLocaleString("en-IN")}</span>
            <span className={x.stock < 5 ? "low" : ""}>{x.stock}</span>
            <Link to={`/inventory/edit/${x.id}`}>Edit</Link>
          </div>
        ))}
      </div>
    </>
  );
}
