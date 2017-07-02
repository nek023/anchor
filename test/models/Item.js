import assert from 'power-assert';
import { ItemTypes } from '../../src/constants';
import { createItem } from '../helpers';

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

  context('when item type is tab', () => {
    beforeEach(() => {
      item = item.set('type', ItemTypes.TAB);
    });

    context('when favIconUrl is null', () => {
      beforeEach(() => {
        item = item.set('favIconUrl', null);
      });

      describe('#getFavIconUrl()', () => {
        it('should return cached favicon', () => {
          assert(item.getFavIconUrl() === `chrome://favicon/${item.url}`);
        });
      });
    });

    context('when favIconUrl is a chrome asset', () => {
      beforeEach(() => {
        item = item.set('favIconUrl', 'chrome://theme/test');
      });

      describe('#getFavIconUrl()', () => {
        it('should return default favicon', () => {
          assert(item.getFavIconUrl() === 'chrome://favicon');
        });
      });
    });

    context('when favIconUrl is not a chrome asset', () => {
      describe('#getFavIconUrl()', () => {
        it('should return its favicon url', () => {
          assert(item.getFavIconUrl() === item.favIconUrl);
        });
      });
    });
  });

  context('when item type is not tab', () => {
    beforeEach(() => {
      item = item.set('type', ItemTypes.BOOKMARK);
    });

    describe('#getFavIconUrl()', () => {
      it('should return cached favicon', () => {
        assert(item.getFavIconUrl() === `chrome://favicon/${item.url}`);
      });
    });
  });
});
