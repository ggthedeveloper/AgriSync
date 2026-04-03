import { useState } from "react";
import { I } from "./Icons";

export default function CallSupport({ th, L, dark }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating support button */}
      <button onClick={() => setOpen(true)} className="as-fab" style={{
        position:"fixed", bottom:96, right:20, zIndex:999,
        width:56, height:56, borderRadius:"50%",
        background: dark ? "#0f2e15" : "#fff",
        border:`2px solid #16a34a`,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
        transition:"all 0.2s",
      }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.2}>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 4.18 2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </button>

      {!open ? null : (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:4000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:th.card, borderRadius:22, padding:"clamp(16px,5vw,28px)", width:"100%", maxWidth:380, border:`1px solid ${th.br}`, boxShadow:"0 20px 60px rgba(0,0,0,0.4)", margin:"0 8px" }}>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#0d9488)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 4.18 2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:th.tx, marginBottom:4 }}>{L.callSupport}</div>
              <div style={{ fontSize:13, color:th.sub }}>{L.callDesc}</div>
            </div>

            {/* Options */}
            <a href="tel:18001801551" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:"linear-gradient(135deg,#16a34a,#0a7a3a)", borderRadius:14, marginBottom:10, textDecoration:"none", cursor:"pointer" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 4.18 2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{L.callNow}</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>Toll-free · 24×7</div>
              </div>
            </a>

            <a href="https://wa.me/911800180155" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:dark?"#1a3520":"#f0fdf4", border:`1.5px solid #16a34a40`, borderRadius:14, marginBottom:10, textDecoration:"none", cursor:"pointer" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#25D36622", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width={22} height={22} viewBox="0 0 32 32" fill="#25D366">
                  <path d="M16 2C8.27 2 2 8.27 2 16c0 2.48.65 4.8 1.79 6.82L2 30l7.37-1.76A13.94 13.94 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5c-2.2 0-4.27-.6-6.04-1.64l-.43-.26-4.37 1.04 1.07-4.25-.28-.46A11.48 11.48 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.28-8.56c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.59-.78-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.32.34-1.21 1.18-1.21 2.88s1.24 3.34 1.41 3.57c.17.23 2.44 3.73 5.93 5.23.83.36 1.48.57 1.98.73.83.26 1.59.22 2.19.13.67-.1 2.02-.83 2.3-1.62.29-.8.29-1.49.2-1.62-.09-.14-.32-.23-.66-.4z"/>
                </svg>
              </div>
              <div>
                <div style={{ color:th.tx, fontWeight:700, fontSize:15 }}>{L.callWhatsApp}</div>
                <div style={{ color:th.sub, fontSize:12 }}>Chat in your language</div>
              </div>
            </a>

            {/* Languages */}
            <div style={{ background:th.sa, borderRadius:12, padding:"12px 14px", marginBottom:16, border:`1px solid ${th.br}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:th.mt, marginBottom:8 }}>AVAILABLE IN</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["English","తెలుగు","हिन्दी","मराठी","தமிழ்","ಕನ್ನಡ","മലയാളം","বাংলা"].map(l => (
                  <span key={l} style={{ background:th.al, border:`1px solid ${th.br}`, borderRadius:8, padding:"3px 9px", fontSize:12, color:th.ac, fontWeight:600 }}>{l}</span>
                ))}
              </div>
            </div>

            <button onClick={() => setOpen(false)} style={{ width:"100%", padding:"12px", background:"transparent", border:`1.5px solid ${th.br}`, borderRadius:12, cursor:"pointer", color:th.sub, fontSize:14, fontWeight:600, fontFamily:"inherit" }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
