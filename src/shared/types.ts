export const ItemType = {
  Bookmark: "bookmark",
  History: "history",
  Tab: "tab",
} as const;

export interface BookmarkItem {
  id: string;
  type: typeof ItemType.Bookmark;
  title?: string;
  url?: string;
}

export interface HistoryItem {
  id: string;
  type: typeof ItemType.History;
  title?: string;
  url?: string;
}

export interface TabItem {
  id: string;
  type: typeof ItemType.Tab;
  faviconUrl?: string;
  title?: string;
  url?: string;
  tabIndex: number;
  windowId: number;
}

export type Item = BookmarkItem | HistoryItem | TabItem;
