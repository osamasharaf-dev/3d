import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { invalidateAboutCache } from "../lib/useAbout";
import { invalidateHeroCache } from "../lib/useHero";
import { invalidateCertificationsCache } from "../lib/useCertifications";
import { invalidateProfessionalSkillsCache } from "../lib/useProfessionalSkills";
import { invalidateContactCache } from "../lib/useContactInfo";
import { invalidateProjectsCache } from "../lib/useProjects";

/* ── Theme tokens ─────────────────────────────────────────── */
const C = {
  sidebarBg:     "#2C5EAD",
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
const LS  = { display:"block",fontSize:12,fontWeight:700,color:C.labelColor,letterSpacing:".04em",textTransform:"uppercase",marginBottom:5 };
const CS  = { background:C.cardBg,border:`1.5px solid ${C.cardBorder}`,borderRadius:16,padding:"24px",marginBottom:20 };

/* ── Shared UI ────────────────────────────────────────────── */
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
    <div style={{ position:"fixed",top:20,right:20,zIndex:99999,padding:"12px 20px",borderRadius:12,
      background:ok?C.successBg:C.errorBg,border:`1.5px solid ${ok?C.successBorder:C.errorBorder}`,
      color:ok?C.successColor:C.errorColor,fontSize:14,fontWeight:600,
      boxShadow:"0 4px 24px rgba(0,0,0,0.08)",maxWidth:"90vw" }}>
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
        borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0 }}>
      ✕
    </button>
  );
}

