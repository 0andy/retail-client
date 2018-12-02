import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'system-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less'],
})
export class SystemLogComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
