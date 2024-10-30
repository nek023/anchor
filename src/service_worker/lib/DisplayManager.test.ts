import { DisplayManager } from "./DisplayManager";

describe("DisplayManager", () => {
  let onDisplayChangedCallback: () => void;
  const getInfoFunc = jest.fn();

  const mockGetInfo = (info: chrome.system.display.DisplayInfo[]) => {
    getInfoFunc.mockImplementation(
      (callback: (info: chrome.system.display.DisplayInfo[]) => void) => {
        callback(info);
      },
    );
  };

  beforeEach(() => {
    global.chrome = {
      system: {
        display: {
          onDisplayChanged: {
            addListener: (callback: () => void) => {
              onDisplayChangedCallback = callback;
            },
          },
          getInfo: getInfoFunc,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });

  afterEach(() => {
    getInfoFunc.mockReset();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).chrome;
  });

  describe("primaryDisplay", () => {
    test("returns primary display", () => {
      mockGetInfo([
        {
          id: "1",
          name: "primary",
          isPrimary: true,
          bounds: {
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
          },
        },
        {
          id: "2",
          name: "secondary",
          isPrimary: false,
          bounds: {
            left: 1280,
            top: 0,
            width: 1280,
            height: 720,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      const manager = new DisplayManager();
      expect(manager.primaryDisplay?.id).toBe("1");
    });
  });

  describe("displayContainsWindow", () => {
    beforeEach(() => {
      mockGetInfo([
        {
          id: "1",
          name: "primary",
          isPrimary: true,
          bounds: {
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
    });

    test("returns display if it contains specified window", () => {
      const manager = new DisplayManager();
      const window = {
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const display = manager.displayContainsWindow(window as any);

      expect(display?.id).toBe("1");
    });

    test("returns undefined if there is no display that contains specified window", () => {
      const manager = new DisplayManager();
      const window = {
        left: 1280,
        top: 0,
        width: 100,
        height: 100,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const display = manager.displayContainsWindow(window as any);

      expect(display).toBeUndefined();
    });
  });

  describe("handling onDisplayChanged events", () => {
    test("displays will be updated when onDisplayChanged event occurred", () => {
      const manager = new DisplayManager();
      mockGetInfo([
        {
          id: "1",
          name: "primary",
          isPrimary: true,
          bounds: {
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);
      expect(manager.primaryDisplay).toBeUndefined();

      onDisplayChangedCallback();
      expect(manager.primaryDisplay?.id).toBe("1");
    });
  });
});
