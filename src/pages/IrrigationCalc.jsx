import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";

export default function IrrigationCalc({ th, L, user }) {
  const [farmSize, setFarmSize] = useState("");
  const [cropType, setCropType] = useState("paddy");
  const [schedules, setSchedules] = useState(() => S.get("irrigation_schedules") ? JSON.parse(S.get("irrigation_schedules")) : []);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { S.set("irrigation_schedules", JSON.stringify(schedules)); }, [schedules]);

  const crops = {
    paddy: { name: "Paddy", waterNeed: 1200, interval: 7 },
    maize: { name: "Maize", waterNeed: 400, interval: 10 },
    cotton: { name: "Cotton", waterNeed: 300, interval: 12 },
  };

  const handleAddSchedule = () => {
    if (!farmSize || farmSize <= 0) return;
    const crop = crops[cropType];
    const waterNeeded = (crop.waterNeed * parseFloat(farmSize) / 1000).toFixed(1);
    setSchedules([...schedules, { id: Date.now(), crop: cropType, farmSize, waterNeeded, interval: crop.interval, date: new Date().toLocaleDateString() }]);
    setFarmSize("");
    setShowForm(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: th.tx }}>Irrigation Planner</h2>
      <p style={{ fontSize: 14, color: th.sub, marginBottom: 16 }}>Calculate optimal water schedule for crops</p>

      {showForm && (
        <Card th={th} style={{ marginBottom: 16 }}>
          <select value={cropType} onChange={e => setCropType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <input type="number" placeholder="Farm size (acres)" value={farmSize} onChange={e => setFarmSize(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleAddSchedule} style={{ flex: 1 }}>Calculate</Btn>
            <Btn onClick={() => setShowForm(false)} outline style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showForm && <Btn full onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>+ Add Schedule</Btn>}

      {schedules.length > 0 && (
        <Card th={th}>
          <div style={{ fontSize: 13, fontWeight: 700, color: th.tx, marginBottom: 12 }}>Active Schedules</div>
          {schedules.map((s) => (
            <div key={s.id} style={{ padding: 10, background: th.al, borderRadius: 8, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontWeight: 600, color: th.tx }}>{crops[s.crop].name}</div><div style={{ fontSize: 12, color: th.sub }}>{s.waterNeeded}K liters every {crops[s.crop].interval} days</div></div>
              <button onClick={() => setSchedules(schedules.filter(x => x.id !== s.id))} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
