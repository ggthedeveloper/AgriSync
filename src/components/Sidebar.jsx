import { I } from "./Icons";
import { PLANS } from "../data/constants";

const NAV = [
  { k:"dashboard",  icon:"home",     lk:"navDash"   },
  { k:"diagnose",   icon:"search",   lk:"navDiag"   },
  { k:"advisor",    icon:"cpu",      lk:"navAdv"    },
  { k:"market",     icon:"barChart", lk:"navMkt"    },
  { k:"health",     icon:"heart",    lk:"navHealth" },
  { k:"insurance",  icon:"shield",   lk:"navIns"    },
  { k:"community",  icon:"users",    lk:"navComm"   },
  { k:"hub",        icon:"cart",     lk:"navHub"    },
];

export default function Sidebar({ th, L, nav, goTo, sub, dark, onDark, onLogout, open, onClose }) {
  const plan = PLANS[sub];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:299,backdropFilter:"blur(2px)" }} />
      )}

      <aside style={{
        width: "min(240px, 85vw)",
        height:"-webkit-fill-available",
        background:th.sidebar,
        display:"flex", flexDirection:"column",
        position:"fixed", left:0, top:0,
        zIndex:300,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow:"4px 0 32px rgba(0,0,0,0.4)",
        overflowY:"auto",
        WebkitOverflowScrolling:"touch",
      }}>
        {/* Logo */}
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <I n="leaf" size={20} color="#4ade80" />
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", letterSpacing:"-0.3px" }}>{L.app}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", fontWeight:500 }}>{L.tag}</div>
            </div>
          </div>

          {/* User card */}
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 12px" }}>
            <div style={{ display:"flex", gap:3, alignItems:"center", marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>G</div>
              <div style={{ marginLeft:6 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Gaurav</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Gaurav's Farm · Guntur</div>
              </div>
            </div>
            <div style={{ background:plan.color+"33", borderRadius:6, padding:"3px 8px", display:"inline-block" }}>
              <span style={{ fontSize:11, color:plan.color, fontWeight:700 }}>⭐ {sub.charAt(0).toUpperCase()+sub.slice(1)} Plan</span>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, overflowY:"auto", padding:"8px 12px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", padding:"10px 8px 6px", textTransform:"uppercase" }}>Navigation</div>
          {NAV.map(({ k, icon, lk }) => {
            const active = nav === k;
            return (
              <button key={k} onClick={() => { goTo(k); onClose(); }} style={{
                width:"100%", padding:"11px 12px",
                display:"flex", alignItems:"center", gap:12,
                background: active ? "rgba(22,163,74,0.2)" : "transparent",
                border: active ? "1px solid rgba(22,163,74,0.3)" : "1px solid transparent",
                borderRadius:12, cursor:"pointer", fontFamily:"inherit",
                color: active ? "#4ade80" : "rgba(255,255,255,0.65)",
                marginBottom:3, transition:"all 0.15s",
              }}>
                <div style={{ width:30, height:30, borderRadius:8, background: active ? "rgba(22,163,74,0.25)" : "rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <I n={icon} size={16} color={active ? "#4ade80" : "rgba(255,255,255,0.6)"} />
                </div>
                <span style={{ fontSize:14, fontWeight: active ? 700 : 500 }}>{L[lk]}</span>
                {active && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#4ade80" }} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom tools */}
        <div style={{ padding:"12px 12px 20px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={onLogout} style={{ width:"100%", padding:"10px 12px", display:"flex", alignItems:"center", gap:12, background:"rgba(220,38,38,0.12)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:12, cursor:"pointer", fontFamily:"inherit", color:"#f87171", transition:"all 0.15s" }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"rgba(220,38,38,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <I n="logout" size={15} color="#f87171" />
            </div>
            <span style={{ fontSize:13, fontWeight:500 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
