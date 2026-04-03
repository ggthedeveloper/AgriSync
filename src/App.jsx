import Footer from "./components/Footer";
import { useState, useRef, useCallback } from "react";
import { TR, LANGS } from "./data/translations";
import { PLANS, PORDER, PAGEPLANS, WEATHER, LCROPS, DIAG, POSTS0, AP_REG, OT_REG } from "./data/constants";
import { S } from "./utils/storage";
import { TH } from "./utils/theme";
import { I } from "./components/Icons";
import { Modal, Btn, Inp, Sel, FL, Bdg, SL } from "./components/UI";
import PayModal from "./components/PayModal";
import UpGate from "./components/UpgradeGate";
import Sidebar from "./components/Sidebar";
import MarqueeBanner from "./components/MarqueeBanner";
import VoiceAssistant from "./components/VoiceAssistant";
import CallSupport from "./components/CallSupport";
import { AIChatbot } from "./components/AIChatbot";

import Dashboard  from "./pages/Dashboard";
import Diagnose   from "./pages/Diagnose";
import Advisor    from "./pages/Advisor";
import Market     from "./pages/Market";
import Community  from "./pages/Community";
import Health     from "./pages/Health";
import Insurance  from "./pages/Insurance";
import Hub        from "./pages/Hub";
import PhAnalysis from "./pages/PhAnalysis";
import IrrigationCalc from "./pages/IrrigationCalc";
import CropCalendar from "./pages/CropCalendar";
import FarmAnalytics from "./pages/FarmAnalytics";
import RotationPlanner from "./pages/RotationPlanner";
import FertilizerCalc from "./pages/FertilizerCalc";

