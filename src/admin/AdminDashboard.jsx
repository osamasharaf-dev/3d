import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { invalidateAboutCache } from "../lib/useAbout";
import { invalidateHeroCache } from "../lib/useHero";
import { invalidateCertificationsCache } from "../lib/useCertifications";
import { invalidateProfessionalSkillsCache } from "../lib/useProfessionalSkills";
import { invalidateContactCache } from "../lib/useContactInfo";

// ── Color tokens ─────────────────────────────────────────────────────
const C = {
  sidebarBg:     "#2C5EAD",
  headerBg:      "#2C5EAD",
  bodyBg:        "#f0f7ff",
  cardBg:        "#ffffff",
  cardBorder:    "#C4E2F5",
  textPrimary:   "#1a3360",
  textSecondary: "#4a6590",
  labelColor:    "#1591DC",
  inputBg:       "#ffffff",
  inputBorder:   "#d1e8f7",
  accentLight:   "#C4E2F5",
  btnPrimary:    "linear-gradient(135deg,#1591DC,#2C5EAD)",
  successBg:     "rgba(34,197,94,0.08)",
  successBorder: "rgba(34,197,94,0.3)",
  successColor:  "#15803d",
  errorBg:       "rgba(239,68,68,0.08)",
  errorBorder:   "rgba(239,68,68,0.3)",
  errorColor:    "#dc2626",
};

const IS = {
  style: {
    background: C.inputBg, border: `1.5px solid ${C.inputBorder}`,
    borderRadius: 10, padding: "9px 13px", color: C.textPrimary,
    fontSize: 14, width: "100%", outline: "none", transition: "border-color .2s",
  },
};
const LS = { display:"block", fontSize:12, fontWeight:700, color:C.labelColor, letterSpacing:".04em", textTransform:"uppercase", marginBottom:5 };
const CS = { background:C.cardBg, border:`1.5px solid ${C.cardBorder}`, borderRadius:16, padding:"24px", marginBottom:20 };

