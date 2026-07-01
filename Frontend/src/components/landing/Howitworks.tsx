import dashboardImg from '../../assets/images/buildspora dashboard.png';

const steps = [
  {
    number: 1,
    title: "Create & Fund",
    description:
      "Add your project details and lock funds into a secure virtual vault. Nobody touches it without your approval.",
  },
  {
    number: 2,
    title: "Set Milestones",
    description:
      "Break your build into stages — Foundation, Block Work, Roofing, Finishing. Each stage has its own budget.",
  },
  {
    number: 3,
    title: "Verify & Pay",
    description:
      "Your contractor submits live on-site photos. You review, approve, and payment goes straight to the supplier or contractor.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-medium text-gray-400 tracking-wide mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          How it works
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
              Here's how it works.
            </h2>

            <div className="relative">
              <div className="absolute left-[15px] top-8 bottom-8 w-px bg-gray-200" />

              <div className="space-y-10">
                {steps.map(({ number, title, description }) => (
                  <div key={number} className="relative flex gap-5">
                    <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center">
                      {number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {title}
                      </h3>
                      <p className="text-gray-500 text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-full rounded-[32px] lg:rounded-[40px] overflow-hidden flex items-center justify-center p-2 sm:p-3 lg:p-5 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-100/60">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/60">
               <img src={dashboardImg} alt="BuildSpora Dashboard" className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}