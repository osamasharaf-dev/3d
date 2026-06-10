import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  About,
  Achievement,
  Contact,
  Feedbacks,
  Hero,
  Navbar,
} from "./components";
import Projects from "./components/Projects";
import StatsSection from "./components/StatsSection";
import CommandPalette from "./components/CommandPalette";
import ScrollToTop from "./components/ScrollToTop";
import CinematicIntro from "./components/CinematicIntro";
import EasterEggs from "./components/EasterEggs";
import ElasticCursor from "./components/ElasticCursor";
import Footer from "./components/Footer";
import DevBackground from "./components/DevBackground";
import ReactBitsAudioProvider from "./reactbits/context/ReactBitsAudioProvider";
import ReactBitsCursorProvider from "./reactbits/context/ReactBitsCursorProvider";
import AdminLogin from "./admin/AdminLogin";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";

const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const SkillKeyboard = lazy(() => import("./components/SkillKeyboard"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

const MainPage = () => (
  <div className="relative z-0" style={{ backgroundColor: "#f8faff", minHeight: "100vh", overflowX: "hidden" }}>
    <DevBackground />

    {/* Global UI layers */}
    <CinematicIntro />
    <ElasticCursor />
    <EasterEggs />
    <CommandPalette />
    <ScrollToTop />

    {/* Hero */}
    <div style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #eef0ff 50%, #f5f0ff 100%)" }}>
      <Navbar />
      <Hero />
    </div>

    <About />
    <StatsSection />
    <Projects />
    <Achievement />
    <Suspense fallback={<div style={{ background: "#f8faff", minHeight: "320px" }} />}>
      <SkillKeyboard />
    </Suspense>
    <Feedbacks />

    <div className="relative z-0">
      <Contact />
    </div>
    <Footer />
  </div>
);

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f7ff" }}>
    <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <ReactBitsCursorProvider>
    <ReactBitsAudioProvider>
      <BrowserRouter>
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
