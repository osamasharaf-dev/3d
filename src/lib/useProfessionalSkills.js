import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

const FALLBACK = [
  { id: "p0", category: "Communication & Teamwork", icon: "🤝", color: "#0ea5e9", skills: ["Effective Communication", "Team Collaboration", "Client Interaction", "Leadership & Coordination"], order_index: 0 },
  { id: "p1", category: "Problem Solving", icon: "🧠", color: "#4f46e5", skills: ["Analytical Thinking", "Technical Troubleshooting", "Strategic Planning", "Decision Making"], order_index: 1 },
  { id: "p2", category: "Work Excellence", icon: "⚡", color: "#06b6d4", skills: ["Time Management", "Adaptability", "Working Under Pressure", "Attention to Detail", "Continuous Learning", "Fast Problem Resolution"], order_index: 2 },
];

let cache = null;
let fetchPromise = null;
let channelRef = null;
const subscribers = new Set();

const fetchFresh = async () => {
  const { data: d } = await supabase
    .from("professional_skills")
    .select("*")
    .order("order_index", { ascending: true });
  return d && d.length > 0 ? d : FALLBACK;
};

export function useProfessionalSkills() {
  const [data, setData] = useState(cache ?? FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    subscribers.add(setData);

    if (cache) {
      setData(cache);
      setLoading(false);
    } else if (!isSupabaseConfigured) {
      setData(FALLBACK);
      setLoading(false);
    } else {
      if (!fetchPromise) fetchPromise = fetchFresh().catch(() => FALLBACK);
      fetchPromise.then((result) => {
        cache = result;
        setData(result);
        setLoading(false);
      });
    }

    if (!channelRef && isSupabaseConfigured) {
      channelRef = supabase
        .channel("professional_skills_live")
        .on("postgres_changes", { event: "*", schema: "public", table: "professional_skills" }, async () => {
          const fresh = await fetchFresh().catch(() => null);
          if (fresh) {
            cache = fresh;
            fetchPromise = null;
            subscribers.forEach((s) => s(fresh));
          }
        })
        .subscribe();
    }

    return () => {
      subscribers.delete(setData);
      if (subscribers.size === 0 && channelRef) {
        supabase.removeChannel(channelRef);
        channelRef = null;
      }
    };
  }, []);

  return { data, loading };
}

export function invalidateProfessionalSkillsCache() { cache = null; fetchPromise = null; }
