import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Cpu, 
  Gamepad2, 
  BookOpen, 
  Link, 
  Code2, 
  Bot, 
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import { ContentItem, ContentType, ZoneType } from '../types';
import { validateAndFormatEmbed } from '../utils/embed';

interface AddEditContentModalProps {
  isOpen: boolean;
  defaultZone: ZoneType;
  editingItem: ContentItem | null;
  onSave: (item: Partial<ContentItem>) => Promise<void>;
  onClose: () => void;
}

export const AddEditContentModal: React.FC<AddEditContentModalProps> = ({
  isOpen,
  defaultZone,
  editingItem,
  onSave,
  onClose,
}) => {
  const [zone, setZone] = useState<ZoneType>(defaultZone);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // App & Game states
  const [embedCode, setEmbedCode] = useState('');
  
  // Document specific
  const [documentUrl, setDocumentUrl] = useState('');
  const [resourceType, setResourceType] = useState<'url' | 'embed' | 'image' | 'note'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [embedValidation, setEmbedValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });
  const [showEmbedPreview, setShowEmbedPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setZone(editingItem.zone);
      setTitle(editingItem.title || '');
      setDescription(editingItem.description || '');
      setEmbedCode(editingItem.embedCode || '');
      setDocumentUrl(editingItem.documentUrl || '');
      setImageUrl(editingItem.imageUrl || '');
      setFileName(editingItem.fileName || '');
      setResourceType((editingItem.resourceType as any) || 'url');
    } else {
      setZone(defaultZone);
      setTitle('');
      setDescription('');
      setEmbedCode('');
      setDocumentUrl('');
      setImageUrl('');
      setFileName('');
      setResourceType('url');
    }
    setEmbedValidation({ isValid: true });
    setShowEmbedPreview(false);
  }, [editingItem, defaultZone, isOpen]);

  if (!isOpen) return null;

  // Handle image upload for document resources
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Vui lòng chọn hình ảnh định dạng JPG, PNG hoặc WEBP');
      return;
    }

    setFileName(file.name);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Validate HTML / embed code
  const handleEmbedChange = (code: string) => {
    setEmbedCode(code);
    if (code.trim()) {
      const result = validateAndFormatEmbed(code);
      setEmbedValidation({
        isValid: result.isValid,
        message: result.errorMessage,
      });
    } else {
      setEmbedValidation({ isValid: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập tên nội dung');
      return;
    }

    // Validation for Apps and Games
    if (zone === 'apps' || zone === 'games') {
      if (!embedCode.trim()) {
        alert(
          zone === 'apps'
            ? 'Vui lòng dán mã nhúng HTML ứng dụng tạo từ Gemini hoặc Google AI Studio'
            : 'Vui lòng dán mã nhúng hoặc liên kết trò chơi'
        );
        return;
      }
      const val = validateAndFormatEmbed(embedCode);
      if (!val.isValid) {
        setEmbedValidation({ isValid: false, message: val.errorMessage });
        alert(val.errorMessage || 'Mã nhúng không hợp lệ');
        return;
      }
    }

    // Validation for Documents
    if (zone === 'documents') {
      if (resourceType === 'url' && !documentUrl.trim()) {
        alert('Vui lòng nhập đường dẫn tài liệu');
        return;
      }
      if (resourceType === 'embed' && !embedCode.trim()) {
        alert('Vui lòng nhập mã nhúng tài liệu');
        return;
      }
      if (resourceType === 'image' && !imageUrl) {
        alert('Vui lòng tải ảnh tài liệu');
        return;
      }
    }

    let contentType: ContentType = 'app';
    if (zone === 'games') contentType = 'game';
    if (zone === 'documents') contentType = 'document';

    setIsSubmitting(true);
    try {
      await onSave({
        zone,
        title: title.trim(),
        description: description.trim(),
        type: contentType,
        embedCode: zone === 'apps' || zone === 'games' || (zone === 'documents' && resourceType === 'embed') ? embedCode : undefined,
        documentUrl: zone === 'documents' ? documentUrl : undefined,
        imageUrl: zone === 'documents' && resourceType === 'image' ? imageUrl : undefined,
        fileName: fileName || undefined,
        resourceType: zone === 'documents' ? resourceType : undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu nội dung. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-50 via-cyan-50/50 to-white border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              {zone === 'apps' && <Cpu className="w-5 h-5" />}
              {zone === 'games' && <Gamepad2 className="w-5 h-5" />}
              {zone === 'documents' && <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {editingItem ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
              </h2>
              <p className="text-xs text-sky-700">
                Học liệu số – Giáo viên sáng tạo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Zone Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Khu vực học liệu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setZone('apps')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  zone === 'apps'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0" />
                <span className="truncate">Kho Ứng Dụng (AI)</span>
              </button>

              <button
                type="button"
                onClick={() => setZone('games')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  zone === 'games'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span className="truncate">Trò Chơi Tương Tác</span>
              </button>

              <button
                type="button"
                onClick={() => setZone('documents')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  zone === 'documents'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="truncate">Học Liệu Số</span>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên {zone === 'apps' ? 'ứng dụng' : zone === 'games' ? 'trò chơi' : 'học liệu'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                zone === 'apps' 
                  ? 'Ví dụ: Đồng hồ số học tập, Vòng quay may mắn, Bảng nhân nhẩm...'
                  : zone === 'games'
                  ? 'Ví dụ: Đố vui Toán học, Nối từ Tiếng Việt...'
                  : 'Ví dụ: Bài giảng trình chiếu Tuần 12, Sơ đồ vòng đời...'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả hoặc Hướng dẫn hoạt động (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập ghi chú cách sử dụng, nhiệm vụ dành cho học sinh..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* ZONE 1 & 2: APPS OR GAMES HTML EMBED CODE */}
          {(zone === 'apps' || zone === 'games') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {zone === 'apps' 
                    ? 'Mã nhúng HTML ứng dụng từ Gemini / Google AI Studio'
                    : 'Mã nhúng iframe / HTML trò chơi tương tác'} <span className="text-rose-500">*</span>
                </label>
                {embedCode && embedValidation.isValid && (
                  <button
                    type="button"
                    onClick={() => setShowEmbedPreview(!showEmbedPreview)}
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showEmbedPreview ? 'Ẩn xem trước' : 'Xem trước'}</span>
                  </button>
                )}
              </div>

              <textarea
                value={embedCode}
                onChange={(e) => handleEmbedChange(e.target.value)}
                placeholder={
                  zone === 'apps'
                    ? 'Dán mã HTML/CSS/JS hoàn chỉnh hoặc thẻ <iframe> ứng dụng được tạo từ Gemini, Google AI Studio...'
                    : 'Dán mã nhúng <iframe> hoặc toàn bộ mã HTML trò chơi...'
                }
                rows={6}
                className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs focus:outline-hidden focus:ring-2 transition-all ${
                  embedValidation.isValid
                    ? 'border-slate-200 focus:ring-sky-500 bg-slate-900 text-sky-300'
                    : 'border-rose-300 focus:ring-rose-500 bg-rose-50/30 text-rose-900'
                }`}
                required
              />

              {!embedValidation.isValid && embedValidation.message && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{embedValidation.message}</span>
                </div>
              )}

              {showEmbedPreview && embedValidation.isValid && embedCode && (
                <div className="mt-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400 mb-2">Xem trước giao diện chạy trong Sandbox an toàn:</p>
                  <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
                    <iframe
                      srcDoc={embedCode}
                      title="Xem trước ứng dụng"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 leading-relaxed bg-sky-50/50 p-3 rounded-xl border border-sky-100 flex items-start gap-2">
                <Bot className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Tương thích hoàn toàn với AI:</span> Bạn có thể yêu cầu 
                  <strong className="text-sky-700"> Gemini</strong> hoặc <strong className="text-sky-700">Google AI Studio</strong> xuất ra một đoạn mã HTML tương tác hoàn chỉnh. Khi dán vào đây, ứng dụng sẽ được chạy mượt mà và an toàn trên bảng thông minh hoặc máy tính học sinh.
                </div>
              </div>
            </div>
          )}

          {/* ZONE 3: DIGITAL MATERIALS */}
          {zone === 'documents' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Loại học liệu số
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setResourceType('url')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      resourceType === 'url'
                        ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Đường dẫn liên kết
                  </button>
                  <button
                    type="button"
                    onClick={() => setResourceType('embed')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      resourceType === 'embed'
                        ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Mã nhúng HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setResourceType('image')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      resourceType === 'image'
                        ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Ảnh tư liệu
                  </button>
                </div>
              </div>

              {resourceType === 'url' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Đường dẫn bài giảng (Google Slides, Canva, Drive, PDF...)
                  </label>
                  <input
                    type="url"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    placeholder="https://canva.com/... hoặc https://docs.google.com/presentation/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              )}

              {resourceType === 'embed' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mã nhúng an toàn
                  </label>
                  <textarea
                    value={embedCode}
                    onChange={(e) => setEmbedCode(e.target.value)}
                    placeholder="<iframe src='...'></iframe>"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-900 text-sky-300"
                    required
                  />
                </div>
              )}

              {resourceType === 'image' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imageUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
                      <img src={imageUrl} alt="preview" className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800">{fileName || 'Ảnh tư liệu đã tải lên'}</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-teal-600 hover:underline mt-1 font-medium"
                        >
                          Chọn ảnh khác
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/50 hover:bg-teal-50 text-slate-700 text-xs font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-teal-600" />
                      <span>Chọn ảnh tư liệu từ máy tính</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Xác nhận lưu nội dung'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

