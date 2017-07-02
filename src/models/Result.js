import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const ResultRecord = Immutable.Record({
  index:   undefined,
  item:    undefined,
  score:   undefined,
  matches: undefined
});

export default class Result extends ResultRecord {
  static propTypes = ImmutablePropTypes.recordOf({
    index: PropTypes.number.isRequired,
    item: ImmutablePropTypes.record.isRequired,
    score: PropTypes.number.isRequired,
    matches: PropTypes.array.isRequired
  })
}
