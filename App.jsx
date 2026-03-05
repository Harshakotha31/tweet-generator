import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const TONES = ["Witty","Bold","Premium","Humorous","Informative","Playful","Minimal","Inspirational"];
const OBJECTIVES = ["Engagement","Promotion","Awareness","Education","Community","Product Launch"];
const INDUSTRIES = ["Technology","Fashion & Beauty","Food & Beverage","Finance","Health & Wellness","Entertainment","E-commerce","Travel","Sports","Education"];

const TWEET_STYLES = [
  "engaging / conversational",
  "promotional",
  "witty / meme-style",
  "informative / value-driven",
  "engaging / conversational",
  "promotional",
  "witty / meme-style",
  "informative / value-driven",
  "engaging / conversational",
  "promotional",
];
const PALETTE = ["#3b82f6","#8b5cf6","#06b6d4","#a855f7","#6366f1","#7c3aed","#2563eb","#9333ea","#0ea5e9","#7e22ce"];

/* ══════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#060818;font-family:'Inter',sans-serif;color:#fff;overflow-x:hidden}
::selection{background:#3b82f630;color:#fff}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:rgba(99,140,255,0.25);border-radius:4px}
input,textarea{font-family:'Inter',sans-serif;color:#e2e8f0}
input::placeholder,textarea::placeholder{color:rgba(148,163,184,0.4)}
input:focus,textarea:focus{outline:none}
textarea{resize:none}
button{outline:none;font-family:'Inter',sans-serif;cursor:pointer}

/* Professional grid background */
.bg-grid{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-color:#060818;
  background-image:
    linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
  background-size:48px 48px;
}
.bg-glow{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 10% 20%, rgba(37,99,235,0.1) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 80%, rgba(109,40,217,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(15,23,42,0.6) 0%, transparent 100%);
}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spinRing{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}}
@keyframes gradFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes tweetIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes scanLine{from{width:0}to{width:100%}}
@keyframes ripple{0%{transform:scale(0);opacity:.4}100%{transform:scale(4);opacity:0}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(59,130,246,0.4)}50%{opacity:.7;box-shadow:0 0 0 6px rgba(59,130,246,0)}}
`;


/* ══════════════════════════════════════════════════════
   TILT CARD
══════════════════════════════════════════════════════ */
function TiltCard({ children, glow="#3b82f6", style={} }) {
  const ref = useRef(null);
  const [rot, setRot] = useState({x:0,y:0});
  const [on, setOn] = useState(false);
  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({ x:((e.clientY-r.top)/r.height-.5)*-6, y:((e.clientX-r.left)/r.width-.5)*6 });
  };
  return (
    <div ref={ref}
      onMouseMove={onMove}
      onMouseEnter={()=>setOn(true)}
      onMouseLeave={()=>{setRot({x:0,y:0});setOn(false);}}
      style={{
        transform:`perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateZ(${on?4:0}px)`,
        transition: on?"transform 0.08s ease,box-shadow 0.3s":"transform 0.55s cubic-bezier(0.23,1,0.32,1),box-shadow 0.3s",
        transformStyle:"preserve-3d",
        background:"linear-gradient(135deg,rgba(13,19,44,0.85),rgba(9,14,35,0.9))",
        backdropFilter:"blur(32px) saturate(160%)", WebkitBackdropFilter:"blur(32px) saturate(160%)",
        border:`1px solid rgba(99,140,255,${on?.2:.09})`,
        borderRadius:"16px",
        boxShadow:on
          ? `0 32px 72px rgba(0,0,20,0.75),0 0 60px ${glow}2a,inset 0 1px 0 rgba(150,180,255,0.16)`
          : `0 8px 36px rgba(0,0,20,0.5),inset 0 1px 0 rgba(150,180,255,0.07)`,
        position:"relative", overflow:"hidden", ...style
      }}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:`radial-gradient(ellipse at 40% 0%,${glow}16,transparent 70%)`,pointerEvents:"none",zIndex:0,opacity:on?1:0.5,transition:"opacity 0.3s"}}/>
      <div style={{position:"absolute",top:"-100%",left:"-55%",width:"50%",height:"300%",background:"linear-gradient(105deg,transparent 38%,rgba(150,200,255,0.045) 50%,transparent 62%)",transform:on?"translateX(400%)":"translateX(0)",transition:on?"transform 0.65s ease":"none",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NEON BUTTON
══════════════════════════════════════════════════════ */
function NeonBtn({ children, onClick, disabled, color1="#1d4ed8", color2="#7c3aed", glow="#3b82f655", full, style={} }) {
  const [pressed,setPressed]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [ripples,setRipples]=useState([]);
  const fire = e => {
    if(disabled) return;
    const r=e.currentTarget.getBoundingClientRect();
    const id=Date.now();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(x=>x.id!==id)),700);
    onClick&&onClick(e);
  };
  return (
    <button disabled={disabled}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setHovered(false);setPressed(false);}}
      onClick={fire}
      style={{
        width:full?"100%":"auto", padding:"17px 28px",
        background:`linear-gradient(135deg,${color1},${color2})`,
        border:"none", borderRadius:"14px",
        cursor:disabled?"not-allowed":"pointer",
        color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700,
        fontSize:"13px", letterSpacing:"1.5px",
        boxShadow:`0 ${hovered?"18":"8"}px ${hovered?"48":"28"}px ${glow},inset 0 1px 0 rgba(255,255,255,0.2),inset 0 -1px 0 rgba(0,0,0,0.25)`,
        transform:pressed?"scale(0.97) translateY(1px)":hovered?"translateY(-2px) scale(1.01)":"none",
        transition:"transform 0.15s ease,box-shadow 0.2s ease,opacity 0.2s",
        opacity:disabled?.5:1,
        position:"relative", overflow:"hidden",
        display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", ...style
      }}>
      {ripples.map(r=>(
        <span key={r.id} style={{position:"absolute",left:r.x,top:r.y,width:"20px",height:"20px",marginLeft:"-10px",marginTop:"-10px",borderRadius:"50%",background:"rgba(255,255,255,0.28)",animation:"ripple 0.7s ease-out forwards",pointerEvents:"none"}}/>
      ))}
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   GHOST BUTTON
══════════════════════════════════════════════════════ */
function GhostBtn({ children, onClick }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      padding:"17px 24px",
      background:h?"rgba(59,130,246,0.1)":"rgba(59,130,246,0.04)",
      border:`1.5px solid rgba(99,140,255,${h?.3:.14})`,
      borderRadius:"14px", color:`rgba(180,210,255,${h?.85:.45})`,
      fontFamily:"'Syne',sans-serif", fontSize:"13px", fontWeight:600, letterSpacing:"0.5px",
      transition:"all 0.2s", transform:h?"translateY(-1px)":"none"
    }}>{children}</button>
  );
}

/* ══════════════════════════════════════════════════════
   CHIP
══════════════════════════════════════════════════════ */
function Chip({ label, selected, onClick, color="#3b82f6" }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      padding:"7px 16px", borderRadius:"999px", border:"none",
      background:selected?`linear-gradient(135deg,${color}dd,${color}88)`:h?"rgba(59,130,246,0.12)":"rgba(59,130,246,0.06)",
      color:selected?"#fff":h?"rgba(180,210,255,0.8)":"rgba(150,180,255,0.45)",
      fontFamily:"'DM Sans',sans-serif", fontSize:"12.5px", fontWeight:selected?600:400,
      transform:selected?"scale(1.06) translateY(-1px)":h?"scale(1.02)":"scale(1)",
      transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow:selected?`0 4px 18px ${color}44,inset 0 1px 0 rgba(255,255,255,0.2)`:"none"
    }}>
      {selected&&<span style={{marginRight:"5px",fontSize:"9px"}}>✦</span>}{label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   FLOAT INPUT
══════════════════════════════════════════════════════ */
function FloatInput({ label, value, onChange, placeholder, multiline, color="#3b82f6" }) {
  const [focus,setFocus]=useState(false);
  const raised = focus || value.length > 0;
  const base = {
    width:"100%", background:"rgba(15,25,65,0.55)",
    border:`1.5px solid ${focus?color:"rgba(99,140,255,0.13)"}`,
    borderRadius:"13px", padding:"22px 16px 10px",
    color:"#dde9ff", fontSize:"14px", lineHeight:1.6,
    transition:"border-color 0.2s,box-shadow 0.2s",
    boxShadow:focus?`0 0 0 3px ${color}1a`:"none",
  };
  return (
    <div style={{position:"relative",marginBottom:"20px"}}>
      <label style={{
        position:"absolute", left:"16px",
        top:raised?"8px":"50%", transform:raised?"none":"translateY(-50%)",
        fontSize:raised?"9.5px":"13.5px", fontWeight:raised?600:400,
        letterSpacing:raised?"1.8px":"0", textTransform:raised?"uppercase":"none",
        color:raised?color:"rgba(150,180,255,0.38)",
        pointerEvents:"none", zIndex:3,
        transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
        fontFamily:"'DM Sans',sans-serif"
      }}>{label}</label>
      {multiline
        ? <textarea rows={3} style={{...base,paddingTop:"24px"}} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} placeholder={focus?placeholder:""}/>
        : <input style={base} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} placeholder={focus?placeholder:""}/>
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════════════ */
function Steps({ current }) {
  const labels = ["Brand Info","Brand Voice","Results"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"36px"}}>
      {labels.map((l,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
            <div style={{
              width:i===current?"44px":"10px", height:"10px", borderRadius:"999px",
              background:i<current?"linear-gradient(90deg,#3b82f6,#8b5cf6)":i===current?"linear-gradient(90deg,#2563eb,#7c3aed,#06b6d4)":"rgba(99,140,255,0.15)",
              backgroundSize:i===current?"200% 100%":"100% 100%",
              animation:i===current?"gradFlow 2s ease infinite":"none",
              boxShadow:i===current?"0 0 18px #3b82f688":i<current?"0 0 8px #3b82f655":"none",
              transition:"all 0.45s cubic-bezier(0.34,1.56,0.64,1)"
            }}/>
            <span style={{fontSize:"9px",letterSpacing:"1.2px",color:i===current?"#93c5fd":i<current?"rgba(59,130,246,0.6)":"rgba(150,180,255,0.25)",fontFamily:"'Syne',sans-serif",fontWeight:600,transition:"color 0.3s",whiteSpace:"nowrap"}}>{l}</span>
          </div>
          {i<2&&<div style={{width:"40px",height:"1px",background:"rgba(99,140,255,0.1)",margin:"0 4px 14px"}}/>}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOADING STATE
══════════════════════════════════════════════════════ */
function LoadingState() {
  const msgs = ["Analysing brand DNA…","Building tone profile…","Crafting viral hooks…","Polishing 10 tweets…"];
  const [msg,setMsg]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setMsg(p=>(p+1)%msgs.length),1200);
    return()=>clearInterval(t);
  },[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 0 32px",gap:"22px",animation:"fadeIn 0.4s ease"}}>
      <div style={{position:"relative",width:"80px",height:"80px"}}>
        {[["80px","#3b82f6","1s",false],["58px","#8b5cf6","0.7s",true],["38px","#06b6d4","0.45s",false]].map(([s,c,d,rev],i)=>(
          <div key={i} style={{position:"absolute",top:`${(80-parseInt(s))/2}px`,left:`${(80-parseInt(s))/2}px`,width:s,height:s,borderRadius:"50%",border:"2px solid transparent",borderTop:`2px solid ${c}`,animation:`spinRing ${d} linear infinite ${rev?"reverse":""}`}}/>
        ))}
        <div style={{position:"absolute",inset:"26px",borderRadius:"50%",background:"radial-gradient(circle,#3b82f444,transparent)",animation:"blink 1.8s ease-in-out infinite"}}/>
      </div>
      <div style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700,background:"linear-gradient(90deg,rgba(147,197,253,0.2) 25%,#93c5fd 50%,rgba(147,197,253,0.2) 75%)",backgroundSize:"200% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"shimmer 1.8s ease-in-out infinite"}}>
        {msgs[msg]}
      </div>
      <div style={{display:"flex",gap:"7px"}}>
        {[0,1,2,3,4].map(i=><div key={i} style={{width:"4px",height:"4px",borderRadius:"50%",background:"#3b82f6",animation:"blink 1.4s ease-in-out infinite",animationDelay:`${i*.15}s`}}/>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VOICE SUMMARY CARD  ← assignment: 3-4 bullet points
══════════════════════════════════════════════════════ */
function VoiceCard({ voice, brandName }) {
  const icons = { tone:"🎭", audience:"🎯", themes:"🧵", personality:"⚡" };
  const colors = ["#3b82f6","#8b5cf6","#06b6d4","#a855f7"];
  const entries = Object.entries(voice);

  return (
    <TiltCard glow="#8b5cf6" style={{padding:"28px",marginBottom:"28px"}}>
      {/* header */}
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#8b5cf6",boxShadow:"0 0 14px #8b5cf6",animation:"blink 2s ease infinite"}}/>
        <span style={{fontSize:"10px",color:"#c4b5fd",letterSpacing:"3px",fontFamily:"'Syne',sans-serif",fontWeight:700}}>
          BRAND VOICE ANALYSIS
        </span>
        {brandName && (
          <div style={{marginLeft:"auto",padding:"3px 12px",background:"rgba(139,92,246,0.14)",border:"1px solid rgba(139,92,246,0.3)",borderRadius:"999px",fontSize:"9px",color:"#c4b5fd",letterSpacing:"1px",fontFamily:"'Syne',sans-serif",fontWeight:600,}}>
            {brandName.toUpperCase()}
          </div>
        )}
      </div>
      <p style={{fontSize:"11px",color:"rgba(150,180,255,0.35)",letterSpacing:"0.5px",marginBottom:"20px",fontFamily:"'DM Sans',sans-serif"}}>
        A summary of the inferred brand personality, audience & content approach
      </p>

      {/* 4 bullet cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
        {entries.map(([k,v],i)=>(
          <div key={k} style={{background:`linear-gradient(135deg,${colors[i]}0d,transparent)`,border:`1px solid ${colors[i]}28`,borderRadius:"14px",padding:"14px 16px",animation:`fadeUp 0.4s ease ${i*80}ms both`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,width:"40px",height:"40px",background:`radial-gradient(circle at 100% 0%,${colors[i]}20,transparent 70%)`,pointerEvents:"none"}}/>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"7px"}}>
              <span style={{fontSize:"14px"}}>{icons[k]||"•"}</span>
              <span style={{fontSize:"9px",color:colors[i],letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{k}</span>
            </div>
            <p style={{fontSize:"12.5px",color:"rgba(200,220,255,0.84)",lineHeight:1.55,margin:0}}>{v}</p>
          </div>
        ))}
      </div>
    </TiltCard>
  );
}

/* ══════════════════════════════════════════════════════
   TWEET ROW — style label matches assignment exactly
══════════════════════════════════════════════════════ */
function TweetRow({ tweet, index, visible }) {
  const [copied,setCopied]=useState(false);
  const [h,setH]=useState(false);
  const color = PALETTE[index % PALETTE.length];
  const pct = Math.min(tweet.length/280,1);
  const copy = () => { navigator.clipboard.writeText(tweet); setCopied(true); setTimeout(()=>setCopied(false),1600); };

  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        opacity:visible?1:0,
        animation:visible?`tweetIn 0.45s cubic-bezier(0.22,1,0.36,1) ${index*60}ms both`:"none",
        background:h?"rgba(15,25,55,0.7)":"rgba(10,16,38,0.55)",
        backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
        border:`1px solid rgba(99,140,255,${h?.18:.07})`,
        borderLeft:`3px solid ${color}`,
        borderRadius:"14px", padding:"14px 16px", marginBottom:"8px",
        transition:"background 0.2s,border-color 0.2s,box-shadow 0.2s",
        boxShadow:h?`0 8px 32px rgba(0,0,30,0.5),0 0 24px ${color}18`:"0 2px 10px rgba(0,0,20,0.3)",
        position:"relative", overflow:"hidden"
      }}>
      {h&&<div style={{position:"absolute",bottom:0,left:0,height:"1px",background:`linear-gradient(90deg,${color},transparent)`,animation:"scanLine 0.4s ease forwards"}}/>}

      <div style={{display:"flex",alignItems:"flex-start",gap:"12px"}}>
        {/* index badge */}
        <div style={{minWidth:"28px",height:"28px",borderRadius:"8px",background:`${color}18`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,color,fontFamily:"'Syne',sans-serif",flexShrink:0}}>
          {String(index+1).padStart(2,"0")}
        </div>

        <div style={{flex:1,minWidth:0}}>
          {/* style label — exact assignment categories */}
          <div style={{fontSize:"8px",letterSpacing:"2px",textTransform:"uppercase",color,opacity:0.8,marginBottom:"8px",fontFamily:"'Syne',sans-serif",fontWeight:700,display:"flex",alignItems:"center",gap:"6px"}}>
            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>
            {TWEET_STYLES[index]}
          </div>

          {/* tweet text */}
          <p style={{margin:0,fontSize:"13.5px",lineHeight:1.7,color:"rgba(210,230,255,0.9)",fontFamily:"'DM Sans',sans-serif",wordBreak:"break-word"}}>{tweet}</p>

          {/* char bar */}
          <div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{flex:1,height:"2px",background:"rgba(99,140,255,0.1)",borderRadius:"999px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct*100}%`,background:pct>.9?"#ef4444":pct>.7?"#f59e0b":color,borderRadius:"999px",transition:"width 0.3s"}}/>
            </div>
            <span style={{fontSize:"9px",color:"rgba(150,180,255,0.28)",fontFamily:"'Syne',sans-serif",minWidth:"32px",textAlign:"right"}}>{tweet.length}/280</span>
          </div>
        </div>

        {/* copy button */}
        <button onClick={copy} style={{
          padding:"7px 11px",borderRadius:"8px",
          background:copied?`${color}22`:"rgba(59,130,246,0.07)",
          border:`1px solid ${copied?color:"rgba(99,140,255,0.14)"}`,
          color:copied?color:"rgba(150,180,255,0.38)",
          fontSize:"11px",fontFamily:"'Syne',sans-serif",
          transition:"all 0.2s",flexShrink:0,whiteSpace:"nowrap",
          transform:copied?"scale(1.06)":"scale(1)"
        }}>{copied?"✓ done":"copy"}</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DIVIDER
