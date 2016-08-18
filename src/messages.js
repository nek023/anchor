import Result from './models/Result';
import Item from './models/Item';

const MAX_RESULTS = 100;

export const QUERY_ITEMS = 'QUERY_ITEMS';
export const SET_QUERY = 'SET_QUERY';

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
