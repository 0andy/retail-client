import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

import { CartComponent } from './shop/cart/cart.component';
import { CommonServiceModule } from 'app/services/common/common-service.module';
import { AuthenticationComponent } from './passport/authentication/authentication.component';
import { MemberConfirmModule } from './common/member-confirm/member-confirm.module';
import { AltNumComponent } from './shop/alt-num/alt-num.component';

const COMPONENTS = [
  CartComponent,
  AltNumComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  AuthenticationComponent
];
const COMPONENTS_NOROUNT = [
  AuthenticationComponent
];

@NgModule({
  imports: [SharedModule, CommonServiceModule, RouteRoutingModule, MemberConfirmModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
