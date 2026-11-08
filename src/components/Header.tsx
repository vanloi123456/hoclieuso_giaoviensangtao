import React from 'react';
import { Menu, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onAddClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 md:hidden px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-slate-700 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
          title="Mở thanh điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a 
          href="#trang-chu" 
          className="text-base font-bold text-sky-950 font-display truncate hover:text-sky-700 transition-colors"
        >
          Học Liệu Số – Giáo Viên Sáng Tạo
        </a>

        <button
          onClick={onAddClick}
          className="p-2 text-white bg-sky-600 hover:bg-sky-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
          title="Thêm nội dung mới"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
