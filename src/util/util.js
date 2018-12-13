function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

function isObject(arr) {
  return Object.prototype.toString.call(arr) === '[object Object]';
}

function isFunction(arr) {
  return Object.prototype.toString.call(arr) === '[object Function]';
}

function isString(arr) {
  return Object.prototype.toString.call(arr) === '[object String]';
}

function addClass (ele, className) {
  if (isArray(className) || isString(className)) {
    if (isArray(className)) {
      for (let i of className) {
        ele.classList.add(i);
      }
    } else {
      ele.classList.add(className);
    }
    return true;
  } else {
    throw new Error('className error!');
  }
}

function appendChildren(father, ...children) {
  for (let child of children) {
    father.appendChild(child);
  }
}

function getParams(string) {
  let s = string.replace(/\?/, '');
  let arr;
  let res = {};
  try {
    arr = s.split('&');
    for (let i of arr) {
      let sub = i.split('=');
      res[sub[0]] = sub[1];
    }
  } catch (e) {
    console.error(e);
  }
  return res;
}

export {isArray, isObject, isFunction, isString, addClass, appendChildren, getParams};
