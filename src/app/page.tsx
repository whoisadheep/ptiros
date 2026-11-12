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
    <main className="bg-mesh min-h-screen overflow-x-hidden">
      <Navbar />
      
      <section id="home">
        <Hero />
      </section>

      <Stats />

      <section id="career-test">
        <CareerTestCTA />
      </section>

      <section id="simulator">
        <CareerSimulator />
      </section>

      <section id="about">
        <About />
      </section>

      <Science />

      <Expertise />

      <section id="why-ptiros">
        <WhyPtiros />
      </section>

      <Statistics />

      <section id="roadmaps">
        <Roadmaps />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </main>
  );
}
