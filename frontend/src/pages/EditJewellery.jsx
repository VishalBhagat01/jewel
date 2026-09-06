import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, send } from "../services/api";
const blank = {
  item_code: "",
  name: "",
  category: "Gold",
  metal: "22K Gold",
  purity: "22K",
  weight: "",
  purchase_price: "",
  selling_price: "",
  stock: "",
  making_charges: "0",
  image_url: "",
};
export default function EditJewellery() {
  const { id } = useParams(),
    nav = useNavigate(),
    [form, setForm] = useState(blank),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (id)
      get("/inventory").then((a) =>
        setForm(a.find((x) => String(x.id) === id) || blank),
      );
  }, [id]);
  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await send(
        id ? `/inventory/${id}` : "/inventory",
        id ? "PUT" : "POST",
        form,
      );
      nav("/inventory");
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <>
      <p className="eyebrow">CATALOGUE</p>
      <h2>{id ? "Edit" : "Add"} jewellery</h2>
      <form className="editor" onSubmit={submit}>
        {Object.keys(blank).map((k) => (
          <label key={k}>
            {k.replaceAll("_", " ")}
            <input
              required={k !== "image_url"}
              value={form[k] ?? ""}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </label>
        ))}
        <button className="primary">Save piece</button>
        {message && <p className="muted">{message}</p>}
      </form>
    </>
  );
}
