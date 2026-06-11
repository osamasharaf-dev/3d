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
let channelRef = null;
const subscribers = new Set();

const fetchFresh = async () => {
  const { data: d } = await supabase.from("contact_info").select("*").limit(1).single();
  return d ? { ...CONTACT_FALLBACK, ...d } : CONTACT_FALLBACK;
};

const notifyAll = (result) => {
  cache = result;
  fetchPromise = null;
  subscribers.forEach((s) => s(result));
};

export function useContactInfo() {
  const [data, setData] = useState(cache ?? CONTACT_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    subscribers.add(setData);

    if (cache) {
      setData(cache);
      setLoading(false);
    } else if (!isSupabaseConfigured) {
      setData(CONTACT_FALLBACK);
      setLoading(false);
    } else {
      if (!fetchPromise) {
        fetchPromise = fetchFresh().catch(() => CONTACT_FALLBACK);
      }
      fetchPromise.then((result) => {
        cache = result;
        setData(result);
        setLoading(false);
      });
    }

    /* Create the realtime channel only once (singleton) */
    if (!channelRef && isSupabaseConfigured) {
      channelRef = supabase
        .channel("contact_info_live")
        .on("postgres_changes", { event: "*", schema: "public", table: "contact_info" }, async () => {
          const fresh = await fetchFresh().catch(() => null);
          if (fresh) notifyAll(fresh);
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

export function invalidateContactCache() {
  cache = null;
  fetchPromise = null;
}
