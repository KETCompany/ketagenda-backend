const WebSocket = require("ws");
const http = require("http");
const socketPort = process.env.SOCKETPORT || 3001;

module.exports = {
    init(app) {
        socket = http.createServer(app);
        socket.listen(socketPort, () => {
            console.log(`socket server listening to http://localhost:${socketPort}`);
        });
        
        wss = new WebSocket.Server({ server: socket });
        clients = [];

        wss.on("connection", function (ws) {
            console.info("websocket connection open");
            // console.log(wss.clients);

            var timestamp = new Date().getTime();
            ws.send(JSON.stringify({ msgType: "onOpenConnection", msg: { connectionId: timestamp } }));
            ws.on("message", function (data, flags) {
                data = JSON.parse(data);
                if(data.msgType == 'init'){
                    clients[data.state.roomId] = ws;
                }
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                });
                console.log(clients);
            }).on("close", function () {
                console.log("websocket connection close");
            }).on("error", (err) => {
                console.log(err);
            });
        });
    }
}