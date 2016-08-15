import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import createItem from '../fixtures/item';

describe('Item', () => {
  let item;

  beforeEach(() => {
    item = createItem();
  });

  it('should be valid', () => {
    assert(item !== null);

    assert('type'       in item);
    assert('windowId'   in item);
    assert('tabIndex'   in item);
    assert('title'      in item);
    assert('url'        in item);
    assert('favIconUrl' in item);
  });

  context('when type is tab', () => {
    beforeEach(() => {
      item = item.set('type', ItemTypes.TAB);
    });

    context('when favIconUrl is null', () => {
      beforeEach(() => {
        item = item.set('favIconUrl', null);
      });

      describe('getFavIconUrl', () => {
        it('should return cached favicon', () => {
          assert(item.getFavIconUrl() === `chrome://favicon/${item.url}`);
        });
      });
    });

    context('when favIconUrl is not null', () => {
      context('when favicon is chrome asset', () => {
        beforeEach(() => {
          item = item.set('favIconUrl', 'chrome://theme/test');
        });

        describe('getFavIconUrl', () => {
          it('should return default favicon', () => {
            assert(item.getFavIconUrl() === 'chrome://favicon');
          });
        });
      });

      context('when favicon is not chrome asset', () => {
        describe('getFavIconUrl', () => {
          it('should return its favicon url', () => {
            assert(item.getFavIconUrl() === item.favIconUrl);
          });
        });
      });
    });
  });

  context('when its type is not tab', () => {
    beforeEach(() => {
      item = item.set('type', ItemTypes.HISTORY);
    });

    describe('getFavIconUrl', () => {
      it('should return cached favicon', () => {
        assert(item.getFavIconUrl() === `chrome://favicon/${item.url}`);
      });
    });
  });
});
