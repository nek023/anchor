import { shallow } from 'enzyme'
import React from 'react'
import { BookmarkItem, ItemType } from '../types'
import { ResultList } from './ResultList'

describe('ResultList', () => {
  let items: BookmarkItem[]

  beforeEach(() => {
    items = [
      {
        type: ItemType.Bookmark,
        title: 'item1',
        url: 'https://example.com',
      },
      {
        type: ItemType.Bookmark,
        title: 'item2',
        url: 'https://example.com',
      },
    ]
  })

  it('matches snapshot', () => {
    const wrapper = shallow(
      <ResultList items={items} onItemClick={() => {}} selectedItemIndex={0} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('calls onClickItem when list item has been clicked', () => {
    const handleItemClick = jest.fn()
    const wrapper = shallow(
      <ResultList
        items={items}
        onItemClick={handleItemClick}
        selectedItemIndex={0}
      />
    )

    expect(handleItemClick).not.toHaveBeenCalled()

    wrapper.childAt(0).simulate('click')

    expect(handleItemClick).toHaveBeenCalledTimes(1)
  })
})
