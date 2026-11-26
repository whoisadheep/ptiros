import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CareerTestCTA from "@/components/CareerTestCTA";
import CareerSimulator from "@/components/CareerSimulator";
import LandingWingsMotion from "@/components/LandingWingsMotion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-mesh min-h-screen overflow-x-clip text-text">
      <Navbar />

      {/* 1. Hero Welcome Section */}
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      {/* 2. Quick Credibility Proof Bar */}
      <Stats />

      {/* 3. Free Cognitive Discovery Quest (Quiz) */}
      <section id="career-test" className="scroll-mt-24">
        <CareerTestCTA />
      </section>

      {/* 4. Interactive Workplace Simulator Teaser */}
      <section id="simulator" className="scroll-mt-24">
        <CareerSimulator />
      </section>

      {/* 5 & 6. Core Platform Wings + Grand CTA with Motion Graphics */}
      <LandingWingsMotion />

      <Footer />
    </main>
  );
}
