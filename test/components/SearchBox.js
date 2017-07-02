import React from 'react';
import assert from 'power-assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { SearchBox } from '../../src/components';

describe('SearchBox', () => {
  it('should be rendered correctly', () => {
    const wrapper = shallow(<SearchBox />);

    assert(wrapper.containsMatchingElement(<input value={''} />));
  });

  it('should have value specified as props.value', () => {
    const value = 'test query';
    const wrapper = shallow(<SearchBox value={value} />);

    assert(wrapper.containsMatchingElement(<input value={value} />));
  });

  it('should handle change of value', () => {
    const value = 'value';
    const onValueChanged = sinon.spy();
    const wrapper = shallow(
      <SearchBox value={value} onValueChanged={onValueChanged} />
    );

    assert(!onValueChanged.called);

    const newValue = 'new value';
    wrapper.find('input').simulate('change', { target: { value: newValue } });

    assert(onValueChanged.calledOnce);
  });
});
