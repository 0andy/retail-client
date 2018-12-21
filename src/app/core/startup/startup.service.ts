import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';

import { NzIconService, NzModalService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { wrapListenerWithDirtyAndDefault } from '@angular/core/src/render3/instructions';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    private modalService: NzModalService
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get('assets/tmp/app-data.json')
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([appData]) => {
        resolve(null);
        return [appData];
      })
    ).subscribe(([appData]) => {

      // application data
      const res: any = appData;
      // 应用信息：包括站点名、描述、年份
      this.settingService.setApp(res.app);
      // 用户信息：包括姓名、头像、邮箱地址
      this.settingService.setUser(res.user);
      // ACL：设置权限为全量
      this.aclService.setFull(true);
      // 初始化菜单
      this.menuService.add(res.menu);
      // 设置页面标题的后缀
      this.titleService.suffix = res.app.name;
    },
      () => { },
      () => {
        resolve(null);
      });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789'
    };
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    // 初始化菜单
    this.menuService.add([
      {
        text: '主导航',
        group: true,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' }
          },
          {
            text: '快捷菜单',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true
          }
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;

    resolve({});
  }

  private retailLoad(resolve: any, reject: any) {
    const app: any = {
      name: `优效零售`,
      description: `优秀高效`
    };
    //const user: any = {
    //name: 'Admin',
    //avatar: '',
    //email: 'admin@qq.com',
    //token: '123456789'
    //};
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    //this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    this.settingService.setLayout('fixed', true);

    //this.settingService.setLayout('collapsed', true);
    //'light' : 'dark'
    //this.settingService.setLayout('theme','light');
    // 初始化菜单
    this.menuService.add([
      {
        text: '优效零售终端',
        group: true,
        children: [
          {
            text: '收银台',
            link: '/shop/cart',
            icon: { type: 'icon', value: 'anticon anticon-shopping-cart' },
            shortcutRoot: true,
          },
          {
            text: '商品管理',
            link: '/product/index',
            icon: { type: 'icon', value: 'anticon anticon-gift' },
            shortcutRoot: true,
          },
          {
            text: '会员管理',
            link: '/member/index',
            icon: { type: 'icon', value: 'anticon anticon-idcard' },
            shortcutRoot: true,
          },
          {
            text: '仓库管理',
            link: '/warehouse',
            icon: { type: 'icon', value: 'anticon anticon-shop' },
            children: [
              {
                text: '商品入库',
                link: '/warehouse/put'
              },
              {
                text: '商品盘点',
                link: '/warehouse/inventory'
              },
              {
                text: '实时库存',
                // link: '/warehouse/stock'
                link: '/product/index/:stock',
              },
              {
                text: '仓库流水',
                link: '/warehouse/water'
              }
            ]
          },
          {
            text: '系统管理',
            link: '/system',
            icon: { type: 'icon', value: 'anticon anticon-laptop' },
            children: [
              {
                text: '系统用户',
                link: '/system/user'
              },
              {
                text: '系统设置',
                link: '/system/config'
              },
              {
                text: '系统日志',
                link: '/system/log'
              }
            ]
          }
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      //this.viaMock(resolve, reject);
      this.retailLoad(resolve, reject);

    });
  }

  winInit() {
    // 获取当前窗口的`Window`对象
    var win = nw.Window.get();
    let app = this;
    win.on('close', function () {
      this.hide(); // Pretend to be closed already
      app.tokenService.clear();//清除缓存 
      this.close(true); // then close it forcely
      /*app.modalService.confirm({
        nzTitle: '你确定要退出该系统吗？',
        nzContent: '',
        nzOnOk: () => {
          app.tokenService.clear();
          this.hide(); // Pretend to be closed already
          this.close(true); // then close it forcely
        }
      });*/
    });
  }
}
