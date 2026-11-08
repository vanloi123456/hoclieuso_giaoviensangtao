import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { HomeScreen } from './components/HomeScreen';
import { ControlDeck } from './components/ControlDeck';
import { ZoneAppsRepository } from './components/ZoneAppsRepository';
import { ZoneInteractiveGames } from './components/ZoneInteractiveGames';
import { ZoneDigitalMaterials } from './components/ZoneDigitalMaterials';
import { Footer } from './components/Footer';

// Modals
import { AddEditContentModal } from './components/AddEditContentModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AppPlayerModal } from './components/AppPlayerModal';
import { GamePlayerModal } from './components/GamePlayerModal';
import { MaterialViewerModal } from './components/MaterialViewerModal';

// Storage & types
import { storageService } from './services/storage';
import { ContentItem, UserRole, ZoneType } from './types';

export default function App() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('teacher');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [targetZone, setTargetZone] = useState<ZoneType>('apps');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  // Active Viewers / Players
  const [runningApp, setRunningApp] = useState<ContentItem | null>(null);
  const [playingGame, setPlayingGame] = useState<ContentItem | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<ContentItem | null>(null);

  // Fullscreen state & Mobile sidebar
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState('trang-chu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load items from IndexedDB on mount (Starts 100% empty, zero sample items)
  useEffect(() => {
    async function initStorage() {
      try {
        const storedItems = await storageService.getAllItems();
        // Support any legacy data migration if needed
        const migrated = storedItems.map((item: any) => {
          if (item.zone === 'images') return { ...item, zone: 'apps' };
          return item;
        }).filter((item: any) => item.zone !== 'videos');
        setItems(migrated);
      } catch (err) {
        console.error('Failed to load items from storage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initStorage();

    // Listen for fullscreen change
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Track active section for top nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['trang-chu', 'kho-ung-dung', 'tro-choi-tuong-tac', 'hoc-lieu-so'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate smoothly to a specific zone
  const handleNavigateToZone = (zone: ZoneType) => {
    const elementId = 
      zone === 'apps' 
        ? 'kho-ung-dung' 
        : zone === 'games' 
        ? 'tro-choi-tuong-tac' 
        : 'hoc-lieu-so';
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Add Trigger
  const handleOpenAddModal = (zone: ZoneType = 'apps') => {
    setTargetZone(zone);
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  // Edit Trigger
  const handleOpenEditModal = (item: ContentItem) => {
    setTargetZone(item.zone);
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  // Delete Prompt
  const handlePromptDelete = (item: ContentItem) => {
    setItemToDelete(item);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await storageService.deleteItem(itemToDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      if (selectedItem?.id === itemToDelete.id) {
        setSelectedItem(null);
      }
      setItemToDelete(null);
    } catch (err) {
      console.error('Lỗi khi xóa nội dung:', err);
      alert('Không thể xóa nội dung. Vui lòng thử lại.');
    }
  };

  // Save new or updated item
  const handleSaveItem = async (data: Partial<ContentItem>) => {
    const now = Date.now();
    let savedItem: ContentItem;

    if (editingItem) {
      savedItem = {
        ...editingItem,
        ...data,
        updatedAt: now,
      } as ContentItem;
    } else {
      savedItem = {
        id: 'item_' + now + '_' + Math.random().toString(36).substr(2, 6),
        zone: data.zone || 'apps',
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'app',
        createdAt: now,
        updatedAt: now,
        order: items.length + 1,
        embedCode: data.embedCode,
        documentUrl: data.documentUrl,
        imageUrl: data.imageUrl,
        fileName: data.fileName,
        resourceType: data.resourceType,
      };
    }

    await storageService.saveItem(savedItem);

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === savedItem.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedItem;
        return next;
      }
      return [...prev, savedItem];
    });

    setSelectedItem(savedItem);
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Reset Viewport to Initial State (Scroll to top)
  const handleResetView = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedItem(null);
  };

  // Export workspace to JSON file
  const handleExport = async () => {
    try {
      const jsonStr = await storageService.exportData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoc-lieu-so-giao-vien-sang-tao-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Không thể xuất dữ liệu học liệu.');
    }
  };

  // Import workspace from JSON file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const imported = await storageService.importData(content);
        setItems(imported);
        alert(`Đã nhập thành công ${imported.length} mục nội dung!`);
      } catch (err: any) {
        alert(err.message || 'Lỗi khi nhập tệp học liệu.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter items by zone
  const appItems = items.filter((i) => i.zone === 'apps');
  const gameItems = items.filter((i) => i.zone === 'games');
  const documentItems = items.filter((i) => i.zone === 'documents');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-16 md:pl-72">
      {/* Fixed Left Navigation Bar */}
      <LeftSidebar
        role={role}
        onRoleChange={setRole}
        activeSection={activeSection}
        onNavigate={(sectionId) => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onAddClick={() => handleOpenAddModal(targetZone)}
        onResetView={handleResetView}
        onExport={handleExport}
        onImport={handleImport}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        counts={{
          apps: appItems.length,
          games: gameItems.length,
          docs: documentItems.length,
        }}
      />

      {/* Mobile Top Header */}
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onAddClick={() => handleOpenAddModal(targetZone)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Trang Chủ: Màn hình giới thiệu 'Học liệu số - Giáo viên sáng tạo' */}
        <HomeScreen
          items={items}
          role={role}
          onNavigateToZone={handleNavigateToZone}
          onQuickAdd={handleOpenAddModal}
        />

        {/* Workspace Control Deck (Role switcher & toolbar) */}
        <ControlDeck
          role={role}
          onRoleChange={setRole}
          selectedItem={selectedItem}
          onAddNew={() => handleOpenAddModal(targetZone)}
          onEditSelected={() => selectedItem && handleOpenEditModal(selectedItem)}
          onDeleteSelected={() => selectedItem && handlePromptDelete(selectedItem)}
          onResetView={handleResetView}
          onExport={handleExport}
          onImport={handleImport}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Loading state indicator */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Đang khởi động không gian học liệu số...
          </div>
        ) : (
          <div className="space-y-14">
            {/* Zone 1: Kho Ứng Dụng (Mã nhúng HTML từ Gemini & Google AI Studio) */}
            <ZoneAppsRepository
              items={appItems}
              role={role}
              onAddItem={() => handleOpenAddModal('apps')}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handlePromptDelete}
              onLaunchApp={(item) => {
                setSelectedItem(item);
                setRunningApp(item);
              }}
            />

            {/* Zone 2: Trò Chơi Tương Tác */}
            <ZoneInteractiveGames
              items={gameItems}
              role={role}
              onAddItem={() => handleOpenAddModal('games')}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handlePromptDelete}
              onPlayGame={(item) => {
                setSelectedItem(item);
                setPlayingGame(item);
              }}
            />

            {/* Zone 3: Học Liệu Số */}
            <ZoneDigitalMaterials
              items={documentItems}
              role={role}
              onAddItem={() => handleOpenAddModal('documents')}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handlePromptDelete}
              onOpenMaterial={(item) => {
                setSelectedItem(item);
                setViewingMaterial(item);
              }}
            />
          </div>
        )}
      </main>

      {/* Fixed Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <AddEditContentModal
        isOpen={isAddEditModalOpen}
        defaultZone={targetZone}
        editingItem={editingItem}
        onSave={handleSaveItem}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingItem(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        title="Xác nhận xóa nội dung"
        itemTitle={itemToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <AppPlayerModal
        item={runningApp}
        onClose={() => setRunningApp(null)}
      />

      <GamePlayerModal
        item={playingGame}
        onClose={() => setPlayingGame(null)}
      />

      <MaterialViewerModal
        item={viewingMaterial}
        onClose={() => setViewingMaterial(null)}
      />
    </div>
  );
}
