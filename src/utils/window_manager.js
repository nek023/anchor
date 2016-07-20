import DisplayManager from './display_manager';

export default class WindowManager {
  constructor() {
    this.window = null;
    this.displayManager = new DisplayManager();

    chrome.windows.onRemoved.addListener(
      this.handleWindowRemoval.bind(this)
    );
  }

  getWindow() {
    return this.window;
  }

  isWindowVisible() {
    return (this.window != null);
  }

  handleWindowRemoval(windowId) {
    if (windowId == this.window.id) {
      this.window = null;
    }
  }

  showWindow() {
    if (this.isWindowVisible()) return;

    chrome.windows.getCurrent(window => {
      const display = this.displayManager.displayContainsWindow(window);
      const width = 600;
      const height = 496 + 22;
      const left = display.bounds.left + Math.round((display.bounds.width - width) * 0.5);
      const top = display.bounds.top + Math.round((display.bounds.height - height) * 0.5);
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        left: left,
        top: top,
        width: width,
        height: height,
        focused: true,
        type: 'popup'
      }, window => {
        this.window = window;
      });
    });
  }

  closeWindow() {
    if (!this.isWindowVisible()) return;

    chrome.windows.remove(this.window.id);
  }
}
