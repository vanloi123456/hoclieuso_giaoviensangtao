import { ContentItem } from '../types';

const DB_NAME = 'HocLieuSo_DB';
const DB_VERSION = 1;
const STORE_NAME = 'content_items';
const SETTINGS_STORE = 'app_settings';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('zone', 'zone', { unique: false });
          store.createIndex('order', 'order', { unique: false });
        }
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Strictly returns empty array on initial launch - zero demo or sample items
  async getAllItems(): Promise<ContentItem[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const items: ContentItem[] = request.result || [];
          // Sort by order ascending
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          resolve(items);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('Falling back to localStorage:', err);
      try {
        const raw = localStorage.getItem('hoclieuso_items');
        if (!raw) return [];
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
  }

  async saveItem(item: ContentItem): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Fallback save to localStorage:', err);
      const items = await this.getAllItems();
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        items[idx] = item;
      } else {
        items.push(item);
      }
      localStorage.setItem('hoclieuso_items', JSON.stringify(items));
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Fallback delete from localStorage:', err);
      const items = (await this.getAllItems()).filter((i) => i.id !== id);
      localStorage.setItem('hoclieuso_items', JSON.stringify(items));
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch {
      localStorage.removeItem('hoclieuso_items');
    }
  }

  async exportData(): Promise<string> {
    const items = await this.getAllItems();
    return JSON.stringify({
      version: 1,
      appName: 'HocLieuSo_GiaoVienSangTao',
      exportedAt: new Date().toISOString(),
      items,
    }, null, 2);
  }

  async importData(jsonString: string): Promise<ContentItem[]> {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.items)) {
      throw new Error('Định dạng tệp học liệu không hợp lệ');
    }

    // Clear existing and save new
    await this.clearAll();
    for (const item of parsed.items) {
      await this.saveItem(item);
    }
    return parsed.items;
  }
}

export const storageService = new StorageService();
