import { DisplayManager } from "./DisplayManager";

describe("DisplayManager", () => {
  let onDisplayChangedCallback: () => void;
  const getInfoFunc = jest.fn();

  const mockGetInfo = (info: chrome.system.display.DisplayInfo[]) => {
    getInfoFunc.mockImplementation(
      (callback: (info: chrome.system.display.DisplayInfo[]) => void) => {
        callback(info);
      }
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
  });

  describe("primaryDisplay", () => {
    test("returns primary display", () => {
      const manager = new DisplayManager();
      expect(manager.primaryDisplay?.id).toBe("1");
    });
  });

  describe("displayContainsWindow", () => {
    test("returns display if it contains specified window", () => {
      const manager = new DisplayManager();
      const window = {
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const display = manager.displayContainsWindow(window as any);

      expect(display?.id).toBe("1");
    });

    test("returns undefined if there is no displays that contains window", () => {
      const manager = new DisplayManager();
      const window = {
        left: 0,
        top: 800,
        width: 100,
        height: 100,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const display = manager.displayContainsWindow(window as any);

      expect(display).toBeUndefined();
    });
  });

  describe("handling onDisplayChanged event", () => {
    test("update displays when onDisplayChanged event occurred", () => {
      mockGetInfo([]);
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

      expect(manager.primaryDisplay).toBeUndefined;
      onDisplayChangedCallback();
      expect(manager.primaryDisplay?.id).toBe("1");
    });
  });
});
