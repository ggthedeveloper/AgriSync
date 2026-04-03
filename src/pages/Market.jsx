import { useState } from "react";
import { SCHEMES, MANDIS } from "../data/constants";
import { I } from "../components/Icons";
import { Card, Modal, Btn, Bdg } from "../components/UI";

export default function Market({ th, L, notify }) {
  const [mktTab, setMktTab] = useState("msp");
  const [mspM, setMspM] = useState(null);
  const [schM, setSchM] = useState(null);
  const [mandiM, setMandiM] = useState(null);
  const [applied, setApplied] = useState([]);

  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 14px",color:th.tx }}>{L.marketTitle}</h2>
      <div style={{ display:"flex",gap:7,marginBottom:16 }}>
        {[["msp",L.msp,"file"],["prices",L.prices,"barChart"],["schemes",L.schemes,"globe"]].map(([k,v,ic]) => (
          <button key={k} onClick={() => setMktTab(k)} style={{ flex:1,padding:"10px 8px",borderRadius:10,border:`1.5px solid ${mktTab===k?th.ac:th.br}`,background:mktTab===k?th.al:"transparent",color:mktTab===k?th.ac:th.sub,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.18s" }}>
            <I n={ic} size={14} color={mktTab===k?th.ac:th.sub} />{v}
          </button>
        ))}
      </div>

      {mktTab === "msp" && (
        <div>
          {[{crop:"Paddy",msp:"₹2,183",unit:"quintal",ch:5.3},{crop:"Wheat",msp:"₹2,275",unit:"quintal",ch:6.2},{crop:"Cotton",msp:"₹7,020",unit:"quintal",ch:3.1},{crop:"Maize",msp:"₹2,090",unit:"quintal",ch:-1.2},{crop:"Bajra",msp:"₹2,500",unit:"quintal",ch:4.0},{crop:"Soybean",msp:"₹4,600",unit:"quintal",ch:2.5}].map(m => (
            <Card th={th} key={m.crop} onClick={() => setMspM(m)} style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:16,color:th.tx,marginBottom:3 }}>{m.crop}</div>
                  <div style={{ fontSize:14,color:th.mt }}>{L.textMinSupport}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:700,fontSize:18,color:th.tx,marginBottom:4 }}>{m.msp}<span style={{ fontSize:13,color:th.mt }}>/{m.unit}</span></div>
                  <div style={{ display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end" }}>
                    <I n={m.ch>0?"trendUp":"trendDown"} size={13} color={m.ch>0?"#16a34a":th.dg} />
                    <Bdg color={m.ch>0?"#16a34a":th.dg}>{m.ch>0?"+":""}{m.ch}%</Bdg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {mspM && (
            <Modal title={`${mspM.crop} — MSP`} onClose={() => setMspM(null)} th={th}>
              <div style={{ fontSize:32,fontWeight:700,color:th.tx,marginBottom:5 }}>{mspM.msp}<span style={{ fontSize:16,color:th.mt }}>/{mspM.unit}</span></div>
              <Bdg color={mspM.ch>0?"#16a34a":th.dg}>{mspM.ch>0?"+":""}{mspM.ch}% YoY</Bdg>
              <div style={{ background:th.al,borderRadius:12,padding:14,margin:"14px 0",borderLeft:`3px solid ${th.ac}` }}>
                <p style={{ fontSize:15,lineHeight:1.75,margin:0,color:th.tx }}>FY 2024-25 Government of India. Procurement via FCI and state agencies.</p>
              </div>
              <Btn full onClick={() => { setMspM(null); notify("Saved"); }}><I n="save" size={15} color="#fff" />Save</Btn>
            </Modal>
          )}
        </div>
      )}

      {mktTab === "prices" && (
        <div>
          <p style={{ fontSize:14,color:th.mt,marginBottom:12,marginTop:0 }}>{L.textLivePrices}</p>
          <Card th={th} style={{ padding:0,overflow:"hidden" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:14 }}>
              <thead>
                <tr style={{ background:th.sa,borderBottom:`1px solid ${th.br}` }}>
                  {[L.mandiTableMandi,L.mandiTableDist,L.mandiTablePaddy,L.mandiTableCotton,L.mandiTableGround].map(h => <th key={h} style={{ padding:"11px 12px",textAlign:"left",color:th.mt,fontWeight:700,fontSize:12 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {MANDIS.map((r, i) => {
                  const bP = Math.max(...MANDIS.map(x => x.p)), bC = Math.max(...MANDIS.map(x => x.co)), bG = Math.max(...MANDIS.map(x => x.g));
                  return (
                    <tr key={r.m} onClick={() => setMandiM(r)} style={{ borderBottom:i<MANDIS.length-1?`1px solid ${th.br}`:"none",cursor:"pointer",background:i%2===0?"transparent":th.sa }}>
                      <td style={{ padding:"12px",fontWeight:700,color:th.tx }}>{r.m}</td>
                      <td style={{ padding:"12px",fontSize:13,color:th.mt }}>{r.d}km</td>
                      <td style={{ padding:"12px",fontWeight:r.p===bP?700:400,color:r.p===bP?th.ac:th.tx }}>{r.p}{r.p===bP?" ★":""}</td>
                      <td style={{ padding:"12px",fontWeight:r.co===bC?700:400,color:r.co===bC?th.ac:th.tx }}>{r.co}{r.co===bC?" ★":""}</td>
                      <td style={{ padding:"12px",fontWeight:r.g===bG?700:400,color:r.g===bG?th.ac:th.tx }}>{r.g}{r.g===bG?" ★":""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          {mandiM && (
            <Modal title={`${mandiM.m} Mandi`} onClose={() => setMandiM(null)} th={th}>
              <div className="as-stat-grid">
                {[[L.textDistance,mandiM.d+"km"],["Paddy","₹"+mandiM.p],["Cotton","₹"+mandiM.co],["Groundnut","₹"+mandiM.g]].map(([k,v]) => (
                  <div key={k} style={{ background:th.sa,borderRadius:11,padding:13,border:`1px solid ${th.br}` }}>
                    <div style={{ fontSize:13,color:th.mt,marginBottom:3 }}>{k}</div>
                    <div style={{ fontWeight:700,color:th.ac,fontSize:16 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:th.gl,borderRadius:12,padding:14,marginBottom:14,borderLeft:`3px solid ${th.gd}` }}>
                <div style={{ fontWeight:700,marginBottom:8,fontSize:15,color:th.gd,display:"flex",gap:6,alignItems:"center" }}><I n="truck" size={14} color={th.gd} />{L.textTransportEst}</div>
                <div style={{ fontSize:15,lineHeight:1.9,color:th.tx }}>
                  <div>Distance: <strong>{mandiM.d} km</strong></div>
                  <div>Transport: <strong>₹{mandiM.tr}/quintal</strong></div>
                  <div>Net paddy: <strong style={{ color:th.ac }}>₹{mandiM.p-mandiM.tr}/quintal</strong></div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn full onClick={() => { setMandiM(null); notify("Booked"); }}><I n="truck" size={15} color="#fff" />Book</Btn>
                <Btn full outline color={th.gd} onClick={() => { setMandiM(null); notify("Saved"); }}><I n="save" size={15} color={th.gd} />Save</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}

      {mktTab === "schemes" && (
        <div>
          {SCHEMES.map(sc => (
            <Card th={th} key={sc.name} style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:16,color:th.tx,marginBottom:3 }}>{sc.name}</div>
                  <div style={{ fontSize:15,color:th.ac,fontWeight:700,marginBottom:3 }}>{sc.benefit}</div>
                  <div style={{ fontSize:13,color:th.mt,display:"flex",gap:5,alignItems:"center" }}><I n="clock" size={12} color={th.mt} />Deadline: {sc.deadline}</div>
                </div>
                <Bdg color={applied.includes(sc.name)?th.gd:th.ac}>{applied.includes(sc.name)?"Applied":"Active"}</Bdg>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <Btn onClick={() => setSchM(sc)} color={applied.includes(sc.name)?th.gd:th.ac} style={{ flex:1 }}>
                  {applied.includes(sc.name) ? <><I n="file" size={14} color="#fff" />{L.view}</> : <><I n="check" size={14} color="#fff" />{L.apply}</>}
                </Btn>
                <a href={sc.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"10px 14px",border:`1.5px solid ${th.br}`,borderRadius:10,color:th.sub,fontSize:14,fontWeight:700,textDecoration:"none",background:"transparent",fontFamily:"inherit" }}>
                  <I n="extLink" size={14} color={th.sub} />{L.official}
                </a>
              </div>
            </Card>
          ))}
          {schM && (
            <Modal title={schM.name} onClose={() => setSchM(null)} th={th}>
              <div style={{ background:th.al,borderRadius:12,padding:14,marginBottom:14,borderLeft:`3px solid ${th.ac}` }}>
                <p style={{ fontSize:15,lineHeight:1.75,margin:0,color:th.tx }}>{schM.desc}</p>
              </div>
              <div style={{ fontWeight:700,marginBottom:10,fontSize:16,color:th.tx }}>Documents Required</div>
              {schM.docs.map((d, i) => (
                <div key={i} style={{ fontSize:15,padding:"8px 0",borderBottom:i<schM.docs.length-1?`1px solid ${th.br}`:"none",display:"flex",gap:9,alignItems:"center" }}>
                  <div style={{ width:22,height:22,borderRadius:6,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <span style={{ fontSize:12,fontWeight:700,color:th.ac }}>{i+1}</span>
                  </div>
                  <span style={{ color:th.tx }}>{d}</span>
                </div>
              ))}
              <div style={{ display:"flex",gap:10,marginTop:16 }}>
                {!applied.includes(schM.name) && (
                  <Btn full onClick={() => { setApplied(a => [...a, schM.name]); setSchM(null); notify(`${schM.name} submitted`); }}>
                    <I n="check" size={15} color="#fff" />Submit
                  </Btn>
                )}
                <a href={schM.url} target="_blank" rel="noopener noreferrer" style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"10px 16px",border:`1.5px solid ${th.ac}`,borderRadius:10,color:th.ac,fontSize:15,fontWeight:700,textDecoration:"none",background:th.al }}>
                  <I n="extLink" size={15} color={th.ac} />{L.official}
                </a>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
