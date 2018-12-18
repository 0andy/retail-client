import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './index/index.component';
import { MemberService } from 'app/services/member/member.service';
import { MemberDetailComponent } from './index/member-detail/member-detail.component';
import { MemberConfirmModule } from '../common/member-confirm/member-confirm.module';

const COMPONENT = [
  MemberComponent,
  MemberDetailComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, MemberRoutingModule, MemberConfirmModule],
  providers: [MemberService],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class MemberModule { }
