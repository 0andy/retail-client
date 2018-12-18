import { Injectable } from '@angular/core';
import { NodeHttpClient } from '../common';
import { Member, PagedResultDto, PagedResultDtoOfMember } from 'app/entities';

@Injectable()
export class MemberService {

    constructor(private nodeHttpClient: NodeHttpClient) {
    }

    getAll(keyWord: string, skipCount: number, maxResultCount: number) {
        return this.nodeHttpClient.get('/api/services/app/Member/GetPagedMemberListAsync', { Filter: keyWord, SkipCount: skipCount, MaxResultCount: maxResultCount }).then((res) => {
            if (res.data) {
                return PagedResultDtoOfMember.fromJS(res.data);
            } else {
                return null;
            }
        });
    }

    getIsExistByPhoneAsync(phone: string) {
        return this.nodeHttpClient.get('/api/services/app/Member/GetIsExistByPhoneAsync', { phone: phone }).then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return null;
            }
        });
    }

    getMemberById(id: string) {
        return this.nodeHttpClient.get('/api/services/app/Member/GetMemberByIdAsync', { id: id }).then((res) => {
            if (res.data) {
                return Member.fromJS(res.data);
            } else {
                return null;
            }
        });
    }

    getIntegralListByIdAsync(id: string, skipCount: number, maxResultCount: number) {
        return this.nodeHttpClient.get('/api/services/app/IntegralDetail/GetPagedIntegralListByIdAsync', { MemberId: id, SkipCount: skipCount, MaxResultCount: maxResultCount }).then((res) => {
            if (res.data) {
                return PagedResultDtoOfMember.fromJS(res.data);
            } else {
                return null;
            }
        });
    }
}
