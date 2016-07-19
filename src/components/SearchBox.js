import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class SearchBox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  handleBlur() {
    this.refs.input.focus();
  }

  render() {
    return (
      <div className='search-box'>
        <input ref='input' className='search-input' type='text'
          autoFocus={true} value={this.props.value}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)} />
      </div>
    );
  }
}

SearchBox.propTypes = {
  value:    PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
