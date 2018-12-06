import { Component, OnInit } from '@angular/core';
import { ShopUserService } from 'app/services/system/shop-user.service';

@Component({
  selector: 'system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent implements OnInit {

  constructor(private shopUserService: ShopUserService) { }

  ngOnInit() {
  }

  createTB(){
    this.shopUserService.createTable();
  }

}
