import { useState, useRef } from "react";
import { USERS, AP_REG, OT_REG } from "../data/constants";
import { TR, LANGS } from "../data/translations";
import { S } from "../utils/storage";
import { I } from "../components/Icons";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [lang, setLang] = useState(() => S.get("lang", "en"));
  const L = TR[lang] || TR.en;
  const [fm, setFm] = useState({ name:"", ph:"", pw:"", cpw:"", acres:"", loc:"Guntur", soil:"Black", wsrc:"Canal", farm:"" });
  const [otp, setOtp] = useState(["","","",""]);
  const [genOtp] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const set = (k, v) => { setFm(f => ({ ...f, [k]: v })); setErr(""); };

  const doLogin = () => {
    if (!fm.ph || !fm.pw) return setErr("Please enter mobile and password");
    setBusy(true);
    setTimeout(() => {
      const u = USERS.find(u => u.ph === fm.ph && u.pw === fm.pw);
      u ? onLogin(u, lang) : setErr("Invalid mobile or password");
      setBusy(false);
    }, 1000);
  };

  const doSignup = () => {
    if (!fm.name || !fm.ph || !fm.pw || !fm.cpw) return setErr("Fill all required fields");
    if (fm.ph.length !== 10) return setErr("Enter valid 10-digit number");
    if (fm.pw !== fm.cpw) return setErr("Passwords do not match");
    setBusy(true);
    setTimeout(() => { setBusy(false); setMode("otp"); }, 800);
  };

  const doVerify = () => {
    const v = otp.join("");
    if (v.length < 4) return setErr("Enter complete OTP");
    if (v !== genOtp) return setErr(`Wrong OTP. Demo OTP: ${genOtp}`);
    setBusy(true);
    setTimeout(() => {
      onLogin({ name:fm.name, ph:fm.ph, acres:fm.acres||"5", loc:fm.loc, soil:fm.soil, wsrc:fm.wsrc, farm:fm.farm||fm.name+"'s Farm" }, lang);
      setBusy(false);
    }, 800);
  };

  const otpKey = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n); setErr("");
    if (v && i < 3) refs[i+1].current?.focus();
    if (!v && i > 0) refs[i-1].current?.focus();
  };

  const iSt = { width:"100%", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:11, padding:"12px 14px", color:"#fff", fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.55)", display:"block", marginBottom:6 };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(155deg,#030d04 0%,#071808 40%,#0a2e0e 70%,#030d04 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',system-ui,sans-serif", padding:20, overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        button{transition:all 0.18s;}
        button:hover:not(:disabled){opacity:0.88;}
        .as-farm-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width:400px) {
          .as-farm-grid { grid-template-columns:1fr; }
        }
        @media (hover:none) and (pointer:coarse) {
          input, select { font-size:16px !important; }
        }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position:"fixed", top:-120, right:-80, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,#16a34a22,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-100, left:-60, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#0d948822,transparent 70%)", pointerEvents:"none" }} />

      {/* Language selector */}
      <div style={{ position:"fixed", top:16, right:16, display:"flex", gap:4, background:"rgba(0,0,0,0.35)", borderRadius:20, padding:4, zIndex:10 }}>
        {LANGS.map(lk => (
          <button key={lk.code} onClick={() => { setLang(lk.code); S.set("lang", lk.code); }}
            style={{ background:lang===lk.code?"rgba(22,163,74,0.85)":"transparent", border:"none", color:"#fff", borderRadius:14, padding:"4px 10px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {lk.label}
          </button>
        ))}
      </div>

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:28, animation:"fadeUp 0.5s ease" }}>
        <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#16a34a,#0a4a1f)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 32px rgba(22,163,74,0.4)", animation:"float 3s ease-in-out infinite" }}>
          <I n="leaf" size={36} color="#fff" />
        </div>
        <h1 style={{ fontSize:"clamp(24px,7vw,32px)", fontWeight:900, color:"#fff", letterSpacing:"-0.8px", margin:"0 0 6px" }}>{L.app}</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>{L.tag}</p>
      </div>

      {/* Card */}
      <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:22, padding:"clamp(16px,5vw,26px) clamp(14px,5vw,24px)", width:"100%", maxWidth:420, animation:"fadeUp 0.65s ease" }}>

        {/* Tabs */}
        {mode !== "otp" && (
          <div style={{ display:"flex", background:"rgba(0,0,0,0.28)", borderRadius:12, padding:4, marginBottom:22, gap:3 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }}
                style={{ flex:1, padding:"9px", borderRadius:9, border:"none", fontFamily:"inherit", fontWeight:700, fontSize:15, cursor:"pointer", background:mode===m?"rgba(22,163,74,0.9)":"transparent", color:mode===m?"#fff":"rgba(255,255,255,0.4)", transition:"all 0.2s" }}>
                {m==="login" ? L.signIn : L.signUp}
              </button>
            ))}
          </div>
        )}

        {/* OTP */}
        {mode === "otp" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:60, height:60, borderRadius:18, background:"rgba(22,163,74,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <I n="phone" size={28} color="#4ade80" />
            </div>
            <div style={{ fontWeight:800, color:"#fff", fontSize:19, marginBottom:5 }}>Verify OTP</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>Sent to +91 {fm.ph}</div>
            <div style={{ fontSize:13, color:"#fbbf24", marginBottom:22, background:"rgba(251,191,36,0.1)", borderRadius:8, padding:"6px 12px", display:"inline-block" }}>Demo OTP: <strong>{genOtp}</strong></div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
              {otp.map((v, i) => (
                <input key={i} ref={refs[i]} value={v} maxLength={1} onChange={e => otpKey(i, e.target.value)}
                  style={{ width:58, height:64, textAlign:"center", fontSize:26, fontWeight:800, borderRadius:13, border:`2px solid ${v?"#16a34a":"rgba(255,255,255,0.18)"}`, background:"rgba(0,0,0,0.35)", color:"#fff", fontFamily:"inherit", outline:"none", transition:"border 0.15s" }} />
              ))}
            </div>
            {err && <div style={{ color:"#f87171", fontSize:13, marginBottom:14, background:"rgba(239,68,68,0.12)", borderRadius:9, padding:"8px 12px" }}>{err}</div>}
            <button onClick={doVerify} disabled={busy} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#16a34a,#0a4a1f)", border:"none", borderRadius:13, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 20px rgba(22,163,74,0.35)" }}>
              {busy ? <><I n="refresh" size={17} color="#fff" style={{ animation:"spin 1s linear infinite" }} /> {L.verifying}</> : <><I n="check" size={17} color="#fff" /> {L.verifyContinue}</> }
            </button>
          </div>
        )}

        {/* Login */}
        {mode === "login" && (
          <div>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>{L.mobile}</label>
              <div style={{ display:"flex", alignItems:"center", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:11, overflow:"hidden" }}>
                <span style={{ padding:"0 13px", color:"rgba(255,255,255,0.4)", fontSize:14, borderRight:"1px solid rgba(255,255,255,0.1)", whiteSpace:"nowrap" }}>+91</span>
                <input value={fm.ph} onChange={e => set("ph", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543210"
                  style={{ flex:1, background:"transparent", border:"none", padding:"13px 14px", color:"#fff", fontSize:16, fontFamily:"inherit", outline:"none" }} />
              </div>
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>{L.pwd}</label>
              <div style={{ display:"flex", alignItems:"center", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:11, overflow:"hidden" }}>
                <input type={showPw?"text":"password"} value={fm.pw} onChange={e => set("pw", e.target.value)} placeholder="••••••••"
                  style={{ flex:1, background:"transparent", border:"none", padding:"13px 14px", color:"#fff", fontSize:16, fontFamily:"inherit", outline:"none" }} />
                <button onClick={() => setShowPw(v => !v)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", padding:"0 14px", cursor:"pointer", display:"flex" }}>
                  <I n={showPw?"eyeOff":"eye"} size={16} color="rgba(255,255,255,0.4)" />
                </button>
              </div>
            </div>
            {err && <div style={{ color:"#f87171", fontSize:13, margin:"10px 0", background:"rgba(239,68,68,0.12)", borderRadius:9, padding:"8px 12px", display:"flex", gap:7, alignItems:"center" }}><I n="alert" size={13} color="#f87171" />{err}</div>}
            <button onClick={doLogin} disabled={busy} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#16a34a,#0a4a1f)", border:"none", borderRadius:13, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"inherit", marginTop:18, boxShadow:"0 4px 24px rgba(22,163,74,0.4)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {busy ? <><I n="refresh" size={17} color="#fff" style={{ animation:"spin 1s linear infinite" }} /> {L.signingIn}</> : <><I n="leaf" size={17} color="#fff" /> {L.signIn}</>}
            </button>
            <div style={{ textAlign:"center", marginTop:14, fontSize:13, color:"rgba(255,255,255,0.3)" }}>
              {L.demo} <span style={{ color:"#fbbf24", fontWeight:700 }}>9999999999</span> / <span style={{ color:"#fbbf24", fontWeight:700 }}>farmer123</span>
            </div>
          </div>
        )}

        {/* Signup */}
        {mode === "signup" && (
          <div>
            {[["name",L.fullName,"text","Gaurav"],["ph",L.mobile,"tel","9876543210"],["farm",L.farmName,"text","Gaurav's Farm"],["acres",L.acres,"number","12"]].map(([k,lb,tp,ph]) => (
              <div key={k} style={{ marginBottom:12 }}>
                <label style={lbl}>{lb}</label>
                <input type={tp} value={fm[k]} onChange={e => set(k, k==="ph"?e.target.value.replace(/\D/g,"").slice(0,10):e.target.value)} placeholder={ph} style={iSt} />
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>{L.district}</label>
              <select value={fm.loc} onChange={e => set("loc",e.target.value)} style={{...iSt,color:"#fff"}}>
                <optgroup label="AP / Telangana">{AP_REG.map(r=><option key={r} style={{color:"#000"}}>{r}</option>)}</optgroup>
                <optgroup label="Other">{OT_REG.map(r=><option key={r} style={{color:"#000"}}>{r}</option>)}</optgroup>
              </select>
            </div>
            <div className="as-farm-grid" style={{ marginBottom:12 }}>
              {[["soil",L.soil,["Black","Red","Sandy","Loamy","Alluvial","Clay"]],["wsrc",L.water,["Canal","Borewell","Rain-fed","River","Pond"]]].map(([k,lb,opts]) => (
                <div key={k}>
                  <label style={{...lbl,fontSize:12}}>{lb}</label>
                  <select value={fm[k]} onChange={e=>set(k,e.target.value)} style={{...iSt,fontSize:13,padding:"10px 12px",color:"#fff"}}>{opts.map(o=><option key={o} style={{color:"#000"}}>{o}</option>)}</select>
                </div>
              ))}
            </div>
            {[["pw",L.pwd],["cpw",L.confirmPwd]].map(([k,lb]) => (
              <div key={k} style={{ marginBottom:12 }}>
                <label style={lbl}>{lb}</label>
                <input type="password" value={fm[k]} onChange={e=>set(k,e.target.value)} placeholder="••••••••" style={iSt} />
              </div>
            ))}
            {err && <div style={{ color:"#f87171", fontSize:13, marginBottom:12, background:"rgba(239,68,68,0.12)", borderRadius:9, padding:"8px 12px", display:"flex", gap:7 }}><I n="alert" size={13} color="#f87171" />{err}</div>}
            <button onClick={doSignup} disabled={busy} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#16a34a,#0a4a1f)", border:"none", borderRadius:13, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 24px rgba(22,163,74,0.4)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {busy ? <><I n="refresh" size={17} color="#fff" style={{ animation:"spin 1s linear infinite" }} /> {L.creating}</> : <><I n="user" size={17} color="#fff" /> {L.createAcc}</>}
            </button>
          </div>
        )}
      </div>
      <p style={{ marginTop:22, fontSize:12, color:"rgba(255,255,255,0.2)", textAlign:"center" }}>Secured · Data.gov.in · Made for Indian Farmers 🇮🇳</p>
    </div>
  );
}
