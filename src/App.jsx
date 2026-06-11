import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CommandPalette from "./components/CommandPalette";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./admin/AdminLogin";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import ReactBitsAudioProvider from "./reactbits/context/ReactBitsAudioProvider";
import ReactBitsCursorProvider from "./reactbits/context/ReactBitsCursorProvider";

/* All non-critical sections are lazy-loaded for better LCP + TTI */
const About          = lazy(() => import("./components/About"));
const StatsSection   = lazy(() => import("./components/StatsSection"));
const Projects       = lazy(() => import("./components/Projects"));
const Achievement    = lazy(() => import("./components/Achievement"));
const SkillKeyboard  = lazy(() => import("./components/SkillKeyboard"));
const Feedbacks      = lazy(() => import("./components/Feedbacks"));
const Contact        = lazy(() => import("./components/Contact"));
const Footer         = lazy(() => import("./components/Footer"));
const DevBackground  = lazy(() => import("./components/DevBackground"));
const CinematicIntro = lazy(() => import("./components/CinematicIntro"));
const EasterEggs     = lazy(() => import("./components/EasterEggs"));
const ElasticCursor  = lazy(() => import("./components/ElasticCursor"));
const PrivacyPolicy  = lazy(() => import("./components/PrivacyPolicy"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

/* Lightweight fallback — same bg, no layout shift */
const SectionFallback = () => (
  <div style={{ background: "#f8faff", minHeight: "200px" }} aria-hidden="true" />
);

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f7ff" }}>
    <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
  </div>
);

const MainPage = () => (
  <div
    className="relative z-0"
    style={{ backgroundColor: "#f8faff", minHeight: "100vh", overflowX: "hidden" }}
  >
    {/* Background and cursor — lazy, non-critical */}
    <Suspense fallback={null}>
      <DevBackground />
      <CinematicIntro />
      <ElasticCursor />
      <EasterEggs />
    </Suspense>

    {/* Always-present command palette + scroll-to-top */}
    <CommandPalette />
    <ScrollToTop />

    {/* Hero — critical, loaded eagerly */}
    <div style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #eef0ff 50%, #f5f0ff 100%)" }}>
      <Navbar />
      <Hero />
    </div>

    {/* All sections below the fold — lazy */}
    <Suspense fallback={<SectionFallback />}>
      <About />
    </Suspense>

    <Suspense fallback={<SectionFallback />}>
      <StatsSection />
    </Suspense>

    <Suspense fallback={<SectionFallback />}>
      <Projects />
    </Suspense>

    <Suspense fallback={<SectionFallback />}>
      <Achievement />
    </Suspense>

    <Suspense fallback={<SectionFallback />}>
      <SkillKeyboard />
    </Suspense>

    <Suspense fallback={<SectionFallback />}>
      <Feedbacks />
    </Suspense>

    <div className="relative z-0">
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
    </div>

    <Suspense fallback={<SectionFallback />}>
      <Footer />
    </Suspense>
  </div>
);

const App = () => (
  <ReactBitsCursorProvider>
    <ReactBitsAudioProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<div style={{ background: "#f8faff", minHeight: "100vh" }} />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Suspense fallback={<AdminFallback />}>
                  <AdminDashboard />
                </Suspense>
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ReactBitsAudioProvider>
  </ReactBitsCursorProvider>
);

export default App;
