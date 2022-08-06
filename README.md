# anchor

![Build](https://github.com/questbeat/anchor/workflows/Build/badge.svg)
![Release](https://github.com/questbeat/anchor/workflows/Release/badge.svg)

Tab switcher for Google Chrome.

![](screenshot.png)


## Installation

### Download from Chrome Web Store

Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/anchor/hgnlmkibblofcjgcljofkcdofkplhlgb) and install the extension.

After installation, select "Keyboard shortcuts" from the menu in the Chrome extension settings and setup the shortcuts.


### Build manually

```sh
asdf install
npm install
npm run build
```

After the build is complete, activate "Developer mode" from the Chrome extension settings, select "Load unpacked" and choose the `build` directory.


## Usage

Launch anchor and enter search words in the input field. A list of tabs matching the search word will be displayed.

You can also search for pages from your bookmarks or history by using the following filters.

* `t:(keyword)` - Find from tabs.
* `b:(keyword)` - Find from bookmarks.
* `h:(keyword)` - Find from histories.

If no filter is specified, it works the same as if `t:` were specified.

Filters can also be combined. For example:

* `tb:`  - Find from tabs and bookmarks.
* `tbh:` - Find from tabs, bookmarks and histories.


## License

anchor is licensed under the [MIT License](LICENSE).
