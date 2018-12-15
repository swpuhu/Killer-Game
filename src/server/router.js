const fs = require('fs');
const querystring = require('querystring');
const url = require('url');
let players = [];
const WebSocket = require('ws');
let obj = {
  number: undefined
};
let routes = {
  '/test': function (request, response) {
    response.writeHead(200);
    let msg = {test: 'hello world'};
    response.write(JSON.stringify(msg));
    response.end();
  },
  '/setPlayers': function (request, response, wss) {
    const params = querystring.parse(url.parse(request.url).query);
    response.writeHead(200);
    if (obj.number === undefined) {
      obj.number = params.number;
      let msg = {msg: 'success'};
      response.write(JSON.stringify(msg));
    } else {
      let msg = {msg: `人数已设置为${obj.number}人。`};
      response.write(JSON.stringify(msg));
    }
    response.end();
    console.log();
  },
  '/joinGame': function (request, response, wss) {
    const params = querystring.parse(url.parse(request.url).query);
    let name = params.name;
    let flag = true;
    players.forEach(item => {
      if (item.name === name) {
        flag = false;
      }
    });
    flag && players.push({name: name, prepared: 0});
    response.writeHead(200, {'Content-Type': 'application/json'});
    let msg = {
      msg: 'welcome to join the game!'
    };
    function broadcast() {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(players));
          wss.removeListener('connection', broadcast);
        }
      });
    }
    wss.on('connection', broadcast);
    response.end(JSON.stringify(msg));
  },
  '/prepare': function (request, response, wss) {
    const params = querystring.parse(url.parse(request.url).query);
    let name = params.name;
    let index = players.indexOf(name);
    if (index > -1) {
      players[index].prepared = 1;
    }
    response.writeHead(200);
  }
};

function parseBody(body) {
  let arr = body.split('&');
  let res = {};
  for (let i of arr) {
    let entry = i.split('=');
    res[entry[0]] = entry[1];
  }
  return res;
}


module.exports.routes = routes;
module.exports.players = players;
module.exports.info = obj;
