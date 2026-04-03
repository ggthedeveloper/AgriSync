import { useState } from "react";
import { INS_SCH, LOANS } from "../data/constants";
import { I } from "../components/Icons";
import { Card, Modal, Btn } from "../components/UI";

export default function Insurance({ th, L, notify }) {
  const [itab, setItab] = useState("insurance");
  const [insM, setInsM] = useState(null);
  const [loanM, setLoanM] = useState(null);

  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 5px",color:th.tx }}>{L.insTitle}</h2>
      <p style={{ fontSize:15,color:th.sub,margin:"0 0 14px" }}>{L.insDesc}</p>

      <div style={{ display:"flex",gap:7,marginBottom:16 }}>
        {[["insurance","Insurance","shield"],["loan","Loan","dollar"]].map(([k,v,ic]) => (
          <button key={k} onClick={() => setItab(k)} style={{ flex:1,padding:"10px 6px",borderRadius:10,border:`1.5px solid ${itab===k?th.ac:th.br}`,background:itab===k?th.al:"transparent",color:itab===k?th.ac:th.sub,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.18s" }}>
            <I n={ic} size={16} color={itab===k?th.ac:th.sub} />{v.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* ── INSURANCE ── */}
      {itab === "insurance" && (
        <div>
          {INS_SCH.map(sc => (
            <Card th={th} key={sc.name} onClick={() => setInsM(sc)} style={{ marginBottom:10,cursor:"pointer" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:16,color:th.tx,marginBottom:3 }}>{sc.name}</div>
                  <div style={{ fontSize:15,color:th.ac,fontWeight:600,marginBottom:3 }}>{sc.coverage}</div>
                  <div style={{ fontSize:14,color:th.mt }}>Premium: {sc.premium}</div>
                </div>
                <I n="chevRight" size={18} color={th.mt} />
              </div>
            </Card>
          ))}
          {insM && (
            <Modal title={insM.name} onClose={() => setInsM(null)} th={th}>
              <div className="as-stat-grid">
                {[["Coverage",insM.coverage],["Premium",insM.premium]].map(([k,v]) => (
                  <div key={k} style={{ background:th.sa,borderRadius:11,padding:13,border:`1px solid ${th.br}` }}>
                    <div style={{ fontSize:13,color:th.mt,marginBottom:3 }}>{k}</div>
                    <div style={{ fontWeight:700,color:th.ac,fontSize:16 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:th.al,borderRadius:12,padding:14,marginBottom:14,borderLeft:`3px solid ${th.ac}` }}>
                <p style={{ fontSize:15,lineHeight:1.75,margin:0,color:th.tx }}>{insM.desc}</p>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn full onClick={() => { setInsM(null); notify(`${insM.name} applied`); }}>{L.apply}</Btn>
                <a href={insM.url} target="_blank" rel="noopener noreferrer" style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"10px 14px",border:`1.5px solid ${th.ac}`,borderRadius:10,color:th.ac,fontSize:15,fontWeight:700,textDecoration:"none",background:th.al }}>
                  <I n="extLink" size={14} color={th.ac} />{L.official}
                </a>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* ── LOAN ── */}
      {itab === "loan" && (
        <div>
          {LOANS.map(sc => (
            <Card th={th} key={sc.name} onClick={() => setLoanM(sc)} style={{ marginBottom:10,cursor:"pointer" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:16,color:th.tx,marginBottom:3 }}>{sc.name}</div>
                  <div style={{ fontSize:15,color:th.ac,fontWeight:600,marginBottom:3 }}>{sc.rate} · Up to {sc.max}</div>
                  <div style={{ fontSize:14,color:th.mt }}>Tenure: {sc.tenure}</div>
                </div>
                <I n="chevRight" size={18} color={th.mt} />
              </div>
            </Card>
          ))}
          {loanM && (
            <Modal title={loanM.name} onClose={() => setLoanM(null)} th={th}>
              <div className="as-grid4" style={{ marginBottom:14 }}>
                {[["Interest",loanM.rate],["Max",loanM.max],["Tenure",loanM.tenure]].map(([k,v]) => (
                  <div key={k} style={{ background:th.sa,borderRadius:11,padding:13,border:`1px solid ${th.br}` }}>
                    <div style={{ fontSize:13,color:th.mt,marginBottom:3 }}>{k}</div>
                    <div style={{ fontWeight:700,color:th.ac,fontSize:15 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:th.al,borderRadius:12,padding:14,marginBottom:14,borderLeft:`3px solid ${th.ac}` }}>
                <p style={{ fontSize:15,lineHeight:1.75,margin:0,color:th.tx }}>{loanM.desc}</p>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn full onClick={() => { setLoanM(null); notify("Application started"); }}>{L.apply}</Btn>
                <a href={loanM.url} target="_blank" rel="noopener noreferrer" style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"10px 14px",border:`1.5px solid ${th.ac}`,borderRadius:10,color:th.ac,fontSize:15,fontWeight:700,textDecoration:"none",background:th.al }}>
                  <I n="extLink" size={14} color={th.ac} />{L.official}
                </a>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
