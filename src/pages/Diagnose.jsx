import { I } from "../components/Icons";
import { Card, Btn, Bar, Bdg } from "../components/UI";
import { S } from "../utils/storage";

export default function Diagnose({ th, L, farm, dImg, setDImg, dBusy, dRes, setDRes, fRef, upload, notify }) {
  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 5px",color:th.tx }}>{L.diagTitle}</h2>
      <p style={{ fontSize:15,color:th.sub,margin:"0 0 14px" }}>{L.diagDesc}</p>
      <input ref={fRef} type="file" accept="image/*" style={{ display:"none" }} onChange={upload} />
      <Card th={th}>
        {!dImg ? (
          <div onClick={() => fRef.current.click()} style={{ padding:"32px 20px",border:`2px dashed ${th.br}`,borderRadius:12,cursor:"pointer",textAlign:"center" }}>
            <div style={{ width:60,height:60,borderRadius:18,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
              <I n="camera" size={28} color={th.ac} />
            </div>
            <div style={{ fontWeight:700,fontSize:17,color:th.tx,marginBottom:6 }}>{L.upload}</div>
            <div style={{ fontSize:14,color:th.mt,marginBottom:16 }}>{L.fileFormat}</div>
            <Btn>{L.btnChooseFile}</Btn>
          </div>
        ) : (
          <div>
            <img src={dImg} alt="crop" style={{ width:"100%",maxHeight:230,borderRadius:12,objectFit:"cover",display:"block" }} />
            <div style={{ display:"flex",gap:10,marginTop:12 }}>
              <Btn full onClick={() => fRef.current.click()}><I n="refresh" size={15} color="#fff" />{L.btnNew}</Btn>
              <Btn full outline color={th.dg} onClick={() => { setDImg(null); setDRes(null); S.del("diag"); }}>
                <I n="trash" size={15} color={th.dg} />{L.btnClear}
              </Btn>
            </div>
          </div>
        )}
      </Card>

      {dBusy && (
        <Card th={th} style={{ textAlign:"center",padding:"28px 20px" }}>
          <div style={{ width:56,height:56,borderRadius:16,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
            <I n="search" size={28} color={th.ac} style={{ animation:"spin 2s linear infinite" }} />
          </div>
          <div style={{ fontWeight:700,fontSize:17,marginBottom:6,color:th.tx }}>{L.analyzing}</div>
          <div style={{ fontSize:14,color:th.sub }}>{L.diagScanning}</div>
        </Card>
      )}

      {dRes && (
        <Card th={th}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:th.mt,marginBottom:4 }}>{L.result.toUpperCase()}</div>
              <div style={{ fontSize:20,fontWeight:700,color:th.tx }}>{dRes.disease}</div>
              <div style={{ fontSize:14,color:th.sub,fontStyle:"italic" }}>{dRes.full}</div>
            </div>
            <Bdg color={dRes.sev === "High" ? th.dg : "#d97706"}>{dRes.sev} Risk</Bdg>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:3 }}>
              <span style={{ color:th.mt,fontWeight:500 }}>{L.conf}</span>
              <span style={{ fontWeight:700,color:th.ac }}>{dRes.conf}%</span>
            </div>
            <Bar value={dRes.conf} color={dRes.conf > 85 ? th.ac : "#d97706"} th={th} />
          </div>
          <div style={{ background:th.al,borderRadius:12,padding:14,borderLeft:`3px solid ${th.ac}`,marginBottom:14 }}>
            <div style={{ fontSize:14,fontWeight:700,color:th.ac,marginBottom:8 }}>{L.treatment}</div>
            <p style={{ fontSize:15,lineHeight:1.75,margin:0,color:th.tx }}>{dRes.tx}</p>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <Btn full onClick={() => notify("Plan saved")}><I n="save" size={15} color="#fff" />Save</Btn>
            <Btn full outline color={th.gd} onClick={() => notify("Shared")}><I n="share" size={15} color={th.gd} />Share</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
