export const closeCurrentWindow = () =>
  chrome.windows.getCurrent((window) => chrome.windows.remove(window.id));
