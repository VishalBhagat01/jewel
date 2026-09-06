import { NavLink } from "react-router-dom";
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>
        MOHIT<small>JEWELLERS</small>
      </h2>
      <nav>
        {[
          ["/dashboard", "Overview"],
          ["/inventory", "Inventory"],
          ["/customers", "Customers"],
          ["/billing", "Billing"],
          ["/sales-history", "Sales history"],
          ["/reports", "Reports"],
        ].map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <p className="sidebar-foot">
        Atelier management
        <br />© 2026 Mohit
      </p>
    </aside>
  );
}
