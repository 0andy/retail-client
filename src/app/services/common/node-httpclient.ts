import { Injectable } from '@angular/core';
import { Token } from '@angular/compiler';
import { SettingsService } from '@delon/theme';
import { ResultDto } from 'app/entities';


@Injectable()
export class NodeHttpClient {

    private http = (<any>window).require('http');
    private querystring = (<any>window).require('querystring');
    private hostname: string = 'localhost';
    private port: number = 21021;

    constructor(private settingsService: SettingsService) {
    }

    get(url: string, params?: { [key: string]: any }): Promise<ResultDto> {
        return this.requestByToken(url + this._formatUrl(params), "get", null);
    }

    post(url: string, body?: any, params?: { [key: string]: any }): Promise<ResultDto> {
        if (params) {
            url += this._formatUrl(params);
        }
        return this.requestByToken(url, "post", body);
    }

    requestByToken(url_: string, method: string, body?: any): Promise<ResultDto> {
        let token = this.settingsService.user['token'];
        if (!token) {
            return new Promise<ResultDto>((resolve, reject) => {
                this.authenticate().then((res) => {
                    if (res.code == 0) {
                        this.settingsService.user['token'] = res.data.accessToken;
                        this.request(url_, method, body, res.data.accessToken).then((res2) => {
                            resolve(res2);
                        });
                    } else {
                        reject(res);
                    }
                });
            });
        } else {
            return this.request(url_, method, body, token);
        }
    }

    request(url_: string, method: string, body?: any, token?: any): Promise<ResultDto> {
        url_ = url_.replace(/[?&]$/, "");
        let options_: any = {
            hostname: this.hostname,
            port: this.port,
            path: url_,
            method: method,
            //observe: "response",
            //responseType: "blob",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": token ? 'Bearer ' + token : '',
            }
        };

        return new Promise<ResultDto>((resolve, reject) => {
            const resdto = new ResultDto();
            const req = this.http.request(options_, function (res) {
                console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
                if (res.statusCode != 200) {
                    resdto.code = res.statusCode;
                    resdto.msg = '提交异常';
                    reject(resdto);
                }
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    if (res.statusCode == 200 && data) {
                        const resData = JSON.parse(data);
                        if (resData.success) {
                            resdto.code = 0;
                            resdto.msg = '提交成功';
                            resdto.data = resData.result;
                            resolve(resdto);
                        } else {
                            resdto.code = 701;
                            resdto.msg = resData.error;
                            resdto.data = resData.result;
                            resolve(resdto);
                        }
                    } else {
                        resdto.code = res.statusCode;
                        resdto.msg = '提交失败';
                        resdto.data = res;
                        reject(resdto);
                    }
                });
            }).on('error', function (e) {
                console.error('error: ' + e.message);
                resdto.code = -1;
                resdto.msg = e.message;
                resdto.data = e;
                reject(resdto)
            });
            if (body) {
                req.write(JSON.stringify(body));
            }
            req.end();
        });
    }

    /**
     * 将字典转为QueryString
     */
    private _formatUrl(params?: { [key: string]: string }): string {
        /*if (!params) return '';

        let fegment = [];
        for (let k in params) {
            let v: any = params[k];
            if (v) {
                //if (v instanceof Date) {
                //    v = moment(v).format('YYYY-MM-DD HH:mm:SS');
                //}
                fegment.push(`${k}=${v}`);
            }
        }
        return '?' + fegment.join('&');*/
        if (!params) return '';
        return '?' + this.querystring.stringify(params);
    }

    authenticate(): Promise<ResultDto> {
        let url_ = "/api/TokenAuth/Authenticate";
        url_ = url_.replace(/[?&]$/, "");

        const sid = this.settingsService.user['shopId']
        //console.log(sid);
        const body = { userNameOrEmailAddress: 'retail', password: 'qaz_retail123!@#', rememberClient: true, shopId: sid };
        let options_: any = {
            hostname: this.hostname,
            port: this.port,
            path: url_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        return new Promise<ResultDto>((resolve, reject) => {
            const resdto = new ResultDto();
            const req = this.http.request(options_, function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                if (res.statusCode != 200) {
                    resdto.code = res.statusCode;
                    resdto.msg = '提交数据异常';
                    reject(resdto);
                }
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    //console.log('BODY: ' + JSON.stringify(data));
                    if (res.statusCode == 200 && data) {
                        const resData = JSON.parse(data);
                        if (resData.success) {
                            resdto.code = 0;
                            resdto.msg = '获取数据成功';
                            resdto.data = resData.result;
                            resolve(resdto);
                        } else {
                            resdto.code = 701;
                            resdto.msg = resData.error;
                            resdto.data = resData.result;
                            resolve(resdto);
                        }
                    } else {
                        resdto.code = res.statusCode;
                        resdto.msg = '数据获取失败';
                        reject(resdto);
                    }
                });
                /*res.on('end', function (chunk) {
                    console.log("body: " + JSON.stringify(chunk));
                });*/
            }).on('error', function (e) {
                console.error('error: ' + e.message);
                resdto.code = -1;
                resdto.msg = e.message;
                resdto.data = e;
                reject(resdto)
            });
            req.write(JSON.stringify(body));
            req.end();
        });
    }
}