import { Item } from '../types'

export const CLOSE_WINDOW = 'CLOSE_WINDOW'
export const OPEN_ITEM = 'OPEN_ITEM'
export const SELECT_ITEM = 'SELECT_ITEM'
export const SET_ITEMS = 'SET_ITEMS'
export const SET_QUERY = 'SET_QUERY'

export interface CloseWindowAction {
  type: typeof CLOSE_WINDOW
}

export interface OpenItemAction {
  type: typeof OPEN_ITEM
  payload: {
    item: Item
  }
}

export interface SelectItemAction {
  type: typeof SELECT_ITEM
  payload: {
    index: number
  }
}

export interface SetItemsAction {
  type: typeof SET_ITEMS
  payload: {
    items: Item[]
  }
}

export interface SetQueryAction {
  type: typeof SET_QUERY
  payload: {
    query: string
  }
}

export type ActionTypes = CloseWindowAction | OpenItemAction | SelectItemAction | SetItemsAction | SetQueryAction

export function closeWindow(): CloseWindowAction {
  return {
    type: CLOSE_WINDOW,
  }
}

export function openItem(item: Item): OpenItemAction {
  return {
    type: OPEN_ITEM,
    payload: { item },
  }
}

export function selectItem(index: number): SelectItemAction {
  return {
    type: SELECT_ITEM,
    payload: { index },
  }
}

export function setItems(items: Item[]): SetItemsAction {
  return {
    type: SET_ITEMS,
    payload: { items },
  }
}

export function setQuery(query: string): SetQueryAction {
  return {
    type: SET_QUERY,
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

export function rootReducer(
  state = initialState,
  action: ActionTypes
): State {
  switch (action.type) {
    case SELECT_ITEM:
      return {
        ...state,
        selectedItemIndex: action.payload.index,
      }
    case SET_ITEMS:
      return {
        ...state,
        items: action.payload.items,
        selectedItemIndex: 0,
      }
    case SET_QUERY:
      return {
        ...state,
        query: action.payload.query,
      }
    default:
      return state
  }
}
