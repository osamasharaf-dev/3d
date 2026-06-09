import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

const FALLBACK = [
  { id: "p0", category: "Communication & Teamwork", icon: "🤝", color: "#8ec5ff", skills: ["Effective Communication", "Team Collaboration", "Client Interaction", "Leadership & Coordination"], order_index: 0 },
  { id: "p1", category: "Problem Solving", icon: "🧠", color: "#a78bfa", skills: ["Analytical Thinking", "Technical Troubleshooting", "Strategic Planning", "Decision Making"], order_index: 1 },
  { id: "p2", category: "Work Excellence", icon: "⚡", color: "#34d399", skills: ["Time Management", "Adaptability", "Working Under Pressure", "Attention to Detail", "Continuous Learning", "Fast Problem Resolution"], order_index: 2 },
];

let cache = null;
let fetchPromise = null;

export function useProfessionalSkills() {
  const [data, setData] = useState(cache ?? FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    if (!isSupabaseConfigured) { setData(FALLBACK); setLoading(false); return; }
    if (!fetchPromise) {
      fetchPromise = supabase
        .from("professional_skills").select("*").order("order_index", { ascending: true })
        .then(({ data: d }) => (d && d.length > 0 ? d : FALLBACK))
        .catch(() => FALLBACK);
    }
    fetchPromise.then((result) => {
      cache = result;
      setData(result);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function invalidateProfessionalSkillsCache() { cache = null; fetchPromise = null; }
