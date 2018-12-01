import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'warehouse-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.less'],
})
export class WarehouseStockComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
