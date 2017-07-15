import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { ResultListItem } from '../components';
import { Result } from '../models';

export default class ResultList extends React.PureComponent {
  static propTypes = {
    onClickItem: PropTypes.func,
    onMouseEnterItem: PropTypes.func,
    results: PropTypes.arrayOf(Result.propTypes).isRequired,
    selectedItemIndex: PropTypes.number.isRequired
  }

  static defaultProps = {
    results: [],
    selectedItemIndex: 0
  }

  componentDidUpdate = () => {
    this.scrollComponentToVisible(this.selectedItem);
  }

  scrollComponentToVisible = (component) => {
    if (!component) return;
    const node = findDOMNode(component);
    node.scrollIntoViewIfNeeded(false);
  }

  render = () => {
    const {
      onClickItem,
      onMouseEnterItem,
      results,
      selectedItemIndex
    } = this.props;

    const listItems = results.map((result, index) => {
      const selected = (index == selectedItemIndex);
      const ref = selected ? ((item) => { this.selectedItem = item; }) : null;

      return <ResultListItem
        key={index}
        ref={ref}
        onClick={onClickItem}
        onMouseEnter={onMouseEnterItem}
        result={result}
        selected={selected} />;
    });

    return (
      <ul className='item-list'>
        {listItems}
      </ul>
    );
  }
}
