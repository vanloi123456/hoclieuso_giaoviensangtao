export type ContentType = 'app' | 'game' | 'document';

export type ZoneType = 'apps' | 'games' | 'documents';

export interface ContentItem {
  id: string;
  zone: ZoneType;
  title: string;
  description?: string;
  type: ContentType;
  createdAt: number;
  updatedAt: number;
  order: number;

  // App & Game specific
  embedCode?: string;
  instructions?: string;
  appCategory?: string; // e.g. Toán học, Tiếng Việt, Tự nhiên & Xã hội, Khoa học...

  // Document / Resource specific
  resourceType?: 'url' | 'embed' | 'image' | 'note';
  documentUrl?: string;
  imageUrl?: string;
  fileName?: string;
}

export type UserRole = 'teacher' | 'student';

export interface ZoneConfig {
  id: ZoneType;
  title: string;
  subtitle: string;
  shortDesc: string;
  badge: string;
  color: string;
}

