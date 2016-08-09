import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import ResultRow from './ResultRow';

export default class ResultList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    this.scrollComponentToVisible(this.refs.selected);
  }

  scrollComponentToVisible(component) {
    const node = findDOMNode(component);
    node.scrollIntoViewIfNeeded(false);
  }

  render() {
    const { results, selectedRowIndex } = this.props;

    const resultRows = results.map((result, index) => {
      const selected = (index == selectedRowIndex);
      const ref = selected ? 'selected' : null;

      return <ResultRow key={index} ref={ref} result={result} selected={selected} />;
    });

    return (
      <ul className='item-list'>
        {resultRows}
      </ul>
    );
  }
}

ResultList.propTypes = {
  results:          PropTypes.array.isRequired,
  selectedRowIndex: PropTypes.number
};

ResultList.defaultProps = {
  selectedRowIndex: 0
};
