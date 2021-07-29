export const closeCurrentWindow = () =>
  chrome.windows.getCurrent((window) => {
    if (window.id != null) {
      chrome.windows.remove(window.id);
    }
  });
