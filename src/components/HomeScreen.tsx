import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  BookOpen, 
  ArrowRight, 
  Plus
} from 'lucide-react';
import { ContentItem, UserRole, ZoneType } from '../types';

interface HomeScreenProps {
  items: ContentItem[];
  role: UserRole;
  onNavigateToZone: (zone: ZoneType) => void;
  onQuickAdd: (zone: ZoneType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  items,
  role,
  onNavigateToZone,
  onQuickAdd,
}) => {
  const appsCount = items.filter((i) => i.zone === 'apps').length;
  const gamesCount = items.filter((i) => i.zone === 'games').length;
  const docsCount = items.filter((i) => i.zone === 'documents').length;

  return (
    <div id="trang-chu" className="space-y-6 scroll-mt-20">
      {/* Hero Banner: Title Centered on Screen */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 text-white p-8 sm:p-12 shadow-lg text-center flex flex-col items-center justify-center">
        {/* Subtle background glow */}
        <div className="absolute -top-14 -right-14 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-semibold mb-3 text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Không gian giáo dục số tiểu học</span>
          </div>

          {/* Centered App Title */}
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mb-6">
            Học liệu số - Giáo viên sáng tạo
          </h1>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateToZone('apps')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sky-700 font-bold text-xs sm:text-sm hover:bg-sky-50 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-sky-600" />
              <span>Kho Ứng Dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateToZone('games')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-900/40 hover:bg-sky-900/60 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Trò Chơi Tương Tác</span>
            </button>

            <button
              onClick={() => onNavigateToZone('documents')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-900/40 hover:bg-sky-900/60 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Học Liệu Số</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Interactive Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Portal 1: Kho Ứng Dụng */}
        <div className="bg-white rounded-3xl border border-sky-100 hover:border-sky-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100">
                {appsCount} ứng dụng
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5 group-hover:text-sky-600 transition-colors">
              Kho Ứng Dụng
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mã nhúng HTML ứng dụng tạo từ Gemini và Google AI Studio phục vụ tương tác trực quan.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateToZone('apps')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Mở Kho ứng dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {role === 'teacher' && (
              <button
                onClick={() => onQuickAdd('apps')}
                className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors cursor-pointer"
                title="Chèn mã nhúng ứng dụng mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Portal 2: Trò Chơi Tương Tác */}
        <div className="bg-white rounded-3xl border border-sky-100 hover:border-indigo-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100">
                {gamesCount} trò chơi
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5 group-hover:text-indigo-600 transition-colors">
              Trò Chơi Tương Tác
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đấu trường trò chơi học tập nhúng từ Wordwall, Quizizz, Kahoot, AI Games sôi nổi.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateToZone('games')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Vào Đấu trường trò chơi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {role === 'teacher' && (
              <button
                onClick={() => onQuickAdd('games')}
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                title="Thêm trò chơi mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Portal 3: Học Liệu Số */}
        <div className="bg-white rounded-3xl border border-sky-100 hover:border-teal-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100">
                {docsCount} tài liệu
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5 group-hover:text-teal-600 transition-colors">
              Học Liệu Số
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tổng hợp bài giảng trình chiếu Canva, Google Slides, liên kết tài liệu điện tử.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateToZone('documents')}
              className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem Học liệu số</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {role === 'teacher' && (
              <button
                onClick={() => onQuickAdd('documents')}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors cursor-pointer"
                title="Thêm học liệu số"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
