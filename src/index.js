import headerGen from './component/header.js';
import sliderGen from './component/slider.js';
import proportionGen from  './component/proportionBox.js';
import * as util from './util/util.js';
import config from './config/assign.js';

let header = headerGen('参数设置', ['header', 'test'], true, true);
let slider = sliderGen(config.minPlayer, config.maxPlayer, config.sliderLength, config.sliderStep, 'home-slider');
let proportionBox = proportionGen(8);
let input = document.createElement('input');
util.addClass(input, ['input']);
input.value = config.minPlayer;

let button = document.createElement('button');
util.addClass(button, ['assign']);
button.innerText = '开始游戏';
button.onclick = function () {
  let name = prompt('请输入昵称');
  window.location = `page/room/waitingRoom.html?name=${name}&number=${input.value}`;
};

document.body.appendChild(header.getElement());
document.body.appendChild(proportionBox.getElement());
document.body.appendChild(slider.getElement());
document.body.appendChild(input);
document.body.appendChild(button);


input.onchange = function () {
  slider.value = input.value;
};

slider.addEventListener('change', function () {
  input.value = ~~slider.value;
  proportionBox.set(input.value);
});

proportionBox.addEventListener('set', function () {
  this.set(input.value);
});
