import { MAX_RESULTS } from './constants';
import Result from './models/Result';
import Item from './models/Item';

export const QUERY_ITEMS = 'QUERY_ITEMS';

function sendMessage(type, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type: type,
      payload: payload
    }, response => {
      if (response) {
        resolve(response);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export function queryItems(query) {
  return new Promise((resolve, reject) => {
    sendMessage(QUERY_ITEMS, query).then(response => {
      const results = response.splice(0, MAX_RESULTS).map((result, index) => {
        return new Result({
          index: index,
          item: new Item(result.item),
          score: result.score,
          matches: result.matches
        });
      });
      resolve(results);
    }).catch(error => {
      reject(error);
    });
  });
}
