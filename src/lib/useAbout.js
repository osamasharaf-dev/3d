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
};

let cache = null;
let fetchPromise = null;

export function useAbout() {
  const [data, setData] = useState(cache ?? ABOUT_FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setData(cache); setLoading(false); return; }
    if (!isSupabaseConfigured) { setData(ABOUT_FALLBACK); setLoading(false); return; }
    if (!fetchPromise) {
      fetchPromise = supabase.from("about_info").select("*").limit(1).single()
        .then(({ data: d }) => d ?? ABOUT_FALLBACK)
        .catch(() => ABOUT_FALLBACK);
    }
    fetchPromise.then((result) => {
      cache = {
        ...ABOUT_FALLBACK,
        ...result,
        bio_paragraphs: Array.isArray(result.bio_paragraphs) ? result.bio_paragraphs : ABOUT_FALLBACK.bio_paragraphs,
        services: Array.isArray(result.services) ? result.services : ABOUT_FALLBACK.services,
      };
      setData(cache);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function invalidateAboutCache() { cache = null; fetchPromise = null; }
