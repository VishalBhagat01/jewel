import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { send } from "../services/api";
export default function Login() {
  const [form, setForm] = useState({ username: "admin", password: "admin123" }),
    [error, setError] = useState(""),
    nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      const r = await send("/auth/login", "POST", form);
      localStorage.setItem("token", r.token);
      localStorage.setItem("user", JSON.stringify(r.user));
      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <main className="login">
      <div className="login-art">
        <span>MOHIT</span>
        <em>Crafting what lasts.</em>
      </div>
      <form onSubmit={submit}>
        <p className="eyebrow">PRIVATE ATELIER</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage your jewellery house.</p>
        {["username", "password"].map((k) => (
          <label key={k}>
            {k}
            <input
              type={k === "password" ? "password" : "text"}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </label>
        ))}
        {error && <p className="error">{error}</p>}
        <button className="primary">Enter dashboard</button>
      </form>
    </main>
  );
}