export default function App({ user, onLogout, initLang }) {
  const [lang, setLang] = useState(() => S.get("lang", initLang || "en"));
  const L = TR[lang] || TR.en;
  const [dark, setDark] = useState(() => S.get("dark", false));
  const [offline, setOffline] = useState(false);
  const [nav, setNav] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const th = TH(dark);

  const [sub, setSubS] = useState(() => S.get("sub", "free"));
  const setSub = v => { setSubS(v); S.set("sub", v); };
  const [payM, setPayM] = useState(null);

  const [farm, setFarmS] = useState(() => S.get("farm", {
    name: user.farm || user.name + "'s Farm",
    loc: user.loc || "Guntur",
    acres: user.acres || "12",
    soil: user.soil || "Black",
    wsrc: user.wsrc || "Canal",
    season: "Kharif",
    lat: null, lng: null, gps: false,
  }));
  const setFarm = useCallback(v => {
    setFarmS(p => { const n = typeof v === "function" ? v(p) : v; S.set("farm", n); return n; });
  }, []);
  const WT    = WEATHER[farm.loc]  || WEATHER.default;
  const crops = LCROPS[farm.loc]   || LCROPS.default;

  const [dImg, setDImg] = useState(null);
  const [dBusy, setDBusy] = useState(false);
  const [dRes, setDRes] = useState(() => S.get("diag", null));
  const fRef = useRef();

  const upload = e => {
    const f = e.target.files[0]; if (!f) return;
    setDImg(URL.createObjectURL(f)); setDRes(null); setDBusy(true);
    setTimeout(() => {
      const r = DIAG[Math.floor(Math.random() * DIAG.length)];
      setDBusy(false); setDRes(r); S.set("diag", r);
    }, 2400);
  };

  const [advDone, setAdvDone] = useState(() => S.get("adv", false));
  const [advBusy, setAdvBusy] = useState(false);
  const [fp, setFpS] = useState(() => S.get("fp", []));
  const setFp = v => { const n = typeof v === "function" ? v(fp) : v; setFpS(n); S.set("fp", n); };

  const [posts, setPostsS] = useState(() => S.get("posts", POSTS0));
  const setPosts = v => { const n = typeof v === "function" ? v(posts) : v; setPostsS(n); S.set("posts", n); };

  const [cart, setCartS] = useState(() => S.get("cart", []));
  const setCart = v => { const n = typeof v === "function" ? v(cart) : v; setCartS(n); S.set("cart", n); };

  const [profOpen, setProfOpen] = useState(false);
  const [ef, setEf] = useState(null);
  const [gpsLoad, setGpsLoad] = useState(false);
  const [gpsErr, setGpsErr] = useState("");

  const notify = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3500);
  };

  const detectGPS = () => {
    if (!navigator.geolocation) { setGpsErr(L.geoNotSupported); return; }
    setGpsLoad(true); setGpsErr("");
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          const city = d.address?.city || d.address?.town || d.address?.village || "";
          const m = [...AP_REG, ...OT_REG].find(r => city.toLowerCase().includes(r.toLowerCase())) || city || "Unknown";
          setEf(f => ({ ...f, loc: m, lat, lng, gps: true }));
          setGpsLoad(false); notify(`Located: ${m}`);
        } catch { setGpsLoad(false); setGpsErr(L.couldNotResolve); }
      },
      e => { setGpsLoad(false); setGpsErr(e.code === 1 ? L.geoPermDenied : L.geoLocationError); },
      { timeout: 10000 }
    );
  };

  const goTo = key => {
    const al = PAGEPLANS[key] || PORDER;
    const si = PORDER.indexOf(sub);
    if (al.some(p => PORDER.indexOf(p) <= si)) { setNav(key); setSideOpen(false); return; }
    setPayM(al[0]);
  };

  const toggleDark = () => { const v = !dark; setDark(v); S.set("dark", v); };

  const LocBar = () => (
    <div style={{ background:th.al, border:`1px solid ${th.ac}30`, borderRadius:13, padding:"11px 14px", marginBottom:16 }} className="as-locbar">
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <div style={{ width:38, height:38, borderRadius:11, background:th.as, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <I n={farm.gps ? "nav" : "map"} size={18} color={th.ac} />
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:th.tx }}>{farm.name}</div>
          <div style={{ fontSize:12, color:th.sub }}>{farm.loc} · {farm.acres} ac · {farm.soil} · {farm.wsrc}</div>
        </div>
      </div>
      <button onClick={() => { setEf({...farm}); setGpsErr(""); setProfOpen(true); }} style={{ background:th.sa, border:`1px solid ${th.br}`, borderRadius:9, padding:"6px 12px", cursor:"pointer", color:th.sub, display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
        <I n="edit" size={13} color={th.sub} /> Edit
      </button>
    </div>
  );

  const FarmModal = () => {
    const d = ef;
    const sd = (k, v) => setEf(f => ({ ...f, [k]: v }));
    return (
      <Modal title={L.editFarm} onClose={() => setProfOpen(false)} th={th}>
        <div style={{ background:th.al, borderRadius:13, padding:14, marginBottom:16, border:`1px solid ${th.ac}30` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <I n="nav" size={16} color={th.ac} />
            <span style={{ fontWeight:700, fontSize:16, color:th.tx }}>Live GPS</span>
            {d.gps && d.lat && <Bdg color={th.ac}>Active</Bdg>}
          </div>
          {d.gps && d.lat && <div style={{ fontSize:12, color:th.sub, marginBottom:8, fontFamily:"monospace" }}>{d.lat.toFixed(5)}, {d.lng.toFixed(5)}</div>}
          <Btn full onClick={detectGPS} disabled={gpsLoad}>
            {gpsLoad ? <><I n="refresh" size={15} color="#fff" style={{ animation:"spin 1s linear infinite" }} /> {L.detecting}</> : <><I n="radio" size={15} color="#fff" /> {L.gps}</> }
          </Btn>
          {gpsErr && <div style={{ fontSize:13, color:th.dg, marginTop:8, padding:"8px 10px", background:th.dl, borderRadius:8, display:"flex", gap:6 }}><I n="alert" size={13} color={th.dg} />{gpsErr}</div>}
        </div>
        <FL label={L.district} th={th}>
          <Sel th={th} value={d.loc} onChange={e => sd("loc", e.target.value)}>
            <optgroup label="AP / Telangana">{AP_REG.map(r => <option key={r}>{r}</option>)}</optgroup>
            <optgroup label="Other">{OT_REG.map(r => <option key={r}>{r}</option>)}</optgroup>
          </Sel>
        </FL>
        <div className="as-farm-grid">
          <FL label={L.farmName} th={th}><Inp th={th} value={d.name} onChange={e => sd("name", e.target.value)} /></FL>
          <FL label={L.acres} th={th}><Inp th={th} type="number" value={d.acres} onChange={e => sd("acres", e.target.value)} /></FL>
          <FL label={L.soil} th={th}><Sel th={th} value={d.soil} onChange={e => sd("soil", e.target.value)}>{["Black","Red","Sandy","Loamy","Alluvial","Clay"].map(s => <option key={s}>{s}</option>)}</Sel></FL>
          <FL label={L.water} th={th}><Sel th={th} value={d.wsrc} onChange={e => sd("wsrc", e.target.value)}>{["Canal","Borewell","Rain-fed","River","Pond"].map(s => <option key={s}>{s}</option>)}</Sel></FL>
        </div>
        <FL label="Season" th={th}><Sel th={th} value={d.season} onChange={e => sd("season", e.target.value)}>{["Kharif","Rabi","Zaid","Annual"].map(s => <option key={s}>{s}</option>)}</Sel></FL>
        <div style={{ display:"flex", gap:10, marginTop:6 }}>
          <Btn outline onClick={() => setProfOpen(false)} style={{ flex:1 }}><I n="x" size={15} color={th.ac} />{L.cancel}</Btn>
          <Btn onClick={() => { setFarm(ef); setProfOpen(false); setAdvDone(false); notify(L.farmSaved); }} style={{ flex:2 }}><I n="save" size={15} color="#fff" />{L.saveF}</Btn>
        </div>
      </Modal>
    );
  };

  const sharedProps = { th, L, farm, WT, crops, notify };

  const NAV = [
    { k:"dashboard", lb:L.navDash,   n:"home"     },
    { k:"diagnose",  lb:L.navDiag,   n:"search"   },
    { k:"advisor",   lb:L.navAdv,    n:"cpu"      },
    { k:"market",    lb:L.navMkt,    n:"chart"    },
    { k:"health",    lb:L.navHealth, n:"heart"    },
    { k:"insurance", lb:L.navIns,    n:"shield"   },
    { k:"community", lb:L.navComm,   n:"users"    },
    { k:"hub",       lb:L.navHub,    n:"cart"     },
    { k:"ph",        lb:L.phTrend,   n:"chart"    },
    { k:"irrigCalc", lb:L.irrigCalc, n:"truck"    },
    { k:"calendar",  lb:L.cropCalendar, n:"clock"  },
    { k:"analytics", lb:L.farmAnalytics, n:"award" },
    { k:"rotation",  lb:L.rotationPlanner, n:"refresh" },
    { k:"fertilizer", lb:L.fertilCalc, n:"leaf" },
  ];

  const renderPage = () => {
    const p = sharedProps;
    switch(nav) {
      case "dashboard":  return <Dashboard  {...p} user={user} offline={offline} sub={sub} setSub={setSub} payM={payM} setPayM={setPayM} goTo={goTo} setEf={setEf} setGpsErr={setGpsErr} setProfOpen={setProfOpen} LocBar={LocBar} />;
      case "diagnose":   return <Diagnose   {...p} dImg={dImg} setDImg={setDImg} dBusy={dBusy} dRes={dRes} setDRes={setDRes} fRef={fRef} upload={upload} LocBar={LocBar} />;
      case "advisor":    return <Advisor    {...p} advBusy={advBusy} setAdvBusy={setAdvBusy} advDone={advDone} setAdvDone={setAdvDone} fp={fp} setFp={setFp} LocBar={LocBar} />;
      case "market":     return <Market     {...p} />;
      case "community":  return <Community  {...p} user={user} posts={posts} setPosts={setPosts} />;
      case "health":     return <Health     {...p} />;
      case "insurance":  return <Insurance  {...p} />;
      case "hub":        return <Hub        {...p} user={user} cart={cart} setCart={setCart} />;
      case "ph":         return <PhAnalysis {...p} user={user} />;
      case "irrigCalc":  return <IrrigationCalc {...p} user={user} />;
      case "calendar":   return <CropCalendar {...p} user={user} />;
      case "analytics":  return <FarmAnalytics {...p} user={user} />;
      case "rotation":   return <RotationPlanner {...p} user={user} />;
      case "fertilizer": return <FertilizerCalc {...p} user={user} />;
      default:           return <Dashboard  {...p} user={user} offline={offline} sub={sub} setSub={setSub} payM={payM} setPayM={setPayM} goTo={goTo} setEf={setEf} setGpsErr={setGpsErr} setProfOpen={setProfOpen} LocBar={LocBar} />;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.tx, fontFamily:"'DM Sans',system-ui,sans-serif", transition:"background 0.3s,color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#16a34a44;border-radius:4px;}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        button:hover:not(:disabled){opacity:0.88;}
        select{outline:none;cursor:pointer;}
        a:hover{opacity:0.85;}
        img{user-select:none;}

        /* ── RESPONSIVE UTILITIES ── */
        .as-page { padding:16px 14px; max-width:860px; margin:0 auto; animation:fadeIn 0.2s ease; }
        .as-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .as-grid4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; }
        .as-topbar-right { display:flex; align-items:center; gap:8px; }
        .as-loc-btn span { max-width:65px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .as-nav-tabs { display:flex; overflow-x:auto; scrollbar-width:none; }
        .as-nav-tabs::-webkit-scrollbar { display:none; }
        .as-weather-row { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px; }
        .as-weather-temp { font-size:52px; font-weight:900; line-height:1; }
        .as-forecast-row { display:flex; gap:6px; }
        .as-plans-row { display:flex; gap:10px; }
        .as-hub-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
        .as-hub-svc  { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .as-hub-specs { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-bottom:10px; }
        .as-locbar { display:flex; justify-content:space-between; align-items:center; }
        .as-farm-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:2px; }
        .as-storage-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        .as-toggle-row { display:flex; gap:8px; margin-bottom:16px; }
        .as-hub-toggle-btn { flex:1; padding:10px 14px; border-radius:10px; font-weight:700; cursor:pointer; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:6px; }
        .as-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
        .as-advisor-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-bottom:14px; }
        .as-lang-menu { position:absolute; top:44px; right:0; border-radius:14px; overflow:hidden; z-index:1000; width:160px; }
        .as-market-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .as-toast { position:fixed; bottom:110px; left:50%; transform:translateX(-50%); border-radius:12px; padding:11px 22px; font-size:15px; font-weight:700; z-index:9999; box-shadow:0 4px 24px rgba(0,0,0,0.3); animation:slideUp 0.25s ease; white-space:nowrap; display:flex; align-items:center; gap:8px; }

        /* ── TABLET  (max 768px) ── */
        @media (max-width:768px) {
          .as-grid2   { grid-template-columns:1fr 1fr; gap:10px; }
          .as-grid4   { grid-template-columns:1fr 1fr; gap:8px; }
          .as-hub-grid { grid-template-columns:1fr 1fr; gap:10px; }
          .as-hub-svc  { grid-template-columns:1fr 1fr; gap:10px; }
          .as-storage-grid { grid-template-columns:1fr; }
          .as-market-grid  { grid-template-columns:1fr; }
          .as-advisor-grid { grid-template-columns:1fr 1fr; }
          .as-stat-grid    { grid-template-columns:1fr 1fr; }
          .as-weather-temp { font-size:44px; }
          .as-page { padding:12px 10px; }
        }

        /* ── PHONE (max 480px) ── */
        @media (max-width:480px) {
          .as-grid2   { grid-template-columns:1fr; gap:8px; }
          .as-grid4   { grid-template-columns:1fr 1fr; gap:6px; }
          .as-hub-grid { grid-template-columns:1fr; gap:10px; }
          .as-hub-svc  { grid-template-columns:1fr 1fr; gap:8px; }
          .as-hub-specs { grid-template-columns:1fr 1fr; }
          .as-farm-grid { grid-template-columns:1fr; gap:0; }
          .as-storage-grid { grid-template-columns:1fr; }
          .as-advisor-grid { grid-template-columns:1fr 1fr; gap:6px; }
          .as-stat-grid    { grid-template-columns:1fr 1fr; gap:8px; }
          .as-market-grid  { grid-template-columns:1fr; }
          .as-plans-row    { gap:6px; }
          .as-weather-temp { font-size:38px; }
          .as-weather-row  { flex-direction:column; align-items:flex-start; gap:10px; }
          .as-forecast-row { gap:3px; }
          .as-locbar       { flex-wrap:wrap; gap:8px; }
          .as-page { padding:10px 8px; }
          .as-toast { font-size:13px; padding:9px 14px; max-width:92vw; white-space:normal; text-align:center; bottom:100px; }

          /* Topbar compact on phone */
          .as-topbar-loc-label { display:none; }
          .as-topbar-offline   { display:none; }

          /* Nav tab text smaller */
          .as-nav-tab { padding:10px 9px !important; font-size:11px !important; gap:3px !important; }
          .as-nav-tab svg { display:none; }
        }

        /* ── TINY PHONE (max 360px) ── */
        @media (max-width:360px) {
          .as-hub-svc  { grid-template-columns:1fr; }
          .as-grid4    { grid-template-columns:1fr 1fr; }
          .as-weather-temp { font-size:32px; }
          .as-plans-row { flex-direction:column; }
        }

        /* Touch-friendly tap targets */
        @media (hover:none) and (pointer:coarse) {
          button { min-height:40px; }
          .as-nav-tab { min-height:44px; }
          input, select { font-size:16px !important; } /* prevents iOS zoom */
        }

        /* ── FLOATING BUTTONS — prevent overlap on small screens ── */
        @media (max-width:480px) {
          /* Shrink floating action buttons slightly */
          .as-fab { width:50px !important; height:50px !important; }
          /* Make sure page bottom has room for stacked FABs */
          .as-page { padding-bottom:180px !important; }
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar th={th} L={L} nav={nav} goTo={goTo} sub={sub} dark={dark} onDark={toggleDark} onLogout={onLogout} open={sideOpen} onClose={() => setSideOpen(false)} />

      {/* ── TOPBAR ── */}
      <div style={{ background:th.topbar, height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 16px rgba(0,0,0,0.25)" }}>
        {/* Left: Hamburger + Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setSideOpen(true)} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"rgba(255,255,255,0.14)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <I n="leaf" size={16} color="#4ade80" />
            </div>
            <span style={{ fontSize:"clamp(15px,4vw,18px)", fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>{L.app}</span>
          </div>
        </div>

        {/* Right: controls */}
        <div className="as-topbar-right">

          {/* Language picker */}
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowLangMenu(v => !v)} style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"6px 10px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:36 }}>
              🌐 {LANGS.find(l=>l.code===lang)?.label || "EN"}
            </button>
            {showLangMenu && (
              <div onClick={() => setShowLangMenu(false)} style={{ position:"fixed", inset:0, zIndex:999 }}>
                <div onClick={e => e.stopPropagation()} style={{ position:"absolute", top:44, right:0, background:th.card, border:`1px solid ${th.br}`, borderRadius:14, boxShadow:th.sh, overflow:"hidden", zIndex:1000, width:160 }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); S.set("lang",l.code); setShowLangMenu(false); }} style={{ width:"100%", padding:"10px 14px", background:lang===l.code?th.al:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit", color:lang===l.code?th.ac:th.tx, fontSize:14, fontWeight:lang===l.code?700:400, display:"flex", alignItems:"center", gap:8, textAlign:"left" }}>
                      <span style={{ fontSize:16 }}>{l.label}</span>
                      <span style={{ fontSize:13 }}>{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <button onClick={() => { setEf({...farm}); setGpsErr(""); setProfOpen(true); }} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"6px 10px", color:"#fff", fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:36 }}>
            <I n={farm.gps?"nav":"map"} size={12} color="#4ade80" />
            <span className="as-topbar-loc-label" style={{ maxWidth:65, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{farm.loc}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button onClick={toggleDark} title={dark?L.switchLightMode:L.switchDarkMode} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"0 8px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", height:36, width:36 }}>
            <I n={dark?"sun":"moon"} size={15} color="#fff" />
          </button>

          {/* Offline toggle */}
          <button className="as-topbar-offline" onClick={() => setOffline(v => !v)} title={offline?L.goOnline:L.goOffline} style={{ background:offline?"rgba(220,38,38,0.3)":"rgba(255,255,255,0.1)", border:`1px solid ${offline?"rgba(220,38,38,0.4)":"rgba(255,255,255,0.15)"}`, borderRadius:10, padding:"0 8px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", height:36, width:36 }}>
            <I n={offline?"wifiOff":"wifi"} size={15} color={offline?"#f87171":"#fff"} />
          </button>

          {/* Logout */}
          <button onClick={onLogout} style={{ background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.35)", borderRadius:10, padding:"0 8px", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", height:36, width:36 }}>
            <I n="logout" size={15} color="#f87171" />
          </button>
        </div>
      </div>

      {/* ── MARQUEE BANNER ── */}
      <MarqueeBanner L={L} dark={dark} />

      {/* ── Plan badge bar ── */}
      <div style={{ background:PLANS[sub].color+"12", borderBottom:`1px solid ${PLANS[sub].color}20`, padding:"5px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <I n="award" size={13} color={PLANS[sub].color} />
          <span style={{ fontSize:12, fontWeight:700, color:PLANS[sub].color }}>{L.planBadge.replace("{plan}", sub.charAt(0).toUpperCase()+sub.slice(1))}</span>
        </div>
        {sub === "free" && (
          <button onClick={() => setPayM("basic")} style={{ background:PLANS.basic.color, border:"none", borderRadius:8, padding:"3px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
            <I n="zap" size={11} color="#fff" /> Upgrade
          </button>
        )}
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ background:th.sf, borderBottom:`1px solid ${th.br}`, display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
        {NAV.map(({ k, lb, n }) => {
          const isNewFeature = ["ph", "irrigCalc", "calendar", "analytics", "rotation", "fertilizer"].includes(k);
          return (
            <button key={k} onClick={() => goTo(k)} className="as-nav-tab" style={{ padding:"12px 13px", cursor:"pointer", fontSize:13, fontWeight:600, borderBottom:`3px solid ${nav===k?th.ac:"transparent"}`, color:nav===k?th.ac:th.sub, whiteSpace:"nowrap", background:"transparent", border:"none", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}>
              {!isNewFeature && <I n={n} size={13} color={nav===k?th.ac:th.sub} />}
              {lb}
            </button>
          );
        })}
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="as-page">
        {offline && (
          <div style={{ background:th.gl, border:`1px solid ${th.gd}`, borderRadius:11, padding:"10px 14px", marginBottom:14, fontSize:14, color:th.gd, display:"flex", gap:7, alignItems:"center" }}>
            <I n="wifiOff" size={15} color={th.gd} />{L.offline}
          </div>
        )}
        <UpGate navKey={nav} sub={sub} L={L} th={th} onUpgrade={setSub}>
          {renderPage()}
        </UpGate>
        <Footer th={th} />
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className="as-toast" style={{ background:toast.err?th.dg:th.ac, color:"#fff" }}>
          <I n={toast.err?"alert":"check"} size={15} color="#fff" />{toast.msg}
        </div>
      )}

      {/* Modals */}
      {payM && <PayModal planKey={payM} th={th} L={L} onSuccess={() => setSub(payM)} onClose={() => setPayM(null)} />}
      {profOpen && ef && <FarmModal />}

      {/* Floating tools */}
      <CallSupport th={th} L={L} dark={dark} />
      <VoiceAssistant th={th} L={L} lang={lang} farm={farm} WT={WT} crops={crops} onNavigate={goTo} dark={dark} />
      <AIChatbot lang={lang} th={th} />
    </div>
  );
}
