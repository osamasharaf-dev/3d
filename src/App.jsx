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
import EasterEggs from "./components/EasterEggs";
import ElasticCursor from "./components/ElasticCursor";
import Footer from "./components/Footer";
import SkillKeyboard from "./components/SkillKeyboard";
import ReactBitsAudioProvider from "./reactbits/context/ReactBitsAudioProvider";
import ReactBitsCursorProvider from "./reactbits/context/ReactBitsCursorProvider";

const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

const MainPage = () => (
  <div
    className="relative z-0"
    style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}
  >
    <ElasticCursor />
    <EasterEggs />
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar />
      <Hero />
    </div>
    <StarsCanvas />
    <About />
    <Projects />
    <Achievement />
    <SkillKeyboard />
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
              <Suspense
                fallback={
                  <div style={{ background: "hsl(222.2 84% 4.9%)", minHeight: "100vh" }} />
                }
              >
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
