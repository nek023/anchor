import { Record } from 'immutable';

const ResultRecord = Record({
  index:   undefined,
  item:    undefined,
  score:   undefined,
  matched: undefined
});

export default class Result extends ResultRecord {
}
