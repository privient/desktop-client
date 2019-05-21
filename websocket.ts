import { BrowserWindow } from "electron";
import * as WebSocket from 'ws';

const IPCEvent = {
    DATA: "data",
    SOCKETSTATUS: "socketstatus",
    UPDATEDATA: "updatedata"
}

export class WebsocketService {
    wss: any;
    window: BrowserWindow;

    constructor(websocketPort: number, electronWindow: BrowserWindow) {
        this.wss = new WebSocket.Server({ port: websocketPort });
        this.window = electronWindow;
        this.StartWebsocket();
    }

    private StartWebsocket() {
        this.wss.on('connection', (ws, req) => {
            var ip = req.connection.remoteAddress;
            if (ip !== "::1") return;

            ws.send('Connected Successfully');
            this.window.webContents.send('socketstatus', 'Connected');

            ws.on('message', (message) => {
                try {
                    var result = JSON.parse(message);
                    this.window.webContents.send(result.route, result.data);
                } catch(err) {
                    console.log('Failed to parse JSON data.');
                    ws.send('Failed to parse JSON data.');
                }
            });

            ws.on('close', () => {
                this.window.webContents.send('socketstatus', 'Disconnected');
            });
        });
    }

    /*
    OnConnection(ws, req) {
        // Only allow localhost connections.
       

        
        //this.IPCSend(IPCEvent.DATA, 'IPC Connected');

        ws.on('message', function incoming(message) {
            this.OnMessage(message);
        });
        ws.on('close', this.OnClose);
    }

    IPCSend(ipcRoute, message) {
        this.window.webContents.send(ipcRoute, message);
    }

    OnMessage(message) {
        try {
            var jsonObject = JSON.parse(message);
            console.log(jsonObject);
            this.IPCSend('data', message);
            //this.IPCSend('data', message);
        } catch(err) {
            console.log('Failed to parse data.');
            console.log(err);
        }
    }

    OnClose() {
        console.log('Disconnected');
    }
    */
}

/* JSON Message Structure:


*/