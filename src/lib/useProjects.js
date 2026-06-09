import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { projects as staticProjects } from "../constants";

/* Module-level cache — persists across component mounts, never re-fetches */
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

const fetchProjects = async () => {
  if (!isSupabaseConfigured) return { data: staticProjects, source: "static" };
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });
  if (error || !data || data.length === 0) {
    return { data: staticProjects, source: "static" };
  }
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
      return;
    }
    if (!fetchPromise) {
      fetchPromise = fetchProjects();
    }
    fetchPromise.then(({ data, source }) => {
      cache = { data, source };
      setState({ projects: data, loading: false, error: null, source });
    }).catch((err) => {
      cache = { data: staticProjects, source: "static" };
      setState({ projects: staticProjects, loading: false, error: err?.message, source: "static" });
    });
  }, []);

  return state;
}

/* Call this from admin after saving to bust cache */
export function invalidateProjectsCache() {
  cache = null;
  fetchPromise = null;
}
