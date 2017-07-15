import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ResultList, SearchBox } from '../components';
import { KeyCodes } from '../constants';
import { State } from '../models';
import { actions } from '../modules';

export class App extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    state: State.propTypes.isRequired
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleKeyDown);
    this.props.actions.setQuery(this.props.state.query);
  }

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  openItem = (item) => {
    this.props.actions.openItem(item);
  }

  closeWindow = () => {
    this.props.actions.closeWindow();
  }

  selectNextItem = () => {
    const { actions, state } = this.props;
    const index = state.selectedItemIndex;
    if (index >= state.results.length - 1) return;
    actions.selectItem(index + 1);
  }

  selectPreviousItem = () => {
    const { actions, state } = this.props;
    const index = state.selectedItemIndex;
    if (index <= 0) return;
    actions.selectItem(index - 1);
  }

  handleKeyDown = () => {
    switch (event.keyCode) {
    case KeyCodes.RETURN: {
      event.preventDefault();
      const { results, selectedItemIndex } = this.props.state;
      if (results.length == 0) return;
      this.openItem(results[selectedItemIndex].item);
      this.closeWindow();
      break;
    }

    case KeyCodes.ESCAPE:
      event.preventDefault();
      this.closeWindow();
      break;

    case KeyCodes.UP:
      event.preventDefault();
      this.selectPreviousItem();
      break;

    case KeyCodes.DOWN:
      event.preventDefault();
      this.selectNextItem();
      break;

    case KeyCodes.N:
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectNextItem();
      break;

    case KeyCodes.P:
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectPreviousItem();
      break;

    default:
      break;
    }
  }

  handleMouseEnterItem = (index) => {
    this.props.actions.selectItem(index);
  }

  handleClickItem = (result) => {
    this.openItem(result.item);
    this.closeWindow();
  }

  render = () => {
    const { actions, state } = this.props;

    return (
      <div className='app'>
        <SearchBox
          value={state.query}
          onValueChanged={actions.setQuery} />
        <ResultList
          results={state.results}
          selectedItemIndex={state.selectedItemIndex}
          onMouseEnterItem={this.handleMouseEnterItem}
          onClickItem={this.handleClickItem} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
