import { useEffect, useState } from "react";
import { get, send } from "../services/api";
const blank = { name: "", email: "", phone: "", address: "" };
export default function Customers() {
  const [rows, setRows] = useState([]),
    [form, setForm] = useState(blank),
    [editing, setEditing] = useState(null);
  const load = () =>
    get("/customers")
      .then(setRows)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    await send(
      editing ? `/customers/${editing}` : "/customers",
      editing ? "PUT" : "POST",
      form,
    );
    setForm(blank);
    setEditing(null);
    load();
  };
  const remove = async (id) => {
    if (confirm("Delete customer?")) {
      await send(`/customers/${id}`, "DELETE", {});
      load();
    }
  };
  return (
    <>
      <p className="eyebrow">RELATIONSHIPS</p>
      <h2>Customers</h2>
      <form className="customer-form" onSubmit={submit}>
        {Object.keys(blank).map((k) => (
          <input
            required={k !== "address"}
            key={k}
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
        <button className="primary">
          {editing ? "Update" : "Add"} customer
        </button>
      </form>
      <div className="table">
        {rows.map((x) => (
          <div className="tr" key={x.id}>
            <span>
              <b>{x.name}</b>
              <small>{x.email}</small>
            </span>
            <span>{x.phone}</span>
            <span>{x.address}</span>
            <button
              onClick={() => {
                setEditing(x.id);
                setForm(x);
              }}
            >
              Edit
            </button>
            <button onClick={() => remove(x.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}
