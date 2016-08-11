export default class WindowManager {
  constructor() {
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
    if (!this.isWindowVisible()) return false;

    return this.window.focused;
  }

  handleWindowRemoval(windowId) {
    if (!this.isWindowVisible()) return;

    if (windowId == this.window.id) {
      this.window = null;
    }
  }

  handleFocusChanges(windowId) {
    if (!this.isWindowVisible()) return;

    if (windowId == this.window.id) {
      this.window.focused = true;
    } else {
      this.window.focused = false;
    }
  }

  showWindow({ url = null, left, top, width, height }, callback = null) {
    if (this.isWindowVisible()) {
      chrome.windows.update(this.window.id, {
        left: left,
        top: top,
        width: width,
        height: height,
        focused: true
      }, window => {
        if (callback) callback(window, false);
      });
    } else {
      chrome.windows.create({
        url: url,
        left: left,
        top: top,
        width: width,
        height: height,
        focused: true,
        type: 'popup'
      }, window => {
        this.window = window;

        if (callback) callback(window, true);
      });
    }
  }

  closeWindow(callback = null) {
    if (!this.isWindowVisible()) return;

    chrome.windows.remove(this.window.id, () => {
      this.window = null;

      if (callback) callback();
    });
  }
}
