import { Injectable } from '@angular/core';
import { IpcService } from '../ipc.service';

@Injectable({
    providedIn: 'root'
})
export class IPCRouter {
    messages: any = { data: {} }
    
    constructor(ipc: IpcService) {
        console.log('IPCRouter started.');
        ipc.on('data', this.OnData);
        ipc.on('socketstatus', this.OnSocketStatus);
        ipc.on('updatedata', this.OnUpdateData);
    }

    private OnData(event: Electron.IpcMessageEvent, message: any) {
        this.messages.data["data"] = message;
    }

    private OnSocketStatus(event: Electron.IpcMessageEvent, message: any) {
        this.messages.data["socketstatus"] = message;
    }

    private OnUpdateData(event: Electron.IpcMessageEvent, message: any) {
        this.messages.data["updatedata"] = message;
    }
}