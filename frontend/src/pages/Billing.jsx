import { useEffect, useState } from "react";
import { get, send } from "../services/api";
export default function Billing() {
  const [customers, setCustomers] = useState([]),
    [items, setItems] = useState([]),
    [customer, setCustomer] = useState(""),
    [walkin, setWalkin] = useState({ name: "", phone: "" }),
    [lines, setLines] = useState([{ jewellery_id: "", quantity: 1 }]),
    [gst, setGst] = useState(3),
    [message, setMessage] = useState("");
  useEffect(() => {
    get("/customers").then(setCustomers);
    get("/inventory").then(setItems);
  }, []);
  const selected = lines.map((x) => ({
    ...x,
    p: items.find((i) => String(i.id) === String(x.jewellery_id)),
  }));
  const subtotal = selected.reduce(
      (a, x) =>
        a +
        (x.p ? Number(x.p.selling_price + x.p.making_charges) * x.quantity : 0),
      0,
    ),
    grand = subtotal * (1 + Number(gst) / 100);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await send("/sales", "POST", {
        customer_id: customer ? Number(customer) : null,
        walk_in_name: customer ? null : walkin.name,
        walk_in_phone: customer ? null : walkin.phone,
        items: lines.map((x) => ({
          jewellery_id: Number(x.jewellery_id),
          quantity: Number(x.quantity),
        })),
        gst_rate: Number(gst),
      });
      setMessage("Sale recorded successfully.");
    } catch (e) {
      setMessage(e.message);
    }
  };
  return (
    <>
      <p className="eyebrow">POINT OF SALE</p>
      <h2>New billing</h2>
      <form className="editor" onSubmit={submit}>
        <label>
          Customer
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="">Walk-in customer</option>
            {customers.map((x) => (
              <option value={x.id} key={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        {!customer && (
          <>
            <label>
              Walk-in name
              <input
                required
                value={walkin.name}
                onChange={(e) => setWalkin({ ...walkin, name: e.target.value })}
              />
            </label>
            <label>
              Walk-in phone
              <input
                value={walkin.phone}
                onChange={(e) =>
                  setWalkin({ ...walkin, phone: e.target.value })
                }
              />
            </label>
          </>
        )}
        {lines.map((line, i) => (
          <div className="sale-line" key={i}>
            <label>
              Piece
              <select
                required
                value={line.jewellery_id}
                onChange={(e) =>
                  setLines(
                    lines.map((x, j) =>
                      j === i ? { ...x, jewellery_id: e.target.value } : x,
                    ),
                  )
                }
              >
                <option value="">Select piece</option>
                {items.map((x) => (
                  <option value={x.id} key={x.id}>
                    {x.name} — ₹{x.selling_price}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Qty
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) =>
                  setLines(
                    lines.map((x, j) =>
                      j === i ? { ...x, quantity: e.target.value } : x,
                    ),
                  )
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setLines([...lines, { jewellery_id: "", quantity: 1 }])
          }
        >
          + Add another item
        </button>
        <label>
          GST %
          <input
            type="number"
            min="0"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
        </label>
        <p>
          Subtotal: ₹{subtotal.toLocaleString("en-IN")} · GST: ₹
          {(grand - subtotal).toLocaleString("en-IN")} ·{" "}
          <b>Grand total: ₹{grand.toLocaleString("en-IN")}</b>
        </p>
        <button className="primary">Complete sale</button>
        {message && <p className="muted">{message}</p>}
      </form>
    </>
  );
}
