import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export const CONTACT_FALLBACK = {
  email: "osamaabdulhalimsharaf@gmail.com",
  phone: "+963 935 562 470",
  linkedin: "https://linkedin.com/in/osamasharaf",
  github: "https://github.com/osamasharaf",
  facebook: "https://facebook.com/osamasharaf",
  instagram: "https://instagram.com/osamasharaf",
  whatsapp: "https://wa.me/963935562470",
};

let cache = null;
let fetchPromise = null;

export function useContactInfo() {
  const [data, setData] = useState(cache ?? CONTACT_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    if (!isSupabaseConfigured) { setData(CONTACT_FALLBACK); setLoading(false); return; }
    if (!fetchPromise) {
      fetchPromise = supabase.from("contact_info").select("*").limit(1).single()
        .then(({ data: d }) => d ?? CONTACT_FALLBACK)
        .catch(() => CONTACT_FALLBACK);
    }
    fetchPromise.then((result) => {
      cache = { ...CONTACT_FALLBACK, ...result };
      setData(cache);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function invalidateContactCache() { cache = null; fetchPromise = null; }
