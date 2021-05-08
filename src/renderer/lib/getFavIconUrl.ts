import { Item, ItemType } from "../../common/types";

export const getFavIconUrl = (item: Item) => {
  if (item.type === ItemType.Tab && item.favIconUrl) {
    if (item.favIconUrl.startsWith("chrome://theme/")) {
      return "chrome://favicon";
    }
    return item.favIconUrl;
  }
  return `chrome://favicon/${item.url}`;
};
