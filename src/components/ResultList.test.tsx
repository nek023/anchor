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
    const wrapper = shallow(<ResultList items={items} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('calls onClickItem when list item has been clicked', () => {
    const onClickItem = jest.fn()
    const wrapper = shallow(
      <ResultList items={items} onClickItem={onClickItem} />
    )

    expect(onClickItem).not.toHaveBeenCalled()

    wrapper.childAt(0).simulate('click')

    expect(onClickItem).toHaveBeenCalledTimes(1)
  })
})