function Spinner() {
  return (
    <div style={{ display:"flex",justifyContent:"center",padding:"32px" }}>
      <div style={{ width:32,height:32,borderRadius:"50%",border:`3px solid ${C.accentLight}`,borderTopColor:C.labelColor,animation:"adminspin .8s linear infinite" }} />
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const ok = type==="success";
  return (
    <div style={{ position:"fixed",top:20,right:20,zIndex:9999,padding:"12px 20px",borderRadius:12,
      background:ok?C.successBg:C.errorBg,border:`1.5px solid ${ok?C.successBorder:C.errorBorder}`,
      color:ok?C.successColor:C.errorColor,fontSize:14,fontWeight:600,
      boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
      {ok?"✓ ":"✕ "}{msg}
    </div>
  );
}

function SaveBtn({ loading, label="Save Changes" }) {
  return (
    <button type="submit" disabled={loading}
      style={{ marginTop:16,background:C.btnPrimary,color:"#fff",border:"none",borderRadius:10,
        padding:"10px 24px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",
        opacity:loading?.7:1,boxShadow:"0 4px 16px rgba(21,145,220,0.25)",transition:"opacity .2s" }}>
      {loading?"Saving…":label}
    </button>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      style={{ background:C.accentLight,color:C.textPrimary,border:`1.5px solid ${C.cardBorder}`,
        borderRadius:8,padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8 }}>
      + {label}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ background:"rgba(239,68,68,0.08)",color:"#dc2626",border:"1.5px solid rgba(239,68,68,0.22)",
        borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:600,cursor:"pointer" }}>
      Remove
    </button>
  );
}

// ── Panels ─────────────────────────────────────────────────────────

function OverviewPanel() {
  const [counts, setCounts] = useState({});
  useEffect(()=>{
    const tables=["certifications","professional_skills","contact_info","about_info","hero_info"];
    Promise.all(tables.map(t=>supabase.from(t).select("*",{count:"exact",head:true}).then(({count})=>({t,count}))))
      .then(res=>setCounts(Object.fromEntries(res.map(({t,count})=>[t,count??0]))));
  },[]);
  const items=[
    {label:"Hero Info",key:"hero_info",icon:"🏠"},
    {label:"About Info",key:"about_info",icon:"👤"},
    {label:"Certifications",key:"certifications",icon:"📜"},
    {label:"Soft Skills",key:"professional_skills",icon:"🧠"},
    {label:"Contact Info",key:"contact_info",icon:"📬"},
  ];
  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20 }}>Dashboard Overview</h2>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16 }}>
        {items.map(({label,key,icon})=>(
          <div key={key} style={{ ...CS,marginBottom:0,textAlign:"center",padding:"20px 16px" }}>
            <div style={{ fontSize:32,marginBottom:10 }}>{icon}</div>
            <div style={{ fontSize:26,fontWeight:800,color:C.textPrimary }}>{counts[key]??"—"}</div>
            <div style={{ fontSize:13,color:C.textSecondary,fontWeight:500,marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...CS,marginTop:24 }}>
        <h3 style={{ fontWeight:700,color:C.textPrimary,marginBottom:12,fontSize:15 }}>Quick Guide</h3>
        <ul style={{ color:C.textSecondary,fontSize:14,lineHeight:1.8,paddingLeft:18 }}>
          <li>Edit <strong>Hero Section</strong> to update your name, headline, and typed roles.</li>
          <li>Edit <strong>About &amp; Resume</strong> to update your bio and attach your resume PDF.</li>
          <li>Edit <strong>Certifications</strong> to manage your credentials and badges.</li>
          <li>Edit <strong>Soft Skills</strong> to manage professional skill categories.</li>
          <li>Edit <strong>Contact Info</strong> to update your social links and contact details.</li>
        </ul>
      </div>
    </div>
  );
}

function HeroPanel() {
  const [form, setForm] = useState({name:"",greeting:"",subtitle:"",cta_primary:"",cta_secondary:"",typed_items:[""]});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(()=>{
    supabase.from("hero_info").select("*").limit(1).single().then(({data})=>{
      if (data) setForm({...data,typed_items:Array.isArray(data.typed_items)?data.typed_items:[""]});
      setLoading(false);
    });
  },[]);

  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const save=async(e)=>{
    e.preventDefault(); setSaving(true);
    const {error}=await supabase.from("hero_info").upsert({...form,updated_at:new Date().toISOString()});
    setSaving(false);
    error?showToast(error.message,"error"):(invalidateHeroCache(),showToast("Hero saved!","success"));
  };

  if (loading) return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>Hero Section</h2>
      <div style={CS}>
        {[["Name","name"],["Greeting","greeting"],["Subtitle","subtitle"],["Primary CTA","cta_primary"],["Secondary CTA","cta_secondary"]].map(([label,field])=>(
          <div key={field} style={{marginBottom:16}}>
            <label style={LS}>{label}</label>
            <input {...IS} value={form[field]||""} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))} />
          </div>
        ))}
        <div>
          <label style={LS}>Typed Items</label>
          {(form.typed_items||[""]).map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <input {...IS} style={{...IS.style,flex:1}} value={item} onChange={e=>{const a=[...form.typed_items];a[i]=e.target.value;setForm(p=>({...p,typed_items:a}));}} />
              <RemoveBtn onClick={()=>{const a=form.typed_items.filter((_,j)=>j!==i);setForm(p=>({...p,typed_items:a.length?a:[""]}));}} />
            </div>
          ))}
          <AddBtn onClick={()=>setForm(p=>({...p,typed_items:[...p.typed_items,""]}))} label="Add Item" />
        </div>
        <SaveBtn loading={saving} />
      </div>
    </form>
  );
}

