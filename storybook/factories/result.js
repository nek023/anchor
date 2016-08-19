import faker from 'faker';
import Result from '../../src/models/Result';
import createItem from './item';

export default function createResult({
  index   = faker.random.number(),
  item    = createItem(),
  score   = faker.random.number(),
  matches = []
} = {}) {
  return new Result({
    index,
    item,
    score,
    matches
  });
}
