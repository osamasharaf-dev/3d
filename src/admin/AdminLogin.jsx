import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your secrets.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(222.2 84% 4.9%)" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "rgba(10,12,22,0.95)",
          border: "1.5px solid rgba(145,94,255,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Portfolio CMS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#8ec5ff] text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/25 focus:border-[#915EFF]"
              style={{
                background: "rgba(7,8,15,0.8)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.2s",
              }}
            />
          </div>
          <div>
            <label className="block text-[#8ec5ff] text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-white/25"
              style={{
                background: "rgba(7,8,15,0.8)",
                border: "1.5px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-red-400 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #915EFF, #6d3fcf)", boxShadow: "0 4px 20px rgba(145,94,255,0.35)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-white/25 text-xs">
          <a href="/" className="hover:text-white/50 transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  );
}
