import { defaults } from '../defaults.mjs';
import { xutils } from './xutils.mjs';
import { stream } from './stream.mjs';

const ls = xutils.ls;

let navigate = {},
paths = [];

function Router(cnf) {
  this.settings = cnf;

  let settings = this.settings,
  x = ls.get(settings.storage.prefix)
  if (!x || x === '') {
    ls.set(settings.storage.prefix, {})
  }

  let init = settings.init;
  if(init){
    this.init = settings.init
  }

}

Router.prototype = {
  on(dest, fn) {
    navigate[dest] = fn;
    return this;
  },
  off(dest, cb) {
    delete navigate[dest];
    return this;
  },
  back() {
    let pf = this.settings.storage.prefix,
    r = ls.get(pf),
    current = ls.get(pf +'_current'),
    prev = ls.get(pf +'_prev');

    if(current === prev || !prev || typeof prev !== 'string' || !r[prev]){
      return;
    }

    this.rout(prev, r[prev])
  },
  rout(dest, data){
    let pf = this.settings.storage.prefix,
    next = dest;

    ls.set(pf +'_state', data || {});
    ls.set(pf +'_current', next);
    location.hash = dest;
    return this
  },
  routfn() {
    let settings = this.settings,
    pf = settings.storage.prefix,
    dest = location.hash.slice(1),
    data = ls.get(pf +'_state'),
    params;
    data = {data: data};
    if(settings.params){
      params = xutils.parse_params(dest);
      dest = params.dest;
      data.params = params.params;
    }

    if (dest === settings.error) {
      navigate[dest](data, stream)
      return;
    }

    if (dest === settings.base_path && !data) {
      data = {data: settings.base_data};
    }

    let before = settings.each.before,
    after = settings.each.after,
    r = ls.get(settings.storage.prefix),
    current = ls.get(pf +'_current');

    if (before && typeof before === 'function') {
      if (!before(dest)) {
        return;
      };
    }

    let loc = location;

    data.href = loc.href;
    data.host = loc.host;
    data.path = loc.hash.slice(1);

    try {
      navigate[dest](data, stream);
      r[dest] = {
        date: Date.now() + settings.storage.max_age,
        data: data
      }

      ls.set(pf, r);
      ls.set(pf +'_prev', current);

    } catch (err) {
      if(this.settings.verbose){
        console.error(err)
      }
      return navigate[this.settings.error]({data:{
        dest: dest,
        msg: 'not found',
        code: 404
      }}, stream);

    }

    if (after && typeof after === 'function') {
      after(dest);
    }
  },
  listen() {
    let settings = this.settings,
    routfn = this.routfn;

    let dest = location.hash.slice(1),
    pf = settings.storage.prefix,
    params;

    if(settings.params){
      params = xutils.parse_params(dest);
      dest = params.dest;
      params = params.params;
    }



    ls.set(pf +'_current', dest);

    if (location.href !== settings.origin) {
      let r = ls.get(pf),
      dnow = Date.now();

      if (r[dest]) {
        if (r[dest].date && typeof r[dest].date === 'number' && r[dest].date > dnow) {
          if(settings.params && params){
            r[dest].data.params = params
          }
          navigate[dest](r[dest].data, stream);
        } else {
          this.rout(settings.base_path, settings.base_data, stream);
          delete r[dest];
          ls.set(pf, r);
        }
      } else {
        this.rout(settings.base_path, settings.base_data, stream);
      }
    } else {
      this.rout(settings.base_path, settings.base_data, stream);
    }

    return this;
  },
  validate() {
    let pf = this.settings.storage.prefix,
    r = ls.get(pf),
    dnow = Date.now();
    try {
      Object.keys(r).forEach(function(key) {
        if (key.date < dnow){delete r[key];}
      });
      ls.set(pf, r);
    } catch (err) {
      console.error(err)
    } finally {
      return this;
    }
  }
};

let router = new Router(defaults);

window.onhashchange = function(){
  router.routfn()
}

export { router, stream, defaults, navigate }
