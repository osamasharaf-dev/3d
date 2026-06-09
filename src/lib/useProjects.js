import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { projects as staticProjects } from "../constants";

const normalizeProject = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  tags: Array.isArray(p.tags) ? p.tags : [],
  image: p.image_url || p.image || "",
  images: Array.isArray(p.images)
    ? p.images
    : p.image_url
    ? [p.image_url]
    : [],
  source_code_link: p.source_code_link || "#",
  live_demo_link: p.live_demo_link || "#",
  features: Array.isArray(p.features) ? p.features : [],
  order_index: p.order_index ?? 0,
});

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("static");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setProjects(staticProjects);
      setSource("static");
      setLoading(false);
      return;
    }

    supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data, error: err }) => {
        if (err || !data || data.length === 0) {
          setProjects(staticProjects);
          setSource("static");
          if (err) setError(err.message);
        } else {
          setProjects(data.map(normalizeProject));
          setSource("supabase");
        }
        setLoading(false);
      });
  }, []);

  return { projects, loading, error, source };
}
