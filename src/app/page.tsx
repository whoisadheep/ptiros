import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Science from "@/components/Science";
import Expertise from "@/components/Expertise";
import WhyPtiros from "@/components/WhyPtiros";
import Statistics from "@/components/Statistics";
import CareerTestCTA from "@/components/CareerTestCTA";
import Roadmaps from "@/components/Roadmaps";
import Contact from "@/components/Contact";
import CareerSimulator from "@/components/CareerSimulator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-mesh min-h-screen overflow-x-clip">
      <Navbar />
      
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      <Stats />

      <section id="career-test" className="scroll-mt-24">
        <CareerTestCTA />
      </section>

      <section id="simulator" className="scroll-mt-24">
        <CareerSimulator />
      </section>

      <section id="about" className="scroll-mt-24">
        <About />
      </section>

      <Science />

      <Expertise />

      <section id="why-ptiros" className="scroll-mt-24">
        <WhyPtiros />
      </section>

      <Statistics />

      <section id="roadmaps" className="scroll-mt-24">
        <Roadmaps />
      </section>

      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>

      <Footer />
    </main>
  );
}