/* ── Image Upload Button ─────────────────────────────────── */
function ImageUploadBtn({ currentUrl, onUrl, folder = "images", label = "Upload Image" }) {
  const fileRef  = useRef();
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    const ext  = file.name.split(".").pop().toLowerCase();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("assets")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("assets").getPublicUrl(path);
    onUrl(publicUrl);
    setUploading(false);
  };

  return (
    <div>
      {/* Preview */}
      {currentUrl && (
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
          <img
            src={currentUrl}
            alt="Preview"
            style={{ width:56,height:56,borderRadius:10,objectFit:"cover",border:`1.5px solid ${C.cardBorder}`,background:"#f0f7ff" }}
            onError={e => { e.target.style.display="none"; }}
          />
          <span style={{ fontSize:12,color:C.textSecondary,wordBreak:"break-all",flex:1 }}>{currentUrl.split("/").pop()}</span>
          <button type="button" onClick={() => onUrl("")}
            style={{ fontSize:11,color:C.errorColor,background:"none",border:"none",cursor:"pointer",padding:"2px 6px" }}>
            Remove
          </button>
        </div>
      )}

      {/* Drag-drop / click area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${uploading ? C.labelColor : C.cardBorder}`,
          borderRadius: 12, padding: "18px 16px", textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          background: uploading ? "rgba(21,145,220,0.04)" : "rgba(196,226,245,0.10)",
          transition: "all .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.labelColor}
        onMouseLeave={e => e.currentTarget.style.borderColor = uploading ? C.labelColor : C.cardBorder}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>{uploading ? "⏳" : "📷"}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>
          {uploading ? "Uploading…" : label}
        </div>
        <div style={{ fontSize: 11, color: C.textSecondary }}>
          {uploading ? "Please wait" : "Click to pick a file — PNG, JPG, WebP, GIF"}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display:"none" }}
        onChange={e => upload(e.target.files?.[0])}
      />
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────── */
function OverviewPanel() {
  const [counts, setCounts] = useState({});
  useEffect(()=>{
    const tables=["certifications","professional_skills","contact_info","about_info","hero_info","skills","projects"];
    Promise.all(tables.map(t=>supabase.from(t).select("*",{count:"exact",head:true}).then(({count})=>({t,count}))))
      .then(res=>setCounts(Object.fromEntries(res.map(({t,count})=>[t,count??0]))));
  },[]);
  const items=[
    {label:"Hero Info",     key:"hero_info",          icon:"🏠"},
    {label:"About Info",    key:"about_info",          icon:"👤"},
    {label:"Certifications",key:"certifications",      icon:"📜"},
    {label:"Soft Skills",   key:"professional_skills", icon:"🧠"},
    {label:"Tech Skills",   key:"skills",              icon:"⚙️"},
    {label:"Projects",      key:"projects",            icon:"🚀"},
    {label:"Contact Info",  key:"contact_info",        icon:"📬"},
  ];
  return (
    <div>
      <h2 style={{ fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20 }}>Dashboard Overview</h2>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12 }}>
        {items.map(({label,key,icon})=>(
          <div key={key} style={{ ...CS,marginBottom:0,textAlign:"center",padding:"16px 12px" }}>
            <div style={{ fontSize:28,marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:24,fontWeight:800,color:C.textPrimary }}>{counts[key]??"—"}</div>
            <div style={{ fontSize:12,color:C.textSecondary,fontWeight:500,marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...CS,marginTop:20 }}>
        <h3 style={{ fontWeight:700,color:C.textPrimary,marginBottom:12,fontSize:15 }}>Quick Guide</h3>
        <ul style={{ color:C.textSecondary,fontSize:14,lineHeight:2,paddingLeft:18,margin:0 }}>
          <li>Edit <strong>Hero Section</strong> to update your name, headline, and typed roles.</li>
          <li>Edit <strong>About &amp; Resume</strong> to update your bio and upload your resume PDF.</li>
          <li>Edit <strong>Certifications</strong> to manage credentials — upload badge images directly.</li>
          <li>Edit <strong>Projects</strong> to add/edit portfolio projects with uploaded cover images.</li>
          <li>Edit <strong>Technical Skills</strong> to manage skill cards by category.</li>
          <li>Edit <strong>Soft Skills</strong> to manage professional skill categories.</li>
          <li>Edit <strong>Contact Info</strong> to update your social links and contact details.</li>
        </ul>
      </div>
    </div>
  );
}

/* ── Hero Panel ──────────────────────────────────────────── */
function HeroPanel() {
  const [form, setForm] = useState({name:"",greeting:"",subtitle:"",cta_primary:"",cta_secondary:"",typed_items:[""]});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("hero_info").select("*").limit(1).single().then(({data})=>{
      if(data)setForm({...data,typed_items:Array.isArray(data.typed_items)?data.typed_items:[""]});
      setLoading(false);
    });
  },[]);

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    const{error}=await supabase.from("hero_info").upsert({...form,updated_at:new Date().toISOString()});
    setSaving(false);
    error?showToast(error.message,"error"):(invalidateHeroCache(),showToast("Hero saved!","success"));
  };

  if(loading)return <Spinner />;
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
              <input {...IS} style={{...IS.style,flex:1}} value={item}
                onChange={e=>{const a=[...form.typed_items];a[i]=e.target.value;setForm(p=>({...p,typed_items:a}));}} />
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

/* ── About Panel ─────────────────────────────────────────── */
function AboutPanel() {
  const [form,setForm]       = useState({bio_paragraphs:[""],services:[],hire_email:"",resume_url:""});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [uploading,setUploading] = useState(false);
  const [toast,setToast]     = useState(null);
  const fileRef = useRef();
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("about_info").select("*").limit(1).single().then(({data})=>{
      if(data)setForm({...data,bio_paragraphs:Array.isArray(data.bio_paragraphs)?data.bio_paragraphs:[""],services:Array.isArray(data.services)?data.services:[],resume_url:data.resume_url||""});
      setLoading(false);
    });
  },[]);

  const uploadResume=async(file)=>{
    if(!file)return;setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`resumes/resume-${Date.now()}.${ext}`;
    const{error}=await supabase.storage.from("assets").upload(path,file,{upsert:true,contentType:file.type});
    if(error){showToast("Upload failed: "+error.message,"error");setUploading(false);return;}
    const{data:{publicUrl}}=supabase.storage.from("assets").getPublicUrl(path);
    setForm(p=>({...p,resume_url:publicUrl}));
    setUploading(false);showToast("Resume uploaded!","success");
  };

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    const{error}=await supabase.from("about_info").upsert({...form,updated_at:new Date().toISOString()});
    setSaving(false);
    error?showToast(error.message,"error"):(invalidateAboutCache(),showToast("About saved!","success"));
  };

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary,marginBottom:20}}>About &amp; Resume</h2>
      <div style={CS}>
        <label style={LS}>Bio Paragraphs</label>
        {(form.bio_paragraphs||[""]).map((p,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <textarea style={{...IS.style,minHeight:80,resize:"vertical"}} value={p}
              onChange={e=>{const a=[...form.bio_paragraphs];a[i]=e.target.value;setForm(f=>({...f,bio_paragraphs:a}));}} />
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
          <label style={LS}>Resume (PDF)</label>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
            <input {...IS} style={{...IS.style,flex:1,minWidth:0}} type="url" placeholder="https://…"
              value={form.resume_url||""} onChange={e=>setForm(p=>({...p,resume_url:e.target.value}))} />
            <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading}
              style={{background:C.accentLight,color:C.textPrimary,border:`1.5px solid ${C.cardBorder}`,
                borderRadius:9,padding:"9px 14px",fontSize:13,fontWeight:600,cursor:uploading?"not-allowed":"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {uploading?"Uploading…":"📤 Upload PDF"}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}}
              onChange={e=>uploadResume(e.target.files?.[0])} />
          </div>
          {form.resume_url&&<p style={{fontSize:12,color:C.textSecondary,wordBreak:"break-all"}}>Current: <a href={form.resume_url} target="_blank" rel="noreferrer" style={{color:C.labelColor}}>View</a></p>}
        </div>
        <SaveBtn loading={saving} />
      </div>
      <div style={CS}>
        <label style={LS}>Services / What I Do</label>
        {(form.services||[]).map((svc,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
            <input {...IS} style={{...IS.style,flex:2,minWidth:120}} placeholder="Title"
              value={svc.title||""} onChange={e=>{const a=[...form.services];a[i]={...a[i],title:e.target.value};setForm(f=>({...f,services:a}));}} />
            <input {...IS} style={{...IS.style,flex:1,minWidth:80}} placeholder="Icon name"
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

/* ── Certifications Panel ────────────────────────────────── */
function CertificationsPanel() {
  const [certs,setCerts]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("certifications").select("*").order("order_index").then(({data})=>{
      if(data)setCerts(data);setLoading(false);
    });
  },[]);

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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <span style={{fontWeight:700,color:C.textPrimary,fontSize:15}}>{cert.title||`Cert #${i+1}`}</span>
            <RemoveBtn onClick={()=>setCerts(p=>p.filter((_,j)=>j!==i))} />
          </div>

          {[["Title","title"],["Company","company_name"],["Date Range","date_range"],["Icon BG (#hex)","icon_bg"]].map(([lbl,field])=>(
            <div key={field} style={{marginBottom:12}}>
              <label style={LS}>{lbl}</label>
              <input {...IS} value={cert[field]||""} onChange={e=>upd(i,field,e.target.value)} />
            </div>
          ))}

          {/* Image upload for icon */}
          <div style={{marginBottom:12}}>
            <label style={LS}>Badge / Icon Image</label>
            <ImageUploadBtn
              currentUrl={cert.icon_url||""}
              onUrl={url=>upd(i,"icon_url",url)}
              folder="cert-icons"
              label="Upload Badge Image"
            />
          </div>

          <div style={{marginBottom:12}}>
            <label style={LS}>Points</label>
            {(cert.points||[""]).map((pt,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input {...IS} style={{...IS.style,flex:1}} value={pt||""}
                  onChange={e=>{const a=[...(cert.points||[])];a[j]=e.target.value;upd(i,"points",a);}} />
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
      <AddBtn onClick={()=>setCerts(p=>[...p,{title:"",company_name:"",date_range:"",icon_bg:"#e0f2fe",icon_url:"",points:[""],credentials:[null],order_index:p.length}])} label="Add Certification" />
      <div><SaveBtn loading={saving} /></div>
    </form>
  );
}

/* ── Projects Panel ──────────────────────────────────────── */
function ProjectsPanel() {
  const [projects,setProjects] = useState([]);
  const [loading,setLoading]   = useState(true);
  const [saving,setSaving]     = useState(false);
  const [toast,setToast]       = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("projects").select("*").order("order_index",{ascending:true}).then(({data})=>{
      if(data)setProjects(data.map(p=>({...p,tags:Array.isArray(p.tags)?p.tags:[],features:Array.isArray(p.features)?p.features:[]})));
      setLoading(false);
    });
  },[]);

  const upd=(i,f,v)=>setProjects(p=>{const a=[...p];a[i]={...a[i],[f]:v};return a;});

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    for(const proj of projects){
      // Handle deletions
      if(proj._deleted){
        if(proj.id&&!String(proj.id).startsWith("new_")){
          const{error}=await supabase.from("projects").delete().eq("id",proj.id);
          if(error){showToast(error.message,"error");setSaving(false);return;}
        }
        continue;
      }
      const payload={
        name:proj.name,description:proj.description,
        image_url:proj.image_url||null,
        source_code_link:proj.source_code_link||null,
        live_demo_link:proj.live_demo_link||null,
        tags:proj.tags||[],
        features:proj.features||[],
        order_index:proj.order_index??0,
      };
      let error;
      if(proj.id&&!String(proj.id).startsWith("new_")){
        ({error}=await supabase.from("projects").update(payload).eq("id",proj.id));
      } else {
        ({error}=await supabase.from("projects").insert(payload));
      }
      if(error){showToast(error.message,"error");setSaving(false);return;}
    }
    setProjects(prev=>prev.filter(p=>!p._deleted));
    invalidateProjectsCache();
    setSaving(false);showToast("Projects saved!","success");
  };

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary}}>Projects</h2>
        <AddBtn onClick={()=>setProjects(p=>[...p,{id:`new_${Date.now()}`,name:"",description:"",image_url:"",source_code_link:"",live_demo_link:"",tags:[],features:[],order_index:p.length}])} label="Add Project" />
      </div>

      {projects.filter(p=>!p._deleted).map((proj,i)=>(
        <div key={proj.id||i} style={CS}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <span style={{fontWeight:700,color:C.textPrimary,fontSize:15}}>{proj.name||`Project #${i+1}`}</span>
            <RemoveBtn onClick={()=>setProjects(p=>p.map((pr,j)=>j===i?{...pr,_deleted:true}:pr))} />
          </div>

          <div style={{marginBottom:12}}>
            <label style={LS}>Project Name</label>
            <input {...IS} value={proj.name||""} onChange={e=>upd(i,"name",e.target.value)} required />
          </div>
          <div style={{marginBottom:12}}>
            <label style={LS}>Description</label>
            <textarea style={{...IS.style,minHeight:80,resize:"vertical"}} value={proj.description||""}
              onChange={e=>upd(i,"description",e.target.value)} />
          </div>

          {/* Cover image upload */}
          <div style={{marginBottom:12}}>
            <label style={LS}>Cover Image</label>
            <ImageUploadBtn
              currentUrl={proj.image_url||""}
              onUrl={url=>upd(i,"image_url",url)}
              folder="project-covers"
              label="Upload Project Cover"
            />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <label style={LS}>GitHub URL</label>
              <input {...IS} type="url" placeholder="https://github.com/…" value={proj.source_code_link||""}
                onChange={e=>upd(i,"source_code_link",e.target.value)} />
            </div>
            <div>
              <label style={LS}>Live Demo URL</label>
              <input {...IS} type="url" placeholder="https://…" value={proj.live_demo_link||""}
                onChange={e=>upd(i,"live_demo_link",e.target.value)} />
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 80px",gap:12,marginBottom:16}}>
            <div>
              <label style={LS}>Tags (one per line, format: name|#color)</label>
              <textarea
                style={{...IS.style,minHeight:70,resize:"vertical",fontFamily:"monospace",fontSize:13}}
                value={(proj.tags||[]).map(t=>typeof t==="object"?`${t.name}|${t.color||"#0ea5e9"}`:(t||"")).join("\n")}
                onChange={e=>{
                  const tags=e.target.value.split("\n").filter(Boolean).map(line=>{
                    const[name,color]=line.split("|");
                    return{name:(name||"").trim(),color:(color||"#0ea5e9").trim()};
                  });
                  upd(i,"tags",tags);
                }}
                placeholder={"React.js|#0ea5e9\nNode.js|#22c55e\nMongoDB|#4f46e5"}
              />
            </div>
            <div>
              <label style={LS}>Order</label>
              <input {...IS} type="number" value={proj.order_index??i}
                onChange={e=>upd(i,"order_index",parseInt(e.target.value)||0)} />
            </div>
          </div>

          <div>
            <label style={LS}>Key Features</label>
            {(proj.features||[]).map((ft,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                <input {...IS} style={{...IS.style,flex:1}} value={ft||""}
                  onChange={e=>{const a=[...(proj.features||[])];a[j]=e.target.value;upd(i,"features",a);}} />
                <RemoveBtn onClick={()=>upd(i,"features",(proj.features||[]).filter((_,k)=>k!==j))} />
              </div>
            ))}
            <AddBtn onClick={()=>upd(i,"features",[...(proj.features||[]),""])} label="Add Feature" />
          </div>
        </div>
      ))}

      {projects.length===0&&(
        <div style={{...CS,textAlign:"center",color:C.textSecondary,fontSize:14,padding:40}}>
          No projects yet. Click "+ Add Project" to get started.
        </div>
      )}
      <div><SaveBtn loading={saving} /></div>
    </form>
  );
}

/* ── Technical Skills Panel ──────────────────────────────── */
const CATEGORIES = ["Frontend","Backend","Database","Cloud & DevOps","Tools","AI & Modern","Frameworks","Technologies","Other"];

function SkillRow({ skill, upd, del }) {
  return (
    <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap",padding:"8px",background:"rgba(196,226,245,0.15)",borderRadius:8}}>
      <input {...IS} style={{...IS.style,width:52,textAlign:"center",fontSize:20,padding:"6px",flexShrink:0}}
        value={skill.icon||""} onChange={e=>upd(skill.id,"icon",e.target.value)} placeholder="💡" title="Emoji icon" />
      <input {...IS} style={{...IS.style,flex:"1 1 140px",minWidth:100}}
        value={skill.name||""} onChange={e=>upd(skill.id,"name",e.target.value)} placeholder="Skill name" required />
      <select style={{...IS.style,flex:"1 1 130px",minWidth:100}}
        value={skill.category||"Frontend"} onChange={e=>upd(skill.id,"category",e.target.value)}>
        {CATEGORIES.map(cat=><option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input {...IS} style={{...IS.style,width:62,textAlign:"center",flexShrink:0}} type="number"
        value={skill.order_index??0} onChange={e=>upd(skill.id,"order_index",parseInt(e.target.value)||0)} title="Order" />
      <RemoveBtn onClick={()=>del(skill.id)} />
    </div>
  );
}

function SkillsPanel() {
  const [skills,setSkills]   = useState([]);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("skills").select("*").order("category").order("order_index",{ascending:true})
      .then(({data})=>{if(data)setSkills(data);setLoading(false);});
  },[]);

  const save=async(e)=>{
    e.preventDefault();setSaving(true);
    for(const skill of skills){
      if(skill._deleted){
        if(skill.id&&!String(skill.id).startsWith("new_"))await supabase.from("skills").delete().eq("id",skill.id);
        continue;
      }
      const payload={category:skill.category,name:skill.name,icon:skill.icon||null,order_index:skill.order_index??0};
      let error;
      if(skill.id&&!String(skill.id).startsWith("new_")){
        ({error}=await supabase.from("skills").update(payload).eq("id",skill.id));
      } else {
        ({error}=await supabase.from("skills").insert(payload));
      }
      if(error){showToast(error.message,"error");setSaving(false);return;}
    }
    setSkills(prev=>prev.filter(s=>!s._deleted));
    setSaving(false);showToast("Technical skills saved!","success");
  };

  const upd=(id,field,value)=>setSkills(prev=>prev.map(s=>s.id===id?{...s,[field]:value}:s));
  const del=(id)=>setSkills(prev=>prev.map(s=>s.id===id?{...s,_deleted:true}:s));
  const add=()=>setSkills(prev=>[...prev,{id:`new_${Date.now()}`,category:"Frontend",name:"",icon:"💡",order_index:prev.length}]);

  const grouped=CATEGORIES.map(cat=>({category:cat,items:skills.filter(s=>s.category===cat&&!s._deleted)})).filter(g=>g.items.length>0);
  const uncat=skills.filter(s=>!CATEGORIES.includes(s.category)&&!s._deleted);
  if(uncat.length>0)grouped.push({category:"Other",items:uncat});

  if(loading)return <Spinner />;
  return (
    <form onSubmit={save}>
      {toast&&<Toast {...toast}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:22,fontWeight:800,color:C.textPrimary}}>Technical Skills</h2>
        <AddBtn onClick={add} label="Add Skill" />
      </div>
      {skills.filter(s=>String(s.id).startsWith("new_")&&!s._deleted).length>0&&(
        <div style={CS}>
          <label style={{...LS,marginBottom:12}}>New Skills (unsaved)</label>
          {skills.filter(s=>String(s.id).startsWith("new_")&&!s._deleted).map(skill=>(
            <SkillRow key={skill.id} skill={skill} upd={upd} del={del} />
          ))}
        </div>
      )}
      {grouped.map(({category,items})=>(
        <div key={category} style={CS}>
          <div style={{fontWeight:700,color:C.textPrimary,fontSize:15,marginBottom:16,paddingBottom:8,borderBottom:`1px solid ${C.cardBorder}`}}>
            {category} <span style={{fontSize:12,color:C.textSecondary,fontWeight:500}}>({items.length})</span>
          </div>
          {items.map(skill=><SkillRow key={skill.id} skill={skill} upd={upd} del={del} />)}
        </div>
      ))}
      {skills.filter(s=>!s._deleted).length===0&&(
        <div style={{...CS,textAlign:"center",color:C.textSecondary,fontSize:14,padding:40}}>No skills yet. Click "+ Add Skill".</div>
      )}
      <div style={{marginTop:8}}><SaveBtn loading={saving} label="Save All Skills" /></div>
    </form>
  );
}

/* ── Soft Skills Panel ───────────────────────────────────── */
function SoftSkillsPanel() {
  const [groups,setGroups]   = useState([]);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("professional_skills").select("*").order("order_index").then(({data})=>{
      if(data)setGroups(data.map(d=>({...d,skills:Array.isArray(d.skills)?d.skills:[]})));
      setLoading(false);
    });
  },[]);

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
                <input {...IS} style={{...IS.style,flex:1}} value={sk||""}
                  onChange={e=>{const a=[...g.skills];a[j]=e.target.value;upd(i,"skills",a);}} />
                <RemoveBtn onClick={()=>upd(i,"skills",(g.skills||[]).filter((_,k)=>k!==j))} />
              </div>
            ))}
            <AddBtn onClick={()=>upd(i,"skills",[...(g.skills||[]),""])} label="Add Skill" />
          </div>
        </div>
      ))}
      <AddBtn onClick={()=>setGroups(p=>[...p,{category:"",icon:"🔹",color:"#0ea5e9",skills:[],order_index:p.length}])} label="Add Category" />
      <div><SaveBtn loading={saving} /></div>
    </form>
  );
}

