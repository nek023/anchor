import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import styled, { css } from 'styled-components'
import { Item, ItemType } from '../types'

function getFavIconUrl(item: Item) {
  if (item.type === ItemType.Tab && item.favIconUrl) {
    if (item.favIconUrl.startsWith('chrome://theme/')) {
      return 'chrome://favicon'
    }
    return item.favIconUrl
  }
  return `chrome://favicon/${item.url}`
}

const ResultListItemIconContainer = styled.div`
  width: 30px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ResultListItemIconImage = styled.img`
  width: 24px;
  height: 24px;
`

const ResultListItemBody = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`

const ResultListItemTitle = styled.div`
  color: #333333;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

const ResultListItemUrl = styled.div`
  color: #9999aa;
  margin-top: 2px;
  color: #9999aa;
  font-size: 13px;
  font-weight: lighter;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

const ResultListItemContainer = styled.li<{ selected: boolean }>`
  width: 100%;
  height: 46px;
  padding: 3px;
  margin-bottom: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  ${props =>
    props.selected &&
    css`
      background-color: #0067ff;

      ${ResultListItemTitle} {
        color: #fafafa;
      }

      ${ResultListItemUrl} {
        color: #bcd5fb;
      }
    `}
`

interface ResultListItemProps {
  index: number
  item: Item
  onClick: (index: number) => void
  selected: boolean
}

export const ResultListItem: React.FC<ResultListItemProps> = ({
  index,
  item,
  onClick,
  selected,
}) => {
  const listItemContainerRef = useRef<HTMLLIElement>(null)

  const handleClick = useCallback(() => onClick(index), [index, onClick])

  useEffect(() => {
    if (selected && listItemContainerRef?.current) {
      scrollIntoView(listItemContainerRef?.current, {
        block: 'nearest',
        inline: 'nearest',
        scrollMode: 'if-needed',
      })
    }
  }, [selected])

  const listItem = useMemo(
    () => (
      <ResultListItemContainer
        onClick={handleClick}
        ref={listItemContainerRef}
        selected={selected}
      >
        <ResultListItemIconContainer>
          <ResultListItemIconImage src={getFavIconUrl(item)} />
        </ResultListItemIconContainer>
        <ResultListItemBody>
          <ResultListItemTitle>{item.title}</ResultListItemTitle>
          <ResultListItemUrl>{item.url}</ResultListItemUrl>
        </ResultListItemBody>
      </ResultListItemContainer>
    ),
    [handleClick, item, selected]
  )

  return listItem
}
