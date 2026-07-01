import Navbar from '../../components/layout/Navbar'
import '../../App.css'
import Hero from '../../components/landing/Hero';
import MilestoneCards from '../../components/landing/Herocards';
import ProblemSolutionSection from "../../components/landing/problemsolution";
import HowItWorksSection from "../../components/landing/Howitworks";
import DiscoverAndMaterialsSections from "../../components/landing/Discoverandmarket";
import FaqSection from "../../components/landing/FAQsection";
import Footer from "../../components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-6">
        <Navbar />
        <Hero />
        <MilestoneCards />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <DiscoverAndMaterialsSections />
        <FaqSection />
      </div>
      <Footer />
    </>
  )
}
