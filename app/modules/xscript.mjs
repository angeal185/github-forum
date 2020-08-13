// clone dom object cache

let cobj = {
  txt: document.createTextNode('')
},
arr = ['div','span','h4','h5','p','img']

for (let i = 0; i < arr.length; i++) {
  cobj[arr[i]] = document.createElement(arr[i])
}

arr = null;

const xu = {
  ctxt(l){
    let t = cobj.txt.cloneNode(false);
    t.textContent = l;
    return t;
  },
  isnd(i) {
    return i && i.nodeName && i.nodeType
  }
}

function xrender(stream, xpath, data, xdata, cb){
  try {
    if(typeof data === 'object'){
      data = Object.assign({}, xdata, data);
    } else {
      cb = data;
      data = xdata
    }
    stream.empty().append(xpath(stream, data));
    if(cb){cb(false)}
  } catch (err) {
    if(cb){cb(err)}
  }
}

function xfn(e, i) {
  let t = typeof i;
  if (t == 'string') {
    if(!e){
      if(!cobj[i]){
        cobj[i] = document.createElement(i);
      }
      e = cobj[i].cloneNode(false);
    } else {
      e.appendChild(xu.ctxt(i))
    }
  } else if(xu.isnd(i)) {
    e.appendChild(i)
  } else if(t == 'object') {
    let k = Object.keys(i), f;
    for (t = 0; t < k.length; t++){
      f = k[t];
      if(typeof i[f] == 'function') {
        e[f] = i[f];
      } else {
        e.setAttribute(k[t], i[f])
      }
    }

  } else if(t == 'function') {
    t = i();
    e.appendChild(xu.isnd(t) ? t : xu.ctxt(t));
  } else if(t == 'number' || t == 'boolean') {
    e.appendChild(xu.ctxt(i.toString()))
  }
  return e;
}

function x(){
  let arr = [...arguments],
  i = null;
  while (arr.length) {
    i = xfn(i, arr.shift());
  }
  return i;
}

export { x, xrender };
