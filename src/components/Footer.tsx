import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 inset-x-0 md:left-72 z-30 bg-white/95 backdrop-blur-md border-t border-sky-100 py-2.5 px-4 text-center shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-slate-600">
        <div className="font-semibold text-sky-800 font-display tracking-wide">
          Học liệu số - Giáo viên sáng tạo
        </div>
        <div className="text-slate-500 flex items-center gap-1 text-[11px] sm:text-xs">
          <span>Thiết kế bởi:</span>
          <span className="font-semibold text-slate-700">
            Đào Văn Lợi – Trường TH&THCS Tân Khánh Trung, tỉnh Đồng Tháp
          </span>
        </div>
      </div>
    </footer>
  );
};
