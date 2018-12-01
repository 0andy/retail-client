import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'warehouse-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.less'],
})
export class WarehouseWaterComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
