import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
