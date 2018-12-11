import { Injectable } from '@angular/core';


@Injectable()
export class NodeHttpClient {

    private http = (<any>window).require('http');
    private hostname: string = 'localhost';
    private port: number = 21021;

    constructor() {
    }

    get(url: string, params?: { [key: string]: string }): Promise<any> {
        return this.request(url + this._formatUrl(params), "get", null);
    }

    post(url: string, body?: any, params?: { [key: string]: any }): Promise<any> {
        if (params) {
            url += this._formatUrl(params);
        }
        return this.request(url, "post", body);
    }

    request(url_: string, method: string, body?: any): Promise<any> {
        url_ = url_.replace(/[?&]$/, "");
        let options_: any = {
            hostname: this.hostname,
            port: this.port,
            path: url_,
            observe: "response",
            responseType: "blob",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        if (body) {
            const content_ = JSON.stringify(body);
            options_.body = content_;
        }

        return new Promise<any>((resolve, reject) => {
            this.http.request(options_, function (res) {  
                console.log('STATUS: ' + res.statusCode);  
                console.log('HEADERS: ' + JSON.stringify(res.headers));  
                res.setEncoding('utf8');  
                res.on('data', function (data) {  
                    console.log('BODY: ' + data);  
                });  
            }).on('error', function (e) {  
                console.log('problem with request: ' + e.message);  
            });  
        });
    }

    /**
     * 将字典转为QueryString
     */
    private _formatUrl(params?: { [key: string]: string }): string {
        if (!params) return '';

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
        return '?' + fegment.join('&');
    }
}