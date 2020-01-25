import React from 'react'
import styled from 'styled-components'

const SearchBarInput = styled.input`
  width: 100%;
  height: 40px;
  margin: 0;
  padding: 5px;
  font-size: 26px;
  border-radius: 4px;
  border: 1px solid #cccccc;

  &:focus {
    outline: none;
  }
`

type OptionalProps = {
  onValueChanged?: (value: string) => void
}

type Props = OptionalProps & {
  value: string
}

export default class SearchBar extends React.PureComponent<Props> {
  private inputRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    if (this.inputRef.current) {
      const index = this.props.value.length
      this.inputRef.current.setSelectionRange(index, index)
    }
  }

  render() {
    return (
      <SearchBarInput
        type="text"
        value={this.props.value}
        ref={this.inputRef}
        autoFocus={true}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    )
  }

  private handleBlur = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onValueChanged) {
      this.props.onValueChanged(event.target.value)
    }
  }
}
