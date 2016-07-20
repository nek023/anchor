export default class DisplayManager {
  constructor() {
    this.displays = [];
    this.primaryDisplay = null;

    chrome.system.display.onDisplayChanged.addListener(
      this.handleDisplayChange.bind(this)
    );

    this.updateDisplays();
  }

  getDisplays() {
    return this.displays;
  }

  getPrimaryDisplay() {
    return this.primaryDisplay;
  }

  updateDisplays() {
    chrome.system.display.getInfo(displays => {
      this.displays = displays;
      this.primaryDisplay = displays.filter(d => d.isPrimary)[0];
    });
  }

  handleDisplayChange() {
    this.updateDisplays();
  }

  displayContainsWindow(window) {
    const w = {
      left:   window.left,
      top:    window.top,
      right:  window.left + window.width,
      bottom: window.top  + window.height,
    };

    const displays = this.displays.filter(display => {
      const d = {
        left:   display.bounds.left,
        top:    display.bounds.top,
        right:  display.bounds.left + display.bounds.width,
        bottom: display.bounds.top  + display.bounds.height,
      };

      return (d.left   <= w.left
           && d.top    <= w.top
           && d.right  >= w.right
           && d.bottom >= w.bottom);
    });

    return (displays.length > 0) ? displays[0] : null;
  }
}
