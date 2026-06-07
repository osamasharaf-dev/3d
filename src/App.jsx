import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  About,
  Achievement,
  Contact,
  Feedbacks,
  Hero,
  Navbar,
  StarsCanvas,
} from "./components";
import Projects from "./components/Projects";
import StatsSection from "./components/StatsSection";
import CommandPalette from "./components/CommandPalette";
import ScrollToTop from "./components/ScrollToTop";
import CinematicIntro from "./components/CinematicIntro";
import EasterEggs from "./components/EasterEggs";
import ElasticCursor from "./components/ElasticCursor";
import Footer from "./components/Footer";
import ReactBitsAudioProvider from "./reactbits/context/ReactBitsAudioProvider";
import ReactBitsCursorProvider from "./reactbits/context/ReactBitsCursorProvider";

const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const SkillKeyboard = lazy(() => import("./components/SkillKeyboard"));

const MainPage = () => (
  <div className="relative z-0" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
    {/* Global UI layers */}
    <CinematicIntro />
    <ElasticCursor />
    <EasterEggs />
    <CommandPalette />
    <ScrollToTop />

    {/* Page content */}
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar />
      <Hero />
    </div>

    <StarsCanvas />
    <About />
    <StatsSection />
    <Projects />
    <Achievement />
    <Suspense fallback={<div style={{ background: "hsl(222.2 84% 4.9%)", minHeight: "320px" }} />}>
      <SkillKeyboard />
    </Suspense>
    <Feedbacks />

    <div className="relative z-0">
      <Contact />
    </div>
    <Footer />
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
              <Suspense fallback={<div style={{ background: "hsl(222.2 84% 4.9%)", minHeight: "100vh" }} />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ReactBitsAudioProvider>
  </ReactBitsCursorProvider>
);

export default App;
