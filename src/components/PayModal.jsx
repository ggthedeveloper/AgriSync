import { useState } from "react";
import { PLANS } from "../data/constants";
import { I } from "./Icons";
import { Modal, Btn, Inp, Sel, FL, Bdg } from "./UI";

export default function PayModal({ planKey, th, L, onSuccess, onClose }) {
  const plan = PLANS[planKey];
  const [method, setMethod] = useState("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ num:"", exp:"", cvv:"", name:"" });
  const [bank, setBank] = useState("SBI");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const pay = () => { setBusy(true); setTimeout(() => { setBusy(false); setDone(true); }, 2000); };

  if (done) return (
    <Modal title={L.success} onClose={() => { onSuccess(); onClose(); }} th={th}>
      <div style={{ textAlign:"center", padding:"24px 0" }}>
        <div style={{ width:72,height:72,borderRadius:22,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
          <I n="award" size={40} color={th.ac} />
        </div>
        <div style={{ fontSize:22,fontWeight:700,color:th.tx,marginBottom:8 }}>{L.success}</div>
        <div style={{ fontSize:16,color:th.sub,marginBottom:24 }}>
          Now on <strong style={{ color:plan.color }}>{planKey.charAt(0).toUpperCase()+planKey.slice(1)}</strong> plan · ₹{plan.price.toLocaleString()}/month
        </div>
        <Btn full onClick={() => { onSuccess(); onClose(); }}><I n="check" size={16} color="#fff" />{L.done}</Btn>
      </div>
    </Modal>
  );

  return (
    <Modal title={`${L.payNow} — ${planKey.charAt(0).toUpperCase()+planKey.slice(1)}`} onClose={onClose} th={th}>
      <div style={{ background:plan.color+"12",borderRadius:12,padding:14,marginBottom:18,border:`1px solid ${plan.color}30` }}>
        <div style={{ fontSize:16,fontWeight:700,color:plan.color }}>{planKey.charAt(0).toUpperCase()+planKey.slice(1)} Plan</div>
        <div style={{ fontSize:26,fontWeight:800,color:th.tx,marginTop:4 }}>
          ₹{plan.price.toLocaleString()}<span style={{ fontSize:14,fontWeight:400,color:th.mt }}>/month</span>
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:10 }}>
          {plan.features.map(f => <Bdg key={f} color={plan.color}>{f}</Bdg>)}
        </div>
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:18 }}>
        {[["upi","smartphone",L.byUPI],["card","card",L.byCard],["net","globe",L.byNet]].map(([k,ic,lb]) => (
          <button key={k} onClick={() => setMethod(k)} style={{ flex:1,padding:"10px 6px",borderRadius:10,border:`2px solid ${method===k?th.ac:th.br}`,background:method===k?th.al:"transparent",color:method===k?th.ac:th.sub,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
            <I n={ic} size={16} color={method===k?th.ac:th.sub} />{lb}
          </button>
        ))}
      </div>

      {method === "upi" && (
        <div>
          <FL label="UPI ID" th={th}><Inp th={th} value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@upi" /></FL>
          <div style={{ background:th.sa,borderRadius:10,padding:14,marginBottom:14,display:"flex",alignItems:"center",gap:12,border:`1px solid ${th.br}` }}>
            <div style={{ width:48,height:48,borderRadius:10,background:th.al,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <I n="globe" size={24} color={th.ac} />
            </div>
            <div>
              <div style={{ fontSize:15,fontWeight:700,color:th.tx }}>Scan QR or enter UPI ID</div>
              <div style={{ fontSize:13,color:th.mt }}>Pay ₹{plan.price.toLocaleString()} securely</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap" }}>
            {["GPay","PhonePe","Paytm","BHIM"].map(app => (
              <button key={app} onClick={() => setUpi(app.toLowerCase()+"@upi")} style={{ padding:"8px 14px",borderRadius:8,border:`1px solid ${th.br}`,background:th.sa,color:th.tx,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{app}</button>
            ))}
          </div>
        </div>
      )}

      {method === "card" && (
        <div>
          <FL label="Card Number" th={th}>
            <Inp th={th} value={card.num} onChange={e => setCard(c => ({ ...c, num: e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim() }))} placeholder="0000 0000 0000 0000" />
          </FL>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <FL label="Expiry MM/YY" th={th}><Inp th={th} value={card.exp} onChange={e => setCard(c => ({ ...c, exp: e.target.value }))} placeholder="MM/YY" maxLength={5} /></FL>
            <FL label="CVV" th={th}><Inp th={th} value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,"").slice(0,3) }))} placeholder="000" /></FL>
          </div>
          <FL label="Cardholder Name" th={th}><Inp th={th} value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="As on card" /></FL>
        </div>
      )}

      {method === "net" && (
        <div>
          <FL label="Select Bank" th={th}>
            <Sel th={th} value={bank} onChange={e => setBank(e.target.value)}>
              {["SBI","HDFC","ICICI","Axis","PNB","Bank of Baroda","Canara Bank","Union Bank","Kotak","Yes Bank"].map(b => <option key={b}>{b}</option>)}
            </Sel>
          </FL>
          <div style={{ background:th.sa,borderRadius:10,padding:14,marginBottom:14,fontSize:14,color:th.sub,border:`1px solid ${th.br}` }}>
            You will be redirected to <strong style={{ color:th.tx }}>{bank}</strong> secure portal.
          </div>
        </div>
      )}

      <Btn full onClick={pay} disabled={busy}>
        {busy
          ? <><I n="refresh" size={16} color="#fff" style={{ animation:"spin 1s linear infinite" }} /> Processing...</>
          : <><I n="wallet" size={16} color="#fff" /> Pay ₹{plan.price.toLocaleString()}</>
        }
      </Btn>
      <p style={{ fontSize:13,color:th.mt,textAlign:"center",marginTop:10,marginBottom:0 }}>🔒 Secured by 256-bit SSL</p>
    </Modal>
  );
}