function AboutPanel() {
  const [form, setForm] = useState({bio_paragraphs:[""],services:[],hire_email:"",resume_url:""});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  useEffect(()=>{
    supabase.from("about_info").select("*").limit(1).single().then(({data})=>{
      if (data) setForm({
        ...data,
        bio_paragraphs:Array.isArray(data.bio_paragraphs)?data.bio_paragraphs:[""],
        services:Array.isArray(data.services)?data.services:[],
        resume_url:data.resume_url||"",
      });
      setLoading(false);
    });
  },[]);

  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const uploadResume=async(file)=>{
    if(!file)return;
    setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`resumes/resume-${Date.now()}.${ext}`;
    const {error}=await supabase.storage.from("assets").upload(path,file,{upsert:true,contentType:file.type});
    if(error){showToast("Upload failed: "+error.message,"error");setUploading(false);return;}
    const {data:{publicUrl}}=supabase.storage.from("assets").getPublicUrl(path);
    setForm(p=>({...p,resume_url:publicUrl}));
    setUploading(false);
    showToast("Resume uploaded!","success");
  };

  const save=async(e)=>{
    e.preventDefault(); setSaving(true);
    const {error}=await supabase.from("about_info").upsert({...form,updated_at:new Date().toISOString()});
    setSaving(false);
    error?showToast(error.message,"error"):(invalidateAboutCache(),showToast("About saved!","success"));
  };

  if (loading) return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>About &amp; Resume</h2>

      <div style={CS}>
        <label style={LS}>Bio Paragraphs</label>
        {(form.bio_paragraphs||[""]).map((p,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <textarea style={{...IS.style,minHeight:80,resize:"vertical"}}
              value={p} onChange={e=>{const a=[...form.bio_paragraphs];a[i]=e.target.value;setForm(f=>({...f,bio_paragraphs:a}));}} />
            <div style={{marginTop:4}}><RemoveBtn onClick={()=>{const a=form.bio_paragraphs.filter((_,j)=>j!==i);setForm(f=>({...f,bio_paragraphs:a.length?a:[""]}));}} /></div>
          </div>
        ))}
        <AddBtn onClick={()=>setForm(f=>({...f,bio_paragraphs:[...f.bio_paragraphs,""]}))} label="Add Paragraph" />
      </div>

      <div style={CS}>
        <div style={{marginBottom:20}}>
          <label style={LS}>Hire Email</label>
          <input {...IS} type="email" value={form.hire_email||""} onChange={e=>setForm(p=>({...p,hire_email:e.target.value}))} />
        </div>

        <div>
          <label style={LS}>Resume URL — "See my Resume" button</label>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
            <input {...IS} style={{...IS.style,flex:1}}
              type="url"
              placeholder="https://drive.google.com/…  or paste a direct PDF link"
              value={form.resume_url||""}
              onChange={e=>setForm(p=>({...p,resume_url:e.target.value}))} />
            <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading}
              style={{background:C.accentLight,color:C.textPrimary,border:`1.5px solid ${C.cardBorder}`,
                borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:600,
                cursor:uploading?"not-allowed":"pointer",whiteSpace:"nowrap"}}>
              {uploading?"Uploading…":"📤 Upload PDF"}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}}
              onChange={e=>uploadResume(e.target.files?.[0])} />
          </div>
          {form.resume_url&&(
            <p style={{fontSize:12,color:C.textSecondary,wordBreak:"break-all"}}>
              Current: <a href={form.resume_url} target="_blank" rel="noreferrer" style={{color:C.labelColor}}>{form.resume_url}</a>
            </p>
          )}
          <p style={{marginTop:6,fontSize:11,color:C.textSecondary}}>
            Paste a Google Drive / Dropbox share link or upload a PDF — it will appear as "See my Resume" on the site.
          </p>
        </div>

        <SaveBtn loading={saving} />
      </div>

      <div style={CS}>
        <label style={LS}>Services / What I Do</label>
        {(form.services||[]).map((svc,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
            <input {...IS} style={{...IS.style,flex:2,minWidth:140}} placeholder="Title (e.g. Frontend Dev)"
              value={svc.title||""} onChange={e=>{const a=[...form.services];a[i]={...a[i],title:e.target.value};setForm(f=>({...f,services:a}));}} />
            <input {...IS} style={{...IS.style,flex:1,minWidth:100}} placeholder="icon_name (web|mobile|backend|creator)"
              value={svc.icon_name||""} onChange={e=>{const a=[...form.services];a[i]={...a[i],icon_name:e.target.value};setForm(f=>({...f,services:a}));}} />
            <RemoveBtn onClick={()=>setForm(f=>({...f,services:f.services.filter((_,j)=>j!==i)}))} />
          </div>
        ))}
        <AddBtn onClick={()=>setForm(f=>({...f,services:[...f.services,{title:"",icon_name:"web"}]}))} label="Add Service" />
        <SaveBtn loading={saving} label="Save Services" />
      </div>
    </form>
  );
}

