import { useState } from "react";
import { PLANS, PORDER, PAGEPLANS } from "../data/constants";
import { I } from "./Icons";
import { Btn, Bdg } from "./UI";
import PayModal from "./PayModal";

export default function UpGate({ navKey, sub, L, th, onUpgrade, children }) {
  const [showPay, setShowPay] = useState(null);
  const allowed = PAGEPLANS[navKey] || PORDER;
  const si = PORDER.indexOf(sub);
  if (allowed.some(p => PORDER.indexOf(p) <= si)) return children;
  const mp = allowed[0];

  return (
    <div style={{ padding:"40px 20px", textAlign:"center" }}>
      <div style={{ width:72,height:72,borderRadius:22,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px" }}>
        <I n="lock" size={36} color={th.ac} />
      </div>
      <div style={{ fontSize:22,fontWeight:700,color:th.tx,marginBottom:8 }}>{L.upgrade}</div>
      <div style={{ fontSize:16,color:th.sub,marginBottom:24 }}>
        Requires <strong style={{ color:PLANS[mp].color }}>{mp.charAt(0).toUpperCase()+mp.slice(1)}</strong> plan.
      </div>
      <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:20 }}>
        {Object.entries(PLANS)
          .filter(([k]) => allowed.includes(k) && PORDER.indexOf(k) > si)
          .map(([k, p]) => (
            <div key={k} style={{ background:p.color+"12",border:`2px solid ${p.color}`,borderRadius:14,padding:"16px 20px",minWidth:160,textAlign:"left" }}>
              <div style={{ fontWeight:800,fontSize:17,color:p.color }}>{k.charAt(0).toUpperCase()+k.slice(1)}</div>
              <div style={{ fontSize:20,fontWeight:700,color:th.tx,marginBottom:10 }}>
                ₹{p.price.toLocaleString()}<span style={{ fontSize:13,color:th.mt }}>/mo</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize:13,color:th.sub,display:"flex",gap:6,alignItems:"center",marginBottom:4 }}>
                  <I n="check" size={12} color={p.color} />{f}
                </div>
              ))}
              <Btn onClick={() => setShowPay(k)} color={p.color} style={{ marginTop:12, width:"100%" }}>{L.payNow}</Btn>
            </div>
          ))}
      </div>
      {showPay && (
        <PayModal planKey={showPay} th={th} L={L} onSuccess={() => onUpgrade(showPay)} onClose={() => setShowPay(null)} />
      )}
    </div>
  );
}
