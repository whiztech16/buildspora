import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, RefreshCcw } from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function LiveCameraModal({ isOpen, onClose, onCapture }: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions in your browser.');
      } else {
        setError('Could not access the camera. Make sure your device has a camera and it is not being used by another application.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[600px] bg-black rounded-2xl overflow-hidden flex flex-col relative shadow-2xl border border-white/10">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <h3 className="text-white font-semibold text-[15px] drop-shadow-md flex items-center gap-2">
            <Camera size={18} className="text-[#10B981]" />
            Live Site Capture
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <Loader2 size={32} className="animate-spin text-[#10B981]" />
              <p className="text-[14px] font-medium opacity-80">Accessing camera...</p>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white p-8 text-center bg-[#0F172A]">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Camera size={24} className="text-red-400" />
              </div>
              <p className="text-[14px] font-medium leading-relaxed">{error}</p>
              <button 
                onClick={startCamera}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-semibold transition-colors mt-2"
              >
                <RefreshCcw size={16} /> Try Again
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${error || isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Grid overlay */}
          {!error && !isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border border-white/20 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-white/10" />
                <div className="border-r border-white/10" />
                <div />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-black flex justify-center items-center">
          <button
            onClick={handleCapture}
            disabled={isLoading || !!error}
            className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center hover:border-white/50 transition-all disabled:opacity-50 disabled:hover:border-white/30 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-white rounded-full group-hover:scale-95 transition-transform group-active:scale-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
