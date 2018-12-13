import * as util from "../util/util.js";
import base from '../util/base.js';

export default function (title, className, left, right) {
  let doc = document.createElement('div');
  let obj = Object.create(base);
  obj.eventList = [];
  let titleEle = document.createElement('div');
  titleEle.classList.add('title');
  titleEle.innerText = title;
  let leftBtn = null;
  let rightBtn = null;

  if (util.isArray(className) || util.isString(className)) {
    if (util.isArray(className)) {
      for (let i of className) {
        doc.classList.add(i);
      }
    } else {
      doc.classList.add(className);
    }
  } else {
    throw new Error('className error!');
  }

  if (left) {
    leftBtn = document.createElement('div');
    leftBtn.classList.add('left-btn');
    leftBtn.onclick = function (e) {
      obj.dispatchEvent('leftClick', e);
    };
    doc.appendChild(leftBtn);
  }
  doc.appendChild(titleEle);
  if (right) {
    rightBtn = document.createElement('div');
    rightBtn.classList.add('left-btn');
    rightBtn.onclick = function (e) {
      obj.dispatchEvent('rightClick', e);
    };
    doc.appendChild(rightBtn);
  }
  function getElement() {
    return doc;
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    }
  });

  return obj;
}
