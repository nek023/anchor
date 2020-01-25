import { shallow } from 'enzyme'
import React from 'react'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<SearchBar value="" />)

    expect(wrapper).toMatchSnapshot()
  })

  it('calls onValueChanged when value has changed', () => {
    const onValueChanged = jest.fn()
    const wrapper = shallow(
      <SearchBar value={'test value'} onValueChanged={onValueChanged} />
    )

    expect(onValueChanged).not.toHaveBeenCalled()

    wrapper.simulate('change', { target: { value: 'new value' } })

    expect(onValueChanged).toHaveBeenCalledTimes(1)
  })
})