function CertificationsPanel() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(()=>{
    supabase.from("certifications").select("*").order("order_index").then(({data})=>{
      if(data)setCerts(data);
      setLoading(false);
    });
  },[]);

  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    for(const cert of certs){
      const{error}=await supabase.from("certifications").upsert(cert);
      if(error){showToast(error.message,"error");setSaving(false);return;}
    }
    invalidateCertificationsCache();setSaving(false);showToast("Certifications saved!","success");
  };

  const upd=(i,f,v)=>setCerts(p=>{const a=[...p];a[i]={...a[i],[f]:v};return a;});

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>Certifications</h2>
      {certs.map((cert,i)=>(
        <div key={cert.id||i} style={CS}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontWeight:700,color:C.textPrimary,fontSize:15}}>{cert.title||`Cert #${i+1}`}</span>
            <RemoveBtn onClick={()=>setCerts(p=>p.filter((_,j)=>j!==i))} />
          </div>
          {[["Title","title"],["Company","company_name"],["Date Range","date_range"],["Icon BG (#hex)","icon_bg"],["Icon URL","icon_url"]].map(([lbl,field])=>(
            <div key={field} style={{marginBottom:12}}>
              <label style={LS}>{lbl}</label>
              <input {...IS} value={cert[field]||""} onChange={e=>upd(i,field,e.target.value)} />
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <label style={LS}>Points</label>
            {(cert.points||[""]).map((pt,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input {...IS} style={{...IS.style,flex:1}} value={pt||""} onChange={e=>{const a=[...(cert.points||[])];a[j]=e.target.value;upd(i,"points",a);}} />
                <RemoveBtn onClick={()=>upd(i,"points",(cert.points||[]).filter((_,k)=>k!==j))} />
              </div>
            ))}
            <AddBtn onClick={()=>upd(i,"points",[...(cert.points||[]),""])} label="Add Point" />
          </div>
          <div>
            <label style={LS}>Credential URLs</label>
            {(cert.credentials||[null]).map((cr,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input {...IS} style={{...IS.style,flex:1}} placeholder="https://… (leave empty for none)"
                  value={cr||""} onChange={e=>{const a=[...(cert.credentials||[])];a[j]=e.target.value||null;upd(i,"credentials",a);}} />
                <RemoveBtn onClick={()=>upd(i,"credentials",(cert.credentials||[]).filter((_,k)=>k!==j))} />
              </div>
            ))}
            <AddBtn onClick={()=>upd(i,"credentials",[...(cert.credentials||[]),null])} label="Add URL" />
          </div>
        </div>
      ))}
      <AddBtn onClick={()=>setCerts(p=>[...p,{title:"",company_name:"",date_range:"",icon_bg:"#383E56",points:[""],credentials:[null],order_index:p.length}])} label="Add Certification" />
      <div><SaveBtn loading={saving} /></div>
    </form>
  );
}

