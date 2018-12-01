import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'system-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less'],
})
export class SystemConfigComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