══════════════════════════════════════════════════════ */
function Divider({ label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px"}}>
      <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(59,130,246,0.5),transparent)"}}/>
      <span style={{fontSize:"9px",letterSpacing:"3px",color:"rgba(150,180,255,0.32)",fontFamily:"'Syne',sans-serif",fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>
      <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(59,130,246,0.5))"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep]     = useState(0);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");
  const [result, setResult] = useState(null);
  const [shown, setShown]   = useState([]);
  const [allCopied, setAllCopied] = useState(false);

  /* form state */
  const [brandName, setBrandName] = useState("");
  const [industry,  setIndustry]  = useState("");
  const [products,  setProducts]  = useState("");
  const [objective, setObj]       = useState("");
  const [tones,     setTones]     = useState([]);
  const [audience,  setAudience]  = useState("");
  const [themes,    setThemes]    = useState("");

  const toggleTone = t => setTones(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);

  /* ── PROMPT — covers all 4 tweet styles + voice summary ── */
  const buildPrompt = () => `You are a senior brand strategist and viral social media copywriter.

BRAND BRIEF:
- Brand Name: ${brandName || "(not specified — infer from industry)"}
- Industry: ${industry || "(not specified)"}
- Products/Services: ${products || "(not specified)"}
- Campaign Objective: ${objective || "General brand awareness"}
- Brand Tone: ${tones.length ? tones.join(", ") : "(infer from brand context)"}
- Target Audience: ${audience || "(infer from brand context)"}
- Content Themes: ${themes || "(infer from brand context)"}

YOUR TASK:
1. Infer the brand voice from the brief above.
2. Generate EXACTLY 10 tweets in this brand's voice.

TWEET STYLE ORDER (must follow exactly):
1. engaging / conversational
2. promotional
3. witty / meme-style
4. informative / value-driven
5. engaging / conversational
6. promotional
7. witty / meme-style
8. informative / value-driven
9. engaging / conversational
10. promotional

TWEET RULES:
- MAX 280 characters per tweet (hard limit)
- Max 2 hashtags per tweet, placed naturally
- NEVER start with: "We're excited", "Introducing", "Check out", "Announcing", "Thrilled to"
- Each tweet must feel DISTINCT — no repetition
- Write like the brand's best social media manager — punchy, real, shareable

OUTPUT: Respond ONLY in this exact JSON format. No markdown. No explanation. Start with { end with }:
{"brand_voice":{"tone":"describe in one sharp sentence","audience":"describe in one sharp sentence","themes":"describe in one sharp sentence","personality":"describe in one sharp sentence"},"tweets":["tweet1","tweet2","tweet3","tweet4","tweet5","tweet6","tweet7","tweet8","tweet9","tweet10"]}`;

  /* ── GENERATE ── */
  const generate = async () => {
    setLoad(true); setError(""); setResult(null); setShown([]);
    try {
      // Using Groq API — free tier, no credit card needed
      // Get your free key at: https://console.groq.com
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1800,
          temperature: 0.8,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are a brand strategist. Output ONLY valid JSON. No markdown, no code fences, no preamble. Response starts with { and ends with }."
            },
            { role: "user", content: buildPrompt() }
          ]
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${res.status} — please try again.`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.choices?.[0]?.message?.content || "";
      // Strip any accidental markdown fences
      const clean = raw.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
      let parsed;
      try { parsed = JSON.parse(clean); }
      catch { throw new Error("Could not parse response — please try again."); }
      if (!parsed.tweets || !Array.isArray(parsed.tweets) || parsed.tweets.length < 10)
        throw new Error("Incomplete response — please try again.");
      // Enforce 10 tweets max
      parsed.tweets = parsed.tweets.slice(0, 10);
      setResult(parsed);
      setStep(2);
      // Stagger tweet reveal
      parsed.tweets.forEach((_, i) => setTimeout(() => setShown(p => [...p, i]), 180 + i * 95));
    } catch (e) {
      setError(e.message || "Something went wrong.");
    }
    setLoad(false);
  };

  const reset = () => {
    setStep(0); setResult(null); setShown([]); setError(""); setAllCopied(false);
    setBrandName(""); setIndustry(""); setProducts(""); setObj(""); setTones([]); setAudience(""); setThemes("");
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      `Brand Voice Analysis — ${brandName || "Your Brand"}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ...Object.entries(result.brand_voice).map(([k,v]) => `• ${k.toUpperCase()}: ${v}`),
      ``,
      `10 On-Brand Tweets`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ...result.tweets.map((t, i) => `${i+1}. [${TWEET_STYLES[i].toUpperCase()}]\n   ${t}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2200);
  };

  /* ── RENDER ── */
  return (
    <>
      <style>{CSS}</style>

      {/* ── PROFESSIONAL BACKGROUND ── */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* ── CONTENT ── */}
      <div style={{position:"relative",zIndex:2,maxWidth:"680px",margin:"0 auto",padding:"56px 20px 120px",minHeight:"100vh"}}>

        {/* ── HERO ── */}
        <div style={{marginBottom:"52px",animation:"fadeUp 0.5s ease both"}}>

          {/* top label */}
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"20px"}}>
            <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#3b82f6",animation:"pulse 2.5s ease infinite"}}/>
            <span style={{fontSize:"11px",letterSpacing:"3px",color:"rgba(148,163,184,0.6)",fontWeight:500,textTransform:"uppercase"}}>
              AI-Powered · Brand Intelligence
            </span>
          </div>

          {/* headline */}
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(34px,5.5vw,56px)",lineHeight:1.08,letterSpacing:"-1.5px",marginBottom:"16px",color:"#f1f5f9"}}>
            Brand Voice
            <span style={{display:"block",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
              Tweet Generator
            </span>
          </h1>

          {/* subtitle */}
          <p style={{fontSize:"15px",color:"rgba(148,163,184,0.7)",maxWidth:"480px",lineHeight:1.7,fontWeight:400,marginBottom:"28px"}}>
            Analyse your brand's voice and generate 10 on-brand tweets across four content styles — powered by Claude Sonnet.
          </p>

          {/* platform pills — clean horizontal row */}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {[
              {label:"Twitter / X", color:"#1d9bf0"},
              {label:"Instagram",   color:"#e1306c"},
              {label:"LinkedIn",    color:"#0a66c2"},
              {label:"YouTube",     color:"#ff0000"},
              {label:"Facebook",    color:"#1877f2"},
              {label:"TikTok",      color:"#000000"},
            ].map(({label,color})=>(
              <span key={label} style={{
                padding:"4px 12px",borderRadius:"4px",fontSize:"11px",fontWeight:500,
                background:"rgba(15,23,42,0.6)",
                border:"1px solid rgba(99,140,255,0.14)",
                color:"rgba(148,163,184,0.65)",letterSpacing:"0.2px"
              }}>{label}</span>
            ))}
          </div>
        </div>

        {step < 2 && <Steps current={step} />}

        {/* ════ STEP 0 — Brand Info ════ */}
        {step === 0 && (
          <div style={{animation:"fadeUp 0.4s ease both"}}>
            <TiltCard glow="#3b82f6" style={{padding:"32px 32px 28px",marginBottom:"16px"}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"15px",color:"#93c5fd",marginBottom:"28px",display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontSize:"18px"}}>🏷️</span> Tell us about your brand
              </h2>
              <FloatInput label="Brand Name" value={brandName} onChange={setBrandName} placeholder="Zomato, Apple, Cred, Nike…" color="#3b82f6"/>
              <div style={{marginBottom:"22px"}}>
                <p style={{fontSize:"9.5px",color:"rgba(150,180,255,0.35)",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:"12px"}}>Industry / Category</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
                  {INDUSTRIES.map(i=><Chip key={i} label={i} selected={industry===i} onClick={()=>setIndustry(i===industry?"":i)} color="#8b5cf6"/>)}
                </div>
              </div>
              <FloatInput label="Products / Services" value={products} onChange={setProducts} placeholder="What does your brand sell or offer?" multiline color="#3b82f6"/>
              <div>
                <p style={{fontSize:"9.5px",color:"rgba(150,180,255,0.35)",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:"12px"}}>Campaign Objective</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
                  {OBJECTIVES.map(o=><Chip key={o} label={o} selected={objective===o} onClick={()=>setObj(o===objective?"":o)} color="#06b6d4"/>)}
                </div>
              </div>
            </TiltCard>
            <NeonBtn full onClick={()=>setStep(1)} color1="#1d4ed8" color2="#7c3aed" glow="#3b82f655">
              NEXT: DEFINE VOICE →
            </NeonBtn>
          </div>
        )}

        {/* ════ STEP 1 — Voice Setup ════ */}
        {step === 1 && (
          <div style={{animation:"fadeUp 0.4s ease both"}}>
            <TiltCard glow="#8b5cf6" style={{padding:"32px 32px 28px",marginBottom:"16px"}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"15px",color:"#c4b5fd",marginBottom:"28px",display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontSize:"18px"}}>🎙️</span> Define the brand voice
              </h2>
              <div style={{marginBottom:"22px"}}>
                <p style={{fontSize:"9.5px",color:"rgba(150,180,255,0.35)",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:"12px"}}>
                  Brand Tone <span style={{color:"rgba(150,180,255,0.22)",fontWeight:400,textTransform:"none",letterSpacing:"0",fontSize:"11px"}}>— pick all that apply</span>
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
                  {TONES.map(t=><Chip key={t} label={t} selected={tones.includes(t)} onClick={()=>toggleTone(t)} color="#a855f7"/>)}
                </div>
              </div>
              <FloatInput label="Target Audience" value={audience} onChange={setAudience} placeholder="Gen Z foodies, startup founders, busy parents…" color="#8b5cf6"/>
              <FloatInput label="Content Themes" value={themes} onChange={setThemes} placeholder="Deals, launches, memes, behind-the-scenes, tips…" multiline color="#8b5cf6"/>
            </TiltCard>

            {error && (
              <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.28)",borderRadius:"12px",padding:"12px 16px",marginBottom:"14px",color:"#fca5a5",fontSize:"13px",fontFamily:"'DM Sans',sans-serif",animation:"fadeIn 0.3s ease",display:"flex",alignItems:"center",gap:"8px"}}>
                <span>⚠️</span> {error}
              </div>
            )}

            <div style={{display:"flex",gap:"12px"}}>
              <GhostBtn onClick={()=>{setStep(0);setError("");}}>← BACK</GhostBtn>
              <NeonBtn full onClick={generate} disabled={loading} color1="#5b21b6" color2="#1d4ed8" glow="#8b5cf655" style={{flex:1}}>
                {loading
                  ? <><span style={{width:"15px",height:"15px",borderRadius:"50%",border:"2.5px solid rgba(255,255,255,0.35)",borderTop:"2.5px solid #fff",animation:"spinRing 0.75s linear infinite",flexShrink:0}}/> GENERATING TWEETS…</>
                  : "✦ GENERATE 10 TWEETS"
                }
              </NeonBtn>
            </div>
            {loading && <LoadingState/>}
          </div>
        )}

        {/* ════ STEP 2 — Results ════ */}
        {step === 2 && result && (
          <div style={{animation:"fadeUp 0.5s ease both"}}>

            {/* VOICE SUMMARY — 4 bullet points (assignment: 3-4) */}
            <VoiceCard voice={result.brand_voice} brandName={brandName}/>

            {/* TWEETS HEADER */}
            <Divider label={`10 ON-BRAND TWEETS · ${(brandName||"YOUR BRAND").toUpperCase()}`}/>

            {/* style legend */}
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"16px"}}>
              {["engaging / conversational","promotional","witty / meme-style","informative / value-driven"].map((s,i)=>(
                <div key={s} style={{padding:"3px 10px",background:`${PALETTE[i]}12`,border:`1px solid ${PALETTE[i]}30`,borderRadius:"999px",fontSize:"9px",color:PALETTE[i],fontFamily:"'Syne',sans-serif",fontWeight:600,letterSpacing:"0.5px"}}>
                  {s}
                </div>
              ))}
            </div>

            {/* 10 TWEETS */}
            {result.tweets.map((t,i)=>(
              <TweetRow key={i} tweet={t} index={i} visible={shown.includes(i)}/>
            ))}

            {/* ACTIONS */}
            <div style={{display:"flex",gap:"12px",marginTop:"28px"}}>
              <GhostBtn onClick={reset}>← NEW BRAND</GhostBtn>
              <NeonBtn full onClick={copyAll} color1={allCopied?"#059669":"#1d4ed8"} color2={allCopied?"#047857":"#7c3aed"} glow={allCopied?"#10b98155":"#3b82f655"} style={{flex:1}}>
                {allCopied?"✓ COPIED — PASTE ANYWHERE":"COPY ALL + VOICE SUMMARY ↗"}
              </NeonBtn>
            </div>

            {/* STATS */}
            <div style={{display:"flex",marginTop:"22px",padding:"18px 24px",background:"rgba(12,22,58,0.6)",border:"1px solid rgba(99,140,255,0.1)",borderRadius:"18px",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
              {[
                {v:10,            l:"Tweets"},
                {v:Math.round(result.tweets.reduce((a,t)=>a+t.length,0)/10), l:"Avg Chars"},
                {v:result.tweets.filter(t=>t.includes("#")).length, l:"Hashtag Tweets"},
                {v:4,             l:"Style Types"},
              ].map(({v,l},i)=>(
                <div key={l} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid rgba(99,140,255,0.1)":"none",padding:"0 10px"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"24px",background:"linear-gradient(135deg,#93c5fd,#c4b5fd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:`countUp 0.5s ease ${i*100}ms both`}}>{v}</div>
                  <div style={{fontSize:"9px",color:"rgba(150,180,255,0.28)",letterSpacing:"0.8px",marginTop:"3px",fontFamily:"'Syne',sans-serif"}}>{l}</div>
                </div>
              ))}
            </div>

            <p style={{textAlign:"center",marginTop:"20px",fontSize:"9px",color:"rgba(150,180,255,0.13)",letterSpacing:"2px",fontFamily:"'Syne',sans-serif"}}>
              Powered by Groq · Llama 3.3 70B · Confluencr AI Internship
            </p>
          </div>
        )}
      </div>
    </>
  );
}
