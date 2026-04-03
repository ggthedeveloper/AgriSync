import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";

export default function FertilizerCalc({ th, L, user }) {
  const [farmSize, setFarmSize] = useState(user.acres || "");
  const [soilType, setSoilType] = useState("loam");
  const [cropType, setCropType] = useState("paddy");
  const [soilTest, setSoilTest] = useState("");
  const [records, setRecords] = useState(() => {
    const saved = S.get("fertilizer_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    S.set("fertilizer_history", JSON.stringify(records));
  }, [records]);

  const crops = { paddy: "Paddy", maize: "Maize", cotton: "Cotton" };

  const calculateFert = () => {
    if (!farmSize) return null;
    const reqs = { paddy: { n: 120, p: 60, k: 40 }, maize: { n: 100, p: 50, k: 40 }, cotton: { n: 80, p: 40, k: 40 } };
    const req = reqs[cropType];
    return { n: Math.round(req.n * parseFloat(farmSize)), p: Math.round(req.p * parseFloat(farmSize)), k: Math.round(req.k * parseFloat(farmSize)) };
  };

  const addRecord = () => {
    const fert = calculateFert();
    if (!fert) return;
    const record = { id: Date.now(), crop: cropType, acres: parseFloat(farmSize), urea: Math.round(fert.n / 46), dap: Math.round(fert.p / 46), mop: Math.round(fert.k / 60), date: new Date().toLocaleDateString() };
    setRecords([...records, record]);
    setFarmSize("");
    setShowForm(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: th.tx }}>Fertilizer Calculator</h2>
      <p style={{ fontSize: 14, color: th.sub, marginBottom: 16 }}>Calculate NPK requirements for your crops</p>

      {showForm && (
        <Card th={th} style={{ marginBottom: 16 }}>
          <select value={cropType} onChange={e => setCropType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input type="number" placeholder="Farm size (acres)" value={farmSize} onChange={e => setFarmSize(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <input type="number" placeholder="Soil test value (optional)" value={soilTest} onChange={e => setSoilTest(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addRecord} style={{ flex: 1 }}>Calculate</Btn>
            <Btn onClick={() => setShowForm(false)} outline style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showForm && <Btn full onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>+ Calculate</Btn>}

      {records.length > 0 && (
        <Card th={th}>
          <div style={{ fontSize: 13, fontWeight: 700, color: th.tx, marginBottom: 12 }}>Records</div>
          {records.map(r => (
            <div key={r.id} style={{ padding: 10, background: th.al, borderRadius: 8, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontWeight: 600, color: th.tx }}>{crops[r.crop]}</div><div style={{ fontSize: 12, color: th.sub }}>Urea {r.urea}  |  DAP {r.dap}  |  MOP {r.mop} bags</div></div>
              <button onClick={() => setRecords(records.filter(x => x.id !== r.id))} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
