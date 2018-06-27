const WebSocket = require('ws');
const http = require('http');
const { socketPort } = require('./config').server;

const Logger = require('../api/utils/logger');

const clients = [];

const init = (app) => {
  const socket = http.createServer(app);
  socket.listen(socketPort, () => {
    Logger.info(`socket server listening to http://localhost:${socketPort}`);
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
        Logger.error(err);
      });
  });
};

const sendMessage = (socketKeys, bookings) => {
  socketKeys
    .forEach(socketKey =>
      clients.filter(client => client.key === socketKey)
        .forEach(client => {
          if (client.socket.readyState != WebSocket.OPEN) {
            console.error('Socket not opened. Expected state is OPEN but current state is set to ' + client.socket.readyState.toString());
          } else {
            client.socket.send(bookings)
          }
        }));
      }

module.exports = {
  init,
  sendMessage,
};
