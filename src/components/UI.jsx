import { I } from "./Icons";

export const Modal = ({ title, onClose, children, th }) => (
  <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:3000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(4px)" }}>
    <div onClick={e => e.stopPropagation()} style={{ background:th.card,color:th.tx,borderRadius:"22px 22px 0 0",width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto",fontFamily:"inherit",border:`1px solid ${th.br}`,borderBottom:"none" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 14px",borderBottom:`1px solid ${th.br}`,position:"sticky",top:0,background:th.card,zIndex:1 }}>
        <span style={{ fontWeight:800,fontSize:17,color:th.tx }}>{title}</span>
        <button onClick={onClose} style={{ background:th.sa,border:"none",borderRadius:10,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.sub }}>
          <I n="x" size={15} color={th.sub} />
        </button>
      </div>
      <div style={{ padding:"18px 20px 48px" }}>{children}</div>
    </div>
  </div>
);

export const Card = ({ children, th, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background:th.card, borderRadius:16, padding:18,
    border:`1px solid ${th.br}`, boxShadow:th.sh,
    marginBottom:14, transition:"all 0.2s",
    ...(onClick ? { cursor:"pointer" } : {}),
    ...style,
  }}
    onMouseEnter={onClick ? e => { e.currentTarget.style.boxShadow=th.shHover; e.currentTarget.style.transform="translateY(-1px)"; } : undefined}
    onMouseLeave={onClick ? e => { e.currentTarget.style.boxShadow=th.sh; e.currentTarget.style.transform="translateY(0)"; } : undefined}
  >
    {children}
  </div>
);

export const Btn = ({ children, onClick, outline=false, color, disabled=false, full=false, style={} }) => {
  const c = color || "#16a34a";
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      background:outline?"transparent":c, color:outline?c:"#fff",
      border:`2px solid ${c}`, borderRadius:12, padding:"11px 20px",
      fontWeight:700, fontSize:15, cursor:disabled?"not-allowed":"pointer",
      fontFamily:"inherit", transition:"all 0.18s", opacity:disabled?0.5:1,
      display:"inline-flex", alignItems:"center", gap:8, justifyContent:"center",
      ...(full ? { width:"100%" } : {}), ...style,
    }}>
      {children}
    </button>
  );
};

export const Inp = ({ th, ...p }) => (
  <input {...p} style={{ width:"100%",background:th.sa,border:`1.5px solid ${th.br}`,borderRadius:11,padding:"12px 14px",color:th.tx,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border 0.15s",...p.style }}
    onFocus={e => e.target.style.borderColor="#16a34a"}
    onBlur={e => e.target.style.borderColor=""}
  />
);

export const Sel = ({ th, children, ...p }) => (
  <select {...p} style={{ width:"100%",background:th.sa,border:`1.5px solid ${th.br}`,borderRadius:11,padding:"12px 14px",color:th.tx,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",...p.style }}>
    {children}
  </select>
);

export const Bdg = ({ children, color="#16a34a", style={} }) => (
  <span style={{ background:color+"22",color,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:700,display:"inline-block",...style }}>
    {children}
  </span>
);

export const Bar = ({ value, color="#16a34a", th }) => (
  <div style={{ height:7,borderRadius:6,background:th.br,overflow:"hidden",marginTop:6 }}>
    <div style={{ height:"100%",width:`${Math.min(value,100)}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:6,transition:"width 1s ease" }} />
  </div>
);

export const SL = ({ children, th }) => (
  <div style={{ fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:th.mt,marginBottom:12 }}>
    {children}
  </div>
);

export const FL = ({ label, th, children }) => (
  <div style={{ marginBottom:14 }}>
    <label style={{ fontSize:13,fontWeight:600,color:th.mt,display:"block",marginBottom:6 }}>{label}</label>
    {children}
  </div>
);

// Wrapper components for new feature pages
export const Button = ({ onClick, children, disabled = false, variant = "primary", style = {} }) => {
  const bg = variant === "secondary" ? "transparent" : "#16a34a";
  const color = variant === "secondary" ? "#16a34a" : "#fff";
  const border = variant === "secondary" ? "1px solid #16a34a" : "none";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "11px 20px", background: bg, color, border, borderRadius: 12,
      fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", opacity: disabled ? 0.5 : 1, ...style
    }}>
      {children}
    </button>
  );
};

export const Input = ({ type = "text", placeholder = "", value = "", onChange = () => {}, min = undefined, max = undefined, step = undefined, label = "", style = {} }) => (
  <div style={{marginBottom: 12}}>
    {label && <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} min={min} max={max} step={step} 
      style={{width:"100%", padding:"12px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit", ...style}} 
    />
  </div>
);

export const Select = ({ label = "", value = "", onChange = () => {}, options = [], style = {} }) => (
  <div style={{marginBottom: 12}}>
    {label && <label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)} 
      style={{width:"100%", padding:"12px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit", ...style}}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);