/* ── Contact Panel ───────────────────────────────────────── */
function ContactPanel() {
  const [form,setForm]       = useState({email:"",phone:"",linkedin:"",github:"",facebook:"",instagram:"",whatsapp:""});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [toast,setToast]     = useState(null);
  const showToast=(msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    supabase.from("contact_info").select("*").limit(1).single().then(({data})=>{
      if(data)setForm(data);setLoading(false);
    });
  },[]);

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

/* ── Nav config ──────────────────────────────────────────── */
const NAV = [
  {id:"overview",   label:"Overview",         icon:"📊"},
  {id:"hero",       label:"Hero Section",     icon:"🏠"},
  {id:"about",      label:"About & Resume",   icon:"👤"},
  {id:"certs",      label:"Certifications",   icon:"📜"},
  {id:"projects",   label:"Projects",         icon:"🚀"},
  {id:"skills",     label:"Technical Skills", icon:"⚙️"},
  {id:"softskills", label:"Soft Skills",      icon:"🧠"},
  {id:"contact",    label:"Contact Info",     icon:"📬"},
];

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar({ active, setActive, onSignOut, onClose }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%",overflow:"hidden" }}>
      <div style={{ padding:"20px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:15,letterSpacing:".04em" }}>Portfolio CMS</div>
          <div style={{ color:"rgba(255,255,255,0.55)",fontSize:11,marginTop:3 }}>Admin Dashboard</div>
        </div>
        {onClose&&(
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
        )}
      </div>
      <nav style={{ flex:1,overflowY:"auto",padding:"10px" }}>
        {NAV.map(({id,label,icon})=>{
          const isActive=active===id;
          return (
            <button key={id} onClick={()=>{setActive(id);onClose&&onClose();}}
              style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:10,
                background:isActive?"rgba(255,255,255,0.18)":"transparent",
                color:isActive?"#fff":"rgba(255,255,255,0.72)",
                border:"none",cursor:"pointer",fontSize:14,fontWeight:isActive?700:500,
                marginBottom:2,textAlign:"left",transition:"all .15s" }}>
              <span style={{fontSize:15}}>{icon}</span>{label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={onSignOut}
          style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",borderRadius:10,
            background:"rgba(239,68,68,0.15)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.25)",
            cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:6 }}>
          🚪 Sign Out
        </button>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"9px 12px",borderRadius:10,
            background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.72)",
            textDecoration:"none",fontSize:13,fontWeight:500 }}>
          🌐 View Site
        </a>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [active,setActive]         = useState("overview");
  const [drawerOpen,setDrawerOpen] = useState(false);

  const signOut=async()=>{
    await supabase.auth.signOut();
    window.location.href="/admin/login";
  };

  const panel={
    overview:   <OverviewPanel />,
    hero:       <HeroPanel />,
    about:      <AboutPanel />,
    certs:      <CertificationsPanel />,
    projects:   <ProjectsPanel />,
    skills:     <SkillsPanel />,
    softskills: <SoftSkillsPanel />,
    contact:    <ContactPanel />,
  }[active]??<OverviewPanel />;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; }
        input:focus, textarea:focus, select:focus {
          border-color:#4BB8FA !important;
          box-shadow:0 0 0 3px rgba(75,184,250,0.15) !important;
        }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#C4E2F5; border-radius:8px; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-header   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-mobile-header   { display: none !important; }
          .admin-drawer-overlay  { display: none !important; }
        }
      `}</style>

      <div style={{ display:"flex",minHeight:"100vh",background:C.bodyBg,fontFamily:"'Inter',system-ui,sans-serif",position:"relative" }}>

        {/* ── Desktop sidebar ── */}
        <aside className="admin-sidebar-desktop"
          style={{ width:232,flexShrink:0,background:C.sidebarBg,flexDirection:"column",position:"sticky",top:0,height:"100vh",boxShadow:"4px 0 20px rgba(0,0,0,0.12)" }}>
          <Sidebar active={active} setActive={setActive} onSignOut={signOut} />
        </aside>

        {/* ── Mobile drawer overlay ── */}
        {drawerOpen&&(
          <div className="admin-drawer-overlay"
            onClick={()=>setDrawerOpen(false)}
            style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.45)" }}>
            <aside
              onClick={e=>e.stopPropagation()}
              style={{ width:230,height:"100%",background:C.sidebarBg,boxShadow:"4px 0 24px rgba(0,0,0,0.25)" }}>
              <Sidebar active={active} setActive={setActive} onSignOut={signOut} onClose={()=>setDrawerOpen(false)} />
            </aside>
          </div>
        )}

        {/* ── Main content ── */}
        <div style={{ flex:1,minWidth:0,display:"flex",flexDirection:"column" }}>

          {/* Mobile top bar */}
          <div className="admin-mobile-header"
            style={{ display:"none",alignItems:"center",gap:12,padding:"12px 16px",background:C.sidebarBg,boxShadow:"0 2px 12px rgba(0,0,0,0.12)",position:"sticky",top:0,zIndex:100 }}>
            <button onClick={()=>setDrawerOpen(true)}
              style={{ background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:9,width:38,height:38,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              ☰
            </button>
            <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>Portfolio CMS</div>
            <div style={{ marginLeft:"auto",color:"rgba(255,255,255,0.7)",fontSize:13 }}>
              {NAV.find(n=>n.id===active)?.icon} {NAV.find(n=>n.id===active)?.label}
            </div>
          </div>

          <main style={{ flex:1,overflowY:"auto",padding:"24px 16px" }}>
            <div style={{ maxWidth:760,margin:"0 auto" }}>
              {panel}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
