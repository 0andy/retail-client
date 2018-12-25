import { Injectable } from '@angular/core';
import { NodeHttpClient } from '../common';
import { ResultDto } from 'app/entities';

@Injectable()
export class AuthenticationService {

    constructor(private nodeHttpClient: NodeHttpClient) {
    }

    authenticationAsync(licenseKey: string, authorizationCode: string) {
        return this.nodeHttpClient.post('/api/services/app/Shop/AuthenticationAsync', null, { 'licenseKey': licenseKey, 'authorizationCode': authorizationCode })
        .then((res) => {
            if (res.data) {
                return ResultDto.fromJS(res.data);
            } else {
                return null;
            }
        }).catch((e) => {
            throw e;    
        });
    }
}
