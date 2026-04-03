import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";

export default function FarmAnalytics({ th, L, user }) {
  const [records, setRecords] = useState(() => {
    const saved = S.get("farm_analytics");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [crop, setCrop] = useState("paddy");
  const [season, setSeason] = useState("kharif");
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [yield_, setYield] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    S.set("farm_analytics", JSON.stringify(records));
  }, [records]);

  const crops = { paddy: "Paddy", maize: "Maize", cotton: "Cotton" };
  const seasons = { kharif: "Kharif", rabi: "Rabi", summer: "Summer" };

  const addRecord = () => {
    if (!revenue || !expenses) return;
    const newRecord = { id: Date.now(), crop, season, revenue: parseFloat(revenue), expenses: parseFloat(expenses), yield: parseFloat(yield_ || 0), date: new Date().toLocaleDateString(), notes };
    setRecords([...records, newRecord]);
    setRevenue("");
    setExpenses("");
    setYield("");
    setNotes("");
    setShowForm(false);
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  // Calculate totals
  const totalRevenue = records.reduce((s, r) => s + r.revenue, 0);
  const totalExpenses = records.reduce((s, r) => s + r.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgYield = records.length > 0 ? (records.reduce((s, r) => s + r.yield, 0) / records.length).toFixed(1) : 0;
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  // Group by crop
  const byCrop = {};
  records.forEach((r) => {
    if (!byCrop[r.crop]) {
      byCrop[r.crop] = { revenue: 0, expenses: 0, yield: 0, count: 0 };
    }
    byCrop[r.crop].revenue += r.revenue;
    byCrop[r.crop].expenses += r.expenses;
    byCrop[r.crop].yield += r.yield;
    byCrop[r.crop].count += 1;
  });

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: th.tx }}>Farm Analytics</h2>
      <p style={{ fontSize: 14, color: th.sub, marginBottom: 16 }}>Track profitability and yields</p>

      {showForm && (
        <Card th={th} style={{ marginBottom: 16 }}>
          <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={season} onChange={e => setSeason(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(seasons).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input type="number" placeholder="Revenue (₹)" value={revenue} onChange={e => setRevenue(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <input type="number" placeholder="Expenses (₹)" value={expenses} onChange={e => setExpenses(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <input type="number" placeholder="Yield (tons)" value={yield_} onChange={e => setYield(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addRecord} style={{ flex: 1 }}>Save</Btn>
            <Btn onClick={() => setShowForm(false)} outline style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showForm && <Btn full onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>+ Add Record</Btn>}

      {records.length > 0 && (
        <Card th={th}>
          <div style={{ fontSize: 13, fontWeight: 700, color: th.tx, marginBottom: 12 }}>Recent Records</div>
          {records.map(r => (
            <div key={r.id} style={{ padding: 10, background: th.al, borderRadius: 8, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontWeight: 600, color: th.tx }}>{crops[r.crop]} · ₹{(r.revenue - r.expenses).toLocaleString()}</div><div style={{ fontSize: 12, color: th.sub }}>Revenue ₹{r.revenue.toLocaleString()} | Expenses ₹{r.expenses.toLocaleString()}</div></div>
              <button onClick={() => setRecords(records.filter(x => x.id !== r.id))} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
