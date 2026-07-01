import { useState, useEffect } from "react";
import { X } from "lucide-react";
import WhoItsForSlider from "./WhoItsForSlider";

const oldWayItems = [
  "Wire money to a relative's personal account",
  "Receive WhatsApp photos taken from Google",
  "Watch your materials budget quietly disappear",
  "Fly home to find an empty plot",
];

const slides = [
  {
    src: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=800",
    alt: "Person checking phone",
    overlay: (
      <div className="absolute inset-0 p-5 flex flex-col justify-end gap-3 pb-10">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] self-start shadow-lg">
          <p className="text-sm text-gray-800 font-medium">How's the work going?</p>
          <span className="text-[10px] text-gray-400 mt-1 block">10:09 AM</span>
        </div>
        
        <div className="bg-[#E8F5E9] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] self-end shadow-lg">
          <p className="text-sm text-emerald-900 font-medium">All good sir</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-emerald-600/80">10:31 AM</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-500"><path d="M18 7L9.5 15.5L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7L13.5 15.5L11.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] self-start shadow-lg">
          <p className="text-sm text-gray-800 font-medium">Send more pictures</p>
          <span className="text-[10px] text-gray-400 mt-1 block">10:41 AM</span>
        </div>
      </div>
    )
  },
  {
    src: "https://images.unsplash.com/photo-1541888086225-ee80c25d8048?auto=format&fit=crop&q=80&w=800",
    alt: "Construction site",
    overlay: (
       <div className="absolute inset-0 p-5 flex flex-col justify-end gap-3 pb-10">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] self-start shadow-lg">
          <p className="text-sm text-gray-800 font-medium">Why is no one on site today?</p>
          <span className="text-[10px] text-gray-400 mt-1 block">09:15 AM</span>
        </div>
        
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] self-start shadow-lg">
          <p className="text-sm text-gray-800 font-medium">The engineer stopped picking my calls...</p>
          <span className="text-[10px] text-gray-400 mt-1 block">02:30 PM</span>
        </div>
      </div>
    )
  },
  {
    src: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?auto=format&fit=crop&q=80&w=800",
    alt: "Empty foundation",
    overlay: (
      <div className="absolute inset-0 p-5 flex flex-col justify-end gap-3 pb-10">
        <div className="bg-[#E8F5E9] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] self-end shadow-lg">
          <p className="text-sm text-emerald-900 font-medium">We need 2M for cement immediately</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-emerald-600/80">11:05 AM</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] self-start shadow-lg">
          <p className="text-sm text-gray-800 font-medium">But I sent 5M just last week?</p>
          <span className="text-[10px] text-gray-400 mt-1 block">11:15 AM</span>
        </div>
      </div>
    )
  }
];

function ProblemCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[160px] rounded-2xl overflow-hidden mt-6 shadow-sm group bg-gray-900 flex-shrink-0">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="min-w-full relative h-full">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
            {slide.overlay}
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProblemSolutionSection() {
  return (
    <section className="bg-white py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p className="text-base font-bold text-gray-400 tracking-wide mb-6 px-1" style={{ fontFamily: "'Inter', sans-serif" }}>
          Problem vs Solution
        </p>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-gray-50 rounded-[32px] p-6 md:p-8 flex flex-col border border-gray-100/80 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              Stop sending
              <br />
              blind transfers.
            </h2>
            
            <ul className="space-y-4 mb-auto flex-grow pb-8">
              {oldWayItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 shadow-sm bg-white">
                    <X className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
                  </span>
                  <span className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <ProblemCarousel />
          </div>

          <div className="h-full">
            <WhoItsForSlider />
          </div>
        </div>
      </div>
    </section>
  );
}