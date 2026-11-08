import React from 'react';
import { Plus, BookOpen, ExternalLink, Trash2, Edit3, FileText, Image as ImageIcon, Code2, Maximize2 } from 'lucide-react';
import { ContentItem, UserRole } from '../types';

interface ZoneDigitalMaterialsProps {
  items: ContentItem[];
  role: UserRole;
  onAddItem: () => void;
  onEditItem: (item: ContentItem) => void;
  onDeleteItem: (item: ContentItem) => void;
  onOpenMaterial: (item: ContentItem) => void;
}

export const ZoneDigitalMaterials: React.FC<ZoneDigitalMaterialsProps> = ({
  items,
  role,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onOpenMaterial,
}) => {
  return (
    <section id="hoc-lieu-so" className="scroll-mt-24 space-y-4">
      {/* Zone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Học Liệu Số & Tài Liệu
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                {items.length} {items.length === 1 ? 'tài liệu' : 'tài liệu'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tổng hợp bài giảng trình chiếu điện tử, liên kết học tập, tài liệu tham khảo đa phương tiện
            </p>
          </div>
        </div>

        {role === 'teacher' && (
          <button
            onClick={onAddItem}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu số</span>
          </button>
        )}
      </div>

      {/* Content Grid or Delicate Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-teal-200 bg-teal-50/20 p-12 text-center flex flex-col items-center justify-center transition-all hover:bg-teal-50/40">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-xs border border-teal-100 text-teal-500 flex items-center justify-center mb-3">
            <BookOpen className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Khu vực học liệu số đang trống
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Giáo viên có thể liên kết bài giảng điện tử (Google Slides, Canva, Drive), mã nhúng tài liệu hoặc tranh ảnh bổ trợ.
          </p>

          {role === 'teacher' ? (
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-teal-700 bg-white border border-teal-300 hover:border-teal-500 hover:bg-teal-50 rounded-xl transition-all shadow-xs cursor-pointer group"
            >
              <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Thêm nội dung</span>
            </button>
          ) : (
            <span className="text-xs text-teal-600 font-medium bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
              Chưa có tài liệu số nào được đính kèm
            </span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isUrl = Boolean(item.documentUrl);
            const isEmbed = Boolean(item.embedCode);
            const isImage = Boolean(item.imageUrl);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-sky-100 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top type badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                      {isUrl && <ExternalLink className="w-3.5 h-3.5" />}
                      {isEmbed && <Code2 className="w-3.5 h-3.5" />}
                      {isImage && <ImageIcon className="w-3.5 h-3.5" />}
                      {!isUrl && !isEmbed && !isImage && <FileText className="w-3.5 h-3.5" />}
                      <span>
                        {isUrl ? 'Liên kết trực tuyến' : isEmbed ? 'Mã nhúng tương tác' : isImage ? 'Ảnh tư liệu' : 'Tài liệu'}
                      </span>
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenMaterial(item)}
                    className="text-base font-bold text-slate-800 line-clamp-1 hover:text-teal-600 cursor-pointer font-display"
                    title={item.title}
                  >
                    {item.title}
                  </h3>

                  {item.description ? (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1.5">
                      Học liệu kỹ thuật số phục vụ học sinh tiểu học
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => onOpenMaterial(item)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Mở màn hình lớn</span>
                  </button>

                  {role === 'teacher' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa học liệu hoặc đổi tên"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa học liệu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Teacher quick add placeholder card */}
          {role === 'teacher' && (
            <button
              onClick={onAddItem}
              className="min-h-[160px] rounded-2xl border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/10 hover:bg-teal-50/40 p-6 flex flex-col items-center justify-center gap-2 text-teal-600 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-teal-200 group-hover:scale-110 flex items-center justify-center transition-transform">
                <Plus className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold text-slate-700">Thêm học liệu số</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
