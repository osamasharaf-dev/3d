import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { invalidateProjectsCache } from "../lib/useProjects";
import { invalidateHeroCache } from "../lib/useHero";
import { invalidateAboutCache } from "../lib/useAbout";
import { invalidateCertificationsCache } from "../lib/useCertifications";
import { invalidateProfessionalSkillsCache } from "../lib/useProfessionalSkills";
import { invalidateContactCache } from "../lib/useContactInfo";

const TAG_COLORS = ["blue-text-gradient","green-text-gradient","pink-text-gradient","violet-text-gradient","orange-text-gradient"];
const ICON_OPTIONS = ["web","mobile","backend","creator"];

/* ─── Shared UI ───────────────────────────────────────────── */
function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-[#915EFF] border-t-transparent animate-spin inline-block" />;
}

function CI({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide">{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none"
        style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function CT({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide">{label}</label>}
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none resize-y"
        style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, size = "md" }) {
  const v = {
    primary:   { background: "linear-gradient(135deg,#915EFF,#6d3fcf)", color: "white" },
    secondary: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" },
    danger:    { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"} rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85`}
      style={v[variant]}>
      {children}
    </button>
  );
}

function Msg({ type, text }) {
  if (!text) return null;
  const c = type === "success"
    ? { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", color: "#4ade80" }
    : { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: "#f87171" };
  return <div className="px-4 py-3 rounded-xl text-sm" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>{text}</div>;
}

function ListManager({ label, items, onChange, placeholder = "Add item..." }) {
  const [inp, setInp] = useState("");
  const add = () => { const v = inp.trim(); if (!v) return; onChange([...items, v]); setInp(""); };
  return (
    <div className="space-y-2">
      {label && <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide block">{label}</label>}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <input value={item} onChange={e => { const a = [...items]; a[i] = e.target.value; onChange(a); }}
            className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm outline-none"
            style={{ background: "rgba(7,8,15,0.8)", border: "1px solid rgba(255,255,255,0.08)" }} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity w-6 text-center text-lg leading-none">×</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder}
          className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm outline-none"
          style={{ background: "rgba(7,8,15,0.8)", border: "1px solid rgba(255,255,255,0.08)" }} />
        <Btn size="sm" onClick={add}>+ Add</Btn>
      </div>
    </div>
  );
}

function PanelHead({ title, subtitle }) {
  return (
    <div className="mb-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <h2 className="text-white text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-[#aaa6c3] text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

/* ─── Panel: Overview ──────────────────────────────────────── */
function OverviewPanel() {
  const [counts, setCounts] = useState({ projects: "—", certs: "—", skills: "—" });
  useEffect(() => {
    Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("certifications").select("*", { count: "exact", head: true }),
      supabase.from("professional_skills").select("*", { count: "exact", head: true }),
    ]).then(([p, c, s]) => setCounts({ projects: p.count ?? 0, certs: c.count ?? 0, skills: s.count ?? 0 }));
  }, []);

  return (
    <div>
      <PanelHead title="Dashboard Overview" subtitle="Manage all content sections from the sidebar" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Projects", val: counts.projects, icon: "💼", color: "#915EFF" },
          { label: "Certifications", val: counts.certs, icon: "🏆", color: "#8ec5ff" },
          { label: "Skill Groups", val: counts.skills, icon: "💡", color: "#34d399" },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-5 text-center" style={{ background: "rgba(10,12,20,0.85)", border: "1.5px solid rgba(255,255,255,0.07)" }}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-3xl font-black mb-1" style={{ color: c.color }}>{c.val}</div>
            <div className="text-[#aaa6c3] text-xs font-medium">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5 space-y-2.5" style={{ background: "rgba(145,94,255,0.07)", border: "1px solid rgba(145,94,255,0.2)" }}>
        <p className="text-[#c4b5fd] text-sm font-semibold">📋 Sections you can edit</p>
        {[
          ["✨ Hero", "Name, title, typed text, subtitle, CTA buttons"],
          ["👤 About", "Bio paragraphs, service cards, hire email"],
          ["💼 Projects", "Add, edit, delete portfolio projects with images"],
          ["🏆 Certifications", "Credentials, points, credential links"],
          ["💡 Soft Skills", "Skill categories with emoji icons"],
          ["📬 Contact Info", "Email, phone, all social media links"],
        ].map(([section, desc]) => (
          <div key={section} className="flex gap-3 text-sm">
            <span className="font-semibold text-white w-32 flex-shrink-0">{section}</span>
            <span className="text-[#aaa6c3]">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Panel: Hero ─────────────────────────────────────────── */
function HeroPanel() {
  const [form, setForm] = useState({ name: "", greeting: "", typed_items: [], subtitle: "", cta_primary: "", cta_secondary: "" });
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabase.from("hero_info").select("*").limit(1).single().then(({ data: d }) => {
      if (d) {
        setRowId(d.id);
        setForm({ name: d.name||"", greeting: d.greeting||"", typed_items: Array.isArray(d.typed_items)?d.typed_items:[], subtitle: d.subtitle||"", cta_primary: d.cta_primary||"", cta_secondary: d.cta_secondary||"" });
      }
      setLoading(false);
    });
  }, []);

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg(null);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = rowId
      ? await supabase.from("hero_info").update(payload).eq("id", rowId)
      : await supabase.from("hero_info").insert(payload).select().single().then(r => { if (r.data) setRowId(r.data.id); return r; });
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { setMsg({ type: "success", text: "✅ Hero section saved!" }); invalidateHeroCache(); }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="space-y-5 max-w-xl">
      <PanelHead title="Hero Section" subtitle="The top banner of your portfolio" />
      <Msg {...msg} />
      <CI label="Your Name" value={form.name} onChange={set("name")} placeholder="Osama Sharaf" />
      <CI label="Greeting Text" value={form.greeting} onChange={set("greeting")} placeholder="Hi, I'm" />
      <ListManager label="Typed Items (rotating text)" items={form.typed_items} onChange={set("typed_items")} placeholder="e.g. Full-Stack Developer" />
      <CT label="Subtitle / Tagline" value={form.subtitle} onChange={set("subtitle")} placeholder="Building modern solutions..." rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <CI label="CTA Primary Button" value={form.cta_primary} onChange={set("cta_primary")} placeholder="View My Work" />
        <CI label="CTA Secondary Button" value={form.cta_secondary} onChange={set("cta_secondary")} placeholder="Get In Touch" />
      </div>
      <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save Changes"}</Btn>
    </div>
  );
}

/* ─── Panel: About ────────────────────────────────────────── */
function AboutPanel() {
  const [form, setForm] = useState({ bio_paragraphs: [], services: [], hire_email: "" });
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabase.from("about_info").select("*").limit(1).single().then(({ data: d }) => {
      if (d) {
        setRowId(d.id);
        setForm({ bio_paragraphs: Array.isArray(d.bio_paragraphs)?d.bio_paragraphs:[], services: Array.isArray(d.services)?d.services:[], hire_email: d.hire_email||"" });
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg(null);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = rowId
      ? await supabase.from("about_info").update(payload).eq("id", rowId)
      : await supabase.from("about_info").insert(payload);
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { setMsg({ type: "success", text: "✅ About section saved!" }); invalidateAboutCache(); }
  };

  const updService = (i, k, v) => { const s = [...form.services]; s[i] = { ...s[i], [k]: v }; setForm(f => ({ ...f, services: s })); };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-xl">
      <PanelHead title="About Section" subtitle="Your bio paragraphs and service cards" />
      <Msg {...msg} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide">Bio Paragraphs</label>
          <Btn size="sm" onClick={() => setForm(f => ({ ...f, bio_paragraphs: [...f.bio_paragraphs, ""] }))}>+ Add</Btn>
        </div>
        {form.bio_paragraphs.map((p, i) => (
          <div key={i} className="relative group">
            <CT value={p} onChange={v => { const a = [...form.bio_paragraphs]; a[i] = v; setForm(f => ({ ...f, bio_paragraphs: a })); }} placeholder={`Paragraph ${i + 1}`} rows={4} />
            <button onClick={() => setForm(f => ({ ...f, bio_paragraphs: f.bio_paragraphs.filter((_, j) => j !== i) }))}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xl leading-none">×</button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide">Service Cards</label>
          <Btn size="sm" onClick={() => setForm(f => ({ ...f, services: [...f.services, { title: "", icon_name: "web" }] }))}>+ Add</Btn>
        </div>
        {form.services.map((s, i) => (
          <div key={i} className="flex items-center gap-2 group p-3 rounded-lg" style={{ background: "rgba(7,8,15,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <input value={s.title} onChange={e => updService(i, "title", e.target.value)} placeholder="Service title"
              className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }} />
            <select value={s.icon_name} onChange={e => updService(i, "icon_name", e.target.value)}
              className="px-2 py-2 rounded-lg text-white text-sm outline-none cursor-pointer"
              style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <button onClick={() => setForm(f => ({ ...f, services: f.services.filter((_, j) => j !== i) }))}
              className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity px-1 text-lg">×</button>
          </div>
        ))}
      </div>

      <CI label="Hire Me — Email" value={form.hire_email} onChange={v => setForm(f => ({ ...f, hire_email: v }))} placeholder="your@email.com" type="email" />
      <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save Changes"}</Btn>
    </div>
  );
}

/* ─── Panel: Projects ─────────────────────────────────────── */
const EMPTY_PROJ = { name: "", description: "", source_code_link: "", live_demo_link: "", image_url: "", tags: [], features: [], order_index: 0 };

function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJ);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [tagIn, setTagIn] = useState({ name: "", color: TAG_COLORS[0] });
  const [featIn, setFeatIn] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef();

  const load = useCallback(() => {
    supabase.from("projects").select("*").order("order_index").then(({ data }) => { setProjects(data || []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = p => { setForm(p ? { ...EMPTY_PROJ, ...p, tags: p.tags||[], features: p.features||[] } : { ...EMPTY_PROJ }); setEditing(p || "new"); setMsg(null); };
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => { if (!tagIn.name.trim()) return; setForm(f => ({ ...f, tags: [...f.tags, { name: tagIn.name.trim(), color: tagIn.color }] })); setTagIn(t => ({ ...t, name: "" })); };
  const addFeat = () => { if (!featIn.trim()) return; setForm(f => ({ ...f, features: [...f.features, featIn.trim()] })); setFeatIn(""); };

  const uploadImg = async file => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `proj-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) { setMsg({ type: "error", text: error.message }); setUploading(false); return; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.name.trim()) { setMsg({ type: "error", text: "Project name is required" }); return; }
    setSaving(true); setMsg(null);
    const payload = { name: form.name, description: form.description, source_code_link: form.source_code_link, live_demo_link: form.live_demo_link, image_url: form.image_url, tags: form.tags, features: form.features, order_index: Number(form.order_index) || 0 };
    const { error } = editing !== "new"
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { invalidateProjectsCache(); load(); setEditing(null); }
  };

  const remove = async id => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    invalidateProjectsCache(); load();
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (editing !== null) return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3 mb-2">
        <Btn variant="secondary" onClick={() => setEditing(null)}>← Back</Btn>
        <h2 className="text-white text-lg font-bold">{editing === "new" ? "New Project" : `Edit: ${editing.name}`}</h2>
      </div>
      <Msg {...msg} />
      <CI label="Project Name *" value={form.name} onChange={set("name")} />
      <CT label="Description" value={form.description} onChange={set("description")} rows={4} />
      <div>
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide block mb-1.5">Project Image</label>
        <div className="flex gap-2">
          <input value={form.image_url} onChange={e => setForm(f=>({...f,image_url:e.target.value}))} placeholder="https://..." className="flex-1 px-3 py-2.5 rounded-lg text-white text-sm outline-none" style={{background:"rgba(7,8,15,0.8)",border:"1.5px solid rgba(255,255,255,0.08)"}}/>
          <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImg(e.target.files[0])}/>
          <Btn variant="secondary" onClick={() => uploadRef.current?.click()} disabled={uploading}>{uploading ? <Spinner/> : "Upload"}</Btn>
        </div>
        {form.image_url && <img src={form.image_url} alt="" className="mt-2 w-full h-28 object-cover rounded-lg"/>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CI label="Source Code URL" value={form.source_code_link} onChange={set("source_code_link")} placeholder="https://github.com/..." />
        <CI label="Live Demo URL" value={form.live_demo_link} onChange={set("live_demo_link")} placeholder="https://..." />
      </div>
      <CI label="Display Order" value={String(form.order_index)} onChange={set("order_index")} type="number" />
      <div className="space-y-2">
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide block">Tags</label>
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {form.tags.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{background:"rgba(145,94,255,0.15)",color:"#c4b5fd",border:"1px solid rgba(145,94,255,0.3)"}}>
              {t.name} <button onClick={()=>setForm(f=>({...f,tags:f.tags.filter((_,j)=>j!==i)}))} className="hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={tagIn.name} onChange={e=>setTagIn(t=>({...t,name:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTag())} placeholder="Tag name" className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm outline-none" style={{background:"rgba(7,8,15,0.8)",border:"1px solid rgba(255,255,255,0.08)"}}/>
          <select value={tagIn.color} onChange={e=>setTagIn(t=>({...t,color:e.target.value}))} className="px-2 rounded-lg text-white text-xs outline-none cursor-pointer" style={{background:"rgba(7,8,15,0.8)",border:"1px solid rgba(255,255,255,0.08)"}}>
            {TAG_COLORS.map(c=><option key={c} value={c}>{c.replace("-text-gradient","")}</option>)}
          </select>
          <Btn size="sm" onClick={addTag}>+ Tag</Btn>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wide block">Features</label>
        {form.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <input value={f} onChange={e=>{ const a=[...form.features]; a[i]=e.target.value; setForm(p=>({...p,features:a})); }} className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm outline-none" style={{background:"rgba(7,8,15,0.8)",border:"1px solid rgba(255,255,255,0.08)"}}/>
            <button onClick={()=>setForm(p=>({...p,features:p.features.filter((_,j)=>j!==i)}))} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 w-6 text-center text-lg">×</button>
          </div>
        ))}
        <div className="flex gap-2">
          <input value={featIn} onChange={e=>setFeatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addFeat())} placeholder="Feature description..." className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm outline-none" style={{background:"rgba(7,8,15,0.8)",border:"1px solid rgba(255,255,255,0.08)"}}/>
          <Btn size="sm" onClick={addFeat}>+ Add</Btn>
        </div>
      </div>
      <div className="flex gap-3">
        <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save Project"}</Btn>
        <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PanelHead title="Projects" subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} in your portfolio`} />
        <Btn onClick={() => startEdit(null)}>+ New Project</Btn>
      </div>
      {projects.length === 0
        ? <div className="text-center py-16 text-[#aaa6c3]">No projects yet. Add your first one!</div>
        : projects.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(10,12,20,0.85)", border: "1.5px solid rgba(255,255,255,0.07)" }}>
            {p.image_url && <img src={p.image_url} alt="" className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{p.name}</p>
              <p className="text-[#aaa6c3] text-xs mt-0.5 truncate">{p.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Btn size="sm" variant="secondary" onClick={() => startEdit(p)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => remove(p.id)}>Delete</Btn>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ─── Panel: Certifications ──────────────────────────────── */
const EMPTY_CERT = { title: "", company_name: "", date_range: "", icon_url: "", icon_bg: "#383E56", points: [], credentials: [], order_index: 0 };

function CertificationsPanel() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CERT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(() => {
    supabase.from("certifications").select("*").order("order_index").then(({ data }) => { setCerts(data || []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = c => { setForm(c ? { ...EMPTY_CERT, ...c, points: c.points||[], credentials: c.credentials||[] } : { ...EMPTY_CERT }); setEditing(c || "new"); setMsg(null); };
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) { setMsg({ type: "error", text: "Title is required" }); return; }
    setSaving(true); setMsg(null);
    const payload = { ...form, order_index: Number(form.order_index) || 0 };
    const { error } = editing !== "new"
      ? await supabase.from("certifications").update(payload).eq("id", editing.id)
      : await supabase.from("certifications").insert(payload);
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { invalidateCertificationsCache(); load(); setEditing(null); }
  };

  const remove = async id => {
    if (!confirm("Delete?")) return;
    await supabase.from("certifications").delete().eq("id", id);
    invalidateCertificationsCache(); load();
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (editing !== null) return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3 mb-2">
        <Btn variant="secondary" onClick={() => setEditing(null)}>← Back</Btn>
        <h2 className="text-white text-lg font-bold">{editing === "new" ? "New Certification" : "Edit Certification"}</h2>
      </div>
      <Msg {...msg} />
      <CI label="Title *" value={form.title} onChange={set("title")} placeholder="e.g. Full-Stack Web Development" />
      <div className="grid grid-cols-2 gap-4">
        <CI label="Company / Platform" value={form.company_name} onChange={set("company_name")} placeholder="e.g. Coursera" />
        <CI label="Date Range" value={form.date_range} onChange={set("date_range")} placeholder="2023 — Present" />
      </div>
      <CI label="Icon Image URL (optional)" value={form.icon_url} onChange={set("icon_url")} placeholder="https://..." />
      <div className="flex items-end gap-3">
        <div className="flex-1"><CI label="Icon Background Color" value={form.icon_bg} onChange={set("icon_bg")} placeholder="#383E56" /></div>
        <div className="w-10 h-10 rounded-lg border border-white/20 mb-0.5 flex-shrink-0" style={{ background: form.icon_bg }} />
      </div>
      <CI label="Display Order" value={String(form.order_index)} onChange={set("order_index")} type="number" />
      <ListManager label="Points / Skills" items={form.points} onChange={set("points")} placeholder="e.g. React.js Advanced Patterns" />
      <ListManager label="Credential Links (leave blank for no link)" items={form.credentials.map(c => c || "")} onChange={v => set("credentials")(v.map(x => x || null))} placeholder="https://credential-link.com" />
      <div className="flex gap-3">
        <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save"}</Btn>
        <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PanelHead title="Certifications" subtitle={`${certs.length} certification${certs.length !== 1 ? "s" : ""}`} />
        <Btn onClick={() => startEdit(null)}>+ New</Btn>
      </div>
      {certs.length === 0
        ? <div className="text-center py-16 text-[#aaa6c3]">No certifications yet.</div>
        : certs.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(10,12,20,0.85)", border: "1.5px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm overflow-hidden" style={{ background: c.icon_bg || "#383E56" }}>
              {c.icon_url ? <img src={c.icon_url} alt="" className="w-7 h-7 object-contain" /> : c.title?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{c.title}</p>
              <p className="text-[#aaa6c3] text-xs">{[c.company_name, c.date_range].filter(Boolean).join(" • ")}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Btn size="sm" variant="secondary" onClick={() => startEdit(c)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => remove(c.id)}>Delete</Btn>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ─── Panel: Soft Skills ─────────────────────────────────── */
const EMPTY_SKILL = { category: "", icon: "🔹", color: "#8ec5ff", skills: [], order_index: 0 };

function SoftSkillsPanel() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_SKILL);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(() => {
    supabase.from("professional_skills").select("*").order("order_index").then(({ data }) => { setCats(data || []); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = c => { setForm(c ? { ...EMPTY_SKILL, ...c, skills: c.skills||[] } : { ...EMPTY_SKILL }); setEditing(c || "new"); setMsg(null); };
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.category.trim()) { setMsg({ type: "error", text: "Category name is required" }); return; }
    setSaving(true); setMsg(null);
    const payload = { ...form, order_index: Number(form.order_index) || 0 };
    const { error } = editing !== "new"
      ? await supabase.from("professional_skills").update(payload).eq("id", editing.id)
      : await supabase.from("professional_skills").insert(payload);
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { invalidateProfessionalSkillsCache(); load(); setEditing(null); }
  };

  const remove = async id => {
    if (!confirm("Delete?")) return;
    await supabase.from("professional_skills").delete().eq("id", id);
    invalidateProfessionalSkillsCache(); load();
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (editing !== null) return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3 mb-2">
        <Btn variant="secondary" onClick={() => setEditing(null)}>← Back</Btn>
        <h2 className="text-white text-lg font-bold">{editing === "new" ? "New Skill Category" : "Edit Category"}</h2>
      </div>
      <Msg {...msg} />
      <CI label="Category Name *" value={form.category} onChange={set("category")} placeholder="e.g. Communication & Teamwork" />
      <div className="grid grid-cols-3 gap-3">
        <CI label="Emoji Icon" value={form.icon} onChange={set("icon")} placeholder="🔹" />
        <div className="col-span-2 flex items-end gap-2">
          <div className="flex-1"><CI label="Color (hex)" value={form.color} onChange={set("color")} placeholder="#8ec5ff" /></div>
          <div className="w-10 h-10 rounded-lg border border-white/20 mb-0.5 flex-shrink-0" style={{ background: form.color }} />
        </div>
      </div>
      <CI label="Display Order" value={String(form.order_index)} onChange={set("order_index")} type="number" />
      <ListManager label="Skills / Items" items={form.skills} onChange={set("skills")} placeholder="e.g. Effective Communication" />
      <div className="flex gap-3">
        <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save"}</Btn>
        <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PanelHead title="Professional Skills" subtitle="Soft skills & mindset categories" />
        <Btn onClick={() => startEdit(null)}>+ New Category</Btn>
      </div>
      {cats.length === 0
        ? <div className="text-center py-16 text-[#aaa6c3]">No skill categories yet.</div>
        : cats.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(10,12,20,0.85)", border: "1.5px solid rgba(255,255,255,0.07)" }}>
            <span className="text-2xl flex-shrink-0">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: c.color }}>{c.category}</p>
              <p className="text-[#aaa6c3] text-xs mt-0.5">{(c.skills || []).length} skills</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Btn size="sm" variant="secondary" onClick={() => startEdit(c)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => remove(c.id)}>Delete</Btn>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ─── Panel: Contact Info ────────────────────────────────── */
function ContactPanel() {
  const [form, setForm] = useState({ email: "", phone: "", linkedin: "", github: "", facebook: "", instagram: "", whatsapp: "" });
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabase.from("contact_info").select("*").limit(1).single().then(({ data: d }) => {
      if (d) { setRowId(d.id); setForm({ email: d.email||"", phone: d.phone||"", linkedin: d.linkedin||"", github: d.github||"", facebook: d.facebook||"", instagram: d.instagram||"", whatsapp: d.whatsapp||"" }); }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg(null);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = rowId
      ? await supabase.from("contact_info").update(payload).eq("id", rowId)
      : await supabase.from("contact_info").insert(payload);
    setSaving(false);
    if (error) setMsg({ type: "error", text: error.message });
    else { setMsg({ type: "success", text: "✅ Contact info saved!" }); invalidateContactCache(); }
  };

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="space-y-5 max-w-lg">
      <PanelHead title="Contact Info" subtitle="Your contact details and social links shown on the site" />
      <Msg {...msg} />
      <div className="grid grid-cols-2 gap-4">
        <CI label="Email Address" value={form.email} onChange={set("email")} placeholder="your@email.com" type="email" />
        <CI label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+963 935 562 470" />
      </div>
      <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(7,8,15,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wider">Social Media Links</p>
        <CI label="🔵 LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/..." />
        <CI label="⚫ GitHub" value={form.github} onChange={set("github")} placeholder="https://github.com/..." />
        <CI label="🔷 Facebook" value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/..." />
        <CI label="🟣 Instagram" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/..." />
        <CI label="🟢 WhatsApp" value={form.whatsapp} onChange={set("whatsapp")} placeholder="https://wa.me/..." />
      </div>
      <Btn onClick={save} disabled={saving}>{saving ? <Spinner /> : "Save Changes"}</Btn>
    </div>
  );
}

/* ─── Main AdminDashboard ────────────────────────────────── */
const TABS = [
  { id: "overview",       label: "Overview",       icon: "📊" },
  { id: "hero",           label: "Hero",           icon: "✨" },
  { id: "about",          label: "About",          icon: "👤" },
  { id: "projects",       label: "Projects",       icon: "💼" },
  { id: "certifications", label: "Certifications", icon: "🏆" },
  { id: "soft-skills",    label: "Soft Skills",    icon: "💡" },
  { id: "contact",        label: "Contact Info",   icon: "📬" },
];

const PANELS = {
  overview: OverviewPanel,
  hero: HeroPanel,
  about: AboutPanel,
  projects: ProjectsPanel,
  certifications: CertificationsPanel,
  "soft-skills": SoftSkillsPanel,
  contact: ContactPanel,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };
  const Panel = PANELS[activeTab] || OverviewPanel;

  return (
    <div style={{ background: "hsl(222.2 84% 4.9%)", minHeight: "100vh" }} className="flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-4 flex-shrink-0" style={{ background: "rgba(5,7,18,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(m => !m)} className="lg:hidden text-white/60 hover:text-white p-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#915EFF,#6d3fcf)" }}>OS</div>
          <span className="text-white font-bold text-sm hidden sm:block">Portfolio CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "rgba(142,197,255,0.08)", border: "1px solid rgba(142,197,255,0.2)", color: "#8ec5ff" }}>↗ View Site</a>
          <button onClick={logout} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>Logout</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col w-48 flex-shrink-0 pt-4 pb-6 absolute lg:relative z-40 h-full transition-transform duration-200`}
          style={{ background: "rgba(4,6,16,0.99)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <nav className="flex-1 px-3 space-y-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${activeTab === t.id ? "text-white" : "text-[#aaa6c3] hover:text-white hover:bg-white/[0.04]"}`}
                style={activeTab === t.id ? { background: "rgba(145,94,255,0.18)", border: "1px solid rgba(145,94,255,0.28)" } : {}}>
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile menu */}
        {menuOpen && <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMenuOpen(false)} style={{ background: "rgba(0,0,0,0.5)" }} />}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          <Panel />
        </main>
      </div>
    </div>
  );
}
