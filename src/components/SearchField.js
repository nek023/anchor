import React, { PureComponent, PropTypes } from 'react';

export default class SearchField extends PureComponent {
  constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event) {
    if (!this.props.onValueChanged) return;
    this.props.onValueChanged(event.target.value);
  }

  handleBlur() {
    this.refs.input.focus();
  }

  render() {
    return (
      <div className='search-field'>
        <input ref='input' type='text' value={this.props.value}
          autoFocus={true} onChange={this.handleChange}
          onBlur={this.handleBlur} />
      </div>
    );
  }
}

SearchField.propTypes = {
  value:          PropTypes.string,
  onValueChanged: PropTypes.func
};

SearchField.defaultProps = {
  value: ''
};
