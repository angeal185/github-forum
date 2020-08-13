import { x, xrender } from './modules/xscript.mjs';
import { xutils } from './modules/xutils.mjs';
import { xviews } from './views/xviews.mjs';
import { xdata } from './data/xdata.mjs';

//cached reference to app-main object
let app_main = x('div', {class: 'col-lg-9'});

// app default functions
let defaults = Object.assign(xdata.default, xdata.app, {
  app_main: app_main,
  each: {
    before: function(dest) {
      // return false;  cancel rout
      return true; // continue to rout
    },
    after: function(dest) {
      let title = dest.slice(1),
      evt = new CustomEvent('bc-ud', {detail: title});
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      document.title = title;
      window.dispatchEvent(evt);
    }
  },
  init: function(){
    xutils.build(xdata, xviews['build'](app_main));

    let title = location.hash.slice(2),
    evt = new CustomEvent('bc-ud', {detail: title});
    document.title = title
    window.dispatchEvent(evt)

    return this;
  },
  render: function(stream, path, data, cb){
    xrender(stream, xviews[path], data, xdata[path], cb);
    return this;
  }
})

export { defaults, app_main }
