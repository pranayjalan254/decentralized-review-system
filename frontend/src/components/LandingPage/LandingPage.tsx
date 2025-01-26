import AnimatedBackground from "./AnimatedBackground";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Team from "./Team";

function LandingPage() {
  return (
    <div>
      <AnimatedBackground />
      <div className="relative">
        <Navbar />
        <Hero />
        <Features />
        <Team />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
