import { useState } from "react";
import { S } from "../utils/storage";
import { I } from "../components/Icons";
import { Card, Modal, Btn, Bar, Bdg, SL } from "../components/UI";

export default function Advisor({ th, L, farm, WT, crops, advBusy, setAdvBusy, advDone, setAdvDone, fp, setFp, notify }) {
  const [cropM, setCropM] = useState(null);

  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 5px",color:th.tx }}>{L.advisor}</h2>
      <p style={{ fontSize:15,color:th.sub,margin:"0 0 14px" }}>{L.advisorDesc}</p>

      <Card th={th}>
        <div className="as-advisor-grid">
          {[["Location",farm.loc],["Acres",farm.acres+" ac"],["Soil",farm.soil],["Water",farm.wsrc],["Temp",WT.t+"°C"],["Rain",WT.r+"% chance"],["Season",farm.season],["Humidity",WT.h+"%"]].map(([k,v]) => (
            <div key={k} style={{ background:th.sa,borderRadius:10,padding:10,border:`1px solid ${th.br}` }}>
              <div style={{ fontSize:12,color:th.mt,marginBottom:3 }}>{k}</div>
              <div style={{ fontWeight:700,fontSize:14,color:th.tx }}>{v}</div>
            </div>
          ))}
        </div>
        <Btn full disabled={advBusy} onClick={() => { setAdvBusy(true); setAdvDone(false); setTimeout(() => { setAdvBusy(false); setAdvDone(true); S.set("adv",true); }, 1800); }}>
          {advBusy
            ? <><I n="refresh" size={15} color="#fff" style={{ animation:"spin 1s linear infinite" }} />{L.analyzing}</>
            : <><I n="cpu" size={15} color="#fff" />{L.genRec}</>
          }
        </Btn>
      </Card>

      {advDone && (
        <div>
          {fp.length > 0 && (
            <Card th={th} style={{ background:th.al,border:`1px solid ${th.ac}30` }}>
              <div style={{ display:"flex",gap:7,alignItems:"center",marginBottom:8 }}>
                <I n="checkCirc" size={15} color={th.ac} />
                <span style={{ fontWeight:700,fontSize:15,color:th.ac }}>{L.farmPlan}</span>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {fp.map(n => <Bdg key={n} color={th.ac}>{n}</Bdg>)}
              </div>
            </Card>
          )}
          {crops.map((c) => (
            <Card th={th} key={c.name} onClick={() => setCropM(c)} style={{ marginBottom:10,cursor:"pointer" }}>
              <div style={{ display:"flex",alignItems:"center",gap:13 }}>
                <div style={{ width:46,height:46,borderRadius:13,background:c.c+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <I n="wheat" size={24} color={c.c} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:16,color:th.tx }}>{c.name}</div>
                  <div style={{ fontSize:14,color:th.sub }}>{c.season} · {c.water} water · {c.profit}</div>
                  <Bar value={c.s} color={c.c} th={th} />
                </div>
                <div style={{ textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5 }}>
                  <Bdg color={c.c}>{c.s}%</Bdg>
                  <I n="chevRight" size={14} color={th.mt} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {cropM && (
        <Modal title={cropM.name} onClose={() => setCropM(null)} th={th}>
          <div className="as-stat-grid">
            {[["Season",cropM.season],["Water",cropM.water],["Profit",cropM.profit],["Match",cropM.s+"%"]].map(([k,v]) => (
              <div key={k} style={{ background:th.sa,borderRadius:11,padding:13,border:`1px solid ${th.br}` }}>
                <div style={{ fontSize:12,color:th.mt,marginBottom:3 }}>{k}</div>
                <div style={{ fontWeight:700,color:cropM.c,fontSize:16 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:th.al,borderRadius:12,padding:14,marginBottom:14,borderLeft:`3px solid ${th.ac}` }}>
            <div style={{ fontWeight:700,marginBottom:10,fontSize:15,color:th.ac }}>{L.formCultTips}</div>
            {["Prepare land 2–3 weeks before sowing","Apply basal fertilizer as recommended","Maintain proper irrigation schedule","Monitor weekly for pest activity"].map((tip, i) => (
              <div key={i} style={{ fontSize:15,padding:"6px 0",borderBottom:i<3?`1px solid ${th.br}`:"none",display:"flex",gap:9 }}>
                <I n="check" size={14} color={th.ac} /><span style={{ color:th.tx }}>{tip}</span>
              </div>
            ))}
          </div>
          <Btn full onClick={() => { if (!fp.includes(cropM.name)) setFp(p => [...p, cropM.name]); setCropM(null); notify(`${cropM.name} added`); }}>
            <I n="plus" size={15} color="#fff" />Add to Farm Plan
          </Btn>
        </Modal>
      )}
    </div>
  );
}
