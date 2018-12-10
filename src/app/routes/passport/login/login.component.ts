import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core/startup/startup.service';
import { ShopUserService } from 'app/services/system';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService, ShopUserService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;

  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    public msg: NzMessageService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    private shopUserService: ShopUserService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  // #endregion

  // #region get captcha
  count = 0;
  interval$: any;
  // #endregion

  submit() {
    this.error = '';
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) return;
    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    /* this.http
       .post('/login/account?_allow_anonymous=true', {
         type: this.type,
         userName: this.userName.value,
         password: this.password.value,
       })
       .subscribe((res: any) => {
         if (res.msg !== 'ok') {
           this.error = res.msg;
           return;
         }
       
    // 清空路由复用信息
    this.reuseTabService.clear();
    // 设置用户Token信息
    //this.tokenService.set(res.user);
    var user = {
      token: '123456789',
      name: "admin",
      email: "admin@qq.com",
      id: 10000,
      time: +new Date(),
    };
    this.tokenService.set(user);
    // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    this.startupSrv.load().then(() => this.router.navigate(['/']));
    });*/

    this.shopUserService.login(this.userName.value, this.password.value).then((res) => {
      if (res.code == 0) {
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        var user = {
          token: '!@#123456^&*(123456',
          avatar: './assets/avatar.jpg',
          account: res.data.account,
          name: res.data.name,
          role: res.data.role,
          id: res.data.id,
          time: + new Date(),
        };
        this.tokenService.set(user);
        this.settingsService.setUser(user);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          //开启全屏
          //nw.Window.get().enterFullscreen();
          this.router.navigate(['/']);
        });
      } else {
        this.error = res.msg;
        return;
      }
    });
  }
  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
