import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, Sparkles, Cpu, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContentItem } from '../types';
import { generateSandboxHtml } from '../utils/embed';

interface AppPlayerModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export const AppPlayerModal: React.FC<AppPlayerModalProps> = ({ item, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item || !item.embedCode) return null;

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#38bdf8', '#34d399', '#f472b6', '#fbbf24'],
    });
  };

  const handleRestart = () => {
    setRefreshKey((k) => k + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const sandboxContent = generateSandboxHtml(item.embedCode);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* App Stage Topbar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-sky-950/60 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                Ứng dụng học tập AI (Gemini / AI Studio)
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-display truncate max-w-lg">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCelebrate}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Tung pháo hoa khen ngợi học sinh"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Khen ngợi học sinh 🎉</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Khởi động lại ứng dụng"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chạy lại</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-slate-800 mx-1" />

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            title="Đóng ứng dụng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Embedded Safe Application Canvas */}
      <div className="flex-1 w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-full max-w-7xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-sky-900/40 relative">
          <iframe
            key={refreshKey}
            srcDoc={sandboxContent}
            title={item.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-autoplay"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            className="w-full h-full border-0 block"
          />
        </div>
      </div>
    </div>
  );
};
