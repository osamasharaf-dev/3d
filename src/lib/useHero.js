import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export const HERO_FALLBACK = {
  name: "Osama Sharaf",
  greeting: "Hi, I'm",
  typed_items: ["Full-Stack Developer", "Software Engineer", "Web Architect", "Problem Solver"],
  subtitle: "Building modern digital solutions, scalable web applications, and high-performance digital experiences.",
  cta_primary: "View My Work",
  cta_secondary: "Get In Touch",
};

let cache = null;
let fetchPromise = null;

export function useHero() {
  const [data, setData] = useState(cache ?? HERO_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    if (!isSupabaseConfigured) { setData(HERO_FALLBACK); setLoading(false); return; }
    if (!fetchPromise) {
      fetchPromise = supabase.from("hero_info").select("*").limit(1).single()
        .then(({ data: d }) => d ?? HERO_FALLBACK)
        .catch(() => HERO_FALLBACK);
    }
    fetchPromise.then((result) => {
      cache = {
        ...HERO_FALLBACK,
        ...result,
        typed_items: Array.isArray(result.typed_items) ? result.typed_items : HERO_FALLBACK.typed_items,
      };
      setData(cache);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function invalidateHeroCache() { cache = null; fetchPromise = null; }
