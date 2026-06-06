import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  About,
  Achievement,
  Contact,
  Feedbacks,
  Hero,
  Navbar,
  Preloader,
  StarsCanvas,
  Works,
} from "./components";
import EasterEggs from "./components/EasterEggs";
import ElasticCursor from "./components/ElasticCursor";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SkillKeyboard from "./components/SkillKeyboard";
import ReactBitsAudioProvider from "./reactbits/context/ReactBitsAudioProvider";
import ReactBitsCursorProvider from "./reactbits/context/ReactBitsCursorProvider";

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
    <Works />
    <Achievement />
    <SkillKeyboard />
    <Feedbacks />
    <div className="relative z-0">
      <Contact />
    </div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <ReactBitsCursorProvider>
      <ReactBitsAudioProvider>
        <Preloader>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </BrowserRouter>
        </Preloader>
      </ReactBitsAudioProvider>
    </ReactBitsCursorProvider>
  );
};

export default App;
