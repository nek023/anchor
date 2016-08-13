import React from 'react';
import SearchField from '../../src/components/SearchField';
import assert from 'power-assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';

describe('SearchField component', () => {
  it('should be rendered correctly', () => {
    const value = 'test query';
    const wrapper = shallow(<SearchField value={value} />);

    assert(wrapper.containsMatchingElement(<input value={value} />));
  });

  it('should have empty value as default', () => {
    const wrapper = shallow(<SearchField />);

    assert(wrapper.containsMatchingElement(<input value={''} />));
  });

  it('should handle change of value', () => {
    const value = 'value';
    const onValueChanged = sinon.spy();
    const wrapper = shallow(
      <SearchField value={value} onValueChanged={onValueChanged} />
    );

    assert(!onValueChanged.called);

    const newValue = 'new value';
    wrapper.find('input').simulate('change', { target: { value: newValue } });

    assert(onValueChanged.calledOnce);
  });
});
