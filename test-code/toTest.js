import Property from './Property';

// Backbone styles
// https://github.com/artf/grapesjs/blob/dev/src/style_manager/model/PropertyComposite.js
export default Property.extend({});

// single initi API call
//https://github.com/BrowserSync/browser-sync/blob/master/examples/proxy.middleware.js

module.exports = function(size) {
  size = size || 21;
  var id = '';
  var bytes = crypto.getRandomValues(new Uint8Array(size));
  while (0 < size--) {
    id += url[bytes[size] & 63];
  }
  return Promise.resolve(id);
};

// Fine tune IIFE https://github.com/aFarkas/lazysizes/blob/gh-pages/src/lazysizes-core.js (this one should not saved);
// More IIFE https://github.com/axios/axios/blob/master/lib/helpers/cookies.js

// Investigate why paperjs/paper.js wont parse
