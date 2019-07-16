import { shallow } from 'enzyme'
import React from 'react'
import { BookmarkItem, ItemType } from '../types'
import ResultListItem from './ResultListItem'

describe('ResultListItem', () => {
  let item: BookmarkItem

  beforeEach(() => {
    item = {
      type: ItemType.Bookmark,
      title: 'example',
      url: 'https://example.com',
    }
  })

  it('matches snapshot', () => {
    const wrapper = shallow(<ResultListItem index={0} item={item} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('calls onClick when mouse has been clicked', () => {
    const onClick = jest.fn()
    const wrapper = shallow(
      <ResultListItem index={0} item={item} onClick={onClick} />
    )

    expect(onClick).not.toHaveBeenCalled()

    wrapper.simulate('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
