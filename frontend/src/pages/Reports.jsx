import { useEffect, useState } from "react";
import { get } from "../services/api";
export default function Reports() {
  const [data, setData] = useState({
    dashboard: {},
    categories: [],
    top: [],
    low: [],
  });
  useEffect(() => {
    Promise.all([
      get("/reports/dashboard"),
      get("/reports/category-sales"),
      get("/reports/top-items"),
      get("/reports/low-stock"),
    ])
      .then(([dashboard, categories, top, low]) =>
        setData({ dashboard, categories, top, low }),
      )
      .catch(() => {});
  }, []);
  return (
    <>
      <p className="eyebrow">INSIGHTS</p>
      <h2>Reports</h2>
      <div className="cards">
        <div className="dash-card">
          <span>Today</span>
          <strong>
            ₹{Number(data.dashboard.today_sales || 0).toLocaleString("en-IN")}
          </strong>
        </div>
        <div className="dash-card">
          <span>This month</span>
          <strong>
            ₹{Number(data.dashboard.month_sales || 0).toLocaleString("en-IN")}
          </strong>
        </div>
      </div>
      <div className="panel">
        <h3>Category sales</h3>
        {data.categories.map((x) => (
          <p className="report-line" key={x.category}>
            <span>{x.category}</span>
            <b>₹{Number(x.total).toLocaleString("en-IN")}</b>
          </p>
        ))}
        <h3>Top items</h3>
        {data.top.map((x) => (
          <p className="report-line" key={x.item_name}>
            <span>{x.item_name}</span>
            <b>{x.quantity} sold</b>
          </p>
        ))}
        <h3>Low stock</h3>
        {data.low.map((x) => (
          <p className="report-line" key={x.id}>
            <span>{x.name}</span>
            <b>{x.stock} left</b>
          </p>
        ))}
      </div>
    </>
  );
}
