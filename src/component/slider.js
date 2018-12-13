import * as util from '../util/util.js'
import base from '../util/base.js';

export default function (min, max, length = 200, step = 1, className) {
  let range = max - min;
  let _step = range / length;
  let obj = Object.create(base);
  let value = min;
  obj.eventList = [];
  let doc = document.createElement('div');
  util.addClass(doc, ['slider', className]);
  let minusButton = document.createElement('div');
  util.addClass(minusButton, ['minus-btn']);
  minusButton.addEventListener('touchstart', function () {
    value = value - step;
    if (value <= min) {
      value = min;
    }
    obj.dispatchEvent('change', -step);
    slider.style.left = (value - min) / _step + 'px';
    bar.style.background = `linear-gradient(to right, #ff7c7c,#4f6efb ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b)`
  });

  let plusButton = document.createElement('div');
  util.addClass(plusButton, ['plus-btn']);
  plusButton.addEventListener('touchstart', function () {
    value += step;
    if (value >= max) {
      value = max;
    }
    obj.dispatchEvent('change', step);
    slider.style.left = (value - min) / _step + 'px';
    bar.style.background = `linear-gradient(to right, #ff7c7c,#4f6efb ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b)`
  });

  let sliderWrapper = document.createElement('div');
  util.addClass(sliderWrapper, ['slider-wrapper']);

  let bar = document.createElement('div');
  util.addClass(bar, ['bar']);
  bar.style.width = length + 'px';

  let slider = document.createElement('div');
  util.addClass(slider, ['slider']);
  slider.addEventListener('touchstart', function (e) {
    e.stopPropagation();
    let offsetX = slider.offsetLeft;
    let initPos = e.targetTouches[0].clientX;
    let oldDistance = 0;
    let move = function (ev) {
      ev.preventDefault();
      let moveDistance = (ev.targetTouches[0].clientX - initPos);
      let distance = offsetX + moveDistance;
      if (distance <= 0) {
        distance = 0;
      } else if (distance >= length) {
        distance = length;
      }
      let changeValue = +((distance - oldDistance) * _step).toFixed(2);
      obj.dispatchEvent('change', changeValue);
      value = min + slider.offsetLeft * _step;
      slider.style.left = distance + 'px';
      bar.style.background = `linear-gradient(to right, #ff7c7c,#4f6efb ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b)`
      oldDistance = distance;
    };
    let up = function () {
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
    document.addEventListener('touchmove', move, {passive: false});
    document.addEventListener('touchend', up);
  });

  util.appendChildren(sliderWrapper, bar, slider);
  util.appendChildren(doc, minusButton, sliderWrapper, plusButton);


  function getElement() {
    return doc;
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    },
    value: {
      get () {
        return value;
      },
      set (newValue) {
        if (newValue < min || newValue > max) return ;
        value = +newValue;
        slider.style.left = (newValue - min) / _step + 'px';
        bar.style.background = `linear-gradient(to right, #ff7c7c,#4f6efb ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b ${slider.offsetLeft / bar.clientWidth * 100}%,#f9c39b)`
      }
    }
  });
  return obj;
}
