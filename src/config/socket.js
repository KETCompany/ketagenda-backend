const WebSocket = require('ws');
const http = require('http');
const socketPort = process.env.SOCKETPORT || 3001;

const clients = [];

const init = (app) => {
  const socket = http.createServer(app);
  socket.listen(socketPort, () => {
    console.log(`socket server listening to http://localhost:${socketPort}`);
  });

  const wss = new WebSocket.Server({ server: socket });

  wss.on('connection', (ws) => {
    const timestamp = new Date().getTime();
    ws.send(JSON.stringify({ msgType: 'onOpenConnection', msg: { connectionId: timestamp } }));
    ws.on('message', (response) => {
      const responseData = JSON.parse(response);
      if (responseData.msgType === 'register') {
        clients.push({ key: responseData.displayKey, socket: ws });
      }
    }).on('close', res => clients.filter(value => value.socket._closeCode === res))
      .on('error', (err) => {
        console.log(err);
      });
  });
};

const sendMessage = (socketKeys, reservation) =>
  socketKeys
    .forEach(socketKey =>
      clients.filter(client => client.key === socketKey)
        .forEach(client =>
          client.socket.send(reservation)));

module.exports = {
  init,
  sendMessage,
};
