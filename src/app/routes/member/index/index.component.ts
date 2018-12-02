import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'member-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class MemberComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
