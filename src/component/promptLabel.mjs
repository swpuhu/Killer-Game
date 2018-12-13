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

function show(duration = 2000) {
  document.body.appendChild(doc);
  doc.animate([
    {opacity: 0, transform: 'translate(-50%, -50%)', offset: 0},
    {opacity: 1, transform: 'translate(-50%, -50%)', offset: 0.2},
    {opacity: 1, transform: 'translate(-50%, -50%)', offset: 0.8},
    {opacity: 0, transform: 'translate(-50%, -200%)', offset: 1}
  ], {
    duration: duration,
    easing: 'ease'
  });
  setTimeout(() => {
    doc.remove();
  }, duration);
}

export default function (text) {
  let obj = Object.create(base);
  content.innerText = text;

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
    }
  });

  return obj;
}

