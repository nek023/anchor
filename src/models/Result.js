import { Record } from 'immutable';

const ResultRecord = Record({
  index:   undefined,
  item:    undefined,
  score:   undefined,
  matches: undefined
});

export default class Result extends ResultRecord {
}
