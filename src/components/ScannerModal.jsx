import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Sparkles, Check, VideoOff } from "lucide-react";
import { PRESETS } from "../types.js";

export default function ScannerModal({ isOpen, onClose, onDetected }) {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let stream = null;

    if (
      isOpen &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((mediaStream) => {
          stream = mediaStream;
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(() => {
          setHasCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerDetection = (preset) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const today = new Date();
      onDetected({
        name: preset.name,
        category: preset.category,
        location: preset.location,
        quantity: preset.quantity,
        createdDate: today.toISOString().split("T")[0],
        expiryDate: new Date(today.getTime() + preset.days * 86400000)
          .toISOString()
          .split("T")[0],
        notes: `Scanned via Smart Tag (Barcode #${preset.barcode})`,
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h2 className="font-extrabold text-base">
              Live Optical Tag Scanner
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Live Camera Viewfinder */}
          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 mb-4 flex items-center justify-center">
            {hasCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-500 p-4 text-center">
                <VideoOff className="w-8 h-8 mb-2 text-slate-600" />
                <span className="text-xs">
                  Camera preview unavailable or permission denied. Use instant
                  tag simulation below.
                </span>
              </div>
            )}

            {/* Targeting Reticle */}
            <div className="absolute inset-6 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              </div>
              {isProcessing && (
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce" />
              )}
              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>
          </div>

          <div className="w-full">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Tap any detected product label below to auto-fill:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.slice(0, 4).map((preset, idx) => (
                <button
                  key={idx}
                  disabled={isProcessing}
                  onClick={() => triggerDetection(preset)}
                  className="flex items-center gap-1.5 p-2.5 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 text-left transition active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      +{preset.days} days • {preset.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
