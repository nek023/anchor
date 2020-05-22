import { Item } from '../common/types'

export enum ActionType {
  OpenItem = 'OPEN_ITEM',
  SelectItem = 'SELECT_ITEM',
  SetItems = 'SET_ITEMS',
  SetQuery = 'SET_QUERY',
}

export const openItem = (item: Item) => ({
  type: ActionType.OpenItem as const,
  payload: { item },
})

export const selectItem = (index: number) => ({
  type: ActionType.SelectItem as const,
  payload: { index },
})

export const setItems = (items: Item[]) => ({
  type: ActionType.SetItems as const,
  payload: { items },
})

export const setQuery = (query: string) => ({
  type: ActionType.SetQuery as const,
  payload: { query },
})

type Action =
  | ReturnType<typeof openItem>
  | ReturnType<typeof selectItem>
  | ReturnType<typeof setItems>
  | ReturnType<typeof setQuery>

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

export const rootReducer = (state = initialState, action: Action) => {
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
