import { useState, useEffect } from "react";
import { PLANS } from "../data/constants";
import { I } from "../components/Icons";
import { Card, SL, Bar, Bdg, Btn } from "../components/UI";
import PayModal from "../components/PayModal";

const WIcon = ({ type, size=18 }) => {
  const m = { rain:"cloudRain", cloud:"cloud", sun:"sun" };
  const c = { rain:"#60a5fa", cloud:"#94a3b8", sun:"#f59e0b" };
  return <I n={m[type]||"sun"} size={size} color={c[type]||"#f59e0b"} />;
};

export default function Dashboard({ th, L, user, farm, WT: staticWT, crops, offline, sub, setSub, payM, setPayM, goTo, setEf, setGpsErr, setProfOpen, notify, LocBar }) {
  const [liveWT, setLiveWT] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Fetch live weather using Open-Meteo (free, no key needed)
  useEffect(() => {
    const COORDS = {
      Guntur:     [16.3008, 80.4428], Warangal: [18.0, 79.5778], Vijayawada: [16.5062, 80.648],
      Hyderabad:  [17.3850, 78.4867], Nalgonda: [17.0575, 79.267], Kurnool: [15.8281, 78.0373],
      Delhi:      [28.6139, 77.2090], Mumbai:   [19.0760, 72.8777], Bengaluru:[12.9716, 77.5946],
      Chennai:    [13.0827, 80.2707], Pune:     [18.5204, 73.8567],
    };
    const coords = COORDS[farm.loc];
    if (!coords) return;
    setWeatherLoading(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability&hourly=precipitation_probability&daily=weather_code,temperature_2m_max&timezone=Asia/Kolkata&forecast_days=5`)
      .then(r => r.json())
      .then(d => {
        const cur = d.current;
        const days = d.daily;
        const codeToIcon = c => c < 3 ? "sun" : c < 50 ? "cloud" : "rain";
        const dayLabels = ["Mon","Tue","Wed","Thu","Fri"];
        setLiveWT({
          t: Math.round(cur.temperature_2m),
          h: cur.relative_humidity_2m,
          w: Math.round(cur.wind_speed_10m),
          r: cur.precipitation_probability || 0,
          c: cur.temperature_2m > 35 ? "Hot & Sunny" : cur.temperature_2m > 28 ? "Warm" : "Pleasant",
          f: (days?.temperature_2m_max||[]).slice(0,5).map((t,i) => [dayLabels[i]||"", Math.round(t), codeToIcon(days.weather_code?.[i]||0)]),
          live: true,
        });
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
  }, [farm.loc]);

  const WT = liveWT || staticWT;

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontSize:"clamp(20px,5vw,24px)", fontWeight:800, margin:"0 0 4px", color:th.tx }}>
          {L.morning} {user.name.split(" ")[0]}!
        </h2>
        <p style={{ fontSize:14, color:th.sub, margin:0 }}>{farm.name} · {farm.loc} · {farm.acres} {L.acres}</p>
      </div>

      {LocBar && <LocBar />}

      {/* Smart Alerts */}
      <Card th={th}>
        <SL th={th}>{L.alerts}</SL>
        {[
          { msg: WT?.r > 40 ? L.alertHeavyRain : L.alertRain, c:"#2563eb", icon:"alert" },
          { msg: WT?.h > 70 ? L.alertHumidHigh : L.alertHumidOk, c: WT?.h > 70 ? "#ea580c" : "#16a34a", icon: WT?.h > 70 ? "alertTriangle" : "checkCirc" },
          { msg: L.alertFert, c:"#16a34a", icon:"checkCirc" },
          { msg: WT?.t > 35 ? L.alertTempHigh : L.alertTempOk, c: WT?.t > 35 ? "#dc2626" : "#16a34a", icon: WT?.t > 35 ? "alert" : "checkCirc" },
          { msg: WT?.w > 25 ? L.alertWindHigh : L.alertWindOk, c: WT?.w > 25 ? "#ea580c" : "#16a34a", icon: WT?.w > 25 ? "alert" : "checkCirc" },
        ].map(({ msg, c, icon }, i) => (
          <div key={i} style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:i<4?9:0, padding:"10px 12px", background:c+"12", borderRadius:10, borderLeft:`3px solid ${c}` }}>
            <I n={icon} size={14} color={c} style={{ flexShrink:0, marginTop:2 }} />
            <span style={{ fontSize:14, color:th.tx, lineHeight:1.55 }}>{msg}</span>
          </div>
        ))}
      </Card>

      {/* Live Weather Card */}
      <Card th={th}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <SL th={th}>{L.weather} — {farm.loc}</SL>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            {WT?.live && <Bdg color="#16a34a" style={{ fontSize:10 }}>🟢 Live</Bdg>}
            {weatherLoading && <div style={{ fontSize:11, color:th.mt }}>Updating...</div>}
          </div>
        </div>
        <div className="as-weather-row">
          <div>
            <div className="as-weather-temp" style={{ color:th.tx }}>{WT?.t}°C</div>
            <div style={{ fontSize:15, color:th.sub, marginTop:6 }}>{WT?.c}</div>
          </div>
          <div style={{ textAlign:"right", display:"flex", flexDirection:"column", gap:6 }}>
            {[[L.humidity, `${WT?.h}%`, "#38bdf8", "droplets"],[L.wind, `${WT?.w} km/h`, "#94a3b8", "wind"],[L.rainChance, `${WT?.r}%`, "#60a5fa", "cloudRain"]].map(([k,v,c,n]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:th.sub, justifyContent:"flex-end" }}>
                <I n={n} size={13} color={c} />{k}: <strong style={{ color:th.tx }}>{v}</strong>
              </div>
            ))}
          </div>
        </div>
        {WT?.f && (
          <div className="as-forecast-row" style={{ borderTop:`1px solid ${th.br}`, paddingTop:12 }}>
            {WT.f.map(([d,tmp,ic], i) => (
              <div key={i} style={{ flex:1, textAlign:"center", background:i===0?th.al:"transparent", borderRadius:10, padding:"8px 4px" }}>
                <div style={{ fontSize:11, color:th.mt, marginBottom:4 }}>{d}</div>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}><WIcon type={ic} size={16} /></div>
                <div style={{ fontSize:13, fontWeight:700, color:th.tx }}>{tmp}°</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { setEf({...farm}); setGpsErr(""); setProfOpen(true); }} style={{ width:"100%", marginTop:12, padding:"8px", background:"transparent", border:`1px solid ${th.ac}40`, borderRadius:10, color:th.ac, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <I n="nav" size={13} color={th.ac} /> {L.updateLoc}
        </button>
      </Card>
      <Card th={th}>
        <SL th={th}>{L.soilH} · {farm.soil} Soil</SL>
        {[[L.nitrogen,72,"#16a34a"],[L.phosphorus,58,"#ea580c"],[L.potassium,85,"#2563eb"],[L.phLevel,68,"#7c3aed",6.8]].map(([nm,v,c,disp]) => (
          <div key={nm} style={{ marginBottom:13 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:3 }}>
              <span style={{ fontWeight:500, color:th.sub }}>{nm}</span>
              <span style={{ fontWeight:700, color:c }}>{disp||v+"%"}</span>
            </div>
            <Bar value={v} color={c} th={th} />
          </div>
        ))}
      </Card>

      {/* Recommended crops */}
      <Card th={th}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <SL th={th}>{L.recCrops} — {farm.loc}</SL>
          <button onClick={() => goTo("advisor")} style={{ background:"none", border:"none", color:th.ac, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{L.viewAll}</button>
        </div>
        {crops.slice(0,3).map((c,i) => (
          <div key={c.name} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:i<2?12:0, paddingBottom:i<2?12:0, borderBottom:i<2?`1px solid ${th.br}`:"none" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:c.c+"22", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <I n="wheat" size={22} color={c.c} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color:th.tx }}>{c.name}</div>
              <div style={{ fontSize:13, color:th.sub }}>{c.season} · {c.profit}</div>
              <Bar value={c.s} color={c.c} th={th} />
            </div>
            <Bdg color={c.c}>{c.s}%</Bdg>
          </div>
        ))}
      </Card>

      {/* Plans */}
      <Card th={th}>
        <SL th={th}>{L.plan}</SL>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16, marginTop:16 }}>
          {["free", "basic", "premium"].map((k) => {
            const p = PLANS[k];
            const isActive = sub === k;
            const isBest = k === "premium";
            return (
              <div key={k} onClick={() => { if(isActive)return; if(p.price===0){setSub(k);notify(`Switched to ${k}`);}else setPayM(k); }}
                style={{
                  position:"relative",
                  padding:20,
                  borderRadius:16,
                  border:`2px solid ${isActive ? p.color : th.br}`,
                  background:isActive ? p.color+"12" : th.card,
                  cursor:"pointer",
                  transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow:isActive ? `0 8px 24px ${p.color}30` : th.sh,
                  transform:isActive ? "scale(1.02)" : "scale(1)",
                  overflow:"hidden"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = p.color + "40";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${p.color}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = th.br;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = th.sh;
                  }
                }}
              >
                {isBest && (
                  <div style={{
                    position:"absolute",
                    top:0,
                    left:0,
                    right:0,
                    background:`linear-gradient(90deg, ${p.color}, ${p.color}80)`,
                    color:"#fff",
                    padding:"6px 14px",
                    fontSize:11,
                    fontWeight:800,
                    letterSpacing:"0.5px",
                    textTransform:"uppercase",
                    textAlign:"center"
                  }}>
                    🌟 Popular Choice
                  </div>
                )}
                
                <div style={{ marginTop: isBest ? 32 : 0, marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ fontSize:18, fontWeight:900, color:isActive ? p.color : th.tx, textTransform:"capitalize" }}>{k}</div>
                    {isActive && <I n="check" size={18} color={p.color} />}
                  </div>
                  <div style={{ fontSize:28, fontWeight:900, color:p.color, marginBottom:4 }}>
                    {p.price === 0 ? L.free : "₹" + p.price + "/m"}
                  </div>
                  {p.price > 0 && <div style={{ fontSize:12, color:th.sub }}>₹{(p.price * 10).toLocaleString()} per year</div>}
                </div>

                <div style={{ height:"1px", background:th.br, margin:"16px 0" }} />

                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:th.mt, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>Features</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {p.features.map((feat, i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        <I n="check" size={14} color={p.color} style={{ flexShrink:0, marginTop:3 }} />
                        <span style={{ fontSize:13, color:th.tx, lineHeight:1.4 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { if(isActive)return; if(p.price===0){setSub(k);notify(`Switched to ${k}`);}else setPayM(k); }}
                  style={{
                    width:"100%",
                    padding:11,
                    background:isActive ? p.color : p.color + "15",
                    border:`1.5px solid ${p.color}${isActive ? "FF" : "40"}`,
                    borderRadius:12,
                    color:isActive ? "#fff" : p.color,
                    fontWeight:700,
                    fontSize:14,
                    cursor:"pointer",
                    fontFamily:"inherit",
                    transition:"all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = p.color + "25";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? p.color : p.color + "15";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {isActive ? "Current Plan" : p.price === 0 ? "Switch to Free" : "Upgrade Now"}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {payM && <PayModal planKey={payM} th={th} L={L} onSuccess={() => setSub(payM)} onClose={() => setPayM(null)} />}
    </div>
  );
}
