export enum ItemType {
  Bookmark = 'bookmark',
  History = 'history',
  Tab = 'tab',
}

export interface BookmarkItem {
  type: typeof ItemType.Bookmark
  title?: string
  url?: string
}

export interface HistoryItem {
  type: typeof ItemType.History
  title?: string
  url?: string
}

export interface TabItem {
  type: typeof ItemType.Tab
  favIconUrl?: string
  title?: string
  url?: string
  tabIndex: number
  windowId: number
}

export type Item = BookmarkItem | HistoryItem | TabItem
