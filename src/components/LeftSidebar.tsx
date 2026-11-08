import React, { useRef } from 'react';
import { 
  Home, 
  Cpu, 
  Gamepad2, 
  BookOpen, 
  Plus, 
  UserCheck, 
  GraduationCap, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole, ZoneType, ContentItem } from '../types';

interface LeftSidebarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onAddClick: () => void;
  onResetView: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    apps: number;
    games: number;
    docs: number;
  };
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  role,
  onRoleChange,
  activeSection,
  onNavigate,
  onAddClick,
  onResetView,
  onExport,
  onImport,
  isFullscreen,
  onToggleFullscreen,
  isOpenMobile,
  onCloseMobile,
  counts,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    {
      id: 'trang-chu',
      label: 'Trang Chủ',
      icon: Home,
      color: 'text-sky-600',
    },
    {
      id: 'kho-ung-dung',
      label: 'Kho Ứng Dụng',
      icon: Cpu,
      color: 'text-blue-600',
      badge: counts.apps,
    },
    {
      id: 'tro-choi-tuong-tac',
      label: 'Trò Chơi Tương Tác',
      icon: Gamepad2,
      color: 'text-indigo-600',
      badge: counts.games,
    },
    {
      id: 'hoc-lieu-so',
      label: 'Học Liệu Số',
      icon: BookOpen,
      color: 'text-teal-600',
      badge: counts.docs,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-sky-100 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-sky-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold font-display text-sky-950 leading-tight">
                  Học Liệu Số
                </span>
                <span className="text-xs text-sky-700 font-medium">
                  Giáo viên sáng tạo
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Button */}
          {role === 'teacher' && (
            <button
              onClick={() => {
                onAddClick();
                onCloseMobile();
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-xl shadow-sm shadow-sky-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nội dung mới</span>
            </button>
          )}
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Điều hướng khu vực
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 border border-sky-200/80 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : item.color}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-sky-200/70 text-sky-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Role switcher inside sidebar */}
          <div className="pt-5 mt-4 border-t border-slate-100">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Chế độ người dùng
            </p>
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => onRoleChange('teacher')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Giáo viên</span>
              </button>
              <button
                onClick={() => onRoleChange('student')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Utilities & Auto-save */}
        <div className="p-4 border-t border-sky-100 bg-slate-50/60 space-y-2">
          {/* Auto-save status */}
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-[11px] truncate">Lưu tự động vào IndexedDB</span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={onResetView}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Về trang chủ đầu trang"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đầu trang</span>
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {role === 'teacher' && (
              <>
                <button
                  onClick={onExport}
                  className="p-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Sao lưu JSON"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Nạp tệp JSON"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={onImport}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
