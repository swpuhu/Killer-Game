import headerGen from '../../component/header.js';
import client from '../../util/clientWebSocket.js';
import {getParams} from "../../util/util.js";
import {ajax} from "../../util/ajax.js";
import {isArray, addClass} from "../../util/util.js";
import label from '../../component/promptLabel.mjs';

const wsurl = 'ws://192.168.1.11:3000';
const url = 'http://192.168.1.11:8080';
let header = headerGen('Room', 'header', true, false);
document.body.appendChild(header.getElement());
let name = getParams(window.location.search).name;
let number = getParams(window.location.search).number;
let list = document.createElement('ul');

ajax(`${url}/setPlayers?name=${name}&number=${number}`, 'GET').then(data => {
  console.log(data);
});

ajax(`${url}/joinGame?name=${name}`, 'POST').then(data => {
  let prompt = label(data.msg);
  prompt.show(3000);
});

let ws = new WebSocket(wsurl);
ws.onopen = function () {
  ws.send(name);
};
ws.onmessage = function (data) {
  let res;
  try {
    res = JSON.parse(data.data);
    console.log(res);
    if (isArray(res)) {
      while(list.children.length) {
        list.firstElementChild.remove();
      }
      let count = 1;
      for (let i of res) {
        let li = document.createElement('li');
        addClass(li, ['player-list', 'list-item']);
        li.innerHTML = `
          <div class="list-title">玩家${count++}</div>
          <div class="list-name">${i.name}</div>
        `;

        list.appendChild(li);
      }
      document.body.appendChild(list);
    }
  } catch (e) {
    console.warn('data不是JSON字符串');
    console.warn(e);
    console.log(typeof data.data);
  }
};

