import { Injectable } from '@angular/core';
import { ResultDto } from 'app/entities';

@Injectable()
export class NodeCommonService {

    uuid = (<any>window).require('node-uuid');
    crypto = (<any>window).require('crypto'); //加密解密

    constructor() {}
    
    //基于时间戳生成uuid
    guidV1(){
        return this.uuid.v1();
    }
    //随机生成uuid
    guidV4(){
        return this.uuid.v4();
    }

    md5(content) {
        var md5 = this.crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5.update(content);
        return md5.digest('hex');
    }

}


