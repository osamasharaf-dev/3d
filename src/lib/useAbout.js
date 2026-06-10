import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export const ABOUT_FALLBACK = {
  bio_paragraphs: [
    "I am a Software Engineer and Full-Stack Web Developer passionate about building modern digital solutions, scalable web applications, and high-performance digital experiences.",
    "With expertise spanning front-end development, back-end systems, databases, and cloud-based deployment, I transform ideas into reliable and impactful products that help businesses grow and succeed in the digital world.",
    "My goal is not only to write code, but to create meaningful solutions that combine functionality, performance, and exceptional user experience.",
  ],
  services: [
    { title: "Frontend Development", icon_name: "web" },
    { title: "Backend Development", icon_name: "mobile" },
    { title: "Database Management", icon_name: "backend" },
    { title: "Cloud & DevOps", icon_name: "creator" },
  ],
  hire_email: "osamaabdulhalimsharaf@gmail.com",
  resume_url: "",
};

let cache = null;
let fetchPromise = null;

const normalize = (d) => ({
  ...ABOUT_FALLBACK,
  ...d,
  bio_paragraphs: Array.isArray(d?.bio_paragraphs) && d.bio_paragraphs.length > 0
    ? d.bio_paragraphs
    : ABOUT_FALLBACK.bio_paragraphs,
  services: Array.isArray(d?.services) && d.services.length > 0
    ? d.services
    : ABOUT_FALLBACK.services,
  resume_url: d?.resume_url || "",
});

const fetchFresh = async () => {
  const { data: d } = await supabase.from("about_info").select("*").limit(1).single();
  return d ? normalize(d) : ABOUT_FALLBACK;
};

export function useAbout() {
  const [data, setData] = useState(cache ?? ABOUT_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setData(cache);
      setLoading(false);
    } else if (!isSupabaseConfigured) {
      setData(ABOUT_FALLBACK);
      setLoading(false);
    } else {
      if (!fetchPromise) fetchPromise = fetchFresh().catch(() => ABOUT_FALLBACK);
      fetchPromise.then((result) => {
        cache = result;
        setData(result);
        setLoading(false);
      });
    }

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("about_info_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "about_info" }, async () => {
        const fresh = await fetchFresh().catch(() => null);
        if (fresh) { cache = fresh; fetchPromise = null; setData(fresh); }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { data, loading };
}

export function invalidateAboutCache() { cache = null; fetchPromise = null; }
