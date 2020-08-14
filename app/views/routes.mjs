import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { router } from '../modules/jsnode.mjs';

const routes = {
  terms(stream, data){
    return x('p', data.msg)
  },
  contact(stream, data){
    return x('p', data.msg)
  }
}

export { routes }
