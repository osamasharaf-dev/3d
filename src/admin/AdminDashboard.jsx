import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* ─────────────────────── helpers ─────────────────────── */
const TAG_COLOR_OPTIONS = [
  "blue-text-gradient",
  "green-text-gradient",
  "pink-text-gradient",
  "violet-text-gradient",
  "orange-text-gradient",
];

const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];

const EMPTY_PROJECT = {
  name: "",
  description: "",
  source_code_link: "",
  live_demo_link: "",
  image_url: "",
  images: [],
  tags: [],
  features: [],
  order_index: 0,
};

function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-[#915EFF] border-t-transparent animate-spin inline-block" />;
}

function Badge({ text, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: "rgba(145,94,255,0.15)", color: "#c4b5fd", border: "1px solid rgba(145,94,255,0.3)" }}
    >
      {text}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:text-red-400 transition-colors">×</button>
      )}
    </span>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", textarea, rows = 3 }) {
  const base = {
    background: "rgba(7,8,15,0.8)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    width: "100%",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
  };
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wider">{label}</label>}
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ ...base, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

/* ─────────────────────── project form ─────────────────────── */
function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_PROJECT);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(TAG_COLOR_OPTIONS[0]);
  const [featureText, setFeatureText] = useState("");
  const [imageText, setImageText] = useState("");
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = () => {
    if (!tagName.trim()) return;
    setForm((f) => ({ ...f, tags: [...f.tags, { name: tagName.trim(), color: tagColor }] }));
    setTagName("");
  };

  const removeTag = (i) => setForm((f) => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }));

  const addFeature = () => {
    if (!featureText.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, featureText.trim()] }));
    setFeatureText("");
  };

  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const addImageUrl = () => {
    if (!imageText.trim()) return;
    setForm((f) => ({ ...f, images: [...(f.images || []), imageText.trim()] }));
    setImageText("");
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(path);
      const url = urlData.publicUrl;
      setForm((f) => ({
        ...f,
        image_url: f.image_url || url,
        images: [...(f.images || []), url],
      }));
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <Input label="Project Name" value={form.name} onChange={set("name")} placeholder="My Awesome Project" />
      <Input label="Description" value={form.description} onChange={set("description")} placeholder="What does it do?" textarea rows={4} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="GitHub URL" value={form.source_code_link} onChange={set("source_code_link")} placeholder="https://github.com/..." />
        <Input label="Live Demo URL" value={form.live_demo_link} onChange={set("live_demo_link")} placeholder="https://..." />
      </div>
      <Input label="Main Image URL" value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
      <Input label="Order Index" value={String(form.order_index)} onChange={(v) => set("order_index")(Number(v))} type="number" />

      {/* Image gallery */}
      <div className="flex flex-col gap-2">
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wider">Gallery Images</label>
        <div className="flex gap-2">
          <input
            value={imageText}
            onChange={e => setImageText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
            placeholder="Paste image URL..."
            style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", flex: 1 }}
          />
          <button onClick={addImageUrl} className="px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "rgba(145,94,255,0.3)" }}>Add URL</button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => uploadFile(e.target.files?.[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {uploading ? <Spinner /> : "⬆ Upload Image"}
          </button>
          <span className="text-white/30 text-xs">Uploads to Supabase Storage</span>
        </div>
        {(form.images || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-16 h-10 object-cover rounded-lg opacity-70 group-hover:opacity-100" />
                <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wider">Tech Tags</label>
        <div className="flex gap-2">
          <input
            value={tagName}
            onChange={e => setTagName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="React.js"
            style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", flex: 1 }}
          />
          <select
            value={tagColor}
            onChange={e => setTagColor(e.target.value)}
            style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 12px", fontSize: "12px" }}
          >
            {TAG_COLOR_OPTIONS.map(c => <option key={c} value={c}>{c.replace("-text-gradient", "")}</option>)}
          </select>
          <button onClick={addTag} className="px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "rgba(145,94,255,0.3)" }}>+</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((t, i) => <Badge key={i} text={t.name} onRemove={() => removeTag(i)} />)}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-2">
        <label className="text-[#8ec5ff] text-xs font-semibold uppercase tracking-wider">Key Features</label>
        <div className="flex gap-2">
          <input
            value={featureText}
            onChange={e => setFeatureText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
            placeholder="Describe a feature..."
            style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", flex: 1 }}
          />
          <button onClick={addFeature} className="px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ background: "rgba(145,94,255,0.3)" }}>+</button>
        </div>
        <div className="space-y-1">
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#915EFF] flex-shrink-0" />
              <span className="flex-1">{f}</span>
              <button onClick={() => removeFeature(i)} className="text-red-400/60 hover:text-red-400 text-xs">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)", boxShadow: "0 4px 18px rgba(145,94,255,0.28)" }}
        >
          {saving ? <Spinner /> : null}
          {saving ? "Saving…" : "Save Project"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-white/60 text-sm hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── main dashboard ─────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Skills
  const [newSkill, setNewSkill] = useState({ name: "", icon: "", category: "Frontend" });
  const [addingSkill, setAddingSkill] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    const { data } = await supabase.from("projects").select("*").order("order_index");
    setProjects(data || []);
    setLoadingProjects(false);
  }, []);

  const fetchSkills = useCallback(async () => {
    setLoadingSkills(true);
    const { data } = await supabase.from("skills").select("*").order("category");
    setSkills(data || []);
    setLoadingSkills(false);
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, [fetchProjects, fetchSkills]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  /* ── Projects CRUD ── */
  const saveProject = async (form) => {
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      source_code_link: form.source_code_link,
      live_demo_link: form.live_demo_link,
      image_url: form.image_url,
      images: form.images || [],
      tags: form.tags || [],
      features: form.features || [],
      order_index: form.order_index ?? 0,
    };
    let err;
    if (editingProject) {
      ({ error: err } = await supabase.from("projects").update(payload).eq("id", editingProject.id));
    } else {
      ({ error: err } = await supabase.from("projects").insert([payload]));
    }
    setSaving(false);
    if (err) { showToast(err.message, "error"); return; }
    showToast(editingProject ? "Project updated!" : "Project created!");
    setEditingProject(null);
    setCreatingProject(false);
    fetchProjects();
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    await supabase.from("projects").delete().eq("id", id);
    setDeletingId(null);
    showToast("Project deleted.");
    fetchProjects();
  };

  /* ── Skills CRUD ── */
  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    setAddingSkill(true);
    const { error: err } = await supabase.from("skills").insert([{
      name: newSkill.name.trim(),
      icon: newSkill.icon.trim(),
      category: newSkill.category,
    }]);
    setAddingSkill(false);
    if (err) { showToast(err.message, "error"); return; }
    setNewSkill({ name: "", icon: "", category: "Frontend" });
    showToast("Skill added!");
    fetchSkills();
  };

  const deleteSkill = async (id) => {
    await supabase.from("skills").delete().eq("id", id);
    showToast("Skill removed.");
    fetchSkills();
  };

  const groupedSkills = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  /* ── UI ── */
  const panelStyle = {
    background: "rgba(10,12,22,0.95)",
    border: "1.5px solid rgba(145,94,255,0.18)",
    borderRadius: "16px",
    padding: "24px",
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(222.2 84% 4.9%)" }}>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl"
          style={{ background: toast.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(34,197,94,0.9)", backdropFilter: "blur(8px)" }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ background: "rgba(5,7,15,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-white font-bold text-lg">Portfolio Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-sm transition-colors">View Site →</a>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-white/70 hover:text-white text-sm transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Total Projects", value: projects.length, icon: "📁" },
            { label: "Total Skills", value: skills.length, icon: "⚡" },
          ].map(s => (
            <div key={s.label} style={panelStyle} className="flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="text-white font-bold text-2xl">{s.value}</div>
                <div className="text-white/40 text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["projects", "skills"].map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
              style={tab === t
                ? { background: "linear-gradient(135deg, #915EFF, #6d3fcf)", color: "white" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Projects Tab ── */}
        {tab === "projects" && (
          <div className="space-y-4">
            {!creatingProject && !editingProject && (
              <div style={panelStyle}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-lg">Projects</h2>
                  <button onClick={() => setCreatingProject(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)" }}>
                    + Add Project
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="flex justify-center py-12"><Spinner /></div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12 text-white/30 text-sm">No projects yet. Click "Add Project" to create one.</div>
                ) : (
                  <div className="space-y-3">
                    {projects.map(p => (
                      <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {p.image_url && (
                          <img src={p.image_url} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0 opacity-80" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm truncate">{p.name}</div>
                          <div className="text-white/40 text-xs truncate mt-0.5">{p.description}</div>
                          <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {(p.tags || []).slice(0, 4).map((t, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(145,94,255,0.15)", color: "#c4b5fd" }}>{t.name}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => { setEditingProject(p); setCreatingProject(false); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            Edit
                          </button>
                          <button onClick={() => deleteProject(p.id)} disabled={deletingId === p.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/70 hover:text-red-400 transition-colors"
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                            {deletingId === p.id ? <Spinner /> : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(creatingProject || editingProject) && (
              <div style={panelStyle}>
                <h2 className="text-white font-bold text-lg mb-6">
                  {editingProject ? `Edit: ${editingProject.name}` : "New Project"}
                </h2>
                <ProjectForm
                  initial={editingProject || EMPTY_PROJECT}
                  onSave={saveProject}
                  onCancel={() => { setEditingProject(null); setCreatingProject(false); }}
                  saving={saving}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Skills Tab ── */}
        {tab === "skills" && (
          <div className="space-y-4">
            {/* Add skill form */}
            <div style={panelStyle}>
              <h2 className="text-white font-bold text-lg mb-4">Add Skill</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={newSkill.name}
                  onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))}
                  placeholder="Skill name (e.g. React)"
                  style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px" }}
                />
                <input
                  value={newSkill.icon}
                  onChange={e => setNewSkill(s => ({ ...s, icon: e.target.value }))}
                  placeholder="Icon URL or emoji"
                  style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px" }}
                />
                <select
                  value={newSkill.category}
                  onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))}
                  style={{ background: "rgba(7,8,15,0.8)", border: "1.5px solid rgba(255,255,255,0.08)", color: "white", borderRadius: "10px", padding: "10px 14px", fontSize: "13px" }}
                >
                  {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={addSkill}
                disabled={addingSkill || !newSkill.name.trim()}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)" }}
              >
                {addingSkill ? <Spinner /> : "+ Add Skill"}
              </button>
            </div>

            {/* Skills by category */}
            {loadingSkills ? (
              <div style={panelStyle} className="flex justify-center py-12"><Spinner /></div>
            ) : (
              SKILL_CATEGORIES.map(cat => (
                <div key={cat} style={panelStyle}>
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    {cat}
                    <span className="text-xs font-normal text-white/40 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                      {groupedSkills[cat].length}
                    </span>
                  </h3>
                  {groupedSkills[cat].length === 0 ? (
                    <p className="text-white/25 text-sm">No skills yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {groupedSkills[cat].map(skill => (
                        <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {skill.icon && (skill.icon.startsWith("http") || skill.icon.startsWith("/"))
                            ? <img src={skill.icon} alt="" className="w-4 h-4 object-contain" />
                            : <span className="text-base">{skill.icon}</span>
                          }
                          <span className="text-white text-sm">{skill.name}</span>
                          <button onClick={() => deleteSkill(skill.id)} className="text-red-400/50 hover:text-red-400 text-xs ml-1 transition-colors">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
