import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import { closeWindow, openItem, selectItem, setQuery, State } from '../modules/index'
import ResultList from './ResultList'
import SearchBar from './SearchBar'

enum KeyCode {
  Return = 13,
  Escape = 27,
  Up = 38,
  Down = 40,
  N = 78,
  P = 80,
}

const mapStateToProps = (state: State) => {
  return {
    items: state.items,
    query: state.query,
    selectedItemIndex: state.selectedItemIndex,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    closeWindow,
    openItem,
    selectItem,
    setQuery,
  }, dispatch)
}

const AppContainer = styled.div`
  padding: 8px;
`

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export class App extends React.PureComponent<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.props.setQuery(this.props.query)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    return (
      <AppContainer>
        <SearchBar value={this.props.query}
          onValueChanged={this.onValueChanged} />
        <ResultList items={this.props.items} onClickItem={this.onClickItem}
          selectedItemIndex={this.props.selectedItemIndex} />
      </AppContainer>
    )
  }

  private selectNextItem = () => {
    if (this.props.selectedItemIndex >= this.props.items.length - 1) return
    this.props.selectItem(this.props.selectedItemIndex + 1)
  }

  private selectPreviousItem = () => {
    if (this.props.selectedItemIndex <= 0) return
    this.props.selectItem(this.props.selectedItemIndex - 1)
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
    case KeyCode.Return:
      event.preventDefault()
      if (this.props.items.length === 0) break
      this.props.openItem(this.props.items[this.props.selectedItemIndex])
      this.props.closeWindow()
      break

    case KeyCode.Escape:
      event.preventDefault()
      this.props.closeWindow()
      break

    case KeyCode.Up:
      event.preventDefault()
      this.selectPreviousItem()
      break

    case KeyCode.Down:
      event.preventDefault()
      this.selectNextItem()
      break

    case KeyCode.N:
      if (!event.ctrlKey) break
      event.preventDefault()
      this.selectNextItem()
      break

    case KeyCode.P:
      if (!event.ctrlKey) break
      event.preventDefault()
      this.selectPreviousItem()
      break

    default:
      break
    }
  }

  private onClickItem = (index: number) => {
    this.props.selectItem(index)
    this.props.openItem(this.props.items[index])
    this.props.closeWindow()
  }

  private onValueChanged = (value: string) => {
    this.props.setQuery(value)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
