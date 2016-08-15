import WindowManager from '../../src/utils/window_manager';
import assert from 'power-assert';
import createMockChromeObject from '../helpers/chrome_extension_helper';
import createWindow from '../fixtures/window';

describe('WindowManager', () => {
  let windowManager;

  beforeEach(() => {
    global.chrome = createMockChromeObject();

    windowManager = new WindowManager();
  });

  context('when it does not have a window', () => {
    describe('showWindow', () => {
      it('should create a new window', () => {
        const window = createWindow();
        chrome.windows.create.callsArgWith(1, window);

        windowManager.showWindow({
          url: 'test.html',
          left: 0,
          top: 0,
          width: 400,
          height: 300
        });

        assert(windowManager.getWindow() === window);
      });
    });

    describe('getWindow', () => {
      it('should return null', () => {
        assert(windowManager.getWindow() === null);
      });
    });

    describe('isWindowVisible', () => {
      it('should return false', () => {
        assert(!windowManager.isWindowVisible());
      });
    });

    describe('isWindowFocused', () => {
      it('should return false', () => {
        assert(!windowManager.isWindowFocused());
      });
    });
  });

  context('when it has a window', () => {
    let window;

    beforeEach(() => {
      window = createWindow();
      chrome.windows.create.callsArgWith(1, window);

      windowManager.showWindow({
        url: 'test.html',
        left: 0,
        top: 0,
        width: 400,
        height: 300
      });
    });

    it('should handle window removal', () => {
      chrome.windows.onRemoved.emit(window.id);

      assert(windowManager.getWindow() === null);
    });

    describe('getWindow', () => {
      it('should return the window', () => {
        assert(windowManager.getWindow() === window);
      });
    });

    describe('isWindowVisible', () => {
      it('should return true', () => {
        assert(windowManager.isWindowVisible());
      });
    });

    describe('showWindow', () => {
      it('should not create a new window', () => {
        const newWindow = createWindow();
        chrome.windows.create.callsArgWith(1, newWindow);
        chrome.windows.update.callsArg(2);

        windowManager.showWindow({
          url: 'test.html',
          left: 0,
          top: 0,
          width: 400,
          height: 300
        });

        assert(windowManager.getWindow() === window);
      });
    });

    describe('closeWindow', () => {
      it('should remove the window', () => {
        chrome.windows.remove.callsArg(1);

        windowManager.closeWindow();

        assert(windowManager.getWindow() === null);
      });
    });
  });
});
