import React, { PureComponent, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ResultRow from './ResultRow';

export default class ResultList extends PureComponent {
  componentDidUpdate() {
    this.scrollComponentToVisible(this.refs.selected);
  }

  scrollComponentToVisible(component) {
    if (!component) return;
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
  results:          PropTypes.array,
  selectedRowIndex: PropTypes.number
};

ResultList.defaultProps = {
  results: [],
  selectedRowIndex: 0
};
