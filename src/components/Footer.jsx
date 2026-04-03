import { I } from "./Icons";

export default function Footer({ th }) {
  return (
    <div style={{ marginTop:32, padding:"16px 16px 24px", borderTop:`1px solid ${th.br}`, textAlign:"center" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:6 }}>
        <I n="leaf" size={14} color={th.ac} />
        <span style={{ fontSize:13, color:th.sub, fontWeight:600 }}>AgriSync</span>
      </div>
      <div style={{ fontSize:12, color:th.mt }}>© {new Date().getFullYear()} AgriSync · Made with ❤️ for Indian Farmers</div>
      <div style={{ fontSize:11, color:th.mt, marginTop:4 }}>Data.gov.in · Open-Meteo · eNAM</div>
    </div>
  );
}
