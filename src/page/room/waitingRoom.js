import headerGen from '../../component/header.js';
import {getParams} from "../../util/util.js";
import {ajax} from "../../util/ajax.js";
import base from '../../util/base.js';
import {isArray, addClass, appendChildren} from "../../util/util.js";
import label from '../../component/promptLabel.mjs';

export default function () {
  let obj = Object.create(base);
  obj.eventList = [];
  const wsurl = 'ws://192.168.1.11:3000';
  const url = 'http://192.168.1.11:8080';
  let header = headerGen('Room', 'header', true, false);
  let name = getParams(window.location.search).name;
  let number = getParams(window.location.search).number;
  let list = document.createElement('ul');
  let doc = document.createElement('div');
  let prompt = label('');

  function getElement() {
    return doc;
  }

  function remove() {
    doc.remove();
  }

  function run() {
    appendChildren(doc, header.getElement(), list);
    appendChildren(document.body, doc);
    ajax(`${url}/setPlayers?name=${name}&number=${number}`, 'GET').then(data => {
      console.log(data);
    });

    let ws = new WebSocket(wsurl);
    ws.onopen = function () {
      ws.send(name);
    };
    ws.onmessage = async function (data) {
      let res;
      try {
        res = JSON.parse(data.data);
        console.log(res);
        /**
         * data.data = {
         *   players: Arrays
         *   status: String
         *   msg: name
         * }
         */
        if (isArray(res.players)) {
          while (list.children.length) {
            list.firstElementChild.remove();
          }
          let count = 1;
          for (let i of res.players) {
            let li = document.createElement('li');
            addClass(li, ['player-list', 'list-item']);
            li.innerHTML = `
          <div class="list-title">玩家${count++}</div>
          <div class="list-name">${i.name}</div>
        `;
            list.appendChild(li);
          }

          if (res.status === 'join') {
            prompt.setText(`welcome ${res.msg} to join the game!`);
          } else {
            prompt.setText(`player ${res.msg} quit the game`);
          }
          prompt.show(3000);
          // startGame!
          if (res.isStart) {
            let startGame = function () {
              return new Promise(resolve => {
                setTimeout(() => {
                  prompt.setText('Ready? The game is about to start.');
                  prompt.show();
                }, 3500);
                setTimeout(() => {
                  resolve()
                }, 6500);
              });
            };
            await startGame();
            obj.dispatchEvent('startGame');
          }
        }
      } catch (e) {
        console.warn('data不是JSON字符串');
        console.warn(e);
        console.log(typeof data.data);
      }
    };
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    },
    remove: {
      value: remove,
      writable: false,
      configurable: false,
      enumerable: true
    },
    run: {
      value: run,
      writable: false,
      configurable: false,
      enumerable: true
    }
  });
  return obj;
}
