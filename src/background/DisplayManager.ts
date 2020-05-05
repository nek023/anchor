export class DisplayManager {
  private _displays: chrome.system.display.DisplayInfo[] = []
  private _primaryDisplay: chrome.system.display.DisplayInfo | undefined

  constructor() {
    chrome.system.display.onDisplayChanged.addListener(() => {
      this.updateDisplays()
    })

    this.updateDisplays()
  }

  get displays(): chrome.system.display.DisplayInfo[] {
    return this._displays
  }

  get primaryDisplay(): chrome.system.display.DisplayInfo | undefined {
    return this._primaryDisplay
  }

  public displayContainsWindow(
    window: chrome.windows.Window
  ): chrome.system.display.DisplayInfo | undefined {
    const { left, top, width, height } = window

    if (
      typeof left !== 'number' ||
      typeof top !== 'number' ||
      typeof width !== 'number' ||
      typeof height !== 'number'
    ) {
      return undefined
    }

    const displays = this.displays.filter((display) => {
      const b = display.bounds

      return (
        b.left <= left &&
        b.top <= top &&
        b.left + b.width >= left + width &&
        b.top + b.height >= top + height
      )
    })

    return displays.length > 0 ? displays[0] : undefined
  }

  private updateDisplays() {
    chrome.system.display.getInfo((displays) => {
      this._displays = displays
      this._primaryDisplay = displays.filter((d) => d.isPrimary)[0]
    })
  }
}
