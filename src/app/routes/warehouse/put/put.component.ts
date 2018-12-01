import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'warehouse-put',
  templateUrl: './put.component.html',
  styleUrls: ['./put.component.less'],
})
export class WarehousePutComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
