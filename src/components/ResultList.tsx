import React from 'react'
import styled from 'styled-components'
import { Item } from '../types'
import ResultListItem from './ResultListItem'

const ResultListContainer = styled.ul`
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

type OptionalProps = {
  onClickItem?: (index: number) => void
  selectedItemIndex?: number
}

type Props = OptionalProps & {
  items: Item[]
}

export default class ResultList extends React.PureComponent<Props> {
  render() {
    const listItems = this.props.items.map((item, index) => {
      const selected = index === this.props.selectedItemIndex

      return (
        <ResultListItem
          index={index}
          item={item}
          key={index}
          onClick={this.handleClick}
          selected={selected}
        />
      )
    })

    return <ResultListContainer>{listItems}</ResultListContainer>
  }

  private handleClick = (index: number) => {
    if (this.props.onClickItem) {
      this.props.onClickItem(index)
    }
  }
}
