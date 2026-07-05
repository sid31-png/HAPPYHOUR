import { Hero } from "../components/Hero";
import { ProblemSolution } from "../components/ProblemSolution";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { PartnersSection } from "../components/PartnersSection";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProblemSolution />
      <div id="fonctionnalites">
        <Features />
      </div>
      <div id="comment-ca-marche">
        <HowItWorks />
      </div>
      <div id="partenaires">
        <PartnersSection />
      </div>
      <Footer />
    </main>
  );
}
