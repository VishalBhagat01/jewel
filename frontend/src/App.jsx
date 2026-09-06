import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddJewellery from "./pages/AddJewellery";
import EditJewellery from "./pages/EditJewellery";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import SalesHistory from "./pages/SalesHistory";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import "./index.css";

function AppLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/add" element={<AddJewellery />} />
            <Route path="inventory/edit/:id" element={<EditJewellery />} />
            <Route path="customers" element={<Customers />} />
            <Route path="billing" element={<Billing />} />
            <Route path="sales-history" element={<SalesHistory />} />
            <Route path="invoice/:id" element={<Invoice />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
