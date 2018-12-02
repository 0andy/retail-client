import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'shop-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {

  systeminfo: any;
  nserver: any;

  constructor(
    private http: _HttpClient
  ) {
    this.nserver = nodeSysServer();
   }

  ngOnInit() {
    this.systeminfo = this.nserver.getSystemInfo();
  }

  open(){
    this.nserver.openbaidu();
  }

}
