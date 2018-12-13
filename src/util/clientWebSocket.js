export default function (url, message, callback) {
  const ws = new WebSocket(url);
  ws.addEventListener('open', function () {
    ws.send(message);
  });
  ws.addEventListener('message', function (message) {
    callback(message);
  });
  return ws;
}
