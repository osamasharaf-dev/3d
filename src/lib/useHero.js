import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export const HERO_FALLBACK = {
  name: "Osama Sharaf",
  greeting: "Hi, I'm",
  typed_items: ["Full-Stack Developer", "Software Engineer", "Web Architect", "Problem Solver"],
  subtitle: "Building modern digital solutions, scalable web applications, and high-performance digital experiences.",
  cta_primary: "View My Work",
  cta_secondary: "Get In Touch",
  photo_url: "",
};

let cache = null;
let fetchPromise = null;
let channelRef = null;
const subscribers = new Set();

const normalize = (d) => ({
  ...HERO_FALLBACK,
  ...d,
  typed_items:
    Array.isArray(d?.typed_items) && d.typed_items.length > 0
      ? d.typed_items
      : HERO_FALLBACK.typed_items,
});

const fetchFresh = async () => {
  const { data: d } = await supabase.from("hero_info").select("*").limit(1).single();
  return d ? normalize(d) : HERO_FALLBACK;
};

export function useHero() {
  const [data, setData] = useState(cache ?? HERO_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    subscribers.add(setData);

    if (cache) {
      setData(cache);
      setLoading(false);
    } else if (!isSupabaseConfigured) {
      setData(HERO_FALLBACK);
      setLoading(false);
    } else {
      if (!fetchPromise) {
        fetchPromise = fetchFresh().catch(() => HERO_FALLBACK);
      }
      fetchPromise.then((result) => {
        cache = result;
        setData(result);
        setLoading(false);
      });
    }

    if (!channelRef && isSupabaseConfigured) {
      channelRef = supabase
        .channel("hero_info_live")
        .on("postgres_changes", { event: "*", schema: "public", table: "hero_info" }, async () => {
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

export function invalidateHeroCache() { cache = null; fetchPromise = null; }
