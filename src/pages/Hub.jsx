import { useState } from "react";
import { GODOWNS } from "../data/constants";
import { I } from "../components/Icons";
import { Card, Modal, Btn, Bdg, SL, FL, Inp, Sel } from "../components/UI";

const HARDWARE = [
  {
    id:"drone",
    img:"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80",
    name:"droneName", desc:"droneDesc",
    price:"₹21,999", rent:"₹799/day",
    badge:"Most Popular", badgeColor:"#7c3aed",
    specs:[["Coverage","10 ac/hr"],["Battery","45 min"],["GPS","RTK ±2cm"],["Payload","10 kg"]],
  },
  {
    id:"sprayer",
    img:"https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80",
    name:"sprayerName", desc:"sprayerDesc",
    price:"₹9,999", rent:"₹199/day",
    badge:"Best Value", badgeColor:"#0d9488",
    specs:[["Tank","500 L"],["Width","12 m boom"],["Control","Remote"],["Range","500 m"]],
  },
];

const SERVICES = [
  { id:"eval",  img:"https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80", nameKey:"evalName",  descKey:"evalDesc",  price:"₹999", icon:"activity" },
  { id:"store", img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80", nameKey:"storeName", descKey:"coldSt",    price:"₹4–12/MT/day", icon:"building" },
  { id:"ins",   img:"https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80", nameKey:"ins",       descKey:"ins",       price:"₹120/acre", icon:"shield" },
  { id:"trans", img:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80", nameKey:"transportName", descKey:"transport", price:"₹2–8/km", icon:"truck" },
];

const STORAGE_FACILITIES = [
  { id:1, name:"Modern Cold Storage Unit", loc:"Guntur", dist:"2 km", capacity:"500 MT", temp:"0°C to 8°C", crops:["Tomato","Potato","Onion"], price:"11/MT/day", rating:"4.8", reviews:342 },
  { id:2, name:"Traditional Godown A", loc:"Guntur", dist:"5 km", capacity:"200 MT", temp:"Ambient", crops:["Rice","Wheat","Cotton"], price:"7/MT/day", rating:"4.5", reviews:156 },
  { id:3, name:"Premium Storage Complex", loc:"Guntur", dist:"8 km", capacity:"1000 MT", temp:"0°C to 4°C", crops:["All vegetables","Fruits","Spices"], price:"16/MT/day", rating:"4.9", reviews:"542" },
  { id:4, name:"Rural Godown B", loc:"Tenali", dist:"12 km", capacity:"300 MT", temp:"Ambient", crops:["Rice","Pulses","Maize"], price:"6/MT/day", rating:"4.3", reviews:98 },
  { id:5, name:"Organic Storage Unit", loc:"Repalle", dist:"15 km", capacity:"150 MT", temp:"15°C to 20°C", crops:["Organic crops","Spices","Seeds"], price:"13/MT/day", rating:"4.7", reviews:187 },
  { id:6, name:"Cooperative Warehouse", loc:"Sattenapalli", dist:"20 km", capacity:"400 MT", temp:"Ambient", crops:["Rice","Groundnuts","Oilseeds"], price:"5/MT/day", rating:"4.4", reviews:203 },
];

export default function Hub({ th, L, user, cart, setCart, notify }) {
  const [modal, setModal] = useState(null);
  const [bDone, setBDone] = useState(false);
  const [bf, setBf] = useState({ date:"", name:user.name, phone:"", notes:"" });
  const [storageView, setStorageView] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);

  const openBook = (item) => { setModal(item); setBDone(false); };

  const sortedStorage = [...STORAGE_FACILITIES].sort((a,b) => parseInt(a.dist) - parseInt(b.dist));

  return (
    <div>
      <h2 style={{ fontSize:"clamp(20px,5vw,24px)", fontWeight:800, margin:"0 0 4px", color:th.tx }}>{L.hardware}</h2>
      <p style={{ fontSize:14, color:th.sub, margin:"0 0 18px" }}>{L.hubSubtitle}</p>

      {/* View Toggle Button */}
      <div className="as-toggle-row">
        <button onClick={() => setStorageView(false)} style={{ flex:1, padding:"10px 14px", background:!storageView?th.ac:"transparent", border:`1.5px solid ${th.br}`, borderRadius:10, color:!storageView?"#fff":th.tx, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          <I n="tool" size={14} color={!storageView?"#fff":th.sub} style={{ marginRight:6 }} /> {L.hardwareServices}
        </button>
        <button onClick={() => setStorageView(true)} style={{ flex:1, padding:"10px 14px", background:storageView?th.ac:"transparent", border:`1.5px solid ${th.br}`, borderRadius:10, color:storageView?"#fff":th.tx, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          <I n="building" size={14} color={storageView?"#fff":th.sub} style={{ marginRight:6 }} /> Storage Facilities
        </button>
      </div>

      {!storageView ? (
        <>
      {/* Cart banner */}
      {cart.length > 0 && (
        <div style={{ background:`linear-gradient(135deg,${th.ac}18,${th.ac2}12)`, border:`1px solid ${th.ac}30`, borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <I n="cart" size={18} color={th.ac} />
            <span style={{ fontWeight:700, color:th.ac }}>{L.hubCartItems.replace("{count}", cart.length)}</span>
          </div>
          <Btn color={th.ac} onClick={() => { notify(`Order placed: ${cart.join(", ")}`); setCart([]); }}>{L.btnCheckout}</Btn>
        </div>
      )}

      {/* Hardware cards with images */}
      <SL th={th}>{L.hubFeatured}</SL>
      <div className="as-hub-grid">
        {HARDWARE.map(item => (
          <Card th={th} key={item.id} style={{ padding:0, overflow:"hidden", marginBottom:0 }}>
            <div style={{ position:"relative" }}>
              <img src={item.img} alt={L[item.name]||item.name} loading="lazy"
                style={{ width:"100%", height:130, objectFit:"cover", display:"block" }}
                onError={e => { e.target.style.display="none"; }}
              />
              <div style={{ 
                position:"absolute", 
                top:10, 
                left:10,
                background:"rgba(0,0,0,0.3)",
                backdropFilter:"blur(12px)",
                webkitBackdropFilter:"blur(12px)",
                borderRadius:10,
                border:"1px solid rgba(255,255,255,0.2)",
                padding:"6px 12px"
              }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#fff", textTransform:"uppercase", letterSpacing:"0.5px" }}>{item.badge}</div>
              </div>
            </div>
            <div style={{ padding:"12px 14px" }}>
              <div style={{ fontWeight:800, fontSize:15, color:th.tx, marginBottom:2 }}>{L[item.name]||item.name}</div>
              <div style={{ fontSize:12, color:th.sub, marginBottom:8 }}>{L[item.desc]||item.desc}</div>
              <div className="as-hub-specs">
                {item.specs.map(([k,v]) => (
                  <div key={k} style={{ background:th.sa, borderRadius:7, padding:"4px 8px" }}>
                    <div style={{ fontSize:10, color:th.mt }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:th.tx }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:th.ac, marginBottom:10 }}>{item.price}</div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn style={{ flex:1, padding:"8px 0", fontSize:12 }} onClick={() => { setCart(c=>[...c,L[item.name]||item.name]); notify("Added to cart"); }}>{L.buyBtn}</Btn>
                <Btn outline style={{ flex:1, padding:"8px 0", fontSize:12 }} onClick={() => openBook(item)}>{L.rentBtn} · {item.rent}</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Services with images */}
      <SL th={th}>{L.hubServices}</SL>
      <div className="as-hub-svc">
        {SERVICES.map(svc => (
          <Card th={th} key={svc.id} style={{ padding:0, overflow:"hidden", marginBottom:0, cursor:"pointer" }} onClick={() => openBook(svc)}>
            <div style={{ position:"relative" }}>
              <img src={svc.img} alt={L[svc.nameKey]||svc.nameKey} loading="lazy"
                style={{ width:"100%", height:100, objectFit:"cover", display:"block" }}
                onError={e => { e.target.style.background=th.sa; e.target.style.height="60px"; e.target.style.display="block"; }}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontWeight:700, fontSize:13, color:th.tx, marginBottom:2 }}>{L[svc.nameKey]||svc.nameKey}</div>
              <div style={{ fontSize:16, fontWeight:800, color:th.ac, marginBottom:8 }}>{svc.price}</div>
              <Btn full style={{ padding:"7px 0", fontSize:12 }}>{L.bookBtn}</Btn>
            </div>
          </Card>
        ))}
      </div>
        </>
      ) : (
        <>
        {/* Storage Facilities Comparison */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <I n="building" size={18} color={th.ac} />
            <span style={{ fontSize:16, fontWeight:800, color:th.tx }}>Crop Storage Facilities (Nearest Locations)</span>
          </div>
          
          {/* Storage cards */}
          <div className="as-storage-grid">
            {sortedStorage.map(storage => (
              <Card key={storage.id} th={th} style={{ marginBottom:0, cursor:"pointer", transition:"all 0.15s" }} onClick={() => setSelectedStorage(selectedStorage?.id === storage.id ? null : storage)}>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:th.tx }}>{storage.name}</div>
                      <Bdg color={storage.rating >= 4.7 ? "#16a34a" : storage.rating >= 4.4 ? "#0d9488" : "#f97316"} style={{ marginLeft:"auto" }}>
                        <I n="star" size={10} color="#fff" style={{ marginRight:2 }} /> {storage.rating}
                      </Bdg>
                    </div>
                    <div style={{ display:"flex", gap:12, marginBottom:10, flexWrap:"wrap" }}>
                      <div>
                        <span style={{ fontSize:11, color:th.mt, fontWeight:600 }}>LOCATION</span>
                        <div style={{ fontSize:14, fontWeight:700, color:th.tx }}>{storage.loc} · {storage.dist}</div>
                      </div>
                      <div>
                        <span style={{ fontSize:11, color:th.mt, fontWeight:600 }}>CAPACITY</span>
                        <div style={{ fontSize:14, fontWeight:700, color:th.tx }}>{storage.capacity}</div>
                      </div>
                      <div>
                        <span style={{ fontSize:11, color:th.mt, fontWeight:600 }}>STORAGE TEMP</span>
                        <div style={{ fontSize:14, fontWeight:700, color:th.tx }}>{storage.temp}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:th.ac }}>₹{storage.price}</span>
                      <span style={{ fontSize:12, color:th.sub }}>· {storage.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                {/* Expandable details */}
                {selectedStorage?.id === storage.id && (
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${th.br}` }}>
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:11, color:th.mt, fontWeight:700, marginBottom:6 }}>SUITABLE CROPS</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {storage.crops.map((crop,i) => (
                          <Bdg key={i} color={th.ac} style={{ fontSize:11 }}>{crop}</Bdg>
                        ))}
                      </div>
                    </div>
                    <div className="as-grid2" style={{ marginTop:0 }}>
                      <Btn outline full style={{ padding:"8px 0", fontSize:12 }} onClick={() => { notify(`${storage.name} saved to favorites`); }}>
                        <I n="heart" size={12} color={th.ac} /> Save
                      </Btn>
                      <Btn full style={{ padding:"8px 0", fontSize:12 }} onClick={() => { setModal(storage); setBDone(false); }}>
                        <I n="phone" size={12} color="#fff" /> Book Now
                      </Btn>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        </>
      )}

      {/* Booking modal */}
      {modal && (
        <Modal title={`Book — ${modal.name || L[modal.name]||L[modal.nameKey]||modal.id}`} onClose={() => setModal(null)} th={th}>
          {!bDone ? (
            <div>
              {[["date",L.formDate,"date"],["name",L.formName,"text"],["phone",L.formPhone,"tel"],["notes",L.formNotes,"text"]].map(([k,lb,tp]) => (
                <FL key={k} label={lb} th={th}><Inp th={th} type={tp} value={bf[k]||""} onChange={e => setBf(f=>({...f,[k]:e.target.value}))} /></FL>
              ))}
              <Btn full onClick={() => { if(!bf.date||!bf.name){notify("Fill required fields",true);return;} setBDone(true); }}>
                <I n="checkCirc" size={15} color="#fff" />{L.btnConfirmBooking}
              </Btn>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:th.al, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <I n="checkCirc" size={36} color={th.ac} />
              </div>
              <div style={{ fontWeight:800, fontSize:20, color:th.tx, marginBottom:6 }}>{L.btnBookingConfirmed}</div>
              <div style={{ background:th.sa, borderRadius:12, padding:14, textAlign:"left", marginBottom:16, fontSize:14, lineHeight:1.8, border:`1px solid ${th.br}` }}>
                <div><strong style={{ color:th.sub }}>Service:</strong> {L[modal.name]||L[modal.nameKey]||modal.id}</div>
                <div><strong style={{ color:th.sub }}>Date:</strong> {bf.date}</div>
                <div><strong style={{ color:th.sub }}>Contact:</strong> {bf.name}</div>
              </div>
              <Btn full onClick={() => setModal(null)}>{L.done}</Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
