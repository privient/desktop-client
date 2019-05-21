import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IPCRouter } from '../../services/IPCRouter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  IPCRouter: IPCRouter;

  constructor(private ipcRouter: IPCRouter) { 
    this.IPCRouter = ipcRouter;
  }

  ngOnInit() { }
}
