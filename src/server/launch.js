let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');
let routes = require ('./router').routes;
let info = require('./router').info;
let config = require('../config/common.js');
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 3000});
let number = 0;

let root = path.resolve(__dirname, '../');
console.log(root);
let server = http.createServer(async function (request, response) {
  let pathname = url.parse(request.url).pathname;
  if (pathname === '/') {
    pathname = config.index;
  }
  // console.log(pathname);
  let filepath = path.join(root, pathname);
  if (/dist/.test(pathname)) {
    filepath = path.resolve(__dirname, '../../' + pathname);
  }
  // console.log(new Date() + ' ' + filepath + ' ' + request.method);
  await readFile(request, response, filepath)
    .then(() => {
  }).catch(e => {
    if (routes[pathname]) {
      routes[pathname](request, response, wss);
    } else {
      console.error(e);
      response.end();
    }
  });
}).listen(8080);

console.log('server running on: http://192.168.1.11:8080');
console.log('webSocket running on ws://192.168.1.11:3000');

function noop () {
}
function heartbeat() {
  this.isAlive = true;
}

let wsClients = [];
wss.on('connection', function (ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('close', function () {
    wsClients.forEach((item, index, arr) => {
      if (item.name === ws.name) {
        wsClients.splice(index, 1);
        console.log(wsClients);
        number--;
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            let res = {
              players: wsClients,
              status: 'quit',
              msg: ws.name,
              isStart: false,
              number: number
            };
            client.send(JSON.stringify(res));
          }
        });
      }
      // console.log(wsClients);
    });
  });

  ws.on('message', function (message) {

    let flag = true;
      wsClients.forEach(item => {
        if (item.client === ws || item.name === message) {
          flag = false;
        }
      });
      if (flag) {
        ws.name = message;
        wsClients.push({
          name: message
        });
        number++;
      }
    console.log(info.number, number);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          let res = {
            players: wsClients,
            status: 'join',
            msg: message,
            isStart: +number === +info.number,
            number: number
          };
          client.send(JSON.stringify(res));
        }
      });

  });
});


setInterval(function () {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      console.log('lose connection');
      return ws.terminal();
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 3000);

function readFile(request, response, url) {
  return new Promise(((resolve, reject) => {
    fs.stat(url, function (err, stats) {
      if (!err && stats.isFile()) {
        if (/\.js|\.mjs$/.test(url)) {
          response.writeHead(200, {'Content-Type': 'text/javascript'});
        } else if (/\.css$/.test(url)) {
          response.writeHead(200, {'Content-Type': 'text/css'});
        }
        else {
          response.writeHead(200);
        }
        fs.createReadStream(url).pipe(response);
        resolve('success');
      } else {
        response.writeHead(404);
        reject(url + 'not exist');
      }
    })
  }))
}
