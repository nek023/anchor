import assert from 'power-assert';
import { createResult } from '../helpers';

describe('Result', () => {
  let result;

  beforeEach(() => {
    result = createResult();
  });

  it('should be valid', () => {
    assert(result !== null);

    assert('index'   in result);
    assert('item'    in result);
    assert('score'   in result);
    assert('matches' in result);
  });
});
