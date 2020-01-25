import { Item } from '../types'

export enum ActionType {
  CloseWindow = 'CLOSE_WINDOW',
  OpenItem = 'OPEN_ITEM',
  SelectItem = 'SELECT_ITEM',
  SetItems = 'SET_ITEMS',
  SetQuery = 'SET_QUERY',
}

export interface CloseWindowAction {
  type: typeof ActionType.CloseWindow
}

export interface OpenItemAction {
  type: typeof ActionType.OpenItem
  payload: {
    item: Item
  }
}

export interface SelectItemAction {
  type: typeof ActionType.SelectItem
  payload: {
    index: number
  }
}

export interface SetItemsAction {
  type: typeof ActionType.SetItems
  payload: {
    items: Item[]
  }
}

export interface SetQueryAction {
  type: typeof ActionType.SetQuery
  payload: {
    query: string
  }
}

export type Action =
  | CloseWindowAction
  | OpenItemAction
  | SelectItemAction
  | SetItemsAction
  | SetQueryAction

export const closeWindow = (): CloseWindowAction => {
  return {
    type: ActionType.CloseWindow,
  }
}

export const openItem = (item: Item): OpenItemAction => {
  return {
    type: ActionType.OpenItem,
    payload: { item },
  }
}

export const selectItem = (index: number): SelectItemAction => {
  return {
    type: ActionType.SelectItem,
    payload: { index },
  }
}

export const setItems = (items: Item[]): SetItemsAction => {
  return {
    type: ActionType.SetItems,
    payload: { items },
  }
}

export const setQuery = (query: string): SetQueryAction => {
  return {
    type: ActionType.SetQuery,
    payload: { query },
  }
}

export interface State {
  items: Item[]
  query: string
  selectedItemIndex: number
}

export const initialState: State = {
  items: [],
  query: '',
  selectedItemIndex: 0,
}

export const rootReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SelectItem:
      return {
        ...state,
        selectedItemIndex: action.payload.index,
      }
    case ActionType.SetItems:
      return {
        ...state,
        items: action.payload.items,
        selectedItemIndex: 0,
      }
    case ActionType.SetQuery:
      return {
        ...state,
        query: action.payload.query,
      }
    default:
      return state
  }
}
