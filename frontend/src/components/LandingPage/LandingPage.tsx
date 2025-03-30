import AnimatedBackground from "./AnimatedBackground";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";

function LandingPage() {
  return (
    <div>
      <AnimatedBackground />
      <div className="relative">
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
