import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="text-center" style={{ marginTop: '64px' }}>
      <h1 className="text-[28px] sm:text-[36px] md:text-[48px] px-2 md:px-0" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.2, color: '#0F172A', letterSpacing: '-0.02em' }}>
        Build With Confidence
        <br />
        From <span style={{ color: '#059669' }}>Anywhere</span>
      </h1>
      
      <p className="text-[#475569] text-[14px] md:text-[16px] max-w-[480px] mx-auto mt-6" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
        Built for Nigerians abroad who want to build back home — with full visibility and control over every milestone.
      </p>

      <Link to="/create-account" className="inline-block mt-6 md:mt-7 px-7 md:px-9 py-3 md:py-[14px] bg-[#059669] hover:bg-[#047857] text-white text-[14px] md:text-[15px] font-semibold rounded-[10px] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
        Start Your Project &rarr;
      </Link>
    </section>
  );
}