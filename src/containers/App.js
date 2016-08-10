import React, { PureComponent, PropTypes } from 'react';
import { ItemTypes, KeyCodes } from '../constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchField from '../components/SearchField';
import ResultList from '../components/ResultList';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.keyDownListener = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyDownListener);
    this.props.setQuery(this.props.query);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDownListener);
  }

  openItem(item) {
    if (item.type == ItemTypes.TAB) {
      chrome.tabs.highlight({
        windowId: item.windowId,
        tabs: item.tabIndex
      }, window => {
        chrome.windows.update(window.id, {
          focused: true
        });
      });
    } else {
      chrome.tabs.create({ url: item.url });
    }
  }

  closeWindow() {
    chrome.windows.getCurrent(window => {
      chrome.windows.remove(window.id);
    });
  }

  selectNextRow() {
    const index = this.props.selectedRowIndex;
    if (index >= this.props.results.length - 1) return;
    this.props.selectRow(index + 1);
  }

  selectPreviousRow() {
    const index = this.props.selectedRowIndex;
    if (index <= 0) return;
    this.props.selectRow(index - 1);
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
    case KeyCodes.RETURN: {
      event.preventDefault();
      const { results, selectedRowIndex } = this.props;
      if (results.length == 0) return;
      this.openItem(results[selectedRowIndex].item);
      this.closeWindow();
      break;
    }

    case KeyCodes.ESCAPE:
      event.preventDefault();
      this.closeWindow();
      break;

    case KeyCodes.UP:
      event.preventDefault();
      this.selectPreviousRow();
      break;

    case KeyCodes.DOWN:
      event.preventDefault();
      this.selectNextRow();
      break;

    case KeyCodes.N:
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectNextRow();
      break;

    case KeyCodes.P:
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectPreviousRow();
      break;

    default:
      break;
    }
  }

  render() {
    const { query, results, selectedRowIndex, setQuery } = this.props;

    return (
      <div className='app'>
        <SearchField value={query} onValueChanged={setQuery} />
        <ResultList results={results} selectedRowIndex={selectedRowIndex} />
      </div>
    );
  }
}

App.propTypes = {
  query:            PropTypes.string.isRequired,
  results:          PropTypes.array.isRequired,
  selectedRowIndex: PropTypes.number.isRequired,
  setQuery:         PropTypes.func.isRequired,
  selectRow:        PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setQuery: actions.setQuery,
      selectRow: actions.selectRow
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
