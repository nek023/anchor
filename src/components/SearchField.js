import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class SearchField extends Component {
  constructor(props) {
      super(props);
      
      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleChange(event) {
    this.props.onValueChanged(event.target.value);
  }

  handleBlur() {
    this.refs.input.focus();
  }

  render() {
    return (
      <div className='search-field'>
        <input ref='input' className='search-input' type='text'
          autoFocus={true} value={this.props.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur} />
      </div>
    );
  }
}

SearchField.propTypes = {
  value:          PropTypes.string.isRequired,
  onValueChanged: PropTypes.func.isRequired
};
