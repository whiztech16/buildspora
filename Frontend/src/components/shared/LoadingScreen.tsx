import { useState, useEffect } from "react";

const WORDS = ["Spora", "Safely", "Confidently", "Spora"];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    globalThis.addEventListener("online", handleOnline);
    globalThis.addEventListener("offline", handleOffline);

    return () => {
      globalThis.removeEventListener("online", handleOnline);
      globalThis.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes slideUpIn {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            15% {
              transform: translateY(0);
              opacity: 1;
            }
            85% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-100%);
              opacity: 0;
            }
          }
          .animate-slide-up-in {
            animation: slideUpIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}
      </style>
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        {/* Offline To
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
         ast */}
        <div 
          className={`fixed left-4 bottom-4 sm:bottom-auto sm:top-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg shadow-sm flex items-center gap-3 transition-transform duration-500 ease-out z-50 ${isOffline ? "translate-x-0" : "-translate-x-[150%]"}`}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[14px] font-semibold">No internet connection.</span>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center w-full text-[28px] sm:text-[36px] tracking-tight select-none">
          <span className="text-[#0F172A] font-bold">Build</span>
          <div className="flex justify-start items-center overflow-hidden h-[1.5em]">
            <div className="flex items-center h-full">
              <span 
                key={index} 
                className="block text-[#059669] font-bold animate-slide-up-in leading-none whitespace-nowrap"
              >
                {WORDS[index]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
