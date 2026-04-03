import { useState, useEffect } from "react";
import { S } from "../utils/storage";
import { Card, Btn } from "../components/UI";
import { I } from "../components/Icons";

export default function PhAnalysis({ th, L, user }) {
  const [readings, setReadings] = useState(() => S.get("ph_readings") ? JSON.parse(S.get("ph_readings")) : []);
  const [showForm, setShowForm] = useState(false);
  const [phValue, setPhValue] = useState("");
  
  useEffect(() => { S.set("ph_readings", JSON.stringify(readings)); }, [readings]);

  const handleAdd = () => {
    if (!phValue) return;
    setReadings([...readings, { id: Date.now(), date: new Date().toLocaleDateString(), ph: parseFloat(phValue) }]);
    setPhValue("");
    setShowForm(false);
  };

  const avgPH = readings.length > 0 ? (readings.reduce((s, r) => s + r.ph, 0) / readings.length).toFixed(1) : "—";

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 14px", color:th.tx }}>{L.phTrend}</h2>
      <p style={{ fontSize:14, color:th.sub, marginBottom:16 }}>Track soil pH levels over time</p>

      {/* Average pH Card */}
      <Card th={th} style={{ marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:28, fontWeight:700, color:th.ac }}>{avgPH}</div>
        <div style={{ fontSize:12, color:th.sub, marginTop:6 }}>Average pH</div>
      </Card>

      {/* Add form */}
      {showForm && (
        <Card th={th} style={{ marginBottom:16 }}>
          <input type="number" min="1" max="14" step="0.1" placeholder="Enter pH (1-14)" value={phValue} onChange={e => setPhValue(e.target.value)} style={{ width:"100%", padding:"10px", marginBottom:10, border:`1px solid ${th.br}`, borderRadius:8, fontSize:14, fontFamily:"inherit", boxSizing:"border-box" }} />
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={handleAdd} style={{ flex:1 }}>Save</Btn>
            <Btn onClick={() => setShowForm(false)} outline style={{ flex:1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {!showForm && <Btn full onClick={() => setShowForm(true)} style={{ marginBottom:16 }}>+ Add Reading</Btn>}

      {/* Readings list */}
      {readings.length > 0 && (
        <Card th={th}>
          <div style={{ fontSize:13, fontWeight:700, color:th.mt, marginBottom:10 }}>Recent Readings</div>
          {[...readings].reverse().map((r) => (
            <div key={r.id} style={{ padding:10, background:th.al, borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:600, color:th.tx }}>pH {r.ph}</div><div style={{ fontSize:12, color:th.sub }}>{r.date}</div></div>
              <button onClick={() => setReadings(readings.filter(x => x.id !== r.id))} style={{ background:"transparent", border:"none", color:"#ef4444", cursor:"pointer", fontWeight:600, fontSize:12 }}>Delete</button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
