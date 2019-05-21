"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var IPCEvent = {
    DATA: "data",
    SOCKETSTATUS: "socketstatus",
    UPDATEDATA: "updatedata"
};
var WebsocketService = /** @class */ (function () {
    function WebsocketService(websocketPort, electronWindow) {
        this.wss = new WebSocket.Server({ port: websocketPort });
        this.window = electronWindow;
        this.StartWebsocket();
    }
    WebsocketService.prototype.StartWebsocket = function () {
        var _this = this;
        this.wss.on('connection', function (ws, req) {
            var ip = req.connection.remoteAddress;
            if (ip !== "::1")
                return;
            ws.send('Connected Successfully');
            _this.window.webContents.send('socketstatus', 'Connected');
            ws.on('message', function (message) {
                try {
                    var result = JSON.parse(message);
                    _this.window.webContents.send(result.route, result.data);
                }
                catch (err) {
                    console.log('Failed to parse JSON data.');
                    ws.send('Failed to parse JSON data.');
                }
            });
            ws.on('close', function () {
                _this.window.webContents.send('socketstatus', 'Disconnected');
            });
        });
    };
    return WebsocketService;
}());
exports.WebsocketService = WebsocketService;
/* JSON Message Structure:


*/ 
//# sourceMappingURL=websocket.js.map