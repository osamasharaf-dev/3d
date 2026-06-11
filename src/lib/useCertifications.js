import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

const FALLBACK = [
  { id: "s0", title: "Full-Stack Web Development", company_name: "Self-Directed Learning", date_range: "2023 — Present", icon_url: "", icon_bg: "#383E56", points: ["React.js & Next.js Advanced Patterns", "Node.js & Express.js Backend Systems", "Database Design with MySQL & PostgreSQL"], credentials: [null, null, null], order_index: 0 },
  { id: "s1", title: "Frontend Mastery", company_name: "Online Platforms", date_range: "2022 — 2023", icon_url: "", icon_bg: "#E6DEDD", points: ["HTML5 & CSS3 — Advanced Certification", "JavaScript (ES6+) — Proficiency Badge", "Responsive Web Design Certification", "Tailwind CSS & Framer Motion"], credentials: [null, null, null, null], order_index: 1 },
  { id: "s2", title: "Backend & Databases", company_name: "Technical Certification", date_range: "2023", icon_url: "", icon_bg: "#383E56", points: ["RESTful API Architecture & Design", "Authentication & Authorization Systems", "Database Optimization Techniques"], credentials: [null, null, null], order_index: 2 },
  { id: "s3", title: "Cloud & Deployment", company_name: "DevOps Foundations", date_range: "2024", icon_url: "", icon_bg: "#0056d2", points: ["Vercel & Netlify Deployment Workflows", "Git & GitHub Version Control — Advanced", "CI/CD Pipeline Fundamentals"], credentials: [null, null, null], order_index: 3 },
];

let cache = null;
let fetchPromise = null;
let channelRef = null;
const subscribers = new Set();

const fetchFresh = async () => {
  const { data: d } = await supabase
    .from("certifications").select("*").order("order_index", { ascending: true });
  return d && d.length > 0 ? d : FALLBACK;
};

export function useCertifications() {
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
        .channel("certifications_live")
        .on("postgres_changes", { event: "*", schema: "public", table: "certifications" }, async () => {
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

export function invalidateCertificationsCache() { cache = null; fetchPromise = null; }
