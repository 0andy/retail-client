import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './index/index.component';
import { MemberService } from 'app/services/member/member.service';

const COMPONENT = [
  MemberComponent,
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, MemberRoutingModule],
  providers: [ MemberService ],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class MemberModule {}
