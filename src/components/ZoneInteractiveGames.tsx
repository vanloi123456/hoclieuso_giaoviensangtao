import React from 'react';
import { Plus, Gamepad2, Maximize2, Trash2, Edit3, Code2, Sparkles, PlayCircle } from 'lucide-react';
import { ContentItem, UserRole } from '../types';
import { generateSandboxHtml } from '../utils/embed';

interface ZoneInteractiveGamesProps {
  items: ContentItem[];
  role: UserRole;
  onAddItem: () => void;
  onEditItem: (item: ContentItem) => void;
  onDeleteItem: (item: ContentItem) => void;
  onPlayGame: (item: ContentItem) => void;
}

export const ZoneInteractiveGames: React.FC<ZoneInteractiveGamesProps> = ({
  items,
  role,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onPlayGame,
}) => {
  return (
    <section id="tro-choi-tuong-tac" className="scroll-mt-24 space-y-4">
      {/* Zone Header with prominent highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Trò Chơi Tương Tác
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Trọng tâm học tập</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                {items.length} {items.length === 1 ? 'trò chơi' : 'trò chơi'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Nhúng trò chơi trí tuệ tạo từ Gemini, Google AI Studio, Wordwall, Quizizz phục vụ dạy học hào hứng
            </p>
          </div>
        </div>

        {role === 'teacher' && (
          <button
            onClick={onAddItem}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 active:scale-95 rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm trò chơi mới</span>
          </button>
        )}
      </div>

      {/* Content Grid or Delicate Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-sky-50/20 p-12 text-center flex flex-col items-center justify-center transition-all hover:bg-sky-50/40">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-xs border border-sky-100 text-indigo-500 flex items-center justify-center mb-3">
            <Gamepad2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Khu vực trò chơi tương tác đang trống
          </h3>
          <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
            Giáo viên có thể dán mã nhúng <code>&lt;iframe&gt;</code> hoặc toàn bộ mã HTML trò chơi giáo dục tạo từ 
            Gemini, Google AI Studio, Wordwall, Quizizz, Kahoot để học sinh trực tiếp thi đua và tương tác.
          </p>

          {role === 'teacher' ? (
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-sky-700 bg-white border border-sky-300 hover:border-sky-500 hover:bg-sky-50 rounded-xl transition-all shadow-xs cursor-pointer group"
            >
              <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Thêm nội dung</span>
            </button>
          ) : (
            <span className="text-xs text-sky-600 font-medium bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
              Chưa có trò chơi nào được tải lên
            </span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const previewDoc = item.embedCode ? generateSandboxHtml(item.embedCode) : '';
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                {/* Game Interactive Preview Frame */}
                <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                  {item.embedCode ? (
                    <div className="w-full h-full relative pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                      <iframe
                        srcDoc={previewDoc}
                        title={item.title}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-0 transform scale-90 origin-center"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Gamepad2 className="w-12 h-12" />
                    </div>
                  )}

                  {/* Play Action Overlay */}
                  <div 
                    onClick={() => onPlayGame(item)}
                    className="absolute inset-0 bg-slate-950/30 hover:bg-slate-950/10 transition-colors flex items-center justify-center cursor-pointer group/btn"
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 group-hover/btn:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg group-hover/btn:scale-105 transition-all">
                      <PlayCircle className="w-4 h-4 fill-current" />
                      <span>Bắt đầu chơi tương tác</span>
                    </div>
                  </div>

                  {/* Top tags */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/80 text-[11px] font-semibold text-indigo-300 backdrop-blur-xs border border-indigo-500/30">
                      <Code2 className="w-3 h-3 text-indigo-400" />
                      <span>Mã nhúng an toàn</span>
                    </span>
                  </div>
                </div>

                {/* Game Meta & Controls */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onPlayGame(item)}
                      className="text-base font-bold text-slate-800 line-clamp-1 hover:text-sky-600 cursor-pointer font-display"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1">
                        Sẵn sàng cho học sinh chơi cá nhân hoặc đấu nhóm
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => onPlayGame(item)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Toàn màn hình</span>
                    </button>

                    {role === 'teacher' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Sửa mã nhúng hoặc đổi tên trò chơi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa trò chơi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Teacher quick add placeholder card */}
          {role === 'teacher' && (
            <button
              onClick={onAddItem}
              className="min-h-[260px] rounded-2xl border-2 border-dashed border-sky-200 hover:border-sky-500 bg-sky-50/10 hover:bg-sky-50/40 p-6 flex flex-col items-center justify-center gap-2 text-sky-600 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-sky-200 group-hover:scale-110 flex items-center justify-center transition-transform">
                <Plus className="w-6 h-6 text-sky-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">Dán mã nhúng trò chơi mới</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
