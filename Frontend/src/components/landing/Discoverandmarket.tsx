import { ArrowRight } from "lucide-react";
import professionalImg from '../../assets/images/profesional.jpg';
import materialsImg from '../../assets/images/authentic materials.jpg';

const fontInter = { fontFamily: "'Inter', sans-serif" };

function SectionImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full max-w-[320px] aspect-square overflow-hidden mx-auto">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

function ArrowButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition" style={fontInter}>
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );
}

export default function DiscoverAndMaterialsSections() {
  return (
    <>
      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide mb-2" style={fontInter}>
              Discover
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4" style={{ ...fontInter, letterSpacing: '-0.02em' }}>
              Find verified
              <br />
              professionals.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-md" style={fontInter}>
              Browse and hire trusted architects, engineers, electricians,
              bricklayers and more for your project.
            </p>
            <ArrowButton>Browse Professionals</ArrowButton>
          </div>

          <SectionImage src={professionalImg} alt="Verified professionals" />
        </div>
      </section>

      <section className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide mb-2" style={fontInter}>
              Materials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4" style={{ ...fontInter, letterSpacing: '-0.02em' }}>
              Buy authentic
              <br />
              materials.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-md" style={fontInter}>
              Order from verified local suppliers. Payment goes directly to
              them — guaranteed authentic cement, blocks, steel, roofing and
              more.
            </p>
            <ArrowButton>Find Suppliers</ArrowButton>
          </div>

          <div className="md:order-first">
            <SectionImage src={materialsImg} alt="Authentic building materials" />
          </div>
        </div>
      </section>
    </>
  );
}