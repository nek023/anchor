import { Record } from 'immutable';
import { ItemTypes } from '../constants';

const ItemRecord = Record({
  type:       undefined,
  windowId:   undefined,
  tabIndex:   undefined,
  title:      undefined,
  url:        undefined,
  favIconUrl: undefined
});

export default class Item extends ItemRecord {
  getFavIconUrl() {
    if (this.type == ItemTypes.TAB) {
      return this.favIconUrl;
    }
    return `chrome://favicon/${this.url}`;
  }
}
