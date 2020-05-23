export const closeWindow = () =>
  chrome.windows.getCurrent((window) => chrome.windows.remove(window.id))
