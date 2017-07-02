async function sendMessage(type, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, payload }, (response) => {
      if (response) {
        resolve(response);
      } else {
        reject(chrome.runtime.lastError);
      }
    });
  });
}

export default sendMessage;
