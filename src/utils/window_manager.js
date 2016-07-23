export default class WindowManager {
  constructor(url) {
    this.url = url;
    this.window = null;

    chrome.windows.onRemoved.addListener(
      this.handleWindowRemoval.bind(this)
    );

    chrome.windows.onFocusChanged.addListener(
      this.handleFocusChanges.bind(this)
    );
  }

  getWindow() {
    return this.window;
  }

  isWindowVisible() {
    return (this.window != null);
  }

  isWindowFocused() {
    return this.window.focused;
  }

  handleWindowRemoval(windowId) {
    if (windowId == this.window.id) {
      this.window = null;
    }
  }

  handleFocusChanges(windowId) {
    if (windowId == this.window.id) {
      this.window.focused = true;
    } else {
      this.window.focused = false;
    }
  }

  showWindow(left, top, width, height) {
    if (this.isWindowVisible()) {
      chrome.windows.update(this.window.id, {
        left: left,
        top: top,
        width: width,
        height: height,
        focused: true
      });
    } else {
      chrome.windows.create({
        url: this.url,
        left: left,
        top: top,
        width: width,
        height: height,
        focused: true,
        type: 'popup'
      }, window => {
        this.window = window;
      });
    }
  }

  closeWindow() {
    if (!this.isWindowVisible()) return;

    chrome.windows.remove(this.window.id, () => {
      this.window = null;
    });
  }
}
