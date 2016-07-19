import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Result from '../models/Result';

export default class ResultRow extends Component {
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleMouseEnter() {
    this.props.onMouseEnter(this.props.result.index);
  }

  handleClick() {
    const onSelect = this.props.onSelect;
    if (onSelect) onSelect(this.props.result);
  }

  render() {
    const { result, selected } = this.props;
    const favIconUrl = result.item.getFavIconUrl();
    const listClassName = selected ? 'item selected' : 'item';

    return (
      <li className={listClassName}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleClick}>
        <div className='item-left'>
          <img className='favicon' src={favIconUrl} />
        </div>
        <div className='item-body'>
          <div className='item-title'>{result.item.title}</div>
          <div className='item-url'>{result.item.url}</div>
        </div>
      </li>
    );
  }
}

ResultRow.propTypes = {
  result:       PropTypes.instanceOf(Result).isRequired,
  selected:     PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onSelect:     PropTypes.func
};

ResultRow.defaultProps = {
  selected: false
};
