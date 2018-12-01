import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';

import { SystemUserComponent } from './user/user.component';
import { SystemLogComponent } from './log/log.component';
import { SystemConfigComponent } from './config/config.component';

const routes: Routes = [
  { path: 'user', component: SystemUserComponent },
  { path: 'log', component: SystemLogComponent },
  { path: 'config', component: SystemConfigComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
