import { useEffect, useState } from "react";
import { get } from "../services/api";
import DashboardCard from "../components/DashboardCard";
const formatPrice = (price) =>
  price == null
    ? "—"
    : `₹${Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatChange = (change, percent) =>
  change == null
    ? ""
    : `${change >= 0 ? "+" : ""}₹${Number(change).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${Number(percent || 0).toFixed(2)}%)`;
export default function Dashboard() {
  const [d, setD] = useState({}),
    [metals, setMetals] = useState(null),
    [metalError, setMetalError] = useState("");
  useEffect(() => {
    get("/reports/dashboard")
      .then(setD)
      .catch(() => {});
    get("/reports/metal-prices")
      .then(setMetals)
      .catch((error) => setMetalError(error.message));
  }, []);
  return (
    <>
      <p className="eyebrow">OVERVIEW</p>
      <h2>Today at a glance.</h2>
      <div className="cards">
        <DashboardCard
          label="Today’s sales"
          value={`₹${Number(d.today_sales || 0).toLocaleString("en-IN")}`}
          accent
        />
        <DashboardCard
          label="This month"
          value={`₹${Number(d.month_sales || 0).toLocaleString("en-IN")}`}
        />
        <DashboardCard label="Pieces in catalogue" value={d.inventory ?? "—"} />
        <DashboardCard label="Customers" value={d.customers ?? "—"} />
      </div>
      <section className="panel">
        <h3>Live metal prices</h3>
        {metalError ? (
          <p className="muted">{metalError}</p>
        ) : (
          <div className="cards">
            <div className="dash-card">
              <span>Gold · INR / troy oz</span>
              <strong>{formatPrice(metals?.gold.price)}</strong>
              <small>
                {metals &&
                  formatChange(metals.gold.change, metals.gold.percent_change)}
              </small>
            </div>
            <div className="dash-card">
              <span>Silver · INR / troy oz</span>
              <strong>{formatPrice(metals?.silver.price)}</strong>
              <small>
                {metals &&
                  formatChange(
                    metals.silver.change,
                    metals.silver.percent_change,
                  )}
              </small>
            </div>
          </div>
        )}
      </section>
      <section className="panel">
        <h3>Welcome to your atelier dashboard</h3>
        <p className="muted">
          Use the sidebar to manage jewellery, customers, billing and reports.
        </p>
      </section>
    </>
  );
}
