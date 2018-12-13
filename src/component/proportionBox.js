import * as util from '../util/util.js';
import base from '../util/base.js';
import config from "../config/assign.js";

function list (num, className, title) {
  let obj = {};
  let _num = num;
  let doc = document.createElement('li');
  util.addClass(doc, [className]);

  let avatar = document.createElement('div');
  util.addClass(avatar, ['avatar']);

  let name = document.createElement('div');
  name.innerText = title;

  let number = document.createElement('div');
  number.innerText = _num + ' 人';

  util.appendChildren(doc, avatar, name, number);
  function getElement() {
    return doc;
  }
  Object.defineProperties(obj, {
    getElement: {
      value: getElement
    },
    value: {
      get () {
        return _num;
      },
      set (newValue) {
        _num = newValue;
        number.innerText = newValue + ' 人';
      }
    }
  });
  return obj;
}

export default function () {
  let obj = Object.create(base);
  let doc = document.createElement('div');
  util.addClass(doc, ['player-proportion']);

  let slide = document.createElement('div');
  util.addClass(slide, ['player-slide']);
  slide.innerText = '玩家配比';

  let rightSlide = document.createElement('div');
  util.addClass(rightSlide, ['right-slide']);

  let content = document.createElement('div');
  util.addClass(content, ['proportion-content']);
  let killer = list(1, 'killer', '杀手');
  let citizen = list (2, 'citizen', '平民');
  util.appendChildren(content, killer.getElement(), citizen.getElement());

  let footer = document.createElement('div');
  util.addClass(footer, ['proportion-footer']);

  let footerContent = document.createElement('div');
  util.addClass(footerContent, ['footer-content']);
  footerContent.innerText = '点我设置';
  util.appendChildren(footer, footerContent);
  util.appendChildren(rightSlide, content, footer);
  util.appendChildren(doc, slide, rightSlide);

  footerContent.addEventListener('click', function (e) {
    obj.dispatchEvent('set', e);
  });

  function getElement() {
    return doc;
  }

  function set(num) {
    if (num < config.minPlayer || num > config.maxPlayer) {
      return;
    }
    if (num <= 4) {
      killer.value = 1;

    } else if (num > 4 && num <= 6) {
      killer.value = 2;
    } else {
      killer.value = 3;
    }
    citizen.value = num - killer.value;
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    },
    set: {
      value: set,
      writable: false,
      configurable: false,
      enumerable: true
    }
  });

  return obj;
}
