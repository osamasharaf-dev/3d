import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSkills([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let { data, error: err } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("order_index", { ascending: true });
    // Fallback: order_index column may not exist yet (run supabase-migration.sql to fix)
    if (err) {
      ({ data, error: err } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true }));
    }
    if (err) setError(err.message);
    setSkills(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("skills_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "skills" }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  return { skills, loading, error, refetch: fetchData };
}
