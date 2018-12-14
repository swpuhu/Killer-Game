import * as util from '../util/util.js';
import base from '../util/base.js';

const doc = document.createElement('div');
util.addClass(doc, ['label', 'prompt-label']);
const content = document.createElement('div');
util.addClass(content, 'label-content');
doc.appendChild(content);
doc.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%,' +
  ' -50%); width: 100%; text-align: center;';

function getElement() {
  return doc;
}

function show() {
  document.body.appendChild(doc);
  doc.addEventListener('webkitAnimationEnd', function () {
    doc.remove();
  })
}

export default function (text) {
  let obj = Object.create(base);
  content.innerText = text;

  function setText(text) {
    content.innerText = text;
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      configurable: false,
      writable: false,
      enumerable: true
    },
    show: {
      value: show,
      configurable: false,
      writable: false,
      enumerable: true
    },
    setText: {
      value: setText,
      configurable: false,
      writable: false,
      enumerable: true
    }
  });

  return obj;
}

