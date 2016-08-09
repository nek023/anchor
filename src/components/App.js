import React, { PureComponent } from 'react';
import { MAX_RESULTS, ItemType, KeyCode, Message } from '../constants';
import SearchField from './SearchField';
import ResultList from './ResultList';
import Result from '../models/Result';
import Item from '../models/Item';

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.keyDownListener = this.handleKeyDown.bind(this);
    this.state = {
      query: '',
      results: [],
      selectedRowIndex: 0
    };

    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyDownListener);
    this.updateItems();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDownListener);
  }

  updateItems() {
    chrome.runtime.sendMessage({
      type: Message.QUERY_ITEMS,
      query: this.state.query
    }, results => {
      results = results.splice(0, MAX_RESULTS).map((result, index) => {
        return new Result({
          index: index,
          item: new Item(result.item),
          score: result.score,
          matches: result.matches
        });
      });
      this.setState({
        results: results,
        selectedRowIndex: 0
      });
    });
  }

  openItem(item) {
    if (item.type == ItemType.TAB) {
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

  selectNextResult() {
    const index = this.state.selectedRowIndex;
    if (index >= this.state.results.length - 1) return;
    this.setState({ selectedRowIndex: index + 1 });
  }

  selectPreviousResult() {
    const index = this.state.selectedRowIndex;
    if (index <= 0) return;
    this.setState({ selectedRowIndex: index - 1 });
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
    case KeyCode.RETURN: {
      const { results, selectedRowIndex } = this.state;
      if (results.length == 0) return;
      this.openItem(results[selectedRowIndex].item);
      this.closeWindow();
      break;
    }

    case KeyCode.ESCAPE: {
      this.closeWindow();
      break;
    }

    case KeyCode.UP: {
      event.preventDefault();
      this.selectPreviousResult();
      break;
    }

    case KeyCode.DOWN: {
      event.preventDefault();
      this. selectNextResult();
      break;
    }

    case KeyCode.N: {
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectNextResult();
      break;
    }

    case KeyCode.P: {
      if (!event.ctrlKey) return;
      event.preventDefault();
      this.selectPreviousResult();
      break;
    }

    default:
      break;
    }
  }

  handleSearchFieldChange(value) {
    this.setState({ query: value }, this.updateItems.bind(this));
  }

  render() {
    const { query, results, selectedRowIndex } = this.state;

    return (
      <div className='app'>
        <SearchField value={query} onValueChanged={this.handleSearchFieldChange} />
        <ResultList results={results} selectedRowIndex={selectedRowIndex} />
      </div>
    );
  }
}
