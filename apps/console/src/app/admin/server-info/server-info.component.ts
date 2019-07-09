import { IServerInfo } from '@dinivas/model';
import { ApiInfoService } from './../../api-info.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dinivas-server-info',
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.scss']
})
export class ServerInfoComponent implements OnInit {
  serverInfo: IServerInfo;

  constructor(private readonly apiInfoService: ApiInfoService) {}

  ngOnInit() {
    this.apiInfoService
      .getApiServerInfo()
      .subscribe((serverInfo: IServerInfo) => (this.serverInfo = serverInfo));
  }
}
