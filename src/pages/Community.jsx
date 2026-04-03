import { useState } from "react";
import { I } from "../components/Icons";
import { Card, Modal, Btn, Bdg, Inp } from "../components/UI";

export default function Community({ th, L, user, farm, posts, setPosts, notify }) {
  const [newPost, setNewPost] = useState("");
  const [cmtM, setCmtM] = useState(null);
  const [cmtTxt, setCmtTxt] = useState("");

  const addComment = () => {
    if (!cmtTxt.trim()) return;
    const nc = { a: user.name, t: cmtTxt };
    const up = { ...cmtM, comments: [...cmtM.comments, nc] };
    setPosts(ps => ps.map(p => p.id === cmtM.id ? up : p));
    setCmtM(up);
    setCmtTxt("");
  };

  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:700,margin:"0 0 16px",color:th.tx }}>{L.community}</h2>

      <Card th={th}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={L.sharePost}
          style={{ width:"100%",background:th.sa,border:`1px solid ${th.br}`,borderRadius:10,padding:"12px 13px",color:th.tx,fontSize:15,fontFamily:"inherit",outline:"none",minHeight:86,resize:"vertical",boxSizing:"border-box",marginBottom:10 }} />
        <div style={{ display:"flex",justifyContent:"flex-end" }}>
          <Btn onClick={() => {
            if (!newPost.trim()) return;
            setPosts(p => [{ id:Date.now(), av:user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(), author:user.name, time:"Just now", text:newPost, likes:0, liked:false, comments:[], crop:"General", loc:farm.loc }, ...p]);
            setNewPost("");
            notify("Post shared");
          }}>
            <I n="send" size={15} color="#fff" />Post
          </Btn>
        </div>
      </Card>

      {posts.map((p, i) => (
        <Card th={th} key={p.id}>
          <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
            <div style={{ width:42,height:42,borderRadius:12,background:th.as,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:th.ac,fontSize:14,flexShrink:0 }}>{p.av}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5 }}>
                <div>
                  <span style={{ fontWeight:700,fontSize:15,color:th.tx }}>{p.author}</span>
                  {p.loc && <span style={{ fontSize:13,color:th.mt,marginLeft:7 }}>{p.loc}</span>}
                </div>
                <span style={{ fontSize:13,color:th.mt,flexShrink:0,marginLeft:8 }}>{p.time}</span>
              </div>
              <Bdg color={th.ac}>{p.crop}</Bdg>
              <p style={{ fontSize:15,lineHeight:1.65,margin:"8px 0 10px",color:th.tx }}>{p.text}</p>
              {p.comments.length > 0 && (
                <div style={{ background:th.sa,borderRadius:10,padding:10,marginBottom:10,border:`1px solid ${th.br}` }}>
                  <div style={{ fontSize:14,color:th.tx }}>
                    <strong style={{ color:th.sub }}>{p.comments[0].a}:</strong> {p.comments[0].t}
                  </div>
                  {p.comments.length > 1 && (
                    <button onClick={() => { setCmtM(p); setCmtTxt(""); }} style={{ background:"none",border:"none",color:th.ac,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4,padding:0 }}>
                      {L.textMoreComments.replace("{count}", p.comments.length - 1)}
                    </button>
                  )}
                </div>
              )}
              <div style={{ display:"flex",gap:14 }}>
                <button onClick={() => setPosts(ps => ps.map((x, j) => j===i ? { ...x, likes:x.liked?x.likes-1:x.likes+1, liked:!x.liked } : x))}
                  style={{ background:"none",border:"none",color:p.liked?th.ac:th.mt,cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:p.liked?700:400,display:"flex",alignItems:"center",gap:5 }}>
                  <I n="thumbUp" size={14} color={p.liked?th.ac:th.mt} />{p.likes}
                </button>
                <button onClick={() => { setCmtM(p); setCmtTxt(""); }}
                  style={{ background:"none",border:"none",color:th.mt,cursor:"pointer",fontSize:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5 }}>
                  <I n="msg" size={14} color={th.mt} />{p.comments.length}
                </button>
                <button onClick={() => notify(L.textLinkCopied)}
                  style={{ background:"none",border:"none",color:th.mt,cursor:"pointer",fontSize:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5 }}>
                  <I n="share" size={14} color={th.mt} />Share
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {cmtM && (
        <Modal title={L.communityComments} onClose={() => { setCmtM(null); setCmtTxt(""); }} th={th}>
          <div style={{ maxHeight:260,overflowY:"auto",marginBottom:14 }}>
            {cmtM.comments.length === 0 && <p style={{ textAlign:"center",color:th.mt,fontSize:14 }}>{L.communityNoComments}</p>}
            {cmtM.comments.map((c, i) => (
              <div key={i} style={{ display:"flex",gap:9,marginBottom:12 }}>
                <div style={{ width:32,height:32,borderRadius:9,background:th.as,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0,color:th.ac }}>
                  {c.a.slice(0,2).toUpperCase()}
                </div>
                <div style={{ background:th.sa,borderRadius:10,padding:"9px 12px",flex:1,border:`1px solid ${th.br}` }}>
                  <div style={{ fontWeight:700,fontSize:12,marginBottom:3,color:th.sub }}>{c.a}</div>
                  <div style={{ fontSize:14,color:th.tx }}>{c.t}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Inp th={th} value={cmtTxt} onChange={e => setCmtTxt(e.target.value)} placeholder="Write a comment..." style={{ flex:1 }}
              onKeyDown={e => { if (e.key === "Enter" && cmtTxt.trim()) addComment(); }} />
            <Btn onClick={addComment}><I n="send" size={15} color="#fff" /></Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
