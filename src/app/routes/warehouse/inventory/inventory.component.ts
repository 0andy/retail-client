import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'warehouse-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less'],
})
export class WarehouseInventoryComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
