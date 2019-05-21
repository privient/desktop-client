import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '../../ipc.service';
import { IpcMessageEvent } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages = {};
  
  constructor(private readonly _ipc: IpcService, private cdr: ChangeDetectorRef) { 
    _ipc.on('data', (event: IpcMessageEvent, arg: any) => {
      console.log(arg);
      this.messages['data'] = arg;
      cdr.detectChanges();
    });

    _ipc.on('socketstatus', (event: IpcMessageEvent, arg: any) => {
      this.messages['socketstatus'] = arg;
      console.log(arg);
      cdr.detectChanges();
    });

    _ipc.on('updatedata', (event: IpcMessageEvent, arg: any) => {

    });
  }

  ngOnInit() { }
}
