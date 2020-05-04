import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  State,
  closeWindow,
  openItem,
  selectItem,
  setQuery,
} from '../modules/index'
import { ResultList } from './ResultList'
import { SearchBar } from './SearchBar'
import { KeyboardEventHandler } from './KeyboardEventHandler'
import { Item } from '../types'

const AppContainer = styled.div`
  padding: 8px;
`

export const App: React.FC = () => {
  const dispatch = useDispatch()
  const items = useSelector<State, Item[]>((state) => state.items)
  const query = useSelector<State, string>((state) => state.query)
  const selectedItemIndex = useSelector<State, number>(
    (state) => state.selectedItemIndex
  )

  useEffect(
    () => {
      dispatch(setQuery(query))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleReturn = useCallback(() => {
    if (items.length === 0) return
    dispatch(openItem(items[selectedItemIndex]))
    dispatch(closeWindow())
  }, [dispatch, items, selectedItemIndex])

  const handleEscape = useCallback(() => dispatch(closeWindow()), [dispatch])

  const handleUp = useCallback(() => {
    if (selectedItemIndex <= 0) return
    dispatch(selectItem(selectedItemIndex - 1))
  }, [dispatch, selectedItemIndex])

  const handleDown = useCallback(() => {
    if (selectedItemIndex >= items.length - 1) return
    dispatch(selectItem(selectedItemIndex + 1))
  }, [dispatch, items.length, selectedItemIndex])

  const handleItemClick = useCallback(
    (index: number) => {
      dispatch(selectItem(index))
      dispatch(openItem(items[index]))
      dispatch(closeWindow())
    },
    [dispatch, items]
  )

  const handleValueChange = useCallback(
    (query: string) => {
      dispatch(setQuery(query))
    },
    [dispatch]
  )

  return (
    <KeyboardEventHandler
      onReturn={handleReturn}
      onEscape={handleEscape}
      onUp={handleUp}
      onDown={handleDown}
    >
      <AppContainer>
        <SearchBar value={query} onValueChange={handleValueChange} />
        <ResultList
          items={items}
          onItemClick={handleItemClick}
          selectedItemIndex={selectedItemIndex}
        />
      </AppContainer>
    </KeyboardEventHandler>
  )
}
