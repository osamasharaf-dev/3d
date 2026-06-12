import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { projects as staticProjects } from "../constants";

let cache = null;
let fetchPromise = null;

const TAG_COLORS = [
  "blue-text-gradient", "green-text-gradient", "pink-text-gradient",
  "violet-text-gradient", "orange-text-gradient",
];

const normalizeTags = (tech_stack, tags) => {
  if (Array.isArray(tech_stack) && tech_stack.length > 0) {
    return tech_stack.map((t, i) =>
      typeof t === "object" && t !== null && t.name
        ? t
        : { name: String(t), color: TAG_COLORS[i % TAG_COLORS.length] }
    );
  }
  if (Array.isArray(tags) && tags.length > 0) return tags;
  return [];
};

const normalizeProject = (p) => ({
  id: p.id,
  name: p.title || p.name || "",
  description: p.description || "",
  tags: normalizeTags(p.tech_stack, p.tags),
  image: p.image || p.image_url || "",
  images: Array.isArray(p.images) ? p.images
    : (p.image || p.image_url) ? [p.image || p.image_url] : [],
  source_code_link: p.source_code_link || "#",
  live_demo_link: p.live_demo_link || "#",
  features: Array.isArray(p.features) ? p.features : [],
  order_index: p.order_index ?? 0,
});

const fetchFresh = async () => {
  if (!isSupabaseConfigured) return { data: staticProjects, source: "static" };
  // Try ordering by order_index first; fall back to created_at if column missing
  let { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) {
    ({ data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true }));
  }
  if (error) return { data: staticProjects, source: "static" };
  return { data: (data || []).map(normalizeProject), source: "supabase" };
};

export function useProjects() {
  const [state, setState] = useState({
    projects: cache?.data ?? [],
    loading: !cache,
    error: null,
    source: cache?.source ?? "static",
  });

  useEffect(() => {
    if (cache) {
      setState({ projects: cache.data, loading: false, error: null, source: cache.source });
    } else {
      if (!fetchPromise) fetchPromise = fetchFresh();
      fetchPromise
        .then(({ data, source }) => {
          cache = { data, source };
          setState({ projects: data, loading: false, error: null, source });
        })
        .catch((err) => {
          cache = { data: staticProjects, source: "static" };
          setState({ projects: staticProjects, loading: false, error: err?.message, source: "static" });
        });
    }

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("projects_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, async () => {
        const fresh = await fetchFresh().catch(() => null);
        if (fresh) {
          cache = fresh;
          fetchPromise = null;
          setState({ projects: fresh.data, loading: false, error: null, source: fresh.source });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return state;
}

export function invalidateProjectsCache() { cache = null; fetchPromise = null; }
