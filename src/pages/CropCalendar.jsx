import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";

export default function CropCalendar({ th, L, user }) {
  const [cropPlans, setCropPlans] = useState(() => S.get("crop_calendar") ? JSON.parse(S.get("crop_calendar")) : []);
  const [selectedCrop, setSelectedCrop] = useState("paddy");
  const [showAddForm, setShowAddForm] = useState(false);
  const [plantDate, setPlantDate] = useState("");

  useEffect(() => { S.set("crop_calendar", JSON.stringify(cropPlans)); }, [cropPlans]);

  const crops = {
    paddy: { name: "Paddy", duration: 120, tasks: [{ day: 0, task: "Land prep" }, { day: 7, task: "Sowing" }, { day: 45, task: "Fertilize" }, { day: 120, task: "Harvest" }] },
    maize: { name: "Maize", duration: 120, tasks: [{ day: 0, task: "Soil prep" }, { day: 5, task: "Sowing" }, { day: 45, task: "First fertility" }, { day: 120, task: "Harvest" }] },
    cotton: { name: "Cotton", duration: 210, tasks: [{ day: 0, task: "Land prep" }, { day: 7, task: "Sowing" }, { day: 90, task: "Flowering" }, { day: 210, task: "Picking" }] },
  };

  const addPlan = () => {
    if (!plantDate) return;
    const crop = crops[selectedCrop];
    const newPlan = { id: Date.now(), crop: selectedCrop, plantDate, tasks: crop.tasks.map(t => ({ ...t, date: new Date(new Date(plantDate).getTime() + t.day * 86400000).toLocaleDateString(), completed: false })) };
    setCropPlans([...cropPlans, newPlan]);
    setPlantDate("");
    setShowAddForm(false);
  };

  const toggleTask = (planId, taskIdx) => {
    setCropPlans(cropPlans.map(p => p.id === planId ? { ...p, tasks: p.tasks.map((t, i) => i === taskIdx ? { ...t, completed: !t.completed } : t) } : p));
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: th.tx }}>Crop Calendar</h2>
      <p style={{ fontSize: 14, color: th.sub, marginBottom: 16 }}>Track planting dates and growth stages</p>

      {showAddForm && (
        <Card th={th} style={{ marginBottom: 16 }}>
          <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <input type="date" value={plantDate} onChange={e => setPlantDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addPlan} style={{ flex: 1 }}>Add Plan</Btn>
            <Btn onClick={() => setShowAddForm(false)} outline style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showAddForm && <Btn full onClick={() => setShowAddForm(true)} style={{ marginBottom: 16 }}>+ New Plan</Btn>}

      {cropPlans.map((plan) => (
        <Card key={plan.id} th={th} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: th.tx, marginBottom: 12 }}>{crops[plan.crop].name} - {plan.plantDate}</div>
          {plan.tasks.map((t, i) => (
            <div key={i} onClick={() => toggleTask(plan.id, i)} style={{ padding: 10, background: t.completed ? "#e0f2fe" : th.al, borderRadius: 6, marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={t.completed} onChange={() => {}} style={{ cursor: "pointer" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: th.tx, textDecoration: t.completed ? "line-through" : "none" }}>Day {t.day}: {t.task}</div>
                <div style={{ fontSize: 12, color: th.sub }}>{t.date}</div>
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
