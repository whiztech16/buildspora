import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes BuildSpora different to other platforms?",
    answer:
      "BuildSpora locks your funds in a dedicated project vault and only releases payment after you personally approve a milestone — backed by live, GPS-stamped photo updates from your contractor.",
  },
  {
    question: "How much does BuildSpora charge",
    answer:
      "BuildSpora charges a small percentage fee on funds moved through the platform. Full pricing details are available on our Pricing page.",
  },
  {
    question: "What if I already have a benefits scheme in place?",
    answer:
      "BuildSpora works alongside any existing arrangement you have. You can use it purely for milestone tracking and verification, or for full fund management — it's flexible to your setup.",
  },
  {
    question: "Do I need another broker?",
    answer:
      "No. BuildSpora is designed to replace the need for an informal broker or middleman by giving you direct visibility and control over your project.",
  },
  {
    question: "Do I have to sign a long contract?",
    answer:
      "No long-term contract is required. You create and fund projects as needed, with no recurring commitment.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Your project data, payment details, and documents are encrypted and only accessible to you and the people you explicitly grant access to.",
  },
];

function FaqItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left px-6 py-4"
      >
        <span className="text-sm font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-4 -mt-1">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-sm font-medium text-gray-400 tracking-wide mb-4">
            FAQs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            What would you like to
            <br />
            know about Build
            <span className="text-emerald-600">Spora</span>?
          </h2>

          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition">
            <Search className="w-3.5 h-3.5" />
            Talk to us
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}