import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Result } from '../models';

export default class ResultListItem extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    result: Result.propTypes.isRequired,
    selected: PropTypes.bool.isRequired
  }

  static defaultProps = {
    selected: false
  }

  componentDidUpdate = () => {
    if (this.props.selected) {
      this.node.scrollIntoViewIfNeeded(false);
    }
  }

  handleMouseEnter = () => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) onMouseEnter(this.props.result.index);
  }

  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) onClick(this.props.result);
  }

  shouldComponentUpdate = (nextProps) => {
    return !(
      Immutable.is(this.props.result, nextProps.result) &&
      this.props.selected === nextProps.selected
    );
  }

  render = () => {
    const { result, selected } = this.props;
    const className = selected ? 'item selected' : 'item';

    return (
      <li className={className}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleClick}
        ref={(node) => { this.node = node; }}>
        <div className='item-left'>
          <img className='favicon' src={result.item.getFavIconUrl()} />
        </div>
        <div className='item-body'>
          <div className='item-title'>{result.item.title}</div>
          <div className='item-url'>{result.item.url}</div>
        </div>
      </li>
    );
  }
}
