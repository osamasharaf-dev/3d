import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { projects as staticProjects } from "../constants";

let cache = null;
let fetchPromise = null;

const normalizeProject = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  tags: Array.isArray(p.tags) ? p.tags : [],
  image: p.image_url || p.image || "",
  images: Array.isArray(p.images) ? p.images : p.image_url ? [p.image_url] : [],
  source_code_link: p.source_code_link || "#",
  live_demo_link: p.live_demo_link || "#",
  features: Array.isArray(p.features) ? p.features : [],
  order_index: p.order_index ?? 0,
});

const fetchFresh = async () => {
  if (!isSupabaseConfigured) return { data: staticProjects, source: "static" };
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });
  if (error || !data || data.length === 0) return { data: staticProjects, source: "static" };
  return { data: data.map(normalizeProject), source: "supabase" };
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
