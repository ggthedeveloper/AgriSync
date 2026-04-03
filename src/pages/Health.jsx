import { useState } from "react";
import { INS_SCH, LOANS } from "../data/constants";
import { I } from "../components/Icons";
import { Card, Modal, Btn } from "../components/UI";

export default function Health({ th, L, notify }) {
  const [htab, setHtab] = useState("tracker");
  const [insM, setInsM] = useState(null);
  const [loanM, setLoanM] = useState(null);

  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 5px",color:th.tx }}>{L.fHealth}</h2>
      <p style={{ fontSize:15,color:th.sub,margin:"0 0 14px" }}>{L.healthDesc}</p>

      <div style={{ display:"flex",gap:7,marginBottom:16 }}>
        {[["tracker",L.tracker,"heart"]].map(([k,v,ic]) => (
          <button key={k} onClick={() => setHtab(k)} style={{ flex:1,padding:"10px 6px",borderRadius:10,border:`1.5px solid ${htab===k?th.ac:th.br}`,background:htab===k?th.al:"transparent",color:htab===k?th.ac:th.sub,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.18s" }}>
            <I n={ic} size={16} color={htab===k?th.ac:th.sub} />{v.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* ── TRACKER ── */}
      {htab === "tracker" && (
        <div>
          <div className="as-stat-grid">
            {[[L.bp,"118/76 mmHg","#dc2626"],[L.sugar,"102 mg/dL","#ea580c"],[L.bmi,"22.4 (Normal)","#16a34a"],[L.checkup,"12 Jul 2025","#2563eb"]].map(([k,v,c]) => (
              <div key={k} style={{ background:c+"0e",borderRadius:13,padding:15,border:`1px solid ${c}28` }}>
                <div style={{ fontSize:13,color:th.mt,marginBottom:6 }}>{k}</div>
                <div style={{ fontWeight:700,color:c,fontSize:16 }}>{v}</div>
              </div>
            ))}
          </div>
          <Card th={th}>
            <div style={{ display:"flex",gap:7,alignItems:"center",marginBottom:12 }}>
              <I n="heart" size={16} color={th.ac} />
              <span style={{ fontWeight:700,fontSize:16,color:th.tx }}>{L.tips}</span>
            </div>
            {["Drink 3 litres of water daily during field work","Wear gloves and mask when applying pesticides","Use proper PPE during all spray operations","Take 30-minute rest after strenuous field activity","Schedule annual eye, hearing and BP checkups","Wash hands thoroughly before eating meals"].map((tip, i) => (
              <div key={i} style={{ fontSize:15,padding:"8px 0",borderBottom:i<5?`1px solid ${th.br}`:"none",display:"flex",gap:9 }}>
                <I n="check" size={14} color={th.ac} /><span style={{ color:th.tx }}>{tip}</span>
              </div>
            ))}
          </Card>
          <Card th={th}>
            <div style={{ display:"flex",gap:7,alignItems:"center",marginBottom:12 }}>
              <I n="activity" size={16} color="#2563eb" />
              <span style={{ fontWeight:700,fontSize:16,color:th.tx }}>{L.textMedicalSchemes}</span>
            </div>
            {[
              { name:"PM Jan Arogya Yojana (PMJAY)", benefit:"Free hospital cover up to ₹5 lakh/year", url:"https://pmjay.gov.in" },
              { name:"Ayushman Bharat",               benefit:"₹5L free hospitalization",              url:"https://pmjay.gov.in" },
              { name:"Kisan Suvidha Helpline",        benefit:"24/7 free advisory",                    url:"https://kisansuvidha.gov.in" },
            ].map(sc => (
              <div key={sc.name} style={{ borderBottom:`1px solid ${th.br}`,paddingBottom:12,marginBottom:12 }}>
                <div style={{ fontWeight:700,fontSize:15,color:th.tx,marginBottom:3 }}>{sc.name}</div>
                <div style={{ fontSize:15,color:th.ac,fontWeight:600,marginBottom:8 }}>{sc.benefit}</div>
                <a href={sc.url} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",border:`1.5px solid ${th.ac}`,borderRadius:9,color:th.ac,fontSize:14,fontWeight:700,textDecoration:"none",background:th.al }}>
                  <I n="extLink" size={13} color={th.ac} />{L.official}
                </a>
              </div>
            ))}
          </Card>
          <Btn full onClick={() => notify("Checkup reminder set")}>
            <I n="bell" size={15} color="#fff" />{L.btnSet}
          </Btn>
        </div>
      )}


    </div>
  );
}
