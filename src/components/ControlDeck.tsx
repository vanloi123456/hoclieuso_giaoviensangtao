import React, { useRef } from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Upload,
  Layers
} from 'lucide-react';
import { UserRole, ContentItem } from '../types';

interface ControlDeckProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedItem: ContentItem | null;
  onAddNew: () => void;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
  onResetView: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  role,
  onRoleChange,
  selectedItem,
  onAddNew,
  onEditSelected,
  onDeleteSelected,
  onResetView,
  onExport,
  onImport,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left Side: Role switcher segmented control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Chế độ Giáo viên</span>
            </button>

            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Chế độ Học sinh</span>
            </button>
          </div>

          {/* Auto-save status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">Đã lưu tự động</span>
          </div>
        </div>

        {/* Center: Selected Item Context Controls (When an item is actively selected by teacher) */}
        {selectedItem && role === 'teacher' && (
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
            <span className="text-xs text-sky-900 font-semibold truncate max-w-[150px]">
              Đang chọn: {selectedItem.title}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onEditSelected}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-white hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={onDeleteSelected}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        )}

        {/* Right Side: Primary Utilities */}
        <div className="flex items-center flex-wrap gap-2">
          {role === 'teacher' && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nội dung</span>
            </button>
          )}

          <button
            onClick={onResetView}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Trở về góc nhìn ban đầu ở đầu trang"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Góc nhìn ban đầu</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Bật / Tắt toàn màn hình"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Toàn màn hình</span>
          </button>

          {role === 'teacher' && (
            <>
              <button
                onClick={onExport}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Sao lưu toàn bộ học liệu ra tệp JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Nhập dữ liệu học liệu từ tệp JSON đã lưu"
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
    </div>
  );
};
