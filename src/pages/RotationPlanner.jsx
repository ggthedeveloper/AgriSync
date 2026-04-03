import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";

export default function RotationPlanner({ th, L, user }) {
  const [rotations, setRotations] = useState(() => {
    const saved = S.get("crop_rotation");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [field, setField] = useState("");
  const [currentCrop, setCurrentCrop] = useState("paddy");
  const [plantDate, setPlantDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    S.set("crop_rotation", JSON.stringify(rotations));
  }, [rotations]);

  const crops = { paddy: "Paddy", maize: "Maize", cotton: "Cotton", groundnut: "Groundnut", wheat: "Wheat" };

  const addRotation = () => {
    if (!field || !plantDate) return;
    const rotation = { id: Date.now(), field, crops: [currentCrop], startDate: plantDate, created: new Date().toLocaleDateString() };
    setRotations([...rotations, rotation]);
    setField("");
    setPlantDate("");
    setShowForm(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px", color: th.tx }}>Crop Rotation</h2>
      <p style={{ fontSize: 14, color: th.sub, marginBottom: 16 }}>Plan sustainable crop rotations</p>

      {showForm && (
        <Card th={th} style={{ marginBottom: 16 }}>
          <input type="text" placeholder="Field name" value={field} onChange={e => setField(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <select value={currentCrop} onChange={e => setCurrentCrop(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
            {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input type="date" value={plantDate} onChange={e => setPlantDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: 10, border: `1px solid ${th.br}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addRotation} style={{ flex: 1 }}>Create</Btn>
            <Btn onClick={() => setShowForm(false)} outline style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showForm && <Btn full onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>+ New Rotation</Btn>}

      {rotations.map(r => (
        <Card key={r.id} th={th} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: th.tx, marginBottom: 10 }}>{r.field} · {r.crops.join(" → ")}</div>
          <div style={{ fontSize: 12, color: th.sub, marginBottom: 12 }}>Started: {new Date(r.startDate).toLocaleDateString()}</div>
          <button onClick={() => setRotations(rotations.filter(x => x.id !== r.id))} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Delete</button>
        </Card>
      ))}
    </div>
  );
}
