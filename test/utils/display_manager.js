import DisplayManager from '../../src/utils/display_manager';
import assert from 'power-assert';
import createMockChromeObject from '../helpers/chrome';
import createDisplay from '../factories/display';
import createWindow from '../factories/window';

describe('DisplayManager', () => {
  let displays;
  let primaryDisplay;
  let displayManager;

  beforeEach(() => {
    displays = [...Array(5).keys()].map(() => createDisplay());
    primaryDisplay = createDisplay({ isPrimary: true });
    displays.push(primaryDisplay);

    global.chrome = createMockChromeObject();
    chrome.system.display.getInfo.callsArgWith(0, displays);

    displayManager = new DisplayManager();
  });

  it('should update displays when displays have been updated', () => {
    assert(displayManager.getDisplays().length === displays.length);

    const newDisplays = [...Array(10).keys()].map(() => createDisplay());
    chrome.system.display.getInfo.callsArgWith(0, newDisplays);
    chrome.system.display.onDisplayChanged.emit();

    assert(displayManager.getDisplays().length === newDisplays.length);
  });

  describe('#getDisplays()', () => {
    it('should return all displays', () => {
      const actual = displayManager.getDisplays();

      assert.deepEqual(actual, displays);
    });
  });

  describe('#getPrimaryDisplay()', () => {
    it('should return primary display', () => {
      const actual = displayManager.getPrimaryDisplay();

      assert(actual === primaryDisplay);
    });
  });

  describe('#displayContainsWindow()', () => {
    it('should return display which contains specified window', () => {
      const newDisplays = [
        createDisplay({
          bounds: {
            left: 0,
            top: 0,
            width: 1600,
            height: 900
          }
        }),
        createDisplay({
          bounds: {
            left: 1600,
            top: 0,
            width: 1600,
            height: 900
          }
        })
      ];
      chrome.system.display.getInfo.callsArgWith(0, newDisplays);
      chrome.system.display.onDisplayChanged.emit();

      const window = createWindow({
        left: 1700,
        top: 200,
        width: 400,
        height: 300
      });
      const expected = newDisplays[1];
      const actual = displayManager.displayContainsWindow(window);

      assert(actual === expected);
    });
  });
});
