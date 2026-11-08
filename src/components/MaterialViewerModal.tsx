import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Maximize2, Minimize2, BookOpen, FileText } from 'lucide-react';
import { ContentItem } from '../types';
import { generateSandboxHtml } from '../utils/embed';

interface MaterialViewerModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({ item, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  if (!item) return null;

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

  const isEmbed = Boolean(item.embedCode);
  const isUrl = Boolean(item.documentUrl);
  const isImage = Boolean(item.imageUrl);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-teal-950/60 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">
                Màn chiếu học liệu số
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-display truncate max-w-lg">
              {item.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.documentUrl && (
            <a
              href={item.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở tab mới</span>
            </a>
          )}

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
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-hidden flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {item.description && (
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-semibold text-slate-900">Hướng dẫn bài học:</span>
              <span className="truncate">{item.description}</span>
            </div>
          )}

          <div className="flex-1 w-full h-full bg-slate-100 overflow-auto relative">
            {isEmbed && item.embedCode && (
              <iframe
                srcDoc={generateSandboxHtml(item.embedCode)}
                title={item.title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="w-full h-full border-0 block"
              />
            )}

            {isUrl && item.documentUrl && (
              <iframe
                src={item.documentUrl}
                title={item.title}
                className="w-full h-full border-0 block bg-white"
              />
            )}

            {isImage && item.imageUrl && (
              <div className="w-full h-full flex items-center justify-center p-4 bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
