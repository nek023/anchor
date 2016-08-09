import React, { PureComponent, PropTypes } from 'react';
import Result from '../models/Result';

export default class ResultRow extends PureComponent {
  render() {
    const { result, selected } = this.props;
    const favIconUrl = result.item.getFavIconUrl();
    const listClassName = selected ? 'item selected' : 'item';

    return (
      <li className={listClassName}>
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
  result:   PropTypes.instanceOf(Result).isRequired,
  selected: PropTypes.bool
};

ResultRow.defaultProps = {
  selected: false
};
