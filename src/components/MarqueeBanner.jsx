import { useState, useEffect } from "react";

export default function MarqueeBanner({ L, dark }) {
  const items = [L.b1, L.b2, L.b3, L.b4, L.b5];
  const text = items.join("   ·   ");

  return (
    <div style={{
      background: dark
        ? "linear-gradient(90deg,#0a1f0c,#0d2e10,#0a1f0c)"
        : "linear-gradient(90deg,#065f2f,#0a7a3a,#065f2f)",
      overflow:"hidden", height:34,
      display:"flex", alignItems:"center",
      borderBottom: dark ? "1px solid #1a3520" : "1px solid #04511f",
    }}>
      <div style={{
        display:"flex", gap:0,
        animation:"marquee 60s linear infinite",
        whiteSpace:"nowrap", willChange:"transform",
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ fontSize:"clamp(11px,3vw,12px)", fontWeight:600, color:"rgba(255,255,255,0.92)", padding:"0 40px", flexShrink:0 }}>
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
