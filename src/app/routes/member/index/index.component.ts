import { Component, OnInit } from '@angular/core';
import { MemberService } from 'app/services/member/member.service';

@Component({
  selector: 'member-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class MemberComponent implements OnInit {

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    alert(100)
    this.memberService.getAll('0','10');
  }

}
