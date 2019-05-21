import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '../../ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _ipc: IpcService) { 
    this.socketListener(_ipc);
  }

  ngOnInit() { }

  private socketListener(ipc: IpcService) {
    ipc.on('data', (event: Electron.IpcMessageEvent, arg: any) => {
      console.log(arg);
    });
  }
}
