import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { SystemUserComponent } from './user/user.component';
import { SystemLogComponent } from './log/log.component';
import { SystemConfigComponent } from './config/config.component';
import { SystemRoutingModule } from './system-routing.module';
import { SaveShopUserComponent } from './user/save-user/save-user.component';
//import { ShopUserService } from 'app/services/system';

const COMPONENT = [
    SystemUserComponent,
    SystemLogComponent,
    SystemConfigComponent,
    SaveShopUserComponent
];

const COMPONENT_NOROUNT = [
  SaveShopUserComponent
];

@NgModule({
  imports: [CommonModule, SharedModule, SystemRoutingModule],
  providers: [ 
  //  ShopUserService 
  ],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class SystemModule {}
