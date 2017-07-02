import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ItemTypes } from '../constants';

const ItemRecord = Immutable.Record({
  type:       undefined,
  windowId:   undefined,
  tabIndex:   undefined,
  title:      undefined,
  url:        undefined,
  favIconUrl: undefined
});

export default class Item extends ItemRecord {
  static propTypes = ImmutablePropTypes.recordOf({
    type: PropTypes.string.isRequired,
    windowId: PropTypes.number.isRequired,
    tabIndex: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    favIconUrl: PropTypes.string.isRequired
  })

  getFavIconUrl() {
    if (this.type == ItemTypes.TAB && this.favIconUrl) {
      if (this.favIconUrl.startsWith('chrome://theme/')) {
        return `chrome://favicon`;
      }
      return this.favIconUrl;
    }
    return `chrome://favicon/${this.url}`;
  }
}
