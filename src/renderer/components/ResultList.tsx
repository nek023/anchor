import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Item } from '../../common/types'
import { ResultListItem } from './ResultListItem'

const Container = styled.ul`
  width: 100%;
  height: 432px; /* (46 + 2) * 9 */
  padding: 0;
  margin: 8px 0 0;
  display: block;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  cursor: default;
`

interface ResultListProps {
  items: Item[]
  onItemClick: (index: number) => void
  selectedItemIndex: number
}

export const ResultList: React.FC<ResultListProps> = ({
  items,
  onItemClick,
  selectedItemIndex,
}) => {
  const handleClick = useCallback((index: number) => onItemClick(index), [
    onItemClick,
  ])

  return (
    <Container>
      {items.map((item, index) => (
        <ResultListItem
          index={index}
          item={item}
          key={index}
          onClick={handleClick}
          selected={index === selectedItemIndex}
        />
      ))}
    </Container>
  )
}
