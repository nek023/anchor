import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const StateRecord = Immutable.Record({
  query: '',
  results: [],
  selectedItemIndex: 0
});

export default class State extends StateRecord {
  static propTypes = ImmutablePropTypes.recordOf({
    query: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(ImmutablePropTypes.record).isRequired,
    selectedItemIndex: PropTypes.number.isRequired
  })

  setQuery(query) {
    return this.set('query', query);
  }

  setResults(results) {
    return this.set('results', results);
  }

  setSelectedItemIndex(selectedItemIndex) {
    return this.set('selectedItemIndex', selectedItemIndex);
  }
}
