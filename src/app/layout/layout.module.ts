import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';

import { SettingDrawerComponent } from './default/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from './default/setting-drawer/setting-drawer-item.component';

const SETTINGDRAWER = [SettingDrawerComponent
  , SettingDrawerItemComponent
  , ChangePasswordComponent
  , HeaderUserComponent];

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  SidebarComponent,
  ...SETTINGDRAWER
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  HeaderStorageComponent,
  HeaderUserComponent
];

import { LayoutModule as CDKLayoutModule } from '@angular/cdk/layout';
import { LayoutSimpleComponent } from './simple/simple.component';
import { LayoutSimpleSidebarComponent } from './simple/sidebar/sidebar.component';
import { LayoutSimpleHeaderComponent } from './simple/header/header.component';
import { LayoutSimpleHeaderUserComponent } from './simple/header/components/user.component';
import { LayoutSimpleHeaderSearchComponent } from './simple/header/components/search.component';
import { ChangePasswordComponent } from './simple/change-password/change-password.component';

const SIMPLE = [
  LayoutSimpleSidebarComponent,
  LayoutSimpleHeaderComponent,
  LayoutSimpleHeaderUserComponent,
  LayoutSimpleHeaderSearchComponent,
  LayoutSimpleComponent,
];

// passport
import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [
  LayoutPassportComponent
];

@NgModule({
  imports: [SharedModule, CDKLayoutModule],
  entryComponents: SETTINGDRAWER,
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT,
    ...SIMPLE
  ],
  exports: [
    ...COMPONENTS,
    ...PASSPORT,
    ...SIMPLE
  ]
})
export class LayoutModule { }