function SoftSkillsPanel() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(()=>{
    supabase.from("professional_skills").select("*").order("order_index").then(({data})=>{
      if(data)setGroups(data.map(d=>({...d,skills:Array.isArray(d.skills)?d.skills:[]})));
      setLoading(false);
    });
  },[]);

  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    for(const g of groups){
      const{error}=await supabase.from("professional_skills").upsert(g);
      if(error){showToast(error.message,"error");setSaving(false);return;}
    }
    invalidateProfessionalSkillsCache();setSaving(false);showToast("Soft skills saved!","success");
  };

  const upd=(i,f,v)=>setGroups(p=>{const a=[...p];a[i]={...a[i],[f]:v};return a;});

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>Soft Skills</h2>
      {groups.map((g,i)=>(
        <div key={g.id||i} style={CS}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontWeight:700,color:C.textPrimary,fontSize:15}}>{g.category||`Group #${i+1}`}</span>
            <RemoveBtn onClick={()=>setGroups(p=>p.filter((_,j)=>j!==i))} />
          </div>
          {[["Category","category"],["Icon (emoji)","icon"],["Accent Color (#hex)","color"]].map(([lbl,field])=>(
            <div key={field} style={{marginBottom:12}}>
              <label style={LS}>{lbl}</label>
              <input {...IS} value={g[field]||""} onChange={e=>upd(i,field,e.target.value)} />
            </div>
          ))}
          <div>
            <label style={LS}>Skills</label>
            {(g.skills||[]).map((sk,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input {...IS} style={{...IS.style,flex:1}} value={sk||""} onChange={e=>{const a=[...g.skills];a[j]=e.target.value;upd(i,"skills",a);}} />
                <RemoveBtn onClick={()=>upd(i,"skills",(g.skills||[]).filter((_,k)=>k!==j))} />
              </div>
            ))}
            <AddBtn onClick={()=>upd(i,"skills",[...(g.skills||[]),""])} label="Add Skill" />
          </div>
        </div>
      ))}
      <AddBtn onClick={()=>setGroups(p=>[...p,{category:"",icon:"🔹",color:"#8ec5ff",skills:[],order_index:p.length}])} label="Add Category" />
      <div><SaveBtn loading={saving} /></div>
    </form>
  );
}

function ContactPanel() {
  const [form, setForm] = useState({email:"",phone:"",linkedin:"",github:"",facebook:"",instagram:"",whatsapp:""});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(()=>{
    supabase.from("contact_info").select("*").limit(1).single().then(({data})=>{
      if(data)setForm(data);
      setLoading(false);
    });
  },[]);

  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    const{error}=await supabase.from("contact_info").upsert({...form,updated_at:new Date().toISOString()});
    setSaving(false);
    error?showToast(error.message,"error"):(invalidateContactCache(),showToast("Contact info saved!","success"));
  };

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>Contact Info</h2>
      <div style={CS}>
        {[["Email","email","email"],["Phone","phone","tel"],["LinkedIn URL","linkedin","url"],["GitHub URL","github","url"],["Facebook URL","facebook","url"],["Instagram URL","instagram","url"],["WhatsApp URL","whatsapp","url"]].map(([lbl,field,type])=>(
          <div key={field} style={{marginBottom:16}}>
            <label style={LS}>{lbl}</label>
            <input {...IS} type={type} value={form[field]||""} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))} />
          </div>
        ))}
        <SaveBtn loading={saving} />
      </div>
    </form>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────
const NAV = [
  {id:"overview",   label:"Overview",       icon:"📊"},
  {id:"hero",       label:"Hero Section",   icon:"🏠"},
  {id:"about",      label:"About & Resume", icon:"👤"},
  {id:"certs",      label:"Certifications", icon:"📜"},
  {id:"softskills", label:"Soft Skills",    icon:"🧠"},
  {id:"contact",    label:"Contact Info",   icon:"📬"},
];

