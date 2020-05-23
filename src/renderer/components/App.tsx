import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ResultList } from './ResultList'
import { SearchBar } from './SearchBar'
import { KeyboardEventHandler } from './KeyboardEventHandler'
import { Item, ItemType } from '../../common/types'
import { Message, MessageType, queryItems, sendMessage } from '../../common/ipc'
import { useThrottle } from 'react-use'

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

const useQuery = (
  initialQuery = ''
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [query, setQuery] = React.useState(initialQuery)

  React.useEffect(() => {
    const onMessage = (
      message: Message,
      sender: chrome.runtime.MessageSender,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendResponse: (response?: any) => void
    ) => {
      if (message.type === MessageType.SET_QUERY) {
        setQuery(message.payload.query)
        sendResponse(true)
      }
    }

    chrome.runtime.onMessage.addListener(onMessage)
    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [])

  return [query, setQuery]
}

const useItems = (query: string, maxItems = 100) => {
  const [items, setItems] = React.useState<Item[]>([])

  React.useEffect(() => {
    ;(async () => {
      const items = (await sendMessage(queryItems(query))) as Item[]
      setItems(items.slice(0, maxItems))
    })()
  }, [maxItems, query])

  return items
}

const initialQuery = new URL(document.URL).searchParams.get('q') || ''

export const App: React.FC = () => {
  const [query, setQuery] = useQuery(initialQuery)
  const items = useItems(useThrottle(query, 50))
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)

  const handleReturn = useCallback(() => {
    if (items.length === 0) return
    openItem(items[selectedItemIndex])
    closeWindow()
  }, [items, selectedItemIndex])

  const handleUp = useCallback(() => {
    if (selectedItemIndex <= 0) return
    setSelectedItemIndex(selectedItemIndex - 1)
  }, [selectedItemIndex])

  const handleDown = useCallback(() => {
    if (selectedItemIndex >= items.length - 1) return
    setSelectedItemIndex(selectedItemIndex + 1)
  }, [items.length, selectedItemIndex])

  const handleItemClick = useCallback(
    (index: number) => {
      setSelectedItemIndex(index)
      openItem(items[index])
      closeWindow()
    },
    [items]
  )

  const handleValueChange = useCallback((query: string) => setQuery(query), [
    setQuery,
  ])

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
