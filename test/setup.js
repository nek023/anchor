import { jsdom } from 'jsdom';

global.document = jsdom('');
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});
