import React from 'react';
import PropTypes from 'prop-types';

export default class SearchBox extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onValueChanged: PropTypes.func
  }

  static defaultProps = {
    value: ''
  }

  componentDidMount = () => {
    const index = this.props.value.length;
    this.input.setSelectionRange(index, index);
  }

  handleBlur = () => {
    this.input.focus();
  }

  handleChange = (event) => {
    const { onValueChanged } = this.props;
    if (onValueChanged) onValueChanged(event.target.value);
  }

  render = () => {
    return (
      <div className='search-field'>
        <input
          type='text'
          value={this.props.value}
          ref={(input) => { this.input = input; }}
          autoFocus={true}
          onBlur={this.handleBlur}
          onChange={this.handleChange} />
      </div>
    );
  }
}
