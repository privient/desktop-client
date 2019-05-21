import { BrowserWindow } from "electron";
import { Storage } from "./storage";
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

            this.window.webContents.send('socketstatus', 'Connected');
            var readyState = {
                route: 'SocketReady',
                message: 'Ready!'
            }
            ws.send(JSON.stringify(readyState));

            ws.on('message', (message) => {
                try {
                    var result = JSON.parse(message);

                    if (result.route == "GetData") {
                        GetData(result.data).then(
                            (result) => {
                                var jsonResult = JSON.stringify(result);
                                ws.send(jsonResult);
                            },
                            (error) => {
                                var jsonResult = JSON.stringify(error);
                                ws.send(jsonResult);
                            }
                        )
                        return;
                    }

                    if (result.route == "SetData") {
                        if (result.update) {
                            SetData(result.data);
                            console.log(result.data);
                        } else {
                            SetData(result.data).then(
                                (res) => {
                                    var jsonResult = JSON.stringify(res);
                                    ws.send(jsonResult);
                                }
                            );
                        }

                        
                        return;
                    }

                    this.window.webContents.send(result.route, result.data);
                } catch(err) {
                    console.log('Failed to parse JSON data.');
                    // ws.send('Failed to parse JSON data.');
                }
            });

            ws.on('close', () => {
                this.window.webContents.send('socketstatus', 'Disconnected');
            });
        });
    }
}

function SetData(msg: any) {
    return new Promise((resolve, reject) => {
        var result = Storage.SetData(msg.appname, msg.data);
        
        var obj = {
            route: 'ExistingData',
            data: {
                appname: msg.appname,
                data: msg.data
            }
        }
        
        return resolve(obj);
    });
}

async function GetData(msg) {
    return new Promise((resolve, reject) => {
        console.log(msg);
        Storage.GetData(msg.appname).then(
            (result) => {
                var obj = {
                    route: 'ExistingData',
                    data: {
                        appname: msg.appname,
                        data: result,
                    }
                }
                return resolve(obj);
            }, 
            (error) => {
                var obj = {
                    route: 'NewData',
                    data: {
                        message: 'Failed to retrieve.'
                    } 
                }
                return reject(obj);
            }
        );
    })
}

/* JSON Message Structure:
    // Standard Messages:
    {
        route: 'WhereItGoes',
        data: {
            // All data
        }
    }

    // Saving Data:
    {
        route: 'SetData',
        data: {
            appname: 'xyz',
            block: {}
        }
    }

    // Getting Data:
    {
        route: 'GetData',
        data: {
            appname: 'xyz'
        }
    }


*/