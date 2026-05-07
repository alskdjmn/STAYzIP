import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (imageBlob: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("카메라 접근에 실패했습니다. 권한을 확인해주세요.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">사진 찍기</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="relative bg-black aspect-[3/4] sm:aspect-video flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-white text-center p-6">
              <p>{error}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 flex justify-center items-center space-x-6 bg-gray-50">
          {capturedImage ? (
            <>
              <button 
                onClick={handleRetake}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCcw className="w-5 h-5" />
                <span>다시 찍기</span>
              </button>
              <button 
                onClick={handleConfirm}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <Check className="w-5 h-5" />
                <span>사용하기</span>
              </button>
            </>
          ) : !error && (
            <button 
              onClick={handleCapture}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
