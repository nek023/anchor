import { useEffect } from 'react'
import { Item } from '../../common/types'
import { queryItems, sendMessage } from '../../common/ipc'

export const useQueryResults = (
  query: string,
  callback: (items: Item[]) => void
) => {
  useEffect(() => {
    ;(async () => {
      const items = (await sendMessage(queryItems(query))) as Item[]
      callback(items)
    })()
  }, [callback, query])
}
