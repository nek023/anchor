import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { State, selectItem, setQuery } from '../modules'
import { ResultList } from './ResultList'
import { SearchBar } from './SearchBar'
import { KeyboardEventHandler } from './KeyboardEventHandler'
import { Item, ItemType } from '../../common/types'

const Container = styled.div`
  padding: 8px;
`

const closeWindow = () =>
  chrome.windows.getCurrent((window) => chrome.windows.remove(window.id))

const openItem = (item: Item) => {
  if (item.type === ItemType.Tab) {
    chrome.tabs.highlight(
      {
        tabs: item.tabIndex,
        windowId: item.windowId,
      },
      (window) => chrome.windows.update(window.id, { focused: true })
    )
  } else {
    chrome.tabs.create({ url: item.url })
  }
}

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
    openItem(items[selectedItemIndex])
    closeWindow()
  }, [items, selectedItemIndex])

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
      openItem(items[index])
      closeWindow()
    },
    [dispatch, items]
  )

  const handleValueChange = useCallback(
    (query: string) => dispatch(setQuery(query)),
    [dispatch]
  )

  return (
    <KeyboardEventHandler
      onReturn={handleReturn}
      onEscape={closeWindow}
      onUp={handleUp}
      onDown={handleDown}
    >
      <Container>
        <SearchBar value={query} onValueChange={handleValueChange} />
        <ResultList
          items={items}
          onItemClick={handleItemClick}
          selectedItemIndex={selectedItemIndex}
        />
      </Container>
    </KeyboardEventHandler>
  )
}
