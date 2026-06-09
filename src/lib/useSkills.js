import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSkills([]);
      setLoading(false);
      return;
    }

    supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        setSkills(data || []);
        setLoading(false);
      });
  }, []);

  const refetch = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true });
    setSkills(data || []);
  };

  return { skills, loading, error, refetch };
}
