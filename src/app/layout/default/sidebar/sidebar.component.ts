import { Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService, ModalHelper } from '@delon/theme';
import { ChangePasswordComponent } from 'app/layout/simple/change-password/change-password.component';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(
    public settings: SettingsService,
    public msgSrv: NzMessageService,
  ) { }
}
