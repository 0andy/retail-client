import { Injectable } from '@angular/core';
import { NodeHttpClient } from '../common';

@Injectable()
export class MemberService {

    constructor(private nodeHttpClient: NodeHttpClient) {
    }

    getAll(skipCount: string, maxResultCount: string) {
        this.nodeHttpClient.get('/api/services/app/User/GetAll', { SkipCount: skipCount, MaxResultCount: maxResultCount}).then((res) => {
            console.log('res:' + res);
        });
    }
}