// ── Main ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("overview");

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const panel = {
    overview:   <OverviewPanel />,
    hero:       <HeroPanel />,
    about:      <AboutPanel />,
    certs:      <CertificationsPanel />,
    softskills: <SoftSkillsPanel />,
    contact:    <ContactPanel />,
  }[active] ?? <OverviewPanel />;

  return (
    <>
      <style>{`
        @keyframes adminspin { to { transform:rotate(360deg); } }
        *, *::before, *::after { box-sizing:border-box; }
        input:focus, textarea:focus, select:focus {
          border-color:#4BB8FA !important;
          box-shadow:0 0 0 3px rgba(75,184,250,0.15) !important;
        }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:#C4E2F5; border-radius:8px; }
      `}</style>

      <div style={{ display:"flex",minHeight:"100vh",background:C.bodyBg,fontFamily:"'Inter',system-ui,sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width:240,flexShrink:0,background:C.sidebarBg,
          display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",
          boxShadow:"4px 0 24px rgba(44,94,173,0.18)",
        }}>
          {/* Logo */}
          <div style={{padding:"28px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.12)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.15)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:800,color:"#fff",fontSize:14,border:"1.5px solid rgba(255,255,255,0.25)"}}>OS</div>
              <div>
                <div style={{fontWeight:800,color:"#fff",fontSize:14,lineHeight:1.2}}>Admin Panel</div>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginTop:2}}>Osama Sharaf</div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{flex:1,padding:"14px 10px",overflowY:"auto"}}>
            {NAV.map(({id,label,icon})=>{
              const active_=active===id;
              return (
                <button key={id} onClick={()=>setActive(id)}
                  style={{
                    width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding:"10px 12px",borderRadius:10,marginBottom:4,
                    background:active_?"rgba(255,255,255,0.18)":"transparent",
                    border:active_?"1.5px solid rgba(255,255,255,0.22)":"1.5px solid transparent",
                    color:"#fff",fontWeight:active_?700:500,fontSize:13.5,
                    cursor:"pointer",textAlign:"left",transition:"all .15s",
                  }}>
                  <span style={{fontSize:16,minWidth:20,textAlign:"center"}}>{icon}</span>
                  {label}
                  {active_&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#4BB8FA",flexShrink:0}} />}
                </button>
              );
            })}
          </nav>

          {/* Sign out */}
          <div style={{padding:"14px 10px",borderTop:"1px solid rgba(255,255,255,0.12)"}}>
            <button onClick={signOut}
              style={{width:"100%",padding:"10px 12px",borderRadius:10,
                background:"rgba(239,68,68,0.15)",border:"1.5px solid rgba(239,68,68,0.32)",
                color:"#fca5a5",fontSize:13.5,fontWeight:600,cursor:"pointer",
                display:"flex",alignItems:"center",gap:8}}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

          {/* Header */}
          <header style={{
            background:C.headerBg,padding:"16px 32px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            boxShadow:"0 2px 16px rgba(44,94,173,0.18)",position:"sticky",top:0,zIndex:50,
          }}>
            <div>
              <h1 style={{color:"#fff",fontWeight:800,fontSize:17,margin:0}}>
                {NAV.find(n=>n.id===active)?.label??"Dashboard"}
              </h1>
              <p style={{color:"rgba(255,255,255,0.55)",fontSize:12,margin:0,marginTop:2}}>
                Portfolio CMS · {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
              </p>
            </div>
            <a href="/" target="_blank" rel="noreferrer"
              style={{color:"rgba(255,255,255,0.85)",fontSize:13,fontWeight:600,textDecoration:"none",
                padding:"7px 16px",borderRadius:8,background:"rgba(255,255,255,0.12)",
                border:"1.5px solid rgba(255,255,255,0.2)"}}>
              View Site ↗
            </a>
          </header>

          {/* Content */}
          <main style={{flex:1,padding:"32px",overflowY:"auto"}}>
            {panel}
          </main>
        </div>
      </div>
    </>
  );
}
