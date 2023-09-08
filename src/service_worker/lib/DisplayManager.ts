export class DisplayManager {
  private _displays: chrome.system.display.DisplayInfo[] = [];
  private _primaryDisplay?: chrome.system.display.DisplayInfo;

  constructor() {
    chrome.system.display.onDisplayChanged.addListener(() =>
      this.updateDisplays(),
    );

    this.updateDisplays();
  }

  get primaryDisplay() {
    return this._primaryDisplay;
  }

  displayContainsWindow(
    window: chrome.windows.Window,
  ): chrome.system.display.DisplayInfo | undefined {
    const { left, top, width, height } = window;
    if (left == null || top == null || width == null || height == null)
      return undefined;

    const displays = this._displays.filter((display) => {
      const b = display.bounds;

      return (
        b.left <= left &&
        b.top <= top &&
        b.left + b.width >= left + width &&
        b.top + b.height >= top + height
      );
    });

    return displays.length > 0 ? displays[0] : undefined;
  }

  private updateDisplays() {
    chrome.system.display.getInfo((displays) => {
      this._displays = displays;
      this._primaryDisplay = displays.find((d) => d.isPrimary);
    });
  }
}
