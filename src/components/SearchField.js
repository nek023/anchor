import React, { PureComponent, PropTypes } from 'react';

export default class SearchField extends PureComponent {
  constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
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
