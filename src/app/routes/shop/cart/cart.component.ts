import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'shop-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {

  systeminfo: any;
  tssysteminfo: any;
  nserver: any;

  constructor(
    private http: _HttpClient
  ) {
    this.nserver = nodeSysServer();
   }

  ngOnInit() {
    this.systeminfo = this.nserver.getSystemInfo();
    var os = (<any>window).require('os');
    this.tssysteminfo = os.platform();
  }

  open(){
    this.nserver.openbaidu();
  }

  opennw(){
    nw.Window.open('https://www.mi.com/', {}, function (new_win) {
      // do something with the newly created window
  });
  }

}
